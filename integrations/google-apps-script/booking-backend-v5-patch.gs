/**
 * IG Sabroso Construction — booking backend V5 compatibility patch.
 *
 * Purpose:
 * 1. Parse the website's HH:mm schedule values explicitly in Asia/Manila.
 * 2. Prevent PM values such as 13:30 from becoming 1:30 AM.
 * 3. Give the existing customer email and Calendar creation flow one canonical
 *    schedule formatter/date builder.
 * 4. Remove only the Calendar event that belongs to a cancelled IG Sabroso
 *    booking reference.
 *
 * Integration boundary:
 * - Add this file to the EXISTING bound Apps Script project.
 * - Do not replace booking-reference generation, Sheet writes, request routing,
 *   recipient configuration, or response JSON.
 * - Keep the website payload in HH:mm format. The server contract is already
 *   correct; the active Apps Script parser is the defective boundary.
 */

const IGS_BOOKING_TIMEZONE_V5_ = 'Asia/Manila';
const IGS_CALENDAR_EVENT_PREFIX_V5_ = 'IG Sabroso Consultation';
const IGS_BOOKING_DURATION_MINUTES_V5_ = 60;

/**
 * Accept either the website contract (HH:mm) or a human 12-hour time.
 * Always return an explicit 24-hour value plus a display value.
 */
function parseBookingTimeV5_(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) throw new Error('Invalid booking time: value is required.');

  let hour;
  let minute;

  const twentyFourHour = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(text);
  if (twentyFourHour) {
    hour = Number(twentyFourHour[1]);
    minute = Number(twentyFourHour[2]);
  } else {
    const twelveHour = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(text);
    if (!twelveHour) throw new Error('Invalid booking time: ' + text);

    hour = Number(twelveHour[1]);
    minute = Number(twelveHour[2] || '00');
    const period = twelveHour[3].toUpperCase();

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
      throw new Error('Invalid booking time: ' + text);
    }

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error('Invalid booking time: ' + text);
  }

  const normalized24 = padBookingNumberV5_(hour) + ':' + padBookingNumberV5_(minute);
  const displayHour = hour % 12 || 12;
  const display = displayHour + ':' + padBookingNumberV5_(minute) + ' ' + (hour >= 12 ? 'PM' : 'AM');

  return {
    hour24: hour,
    minute: minute,
    normalized24: normalized24,
    display: display,
  };
}

function parseBookingDateV5_(value) {
  const text = String(value == null ? '' : value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) throw new Error('Invalid booking date: ' + text);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error('Invalid booking date: ' + text);
  }

  return {
    year: year,
    month: month,
    day: day,
    normalized: match[1] + '-' + match[2] + '-' + match[3],
  };
}

/**
 * Build an absolute Date from a Philippine wall-clock value without relying on
 * JavaScript's implementation-dependent parsing or a spreadsheet time sentinel.
 */
function buildBookingDateTimeV5_(dateValue, timeValue) {
  const date = parseBookingDateV5_(dateValue);
  const time = parseBookingTimeV5_(timeValue);

  return Utilities.parseDate(
    date.normalized + ' ' + time.normalized24,
    IGS_BOOKING_TIMEZONE_V5_,
    'yyyy-MM-dd HH:mm'
  );
}

function formatBookingScheduleV5_(dateValue, timeValue) {
  const dateTime = buildBookingDateTimeV5_(dateValue, timeValue);
  const dateText = Utilities.formatDate(dateTime, IGS_BOOKING_TIMEZONE_V5_, 'MMMM d, yyyy');
  const timeText = Utilities.formatDate(dateTime, IGS_BOOKING_TIMEZONE_V5_, 'h:mm a');
  return dateText + ' — ' + timeText;
}

/**
 * Drop-in Calendar creator for the existing createBooking flow.
 * Pass the same Calendar object/configuration already used by the CRM.
 */
function createBookingCalendarEventV5_(calendar, bookingReference, payload) {
  const p = payload || {};
  const reference = String(bookingReference || '').trim();
  if (!reference) throw new Error('Booking reference is required for Calendar creation.');

  const start = buildBookingDateTimeV5_(p.preferredDate, p.preferredTime);
  const end = new Date(start.getTime() + IGS_BOOKING_DURATION_MINUTES_V5_ * 60 * 1000);
  const clientName = cleanBookingTextV5_(p.fullName) || 'Website client';
  const title = IGS_CALENDAR_EVENT_PREFIX_V5_ + ' — ' + clientName + ' — ' + reference;
  const description = buildBookingCalendarDescriptionV5_(reference, p);

  return calendar.createEvent(title, start, end, {
    location: cleanBookingTextV5_(p.projectLocation),
    description: description,
  });
}

function buildBookingCalendarDescriptionV5_(bookingReference, payload) {
  const p = payload || {};
  return [
    'Booking Reference: ' + cleanBookingTextV5_(bookingReference),
    'Client: ' + (cleanBookingTextV5_(p.fullName) || 'Not provided'),
    'Phone: ' + (cleanBookingTextV5_(p.phoneNumber) || 'Not provided'),
    'Email: ' + (cleanBookingTextV5_(p.emailAddress) || 'Not provided'),
    'Project Type: ' + (cleanBookingTextV5_(p.projectType) || 'Not provided'),
    'Preferred Schedule: ' + formatBookingScheduleV5_(p.preferredDate, p.preferredTime),
    'Location: ' + (cleanBookingTextV5_(p.projectLocation) || 'Not provided'),
    'Budget Range: ' + (cleanBookingTextV5_(p.budgetRange) || 'Not provided'),
    'Project Details: ' + (cleanBookingTextV5_(p.projectDetails) || 'Not provided'),
  ].join('\n');
}

/**
 * Safety predicate: cancellation cleanup may touch only an IG Sabroso
 * consultation event that carries the exact booking reference.
 */
function isBookingCalendarEventV5_(titleValue, descriptionValue, bookingReference) {
  const title = String(titleValue == null ? '' : titleValue);
  const description = String(descriptionValue == null ? '' : descriptionValue);
  const reference = String(bookingReference == null ? '' : bookingReference).trim();
  if (!reference) return false;
  if (title.indexOf(IGS_CALENDAR_EVENT_PREFIX_V5_) !== 0) return false;

  const exactTitleSuffix = ' — ' + reference;
  const exactDescriptionLine = 'Booking Reference: ' + reference;
  return title.slice(-exactTitleSuffix.length) === exactTitleSuffix ||
    description.split(/\r?\n/).indexOf(exactDescriptionLine) !== -1;
}

/**
 * Call after the existing CRM has authenticated the user and accepted a
 * cancellation. It searches only the booking date and deletes only exact,
 * IG-Sabroso-prefixed matches.
 */
function deleteBookingCalendarEventsV5_(calendar, bookingReference, preferredDate) {
  const reference = String(bookingReference || '').trim();
  if (!reference) throw new Error('Booking reference is required for Calendar cleanup.');

  const date = parseBookingDateV5_(preferredDate);
  const start = Utilities.parseDate(
    date.normalized + ' 00:00',
    IGS_BOOKING_TIMEZONE_V5_,
    'yyyy-MM-dd HH:mm'
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const events = calendar.getEvents(start, end, { search: reference });
  let deleted = 0;

  events.forEach(function (event) {
    if (!isBookingCalendarEventV5_(event.getTitle(), event.getDescription(), reference)) return;
    event.deleteEvent();
    deleted += 1;
  });

  return deleted;
}

function padBookingNumberV5_(value) {
  return String(value).padStart(2, '0');
}

function cleanBookingTextV5_(value) {
  return String(value == null ? '' : value).trim();
}
