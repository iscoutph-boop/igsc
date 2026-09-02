/**
 * IG Sabroso Construction — V6.2.5 production-readiness release candidate R2.
 * Standalone Apps Script web app for client-demo and production-readiness staging.
 *
 * Safety:
 * - Uses the existing IG Sabroso spreadsheet and calendar.
 * - Does not require or modify the production website.
 * - Uses explicit Asia/Manila date/time parsing.
 * - Writes by header name so the existing CRM column order is preserved.
 * - Calendar deletion is limited to events carrying the exact booking reference.
 * - V6.2 provides immediate self-service reschedule/cancel semantics and branded lifecycle mail.
 */

const CONFIG = {
  SPREADSHEET_ID: '1jqnP7cFwkmBDnZoUgWXqZuUGzK7F_4I7XwFFx6RYLrk',
  BOOKINGS_SHEET: 'Bookings',
  APPOINTMENTS_SHEET: 'Appointments',
  CALENDAR_NAME: 'IGS Website Appointments',
  CALENDAR_ID: '9a8c649815522b6ac9366068aa0a8e3b930046d1d5e6483a0db709f509156ca5@group.calendar.google.com',
  ADMIN_EMAIL: 'caballerodigitals@gmail.com',
  CUSTOMER_EMAIL_NOTIFICATIONS_ENABLED: false,
  TIMEZONE: 'Asia/Manila',
  SOURCE_WEBSITE: 'https://deploy-preview-4--darling-sunburst-da0a5d.netlify.app',
  BOOKING_DURATION_MINUTES: 60,
  BOOKINGS_HEADER_ROW: 8,
  APPOINTMENTS_HEADER_ROW: 8,
};

function doGet(e) {
  const openAction = e && e.parameter ? cleanTextV6_(e.parameter.open) : '';
  if (openAction === 'crm') {
    return openCrmRecordRedirectV622_(e);
  }
  if (openAction === 'call') {
    return openClientCallBridgeV625_(e);
  }

  return jsonResponseV6_({
    success: true,
    message: 'IG Sabroso Website CRM is running.',
    timezone: CONFIG.TIMEZONE,
    version: '6.2.5-production-readiness-r2',
  });
}

function doPost(e) {
  try {
    const body = parseRequestBodyV6_(e);
    const action = cleanTextV6_(body.action);
    const payload = body.payload || {};
    if (!action) throw new Error('Missing action.');

    let result;
    switch (action) {
      case 'createBooking':
        result = createBookingV6_(payload);
        break;
      case 'findBooking':
        result = findBookingV6_(payload);
        break;
      case 'rescheduleBooking':
        result = rescheduleBookingV6_(payload);
        break;
      case 'cancelBooking':
        result = cancelBookingV6_(payload);
        break;
      default:
        throw new Error('Invalid action: ' + action);
    }

    return jsonResponseV6_(Object.assign({ success: true }, result || {}));
  } catch (error) {
    return jsonResponseV6_({
      success: false,
      message: error && error.message ? String(error.message) : 'CRM request failed.',
    });
  }
}

/** Run once after pasting to authorize Spreadsheet, Calendar and Mail scopes. */
function authorize() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const calendar = ensureWebsiteCalendarV623_();
  const remainingEmailQuota = MailApp.getRemainingDailyQuota();
  Logger.log('Spreadsheet: ' + ss.getName());
  Logger.log('Calendar: ' + calendar.getName());
  Logger.log('Calendar ID: ' + calendar.getId());
  Logger.log('Remaining email quota: ' + remainingEmailQuota);
  return true;
}

function createBookingV6_(payload) {
  validateRequiredV6_(payload.fullName, 'Full Name');
  validateRequiredV6_(payload.phoneNumber, 'Phone Number');
  validateRequiredV6_(payload.projectType, 'Project Type');
  validateRequiredV6_(payload.projectDetails, 'Project Details');
  validateRequiredV6_(payload.preferredDate, 'Preferred Date');
  validateRequiredV6_(payload.preferredTime, 'Preferred Time');
  if (cleanTextV6_(payload.privacyConsent) !== 'accepted') {
    throw new Error('Privacy consent is required.');
  }

  const preferredDate = parseBookingDateV6_(payload.preferredDate).normalized;
  const preferredTimeInfo = parseBookingTimeV6_(payload.preferredTime);
  const preferredTime = preferredTimeInfo.display;
  const rawSubmissionId = cleanTextV6_(payload.submissionId);
  const submissionId = normalizeSubmissionIdV625_(rawSubmissionId);
  if (rawSubmissionId && !submissionId) throw new Error('A valid submission ID is required.');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  let bookingReference;
  let bookingRow;
  let duplicatePrevented = false;
  try {
    const bookingsSheet = getSheetV6_(CONFIG.BOOKINGS_SHEET);
    const existing = submissionId
      ? findBookingBySubmissionIdV625_(bookingsSheet, submissionId)
      : null;
    if (existing) {
      bookingReference = existing.booking.bookingReference;
      bookingRow = existing.row;
      duplicatePrevented = true;
    } else {
      bookingReference = nextBookingReferenceV6_(bookingsSheet, new Date());
      const now = new Date();
      const submittedAt = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
      const booking = {
        bookingReference: bookingReference,
        submittedAt: submittedAt,
        leadSource: cleanTextV6_(payload.leadSource) || 'Website',
        fullName: cleanTextV6_(payload.fullName),
        phoneNumber: cleanTextV6_(payload.phoneNumber),
        emailAddress: cleanTextV6_(payload.emailAddress),
        projectType: cleanTextV6_(payload.projectType),
        projectLocation: cleanTextV6_(payload.projectLocation),
        preferredService: cleanTextV6_(payload.preferredService),
        approximateArea: cleanTextV6_(payload.approximateArea),
        preferredDate: preferredDate,
        preferredTime: preferredTime,
        preferredTime24: preferredTimeInfo.normalized24,
        bookingStatus: 'New',
        priority: cleanTextV6_(payload.priority) || 'Medium',
        assignedTo: cleanTextV6_(payload.assignedTo) || 'Sales',
        budgetRange: cleanTextV6_(payload.budgetRange),
        projectDetails: cleanTextV6_(payload.projectDetails),
        privacyConsent: 'accepted',
        notes: (submissionId ? submissionMarkerV625_(submissionId) + '\n' : '') +
          '[' + timestampV6_() + '] Website consultation request submitted.',
      };
      bookingRow = appendBookingRowV6_(bookingsSheet, booking);
    }

    const calendarPayload = Object.assign({}, payload, {
      preferredDate: preferredDate,
      preferredTime: preferredTimeInfo.normalized24,
    });
    const reconciliation = reconcileCreateSideEffectsV625_(
      bookingRow,
      bookingReference,
      calendarPayload,
      duplicatePrevented
    );

    return {
      bookingReference: bookingReference,
      booking: readBookingByRowV6_(bookingRow),
      warnings: reconciliation.warnings,
      duplicatePrevented: duplicatePrevented,
    };
  } finally {
    lock.releaseLock();
  }
}

function findBookingV6_(payload) {
  const reference = normalizeBookingReferenceV6_(payload.bookingReference);
  const contact = cleanTextV6_(payload.contact);
  if (!reference || !contact) throw new Error('Booking reference and contact are required.');
  const record = findBookingRecordV6_(reference);
  if (!record || !contactMatchesV6_(record.booking, contact)) {
    throw new Error('Booking not found. Please check your booking reference and contact detail.');
  }
  return { booking: record.booking };
}

function rescheduleBookingV6_(payload) {
  const reference = normalizeBookingReferenceV6_(payload.bookingReference);
  const contact = cleanTextV6_(payload.contact);
  if (!reference || !contact) throw new Error('Booking reference and contact are required.');

  const newDate = parseBookingDateV6_(payload.newPreferredDate).normalized;
  const newTimeInfo = parseBookingTimeV6_(payload.newPreferredTime);
  const record = findBookingRecordV6_(reference);
  if (!record || !contactMatchesV6_(record.booking, contact)) {
    throw new Error('Booking not found. Please check your booking reference and contact detail.');
  }
  if (String(record.booking.bookingStatus || '').toLowerCase().indexOf('cancel') !== -1) {
    throw new Error('Cancelled bookings cannot be rescheduled.');
  }

  const oldBooking = Object.assign({}, record.booking);
  const oldDate = oldBooking.preferredDate;
  const oldTime = oldBooking.preferredTime;
  const noteText = cleanTextV6_(payload.rescheduleNotes) || 'None';
  const auditNote = '[' + timestampV6_() + '] Booking rescheduled to ' +
    newDate + ' — ' + newTimeInfo.display + '. Notes: ' + noteText;
  const calendar = getCalendarV6_();
  const oldCalendarPayload = bookingToCalendarPayloadV6_(oldBooking);
  const newCalendarPayload = bookingToCalendarPayloadV6_(oldBooking, {
    preferredDate: newDate,
    preferredTime: newTimeInfo.normalized24,
  });

  // Calendar is the first transactional gate. If replacement fails, restore the old event.
  const calendarTransition = replaceBookingCalendarEventV62_(calendar, reference, oldCalendarPayload, newCalendarPayload);

  try {
    updateBookingFieldsV6_(record.row, {
      'Preferred Date': newDate,
      'Preferred Time': newTimeInfo.display,
      'Booking Status': 'Rescheduled',
      'Reschedule Requested?': 'Yes',
      'Notes': appendNoteV6_(oldBooking.notes, auditNote),
    });

    updateAppointmentV6_(reference, {
      'Appointment Date': newDate,
      'Time': newTimeInfo.display,
      'Schedule Status': 'Rescheduled',
      'Notes': '[' + timestampV6_() + '] Client rescheduled booking.',
    });
  } catch (error) {
    try {
      rollbackBookingCalendarReplacementV62_(calendar, reference, oldCalendarPayload, newCalendarPayload, calendarTransition);
    } catch (_) {}
    try {
      updateBookingFieldsV6_(record.row, {
        'Preferred Date': oldDate,
        'Preferred Time': oldTime,
        'Booking Status': oldBooking.bookingStatus,
        'Reschedule Requested?': 'No',
        'Notes': oldBooking.notes,
      });
      updateAppointmentV6_(reference, {
        'Appointment Date': oldDate,
        'Time': oldTime,
        'Schedule Status': oldBooking.bookingStatus || 'Pending',
      });
    } catch (_) {}
    throw new Error('We could not complete the schedule update. Your previous schedule was preserved.');
  }

  const updatedBooking = readBookingByRowV6_(record.row);
  const warnings = [];

  if (CONFIG.CUSTOMER_EMAIL_NOTIFICATIONS_ENABLED && isEmailAddressV6_(updatedBooking.emailAddress)) {
    try {
      sendCustomerLifecycleEmailV62_('rescheduled', reference, updatedBooking, {
        previousSchedule: formatBookingScheduleV6_(oldDate, oldTime),
        newSchedule: formatBookingScheduleV6_(newDate, newTimeInfo.normalized24),
        notes: noteText,
      });
    } catch (error) {
      warnings.push('Customer email: ' + safeErrorV6_(error));
    }
  }

  try {
    sendAdminLifecycleNotificationV62_('rescheduled', reference, updatedBooking, record.row, {
      previousSchedule: formatBookingScheduleV6_(oldDate, oldTime),
      newSchedule: formatBookingScheduleV6_(newDate, newTimeInfo.normalized24),
      notes: noteText,
    });
  } catch (error) {
    warnings.push('Admin email: ' + safeErrorV6_(error));
  }

  return { booking: updatedBooking, warnings: warnings };
}

function cancelBookingV6_(payload) {
  const reference = normalizeBookingReferenceV6_(payload.bookingReference);
  const contact = cleanTextV6_(payload.contact);
  if (!reference || !contact) throw new Error('Booking reference and contact are required.');

  const record = findBookingRecordV6_(reference);
  if (!record || !contactMatchesV6_(record.booking, contact)) {
    throw new Error('Booking not found. Please check your booking reference and contact detail.');
  }

  // Idempotent customer behavior: an already-cancelled booking stays cancelled without duplicate work.
  if (String(record.booking.bookingStatus || '').toLowerCase().indexOf('cancel') !== -1) {
    return { booking: record.booking, warnings: [] };
  }

  const oldBooking = Object.assign({}, record.booking);
  const reason = cleanTextV6_(payload.cancellationReason) || 'No reason provided.';
  const auditNote = '[' + timestampV6_() + '] Booking cancelled. Reason: ' + reason;
  const calendar = getCalendarV6_();
  const oldCalendarPayload = bookingToCalendarPayloadV6_(oldBooking);
  const deletedEvents = deleteBookingCalendarEventsV6_(calendar, reference, oldBooking.preferredDate);

  try {
    updateBookingFieldsV6_(record.row, {
      'Booking Status': 'Cancelled',
      'Cancel Requested?': 'Yes',
      'Notes': appendNoteV6_(oldBooking.notes, auditNote),
    });
    updateAppointmentV6_(reference, {
      'Schedule Status': 'Cancelled',
      'Notes': '[' + timestampV6_() + '] Client cancelled booking. Reason: ' + reason,
    });
  } catch (error) {
    if (deletedEvents > 0) {
      try { createBookingCalendarEventV6_(calendar, reference, oldCalendarPayload); } catch (_) {}
    }
    try {
      updateBookingFieldsV6_(record.row, {
        'Booking Status': oldBooking.bookingStatus,
        'Cancel Requested?': 'No',
        'Notes': oldBooking.notes,
      });
    } catch (_) {}
    throw new Error('We could not complete the cancellation. The booking remains active.');
  }

  const cancelledBooking = readBookingByRowV6_(record.row);
  const warnings = [];
  const cancelledSchedule = formatBookingScheduleV6_(oldBooking.preferredDate, oldBooking.preferredTime);

  if (CONFIG.CUSTOMER_EMAIL_NOTIFICATIONS_ENABLED && isEmailAddressV6_(cancelledBooking.emailAddress)) {
    try {
      sendCustomerLifecycleEmailV62_('cancelled', reference, cancelledBooking, {
        previousSchedule: cancelledSchedule,
        reason: reason,
      });
    } catch (error) {
      warnings.push('Customer email: ' + safeErrorV6_(error));
    }
  }

  try {
    sendAdminLifecycleNotificationV62_('cancelled', reference, cancelledBooking, record.row, {
      previousSchedule: cancelledSchedule,
      reason: reason,
    });
  } catch (error) {
    warnings.push('Admin email: ' + safeErrorV6_(error));
  }

  return { booking: cancelledBooking, warnings: warnings };
}

function appendBookingRowV6_(sheet, booking) {
  const rowData = {
    'Booking Reference': booking.bookingReference,
    'Date Submitted': booking.submittedAt,
    'Lead Source': booking.leadSource,
    'Full Name': booking.fullName,
    'Phone Number': booking.phoneNumber,
    'Email Address': booking.emailAddress,
    'Project Type': booking.projectType,
    'Project Location': booking.projectLocation,
    'Preferred Date': booking.preferredDate,
    'Preferred Time': booking.preferredTime,
    'Booking Status': booking.bookingStatus,
    'Priority': booking.priority,
    'Assigned To': booking.assignedTo,
    'Budget Range': booking.budgetRange,
    'Project Details': booking.projectDetails,
    'Reschedule Requested?': 'No',
    'Cancel Requested?': 'No',
    'Notes': booking.notes,
  };
  return appendRowByHeadersV6_(sheet, CONFIG.BOOKINGS_HEADER_ROW, rowData);
}

function appendAppointmentRowV6_(reference, payload, status, noteText) {
  const sheet = getSheetV6_(CONFIG.APPOINTMENTS_SHEET);
  const rowData = {
    'Booking Reference': reference,
    'Client Name': cleanTextV6_(payload.fullName),
    'Appointment Date': parseBookingDateV6_(payload.preferredDate).normalized,
    'Time': parseBookingTimeV6_(payload.preferredTime).display,
    'Appointment Type': cleanTextV6_(payload.preferredService) || 'Site Visit / Consultation',
    'Schedule Status': status || 'Pending',
    'Assigned To': cleanTextV6_(payload.assignedTo) || 'Sales',
    'Contact': cleanTextV6_(payload.phoneNumber) || cleanTextV6_(payload.emailAddress),
    'Notes': '[' + timestampV6_() + '] ' + noteText,
  };
  return appendRowByHeadersV6_(sheet, CONFIG.APPOINTMENTS_HEADER_ROW, rowData);
}

function appendRowByHeadersV6_(sheet, headerRow, data) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(headerRow, 1, 1, lastColumn).getDisplayValues()[0];
  const values = headers.map(function (header) {
    return Object.prototype.hasOwnProperty.call(data, header) ? data[header] : '';
  });
  const row = Math.max(sheet.getLastRow() + 1, headerRow + 1);
  sheet.getRange(row, 1, 1, values.length).setValues([values]);
  return row;
}

function updateBookingFieldsV6_(row, fields) {
  const sheet = getSheetV6_(CONFIG.BOOKINGS_SHEET);
  setFieldsByHeadersV6_(sheet, CONFIG.BOOKINGS_HEADER_ROW, row, fields);
}

function updateAppointmentV6_(reference, fields) {
  const sheet = getSheetV6_(CONFIG.APPOINTMENTS_SHEET);
  const row = findRowByReferenceV6_(sheet, CONFIG.APPOINTMENTS_HEADER_ROW, reference);
  if (!row) return false;
  const current = readRowObjectV6_(sheet, CONFIG.APPOINTMENTS_HEADER_ROW, row);
  if (fields.Notes) fields.Notes = appendNoteV6_(current.Notes, fields.Notes);
  setFieldsByHeadersV6_(sheet, CONFIG.APPOINTMENTS_HEADER_ROW, row, fields);
  return true;
}

function setFieldsByHeadersV6_(sheet, headerRow, row, fields) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(headerRow, 1, 1, lastColumn).getDisplayValues()[0];
  Object.keys(fields).forEach(function (header) {
    const index = headers.indexOf(header);
    if (index === -1) return;
    sheet.getRange(row, index + 1).setValue(fields[header]);
  });
}

function findBookingRecordV6_(reference) {
  const sheet = getSheetV6_(CONFIG.BOOKINGS_SHEET);
  const row = findRowByReferenceV6_(sheet, CONFIG.BOOKINGS_HEADER_ROW, reference);
  if (!row) return null;
  return { row: row, booking: bookingObjectFromRowV6_(readRowObjectV6_(sheet, CONFIG.BOOKINGS_HEADER_ROW, row)) };
}

function normalizeSubmissionIdV625_(value) {
  const id = cleanTextV6_(value).toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)
    ? id
    : '';
}

function submissionMarkerV625_(submissionId) {
  return '[Submission ID: ' + submissionId + ']';
}

function findBookingBySubmissionIdV625_(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= CONFIG.BOOKINGS_HEADER_ROW) return null;

  const headers = sheet
    .getRange(CONFIG.BOOKINGS_HEADER_ROW, 1, 1, sheet.getLastColumn())
    .getDisplayValues()[0];
  const notesIndex = headers.indexOf('Notes');
  if (notesIndex < 0) throw new Error('Notes column is missing.');

  const marker = submissionMarkerV625_(submissionId);
  const values = sheet
    .getRange(
      CONFIG.BOOKINGS_HEADER_ROW + 1,
      notesIndex + 1,
      lastRow - CONFIG.BOOKINGS_HEADER_ROW,
      1
    )
    .getDisplayValues();

  for (let index = 0; index < values.length; index += 1) {
    const notes = cleanTextV6_(values[index][0]);
    if (notes.split(/\r?\n/).indexOf(marker) === -1) continue;
    const row = CONFIG.BOOKINGS_HEADER_ROW + 1 + index;
    return { row: row, booking: readBookingByRowV6_(row) };
  }
  return null;
}

function createSideEffectMarkerV625_(sideEffect) {
  return '[Create completed: ' + sideEffect + ']';
}

function hasBookingNoteMarkerV625_(booking, marker) {
  return cleanTextV6_(booking && booking.notes).split(/\r?\n/).indexOf(marker) !== -1;
}

function markCreateSideEffectV625_(bookingRow, marker) {
  const booking = readBookingByRowV6_(bookingRow);
  if (hasBookingNoteMarkerV625_(booking, marker)) return;
  updateBookingFieldsV6_(bookingRow, {
    'Notes': appendNoteV6_(booking.notes, marker),
  });
}

function hasAppointmentRowV625_(reference) {
  const sheet = getSheetV6_(CONFIG.APPOINTMENTS_SHEET);
  return Boolean(findRowByReferenceV6_(sheet, CONFIG.APPOINTMENTS_HEADER_ROW, reference));
}

function hasBookingCalendarEventV625_(calendar, reference, preferredDate) {
  const date = parseBookingDateV6_(preferredDate);
  const start = Utilities.parseDate(date.normalized + ' 00:00', CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const events = calendar.getEvents(start, end, { search: reference });
  return events.some(function (event) {
    return isBookingCalendarEventV6_(event, reference);
  });
}

function hasSentAdminCreateNotificationV625_(reference) {
  const subjectPrefix = 'New consultation request - ' + reference + ' - ';
  const query = 'in:sent to:' + CONFIG.ADMIN_EMAIL +
    ' subject:"New consultation request" "' + reference + '"';
  const threads = GmailApp.search(query, 0, 20);
  return threads.some(function (thread) {
    return thread.getMessages().some(function (message) {
      const recipient = cleanTextV6_(message.getTo()).toLowerCase();
      const subject = cleanTextV6_(message.getSubject());
      return recipient.indexOf(CONFIG.ADMIN_EMAIL.toLowerCase()) !== -1 &&
        subject.indexOf(subjectPrefix) === 0;
    });
  });
}

function reconcileCreateSideEffectsV625_(bookingRow, bookingReference, calendarPayload, isRetry) {
  const warnings = [];
  const appointmentMarker = createSideEffectMarkerV625_('appointment');
  const calendarMarker = createSideEffectMarkerV625_('calendar');
  const adminEmailMarker = createSideEffectMarkerV625_('admin email');
  let booking = readBookingByRowV6_(bookingRow);

  if (!hasBookingNoteMarkerV625_(booking, appointmentMarker)) {
    try {
      if (!hasAppointmentRowV625_(bookingReference)) {
        appendAppointmentRowV6_(bookingReference, calendarPayload, 'Pending', 'Website booking request.');
      }
      markCreateSideEffectV625_(bookingRow, appointmentMarker);
    } catch (error) {
      warnings.push('Appointment sheet: ' + safeErrorV6_(error));
    }
  }

  booking = readBookingByRowV6_(bookingRow);
  if (!hasBookingNoteMarkerV625_(booking, calendarMarker)) {
    try {
      const calendar = getCalendarV6_();
      if (!hasBookingCalendarEventV625_(calendar, bookingReference, calendarPayload.preferredDate)) {
        createBookingCalendarEventV6_(calendar, bookingReference, calendarPayload);
      }
      markCreateSideEffectV625_(bookingRow, calendarMarker);
    } catch (error) {
      warnings.push('Calendar: ' + safeErrorV6_(error));
    }
  }

  if (CONFIG.CUSTOMER_EMAIL_NOTIFICATIONS_ENABLED && isEmailAddressV6_(calendarPayload.emailAddress)) {
    try {
      sendCustomerBookingConfirmationV6_(bookingReference, calendarPayload);
    } catch (error) {
      warnings.push('Customer email: ' + safeErrorV6_(error));
    }
  }

  booking = readBookingByRowV6_(bookingRow);
  if (!hasBookingNoteMarkerV625_(booking, adminEmailMarker)) {
    try {
      if (!isRetry || !hasSentAdminCreateNotificationV625_(bookingReference)) {
        sendAdminLifecycleNotificationV62_('created', bookingReference, Object.assign({}, calendarPayload, {
          bookingStatus: 'New',
        }), bookingRow, {});
      }
      markCreateSideEffectV625_(bookingRow, adminEmailMarker);
    } catch (error) {
      warnings.push('Admin email: ' + safeErrorV6_(error));
    }
  }

  return { warnings: warnings };
}

function findRowByReferenceV6_(sheet, headerRow, reference) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= headerRow) return 0;
  const headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const refIndex = headers.indexOf('Booking Reference');
  if (refIndex < 0) throw new Error('Booking Reference column is missing.');
  const values = sheet.getRange(headerRow + 1, refIndex + 1, lastRow - headerRow, 1).getDisplayValues();
  for (let i = 0; i < values.length; i += 1) {
    if (normalizeBookingReferenceV6_(values[i][0]) === reference) return headerRow + 1 + i;
  }
  return 0;
}

function readBookingByRowV6_(row) {
  const sheet = getSheetV6_(CONFIG.BOOKINGS_SHEET);
  return bookingObjectFromRowV6_(readRowObjectV6_(sheet, CONFIG.BOOKINGS_HEADER_ROW, row));
}

function readRowObjectV6_(sheet, headerRow, row) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(headerRow, 1, 1, lastColumn).getDisplayValues()[0];
  const values = sheet.getRange(row, 1, 1, lastColumn).getDisplayValues()[0];
  const out = {};
  headers.forEach(function (header, index) { out[header] = values[index] || ''; });
  return out;
}

function bookingObjectFromRowV6_(row) {
  return {
    bookingReference: cleanTextV6_(row['Booking Reference']),
    submittedAt: cleanTextV6_(row['Date Submitted']),
    leadSource: cleanTextV6_(row['Lead Source']),
    fullName: cleanTextV6_(row['Full Name']),
    phoneNumber: cleanTextV6_(row['Phone Number']),
    emailAddress: cleanTextV6_(row['Email Address']),
    projectType: cleanTextV6_(row['Project Type']),
    projectLocation: cleanTextV6_(row['Project Location']),
    preferredDate: normalizeDateOutputV6_(row['Preferred Date']),
    preferredTime: cleanTextV6_(row['Preferred Time']),
    bookingStatus: cleanTextV6_(row['Booking Status']),
    priority: cleanTextV6_(row['Priority']),
    assignedTo: cleanTextV6_(row['Assigned To']),
    budgetRange: cleanTextV6_(row['Budget Range']),
    projectDetails: cleanTextV6_(row['Project Details']),
    notes: cleanTextV6_(row['Notes']),
  };
}

function nextBookingReferenceV6_(sheet, now) {
  const year = Utilities.formatDate(now || new Date(), CONFIG.TIMEZONE, 'yyyy');
  const lastRow = sheet.getLastRow();
  let max = 0;
  if (lastRow > CONFIG.BOOKINGS_HEADER_ROW) {
    const values = sheet.getRange(CONFIG.BOOKINGS_HEADER_ROW + 1, 1, lastRow - CONFIG.BOOKINGS_HEADER_ROW, 1).getDisplayValues();
    values.forEach(function (row) {
      const match = new RegExp('^IGS-' + year + '-(\\d{4})$', 'i').exec(cleanTextV6_(row[0]));
      if (match) max = Math.max(max, Number(match[1]));
    });
  }
  return 'IGS-' + year + '-' + String(max + 1).padStart(4, '0');
}

function contactMatchesV6_(booking, contact) {
  const supplied = cleanTextV6_(contact).toLowerCase();
  const email = cleanTextV6_(booking.emailAddress).toLowerCase();
  if (email && supplied === email) return true;
  const suppliedPhone = normalizePhoneV6_(contact);
  const bookingPhone = normalizePhoneV6_(booking.phoneNumber);
  return Boolean(suppliedPhone && bookingPhone && suppliedPhone === bookingPhone);
}

function bookingToCalendarPayloadV6_(booking, overrides) {
  return Object.assign({
    fullName: booking.fullName,
    phoneNumber: booking.phoneNumber,
    emailAddress: booking.emailAddress,
    projectType: booking.projectType,
    projectLocation: booking.projectLocation,
    budgetRange: booking.budgetRange,
    projectDetails: booking.projectDetails,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
  }, overrides || {});
}

function getSheetV6_(name) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

function ensureWebsiteCalendarV623_() {
  const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  if (!calendar) {
    throw new Error(
      'IGS Website Appointments calendar is not accessible to this Apps Script execution account.'
    );
  }
  return calendar;
}

function getCalendarV6_() {
  return ensureWebsiteCalendarV623_();
}

function parseBookingTimeV6_(value) {
  const text = cleanTextV6_(value);
  if (!text) throw new Error('Invalid booking time: value is required.');
  let hour;
  let minute;
  const twentyFour = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(text);
  if (twentyFour) {
    hour = Number(twentyFour[1]);
    minute = Number(twentyFour[2]);
  } else {
    const twelveHour = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(text);
    if (!twelveHour) throw new Error('Invalid booking time: ' + text);
    hour = Number(twelveHour[1]);
    minute = Number(twelveHour[2] || '00');
    const period = twelveHour[3].toUpperCase();
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) throw new Error('Invalid booking time: ' + text);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) throw new Error('Invalid booking time: ' + text);
  const normalized24 = pad2V6_(hour) + ':' + pad2V6_(minute);
  const display = (hour % 12 || 12) + ':' + pad2V6_(minute) + ' ' + (hour >= 12 ? 'PM' : 'AM');
  return { hour24: hour, minute: minute, normalized24: normalized24, display: display };
}

function parseBookingDateV6_(value) {
  const text = cleanTextV6_(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) throw new Error('Invalid booking date: ' + text);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) throw new Error('Invalid booking date: ' + text);
  return { year: year, month: month, day: day, normalized: match[1] + '-' + match[2] + '-' + match[3] };
}

function buildBookingDateTimeV6_(dateValue, timeValue) {
  const date = parseBookingDateV6_(dateValue);
  const time = parseBookingTimeV6_(timeValue);
  return Utilities.parseDate(date.normalized + ' ' + time.normalized24, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
}

function formatBookingScheduleV6_(dateValue, timeValue) {
  const dt = buildBookingDateTimeV6_(dateValue, timeValue);
  return Utilities.formatDate(dt, CONFIG.TIMEZONE, 'MMMM d, yyyy') + ' — ' + Utilities.formatDate(dt, CONFIG.TIMEZONE, 'h:mm a');
}

function createBookingCalendarEventV6_(calendar, reference, payload) {
  const start = buildBookingDateTimeV6_(payload.preferredDate, payload.preferredTime);
  const end = new Date(start.getTime() + CONFIG.BOOKING_DURATION_MINUTES * 60 * 1000);
  const title = 'IG Sabroso Appointment — ' + (cleanTextV6_(payload.fullName) || 'Website client') + ' — ' + reference;
  const description = [
    'Booking Reference: ' + reference,
    'Client: ' + (cleanTextV6_(payload.fullName) || 'Not provided'),
    'Phone: ' + (cleanTextV6_(payload.phoneNumber) || 'Not provided'),
    'Email: ' + (cleanTextV6_(payload.emailAddress) || 'Not provided'),
    'Project Type: ' + (cleanTextV6_(payload.projectType) || 'Not provided'),
    'Preferred Schedule: ' + formatBookingScheduleV6_(payload.preferredDate, payload.preferredTime),
    'Location: ' + (cleanTextV6_(payload.projectLocation) || 'Not provided'),
    'Budget Range: ' + (cleanTextV6_(payload.budgetRange) || 'Not provided'),
    'Project Details: ' + (cleanTextV6_(payload.projectDetails) || 'Not provided'),
  ].join('\n');
  return calendar.createEvent(title, start, end, {
    location: cleanTextV6_(payload.projectLocation),
    description: description,
  });
}

function isBookingCalendarEventV6_(event, reference) {
  const title = cleanTextV6_(event.getTitle());
  const description = cleanTextV6_(event.getDescription());
  if (title.indexOf('IG Sabroso Appointment') !== 0) return false;
  return title.slice(-(' — ' + reference).length) === ' — ' + reference ||
    description.split(/\r?\n/).indexOf('Booking Reference: ' + reference) !== -1;
}

function deleteBookingCalendarEventsV6_(calendar, reference, preferredDate) {
  const date = parseBookingDateV6_(preferredDate);
  const start = Utilities.parseDate(date.normalized + ' 00:00', CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const events = calendar.getEvents(start, end, { search: reference });
  let deleted = 0;
  events.forEach(function (event) {
    if (!isBookingCalendarEventV6_(event, reference)) return;
    event.deleteEvent();
    deleted += 1;
  });
  return deleted;
}

function sendCustomerBookingConfirmationV6_(reference, payload) {
  const recipient = cleanTextV6_(payload.emailAddress);
  const fullName = cleanTextV6_(payload.fullName) || 'Client';
  const schedule = formatBookingScheduleV6_(payload.preferredDate, payload.preferredTime);
  const projectType = cleanTextV6_(payload.projectType) || 'Not provided';
  const projectLocation = cleanTextV6_(payload.projectLocation) || 'Not provided';
  const manageUrl = CONFIG.SOURCE_WEBSITE + '/consultation';
  const subject = 'IG Sabroso Appointment Request Received — ' + reference;

  const body = [
    'IG SABROSO CONSTRUCTION — Elevate Your Lifestyle',
    '',
    'APPOINTMENT REQUEST RECEIVED',
    '',
    'Thank you, ' + fullName + '.',
    'Your consultation request has been received successfully.',
    '',
    'Booking Reference: ' + reference,
    'Preferred Schedule: ' + schedule,
    'Project Type: ' + projectType,
    'Project Location: ' + projectLocation,
    '',
    'What happens next?',
    'Our team will review your request and contact you to confirm the consultation schedule.',
    '',
    'Please keep your booking reference for rescheduling or cancellation requests.',
    '',
    'Manage booking: ' + manageUrl,
    '',
    'IG Sabroso Construction',
    'Elevate Your Lifestyle',
  ].join('\n');

  const safe = {
    reference: escapeHtmlSimpleV6_(reference),
    fullName: escapeHtmlSimpleV6_(fullName),
    schedule: escapeHtmlSimpleV6_(schedule),
    projectType: escapeHtmlSimpleV6_(projectType),
    projectLocation: escapeHtmlSimpleV6_(projectLocation),
    manageUrl: escapeHtmlSimpleV6_(manageUrl),
  };

  const html = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
    @media only screen and (max-width:620px){
      body,.page{background:#fff!important}.outer{padding:0!important}.shell{width:100%!important;max-width:100%!important;border-radius:0!important;box-shadow:none!important}.brand{padding:20px 18px 18px!important;border-top:5px solid #ff4b18!important}.logo-cell{display:none!important}.brand-copy{padding-left:0!important}.pad{padding-left:16px!important;padding-right:16px!important}.hero{padding-top:25px!important}.title{font-size:27px!important;line-height:1.12!important}.sub{font-size:13px!important;line-height:1.55!important}.schedule-card{border-radius:13px!important}.schedule-cell{padding:18px 16px!important}.schedule-value{font-size:19px!important}.grid td{display:block!important;width:100%!important}.gap{display:none!important}.info-card{margin-top:12px!important;border-radius:13px!important}.actions a{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important}.footer-cell{padding:22px 16px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#edf2f7;font-family:Arial,Helvetica,sans-serif;color:#16263f;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your IG Sabroso consultation request was received. Booking reference ${safe.reference}.</div>
  <table role="presentation" class="page" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf2f7;">
    <tr><td class="outer" align="center" style="padding:28px 12px 36px;">
      <table role="presentation" class="shell" width="680" cellspacing="0" cellpadding="0" border="0" style="width:680px;max-width:680px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 12px 38px rgba(22,38,63,.12);">
        <tr><td class="brand" style="padding:28px 32px 22px;background:#16263f;border-top:6px solid #ff4b18;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td class="logo-cell" width="58" valign="middle"><div style="width:50px;height:50px;line-height:50px;text-align:center;border-radius:14px;background:#ff4b18;color:#fff;font-size:20px;font-weight:800;">IG</div></td>
            <td class="brand-copy" valign="middle" style="padding-left:15px;"><div style="font-size:19px;line-height:1.2;font-weight:800;color:#fff;">IG SABROSO CONSTRUCTION</div><div style="margin-top:5px;font-size:13px;line-height:1.3;font-weight:700;color:#ffad96;">Elevate Your Lifestyle</div></td>
          </tr></table>
        </td></tr>

        <tr><td class="pad hero" style="padding:34px 32px 0;">
          <div style="display:inline-block;background:#fff3ee;border-radius:999px;padding:8px 12px;font-size:10px;line-height:1;font-weight:800;letter-spacing:1.3px;color:#ff4b18;text-transform:uppercase;">Appointment request received</div>
          <div class="title" style="margin-top:18px;font-size:36px;line-height:1.12;font-weight:800;letter-spacing:-.7px;color:#16263f;">Thank you, ${safe.fullName}.</div>
          <div class="sub" style="margin-top:10px;font-size:15px;line-height:1.6;color:#687487;">Your consultation request has been received successfully. Our team will review the details and contact you to confirm your appointment.</div>
        </td></tr>

        <tr><td class="pad" style="padding:26px 32px 0;">
          <table role="presentation" class="schedule-card" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#142a47;border-radius:17px;"><tr><td class="schedule-cell" style="padding:23px 25px;">
            <div style="font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;color:#ffad96;">Preferred appointment</div>
            <div class="schedule-value" style="margin-top:9px;font-size:24px;line-height:1.25;font-weight:800;color:#fff;">${safe.schedule}</div>
            <div style="margin-top:9px;font-size:12px;line-height:1.5;color:#d5dfec;">Booking reference: <strong>${safe.reference}</strong></div>
          </td></tr></table>
        </td></tr>

        <tr><td class="pad" style="padding:20px 32px 0;">
          <table role="presentation" class="grid" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td class="info-card" width="48%" valign="top" style="background:#f7f8fa;border-radius:15px;padding:18px 18px;">
              <div style="font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:#8b919b;">Project type</div>
              <div style="margin-top:6px;font-size:15px;line-height:1.35;font-weight:800;color:#16263f;">${safe.projectType}</div>
            </td>
            <td class="gap" width="4%">&nbsp;</td>
            <td class="info-card" width="48%" valign="top" style="background:#f7f8fa;border-radius:15px;padding:18px 18px;">
              <div style="font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:#8b919b;">Project location</div>
              <div style="margin-top:6px;font-size:15px;line-height:1.35;font-weight:800;color:#16263f;">${safe.projectLocation}</div>
            </td>
          </tr></table>
        </td></tr>

        <tr><td class="pad" style="padding:26px 32px 0;">
          <div style="font-size:13px;font-weight:800;color:#16263f;">What happens next?</div>
          <div style="margin-top:8px;font-size:13px;line-height:1.65;color:#687487;">Our team will review your request and contact you to confirm the consultation schedule. Please keep your booking reference if you need to find, reschedule, or cancel this request later.</div>
        </td></tr>

        <tr><td class="pad actions" style="padding:24px 32px 0;">
          <a href="${safe.manageUrl}" style="display:inline-block;background:#ff4b18;color:#fff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:.5px;padding:15px 22px;border-radius:11px;">MANAGE BOOKING →</a>
        </td></tr>

        <tr><td style="padding-top:30px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f8fa;"><tr><td class="footer-cell" style="padding:22px 32px;font-size:10px;line-height:1.55;color:#8a94a3;">
            Submitted securely through <strong style="color:#45536a;">igsabroso.com</strong><br>
            IG Sabroso Construction · Elevate Your Lifestyle
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body,
    htmlBody: html,
    name: 'IG Sabroso Construction',
  });
}


function replaceBookingCalendarEventV62_(calendar, reference, oldPayload, newPayload) {
  const oldDate = parseBookingDateV6_(oldPayload.preferredDate).normalized;
  const deletedPrevious = deleteBookingCalendarEventsV6_(calendar, reference, oldDate);
  try {
    const event = createBookingCalendarEventV6_(calendar, reference, newPayload);
    return { event: event, deletedPrevious: deletedPrevious };
  } catch (error) {
    if (deletedPrevious > 0) {
      try { createBookingCalendarEventV6_(calendar, reference, oldPayload); } catch (_) {}
    }
    throw error;
  }
}

function rollbackBookingCalendarReplacementV62_(calendar, reference, oldPayload, newPayload, transition) {
  try {
    deleteBookingCalendarEventsV6_(calendar, reference, newPayload.preferredDate);
  } catch (_) {}
  if (transition && transition.deletedPrevious > 0) {
    createBookingCalendarEventV6_(calendar, reference, oldPayload);
  }
}

function sendCustomerLifecycleEmailV62_(type, reference, booking, context) {
  const recipient = cleanTextV6_(booking.emailAddress);
  if (!isEmailAddressV6_(recipient)) return;

  const isRescheduled = type === 'rescheduled';
  const title = isRescheduled ? 'Booking rescheduled' : 'Booking cancelled';
  const eyebrow = isRescheduled ? 'Schedule updated' : 'Cancellation confirmed';
  const subject = isRescheduled
    ? 'IG Sabroso Booking Rescheduled — ' + reference
    : 'IG Sabroso Booking Cancelled — ' + reference;
  const schedule = isRescheduled
    ? cleanTextV6_(context.newSchedule)
    : cleanTextV6_(context.previousSchedule);
  const supporting = isRescheduled
    ? 'Your preferred consultation schedule has been updated successfully.'
    : 'Your consultation booking has been cancelled and no appointment remains scheduled for this booking reference.';
  const detailLabel = isRescheduled ? 'Current schedule' : 'Cancelled schedule';
  const manageUrl = CONFIG.SOURCE_WEBSITE + '/consultation';

  const safe = {
    name: escapeHtmlSimpleV6_(booking.fullName || 'Client'),
    reference: escapeHtmlSimpleV6_(reference),
    title: escapeHtmlSimpleV6_(title),
    eyebrow: escapeHtmlSimpleV6_(eyebrow),
    supporting: escapeHtmlSimpleV6_(supporting),
    detailLabel: escapeHtmlSimpleV6_(detailLabel),
    schedule: escapeHtmlSimpleV6_(schedule || 'Not provided'),
    projectType: escapeHtmlSimpleV6_(booking.projectType || 'Not provided'),
    location: escapeHtmlSimpleV6_(booking.projectLocation || 'Not provided'),
    reason: escapeHtmlSimpleV6_(cleanTextV6_(context.reason)),
    notes: escapeHtmlSimpleV6_(cleanTextV6_(context.notes)),
    manageUrl: escapeHtmlSimpleV6_(manageUrl),
  };

  const body = [
    'IG SABROSO CONSTRUCTION — Elevate Your Lifestyle',
    title.toUpperCase(),
    '',
    supporting,
    'Booking Reference: ' + reference,
    detailLabel + ': ' + schedule,
    context.reason ? 'Reason: ' + context.reason : '',
    '',
    'Manage booking: ' + manageUrl,
  ].filter(Boolean).join('\n');

  const extra = context.reason
    ? '<div style="margin-top:16px;padding:14px 16px;border-radius:12px;background:#f7f8fa;"><div style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#8a94a3;">Cancellation reason</div><div style="margin-top:6px;font-size:13px;line-height:1.55;color:#24354c;">' + safe.reason + '</div></div>'
    : (context.notes && context.notes !== 'None'
      ? '<div style="margin-top:16px;padding:14px 16px;border-radius:12px;background:#f7f8fa;"><div style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#8a94a3;">Schedule note</div><div style="margin-top:6px;font-size:13px;line-height:1.55;color:#24354c;">' + safe.notes + '</div></div>'
      : '');

  const html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@media(max-width:620px){.shell{width:100%!important;border-radius:0!important}.outer{padding:0!important}.pad{padding-left:16px!important;padding-right:16px!important}.title{font-size:27px!important}.actions a{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important}}</style></head>' +
    '<body style="margin:0;background:#edf2f7;font-family:Arial,Helvetica,sans-serif;color:#16263f;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf2f7;"><tr><td class="outer" align="center" style="padding:28px 12px 36px;">' +
    '<table role="presentation" class="shell" width="680" cellspacing="0" cellpadding="0" style="width:680px;max-width:680px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 12px 38px rgba(22,38,63,.12);">' +
    '<tr><td style="height:6px;background:#ff4b18;font-size:0;line-height:0;">&nbsp;</td></tr>' +
    '<tr><td class="pad" style="padding:26px 32px;background:#16263f;"><div style="font-size:19px;font-weight:800;color:#fff;">IG SABROSO CONSTRUCTION</div><div style="margin-top:5px;font-size:13px;font-weight:700;color:#ffad96;">Elevate Your Lifestyle</div></td></tr>' +
    '<tr><td class="pad" style="padding:32px 32px 0;"><div style="font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;color:#ff4b18;">' + safe.eyebrow + '</div><div class="title" style="margin-top:12px;font-size:35px;line-height:1.12;font-weight:800;color:#16263f;">' + safe.title + '</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:#687487;">' + safe.supporting + '</div></td></tr>' +
    '<tr><td class="pad" style="padding:24px 32px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#142a47;border-radius:16px;"><tr><td style="padding:22px 24px;"><div style="font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ffad96;">' + safe.detailLabel + '</div><div style="margin-top:8px;font-size:22px;line-height:1.3;font-weight:800;color:#fff;">' + safe.schedule + '</div><div style="margin-top:9px;font-size:11px;color:#d5dfec;">Booking reference: <strong>' + safe.reference + '</strong></div></td></tr></table>' + extra + '</td></tr>' +
    '<tr><td class="pad actions" style="padding:26px 32px 32px;"><a href="' + safe.manageUrl + '" style="display:inline-block;background:#ff4b18;color:#fff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:.5px;padding:15px 22px;border-radius:11px;">MANAGE BOOKING →</a><div style="margin-top:18px;font-size:10px;line-height:1.6;color:#8a94a3;">IG Sabroso Construction · Secure booking update</div></td></tr>' +
    '</table></td></tr></table></body></html>';

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body,
    htmlBody: html,
    name: 'IG Sabroso Construction',
  });
}

function openCrmRecordRedirectV622_(e) {
  const reference = normalizeBookingReferenceV6_(e && e.parameter ? e.parameter.ref : '');
  const row = Number(e && e.parameter ? e.parameter.row : 0);

  if (!reference || !Number.isInteger(row) || row <= CONFIG.BOOKINGS_HEADER_ROW) {
    return HtmlService.createHtmlOutput('<!doctype html><html><body style="font-family:Arial,sans-serif;padding:32px;color:#16263f"><h2>Invalid CRM record link</h2><p>Please open the latest internal IG Sabroso appointment notification.</p></body></html>')
      .setTitle('IG Sabroso CRM');
  }

  const booking = readBookingByRowV6_(row);
  if (normalizeBookingReferenceV6_(booking.bookingReference) !== reference) {
    return HtmlService.createHtmlOutput('<!doctype html><html><body style="font-family:Arial,sans-serif;padding:32px;color:#16263f"><h2>CRM record not found</h2><p>The booking reference does not match this CRM row.</p></body></html>')
      .setTitle('IG Sabroso CRM');
  }

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = getSheetV6_(CONFIG.BOOKINGS_SHEET);
  const targetUrl = ss.getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + row;
  const safeTarget = escapeHtmlSimpleV6_(targetUrl);
  const jsTarget = JSON.stringify(targetUrl);

  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;color:#16263f">' +
    '<div style="max-width:460px;margin:72px auto;padding:28px;background:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(22,38,63,.12);text-align:center">' +
    '<div style="font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18">IG Sabroso Internal</div>' +
    '<h2 style="margin:12px 0 8px">Opening CRM record</h2>' +
    '<p style="margin:0 0 20px;line-height:1.55;color:#687487">Redirecting to the secured Google Sheet record for ' + escapeHtmlSimpleV6_(reference) + '.</p>' +
    '<a href="' + safeTarget + '" target="_top" style="display:inline-block;background:#16263f;color:#fff;text-decoration:none;font-weight:800;padding:14px 18px;border-radius:10px">OPEN CRM RECORD</a>' +
    '</div>' +
    '<script>try{window.top.location.replace(' + jsTarget + ');}catch(e){window.location.replace(' + jsTarget + ');}</script>' +
    '</body></html>'
  ).setTitle('Opening IG Sabroso CRM');
}

function buildAdminOpsLinksV62_(reference, bookingRow, phoneNumber) {
  const serviceUrl = ScriptApp.getService().getUrl();
  if (!serviceUrl) throw new Error('Apps Script Web App URL is unavailable.');
  const crmUrl = serviceUrl + '?open=crm&ref=' + encodeURIComponent(reference) + '&row=' + Number(bookingRow);
  const tel = buildValidTelV625_(phoneNumber);
  const callUrl = tel
    ? serviceUrl + '?open=call&ref=' + encodeURIComponent(reference) + '&row=' + Number(bookingRow)
    : '';
  return { crmUrl: crmUrl, callUrl: callUrl };
}

function openClientCallBridgeV625_(e) {
  const reference = normalizeBookingReferenceV6_(e && e.parameter ? e.parameter.ref : '');
  const row = Number(e && e.parameter ? e.parameter.row : 0);
  let booking = null;

  if (reference && Number.isInteger(row) && row > CONFIG.BOOKINGS_HEADER_ROW) {
    try {
      const candidate = readBookingByRowV6_(row);
      if (normalizeBookingReferenceV6_(candidate.bookingReference) === reference) {
        booking = candidate;
      }
    } catch (_) {}
  }

  const tel = booking ? buildValidTelV625_(booking.phoneNumber) : '';
  const safeReference = escapeHtmlSimpleV6_(reference || '');

  if (!tel) {
    const referenceLine = safeReference
      ? '<div style="margin-top:18px;padding-top:16px;border-top:1px solid #e7ebf0;font-size:12px;line-height:1.5;color:#7b8797;">Booking reference&nbsp;&nbsp;·&nbsp;&nbsp;<strong style="color:#34445a;">' + safeReference + '</strong></div>'
      : '';

    return HtmlService.createHtmlOutput(
      '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
      '<meta name="format-detection" content="telephone=no"></head>' +
      '<body style="margin:0;min-height:100vh;background:#f3f6fa;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,Helvetica,sans-serif;color:#16263f;">' +
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px 16px calc(28px + env(safe-area-inset-bottom));box-sizing:border-box;">' +
      '<main style="width:100%;max-width:430px;background:#ffffff;border:1px solid #e4e9ef;border-top:4px solid #ff4b18;border-radius:18px;box-shadow:0 18px 50px rgba(22,38,63,.10);overflow:hidden;">' +
      '<header style="padding:22px 24px 18px;border-bottom:1px solid #edf0f4;">' +
      '<div style="font-size:13px;font-weight:800;letter-spacing:.45px;color:#16263f;">IG SABROSO CONSTRUCTION</div>' +
      '<div style="margin-top:4px;font-size:12px;color:#7b8797;">Internal client contact</div>' +
      '</header>' +
      '<section style="padding:26px 24px 24px;">' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#a23b2a;">' +
      '<span aria-hidden="true" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#d65a45;"></span>' +
      'Verified CRM contact required</div>' +
      '<h1 style="margin:16px 0 8px;font-size:27px;line-height:1.18;letter-spacing:-.4px;color:#16263f;">Phone number unavailable</h1>' +
      '<p style="margin:0;font-size:14px;line-height:1.65;color:#667386;">For security, CALL CLIENT only opens when the booking reference and CRM row match a valid stored contact. Return to the latest IG Sabroso appointment notification and try again.</p>' +
      referenceLine +
      '<div style="margin-top:24px;padding-top:18px;border-top:1px solid #edf0f4;font-size:11px;color:#8a95a5;">Internal use only&nbsp;&nbsp;·&nbsp;&nbsp;Powered by CDS</div>' +
      '</section></main></div></body></html>'
    ).setTitle('IG Sabroso Call Client');
  }

  const telHref = 'tel:' + tel;
  const safeTelHref = escapeHtmlSimpleV6_(telHref);
  const safePhone = escapeHtmlSimpleV6_(tel);
  const safeName = escapeHtmlSimpleV6_(booking.fullName || 'Client');
  const jsTelHref = JSON.stringify(telHref);

  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<meta name="format-detection" content="telephone=no"></head>' +
    '<body style="margin:0;min-height:100vh;background:#f3f6fa;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,Helvetica,sans-serif;color:#16263f;">' +
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px 16px calc(28px + env(safe-area-inset-bottom));box-sizing:border-box;">' +
    '<main style="width:100%;max-width:430px;background:#ffffff;border:1px solid #e4e9ef;border-top:4px solid #ff4b18;border-radius:18px;box-shadow:0 18px 50px rgba(22,38,63,.10);overflow:hidden;">' +
    '<header style="padding:22px 24px 18px;border-bottom:1px solid #edf0f4;">' +
    '<div style="font-size:13px;font-weight:800;letter-spacing:.45px;color:#16263f;">IG SABROSO CONSTRUCTION</div>' +
    '<div style="margin-top:4px;font-size:12px;color:#7b8797;">Internal client contact</div>' +
    '</header>' +
    '<section style="padding:26px 24px 24px;">' +
    '<div style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#2f6e52;">' +
    '<span aria-hidden="true" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3d8c68;"></span>' +
    'Verified CRM contact</div>' +
    '<h1 style="margin:16px 0 8px;font-size:30px;line-height:1.14;letter-spacing:-.6px;color:#16263f;">Call client</h1>' +
    '<p style="margin:0;font-size:14px;line-height:1.65;color:#667386;">The number below was verified against the matching IG Sabroso CRM booking record.</p>' +
    '<div style="margin-top:22px;padding:18px 18px 17px;background:#f7f9fc;border:1px solid #e5eaf0;border-radius:14px;">' +
    '<div style="font-size:12px;font-weight:700;color:#657286;">Client</div>' +
    '<div style="margin-top:5px;font-size:17px;font-weight:800;line-height:1.35;color:#16263f;word-break:break-word;">' + safeName + '</div>' +
    '<div style="margin-top:14px;font-size:12px;font-weight:700;color:#657286;">Phone</div>' +
    '<div style="margin-top:5px;font-size:22px;font-weight:800;letter-spacing:.2px;color:#16263f;word-break:break-word;">' + safePhone + '</div>' +
    '<div style="margin-top:14px;padding-top:14px;border-top:1px solid #e3e8ee;font-size:11px;line-height:1.5;color:#7b8797;">Booking reference&nbsp;&nbsp;·&nbsp;&nbsp;<strong style="color:#34445a;">' + safeReference + '</strong></div>' +
    '</div>' +
    '<a href="' + safeTelHref + '" aria-label="Call ' + safeName + ' at ' + safePhone + '" style="display:block;margin-top:20px;background:#16263f;color:#ffffff;text-decoration:none;text-align:center;font-size:13px;font-weight:800;letter-spacing:.45px;padding:16px 18px;border-radius:11px;box-shadow:0 8px 18px rgba(22,38,63,.14);">CALL CLIENT</a>' +
    '<div style="margin-top:12px;text-align:center;font-size:12px;line-height:1.55;color:#7b8797;">Opens your device phone app. Your phone will ask for confirmation before the call is placed.</div>' +
    '<div style="margin-top:24px;padding-top:18px;border-top:1px solid #edf0f4;font-size:11px;color:#8a95a5;">Internal use only&nbsp;&nbsp;·&nbsp;&nbsp;Powered by CDS</div>' +
    '</section></main></div>' +
    '<script>try{window.location.replace(' + jsTelHref + ');}catch(e){try{window.location.href=' + jsTelHref + ';}catch(_){}}</script>' +
    '</body></html>'
  ).setTitle('IG Sabroso Call Client');
}

function adminInfoRowV62_(label, value) {
  if (!cleanEmailValue_(value)) return '';
  return '<div style="padding:8px 0;border-bottom:1px solid #e4e7ec;"><div style="font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#98a2b3;">' + escapeHtmlV4_(label) + '</div><div style="margin-top:4px;font-size:13px;line-height:1.45;font-weight:700;color:#24354c;word-break:break-word;">' + value + '</div></div>';
}

function sendAdminLifecycleNotificationV62_(type, reference, booking, bookingRow, context) {
  const recipient = CONFIG.ADMIN_EMAIL;
  const isCreated = type === 'created';
  const isRescheduled = type === 'rescheduled';
  const title = isCreated ? 'New consultation request' : (isRescheduled ? 'Booking rescheduled' : 'Booking cancelled');
  const subject = title + ' - ' + reference + ' - ' + (cleanTextV6_(booking.fullName) || 'Website client');
  const statusCopy = isCreated ? 'A new consultation request was submitted.' :
    (isRescheduled ? 'The client updated the preferred consultation schedule.' : 'The client cancelled this consultation booking.');
  const currentSchedule = isCreated
    ? formatBookingScheduleV6_(booking.preferredDate, booking.preferredTime)
    : (isRescheduled ? cleanTextV6_(context.newSchedule) : cleanTextV6_(context.previousSchedule));
  const links = buildAdminOpsLinksV62_(reference, bookingRow, booking.phoneNumber);
  const reply = buildClientActionV4_(
    isEmailAddressV4_(booking.emailAddress) ? booking.emailAddress : '',
    booking.phoneNumber,
    reference,
    links.callUrl
  );

  const safe = {
    title: escapeHtmlV4_(title),
    statusCopy: escapeHtmlV4_(statusCopy),
    ref: escapeHtmlV4_(reference),
    fullName: escapeHtmlV4_(booking.fullName || 'Website client'),
    phone: escapeHtmlV4_(booking.phoneNumber || 'Not provided'),
    email: escapeHtmlV4_(booking.emailAddress || 'Not provided'),
    projectType: escapeHtmlV4_(booking.projectType || 'Not provided'),
    location: escapeHtmlV4_(booking.projectLocation || 'Not provided'),
    budget: escapeHtmlV4_(booking.budgetRange || 'Not provided'),
    details: escapeHtmlV4_(booking.projectDetails || 'No additional project details provided.'),
    schedule: escapeHtmlV4_(currentSchedule || 'Not provided'),
    previous: escapeHtmlV4_(cleanTextV6_(context.previousSchedule)),
    notes: escapeHtmlV4_(cleanTextV6_(context.notes)),
    reason: escapeHtmlV4_(cleanTextV6_(context.reason)),
    crmUrl: escapeHtmlV4_(links.crmUrl),
  };

  const extraRows = isRescheduled
    ? adminInfoRowV62_('Previous schedule', safe.previous) + adminInfoRowV62_('New schedule', safe.schedule) + (context.notes && context.notes !== 'None' ? adminInfoRowV62_('Client note', safe.notes) : '')
    : (!isCreated ? adminInfoRowV62_('Cancelled schedule', safe.schedule) + adminInfoRowV62_('Reason', safe.reason) : adminInfoRowV62_('Preferred schedule', safe.schedule));

  const body = [
    'IG SABROSO CONSTRUCTION — INTERNAL',
    title.toUpperCase(),
    reference,
    '',
    statusCopy,
    'Client: ' + (booking.fullName || 'Website client'),
    'Phone: ' + (booking.phoneNumber || 'Not provided'),
    'Email: ' + (booking.emailAddress || 'Not provided'),
    'Schedule: ' + currentSchedule,
    'CRM: ' + links.crmUrl,
    'Powered by CDS: https://caballerodigitalsolutions.com',
  ].join('\n');

  const html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@media(max-width:620px){.shell{width:100%!important;border-radius:0!important}.outer{padding:0!important}.pad{padding-left:16px!important;padding-right:16px!important}.title{font-size:26px!important}.grid td{display:block!important;width:100%!important}.gap{display:none!important}.ops a,.reply a{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important;margin:0 0 10px!important}.contact-actions,.contact-actions tbody,.contact-actions tr,.contact-action-cell{display:block!important;width:100%!important}.contact-action-gap{display:none!important}}</style></head>' +
    '<body style="margin:0;background:#edf2f7;font-family:Arial,Helvetica,sans-serif;color:#16263f;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf2f7;"><tr><td class="outer" align="center" style="padding:28px 12px 36px;">' +
    '<table role="presentation" class="shell" width="740" cellspacing="0" cellpadding="0" style="width:740px;max-width:740px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 12px 38px rgba(22,38,63,.12);">' +
    '<tr><td style="height:6px;background:#ff4b18;font-size:0;line-height:0;">&nbsp;</td></tr>' +
    '<tr><td class="pad" style="padding:26px 32px;background:#16263f;"><div style="font-size:19px;font-weight:800;color:#fff;">IG SABROSO CONSTRUCTION</div><div style="margin-top:5px;font-size:12px;font-weight:700;color:#ffad96;">Internal appointment operations</div></td></tr>' +
    '<tr><td class="pad" style="padding:30px 32px 0;"><div style="font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;color:#ff4b18;">' + safe.title + '</div><div class="title" style="margin-top:10px;font-size:35px;line-height:1.12;font-weight:800;color:#16263f;">' + safe.fullName + '</div><div style="margin-top:9px;font-size:14px;line-height:1.6;color:#687487;">' + safe.statusCopy + '</div></td></tr>' +
    '<tr><td class="pad" style="padding:23px 32px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f8fa;border-radius:16px;"><tr><td style="padding:20px 22px;">' +
      adminInfoRowV62_('Booking reference', safe.ref) +
      extraRows +
      adminInfoRowV62_('Phone', safe.phone) +
      adminInfoRowV62_('Email', safe.email) +
      adminInfoRowV62_('Project type', safe.projectType) +
      adminInfoRowV62_('Location', safe.location) +
      adminInfoRowV62_('Budget range', safe.budget) +
    '</td></tr></table></td></tr>' +
    '<tr><td class="pad" style="padding:20px 32px 0;"><div style="font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Project details</div><div style="margin-top:8px;font-size:13px;line-height:1.65;color:#344054;">' + safe.details + '</div></td></tr>' +
    '<tr><td class="pad ops" style="padding:26px 32px 0;"><a href="' + safe.crmUrl + '" style="display:inline-block;background:#16263f;color:#fff;text-decoration:none;font-size:12px;font-weight:800;letter-spacing:.45px;padding:15px 18px;border-radius:11px;">OPEN CRM RECORD →</a></td></tr>' +
    '<tr><td class="pad reply" style="padding:12px 32px 30px;">' + reply.html + '<div style="margin-top:18px;font-size:9px;line-height:1.6;color:#98a2b3;">Internal links require the recipient\'s existing Google permissions. Do not forward this email outside the team.</div><div style="margin-top:10px;font-size:9px;line-height:1.5;color:#a0a8b4;">Internal appointment notification<br><a href="https://caballerodigitalsolutions.com" target="_blank" style="display:inline-block;margin-top:5px;color:#ff4b18;text-decoration:none;font-weight:800;letter-spacing:.15px;">Powered by CDS</a></div></td></tr>' +
    '</table></td></tr></table></body></html>';

  const options = {
    to: recipient,
    subject: subject,
    body: body,
    htmlBody: html,
    name: 'IG Sabroso Appointments',
  };
  if (isEmailAddressV4_(booking.emailAddress)) options.replyTo = booking.emailAddress;
  MailApp.sendEmail(options);
}

function legacySendCustomerRescheduleConfirmationV6_(reference, email, dateValue, timeValue) {
  const schedule = formatBookingScheduleV6_(dateValue, timeValue);
  MailApp.sendEmail({
    to: email,
    subject: 'IG Sabroso Reschedule Request Received — ' + reference,
    body: 'Your reschedule request has been received.\nBooking Reference: ' + reference + '\nNew Preferred Schedule: ' + schedule,
    name: 'IG Sabroso Construction',
  });
}

function legacySendCustomerCancellationConfirmationV6_(reference, email) {
  MailApp.sendEmail({
    to: email,
    subject: 'IG Sabroso Cancellation Request Received — ' + reference,
    body: 'Your cancellation request has been received.\nBooking Reference: ' + reference,
    name: 'IG Sabroso Construction',
  });
}

function normalizeDateOutputV6_(value) {
  const text = cleanTextV6_(value);
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  return match ? match[1] : text;
}

function normalizeBookingReferenceV6_(value) {
  return cleanTextV6_(value).toUpperCase();
}

function normalizePhoneV6_(value) {
  return cleanTextV6_(value).replace(/\D/g, '');
}

function isEmailAddressV6_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanTextV6_(value));
}

function validateRequiredV6_(value, label) {
  if (!cleanTextV6_(value)) throw new Error(label + ' is required.');
}

function cleanTextV6_(value) {
  return String(value == null ? '' : value).trim();
}

function pad2V6_(value) {
  return String(value).padStart(2, '0');
}

function timestampV6_() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
}

function appendNoteV6_(existing, note) {
  const left = cleanTextV6_(existing);
  const right = cleanTextV6_(note);
  return left ? left + '\n' + right : right;
}

function escapeHtmlSimpleV6_(value) {
  return cleanTextV6_(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeErrorV6_(error) {
  return error && error.message ? String(error.message) : String(error || 'Unknown error');
}

function parseRequestBodyV6_(e) {
  if (!e || !e.postData || typeof e.postData.contents !== 'string') {
    throw new Error('Missing request body.');
  }
  return JSON.parse(e.postData.contents);
}

function jsonResponseV6_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
/**
 * IG Sabroso Construction — approved V4 booking notification email.
 *
 * Integration boundary:
 * - This file only formats and sends the internal booking notification email.
 * - It does NOT write to Sheets, create Calendar events, generate booking references,
 *   or change find/reschedule/cancel behavior.
 * - Call sendBookingNotificationV4_(recipient, bookingReference, payload) from the
 *   existing createBooking flow where the current plain MailApp notification is sent.
 */

const IGS_EMAIL_V4_TIMEZONE_ = 'Asia/Manila';
const IGS_EMAIL_V4_SENDER_NAME_ = 'IG Sabroso Appointments';

function legacySendBookingNotificationV4_(recipient, bookingReference, payload) {
  const notification = buildBookingNotificationV4_(bookingReference, payload);

  const options = {
    to: String(recipient || '').trim(),
    subject: notification.subject,
    body: notification.body,
    htmlBody: notification.htmlBody,
    name: IGS_EMAIL_V4_SENDER_NAME_,
  };

  if (notification.replyTo) {
    options.replyTo = notification.replyTo;
  }

  MailApp.sendEmail(options);
}

function buildBookingNotificationV4_(bookingReference, payload) {
  const p = payload || {};
  const ref = cleanEmailValue_(bookingReference) || 'IGS-BOOKING';
  const fullName = cleanEmailValue_(p.fullName) || 'Website client';
  const phoneNumber = cleanEmailValue_(p.phoneNumber) || 'Not provided';
  const emailAddress = cleanEmailValue_(p.emailAddress);
  const projectType = cleanEmailValue_(p.projectType) || 'Not provided';
  const projectLocation = cleanEmailValue_(p.projectLocation) || 'Not provided';
  const preferredService = cleanEmailValue_(p.preferredService) || 'Not provided';
  const approximateArea = cleanEmailValue_(p.approximateArea) || 'Not provided';
  const budgetRange = cleanEmailValue_(p.budgetRange) || 'Not provided';
  const projectDetails = cleanEmailValue_(p.projectDetails) || 'No additional project details provided.';
  const preferredDate = cleanEmailValue_(p.preferredDate);
  const preferredTime = cleanEmailValue_(p.preferredTime);

  const date = formatBookingDateV4_(preferredDate);
  const time = formatBookingTimeV4_(preferredTime);
  const desktopAppointment = date.desktop;
  const mobileAppointment = [date.mobile, time].filter(Boolean).join(', ');

  const replyTo = isEmailAddressV4_(emailAddress) ? emailAddress : '';
  const action = buildClientActionV4_(replyTo, phoneNumber, ref);

  const subject = 'New consultation request - ' + ref + ' - ' + fullName;

  const body = [
    'IG SABROSO CONSTRUCTION — Elevate Your Lifestyle',
    'NEW CONSULTATION REQUEST',
    '',
    fullName + ' is ready to build.',
    'A new appointment request was submitted through igsabroso.com.',
    '',
    'Preferred appointment: ' + (mobileAppointment || 'Not provided'),
    'Booking reference: ' + ref,
    '',
    'CLIENT CONTACT',
    fullName,
    phoneNumber,
    emailAddress || 'Not provided',
    '',
    'PROJECT SNAPSHOT',
    projectType,
    projectLocation,
    preferredService,
    approximateArea,
    budgetRange,
    '',
    'PROJECT DETAILS',
    projectDetails,
    '',
    action.plainText,
    'Submitted securely through igsabroso.com',
  ].join('\n');

  const safe = {
    ref: escapeHtmlV4_(ref),
    fullName: escapeHtmlV4_(fullName),
    phoneNumber: escapeHtmlV4_(phoneNumber),
    emailAddress: escapeHtmlV4_(emailAddress || 'Not provided'),
    projectType: escapeHtmlV4_(projectType),
    projectLocation: escapeHtmlV4_(projectLocation),
    preferredService: escapeHtmlV4_(preferredService),
    approximateArea: escapeHtmlV4_(approximateArea),
    budgetRange: escapeHtmlV4_(budgetRange),
    projectDetails: escapeHtmlV4_(projectDetails),
    desktopAppointment: escapeHtmlV4_(desktopAppointment || 'Preferred date not provided'),
    time: escapeHtmlV4_(time || 'Time not provided'),
    mobileAppointment: escapeHtmlV4_(mobileAppointment || 'Preferred schedule not provided'),
  };

  const htmlBody = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
    @media only screen and (max-width:620px){
      body,.page{background:#fff!important}.outer{padding:0!important}.shell{width:100%!important;max-width:100%!important;border-radius:0!important;box-shadow:none!important}.side-accent{display:none!important}.brand{background:#16263f!important;border-top:5px solid #ff4b18!important;padding:20px 18px 18px!important}.logo-cell{display:none!important}.brand-copy{padding-left:0!important}.brand-name{color:#fff!important;font-size:15px!important;line-height:1.2!important}.tagline{color:#efa08c!important;font-size:10px!important;font-weight:400!important}.pad{padding-left:14px!important;padding-right:14px!important}.status{padding-top:25px!important}.pill{padding:0!important;background:transparent!important;font-size:9px!important;letter-spacing:1.5px!important}.dot{display:none!important}.desktop-ref,.desktop-appt,.desktop-footer-note{display:none!important}.mobile-appt{display:block!important}.hero{padding-top:8px!important}.title{font-size:24px!important;line-height:1.12!important;letter-spacing:-.3px!important}.sub{font-size:13px!important;line-height:1.5!important;margin-top:8px!important}.appt-wrap{padding-top:20px!important}.appt{background:#fff0e9!important;border:1px solid #f3d4c6!important;border-radius:13px!important}.appt-cell{padding:17px 16px!important}.appt-label{font-size:9px!important;color:#c86645!important;letter-spacing:1.2px!important}.mobile-appt{font-size:18px!important;line-height:1.25!important;color:#1d2b42!important;font-weight:800!important;margin-top:8px!important}.mobile-ref{display:block!important;font-size:10px!important;color:#7f7780!important;margin-top:8px!important}.cols{padding-top:18px!important}.stack{display:block!important;width:100%!important}.gap{display:none!important}.info-card{display:block!important;background:#f7f8fa!important;border-radius:13px!important;padding:17px 16px!important;margin-bottom:14px!important}.section-title{font-size:15px!important;letter-spacing:0!important;text-transform:none!important;color:#1d2b42!important}.rule{display:none!important}.label{font-size:8px!important;letter-spacing:1.1px!important;text-transform:uppercase!important;color:#8b919b!important}.value{font-size:13px!important;line-height:1.3!important}.field-gap{margin-top:15px!important}.details{padding-top:1px!important}.details-box{background:#fff!important;border:0!important}.details-cell{padding:0!important}.details-title{font-size:15px!important;letter-spacing:0!important;text-transform:none!important;color:#1d2b42!important}.details-text{font-size:12px!important;line-height:1.55!important;margin-top:8px!important}.actions{padding-top:21px!important}.button{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important;padding:14px 16px!important;border-radius:8px!important;font-size:13px!important}.footer{margin-top:10px!important;background:#f7f8fa!important}.footer-cell{padding:22px 14px!important}.footer-grid td{display:block!important;width:100%!important;text-align:left!important}.footer-right{padding-top:13px!important}.internal{text-align:left!important;padding-top:17px!important;font-size:9px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#edf2f7;font-family:Arial,Helvetica,sans-serif;color:#16263f;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">New consultation request from ${safe.fullName}.</div>
  <table role="presentation" class="page" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf2f7;">
    <tr><td class="outer" align="center" style="padding:28px 12px 36px;">
      <table role="presentation" class="shell" width="760" cellspacing="0" cellpadding="0" border="0" style="width:760px;max-width:760px;background:#fff;border-radius:25px;overflow:hidden;box-shadow:0 12px 38px rgba(22,38,63,.12);">
        <tr>
          <td class="side-accent" width="8" style="width:8px;background:#ff4b18;font-size:0;line-height:0;">&nbsp;</td>
          <td>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr><td class="brand" style="padding:29px 34px 22px;background:#fff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
                  <td class="logo-cell" width="64" valign="middle"><div style="width:56px;height:56px;line-height:56px;text-align:center;border-radius:15px;background:#ff4b18;color:#fff;font-size:22px;font-weight:800;">IG</div></td>
                  <td class="brand-copy" valign="middle" style="padding-left:16px;"><div class="brand-name" style="font-size:21px;line-height:1.2;font-weight:800;color:#16263f;">IG SABROSO CONSTRUCTION</div><div class="tagline" style="margin-top:5px;font-size:14px;line-height:1.3;font-weight:700;color:#ff4b18;">Elevate Your Lifestyle</div></td>
                </tr></table>
              </td></tr>

              <tr><td class="pad status" style="padding:5px 34px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
                  <td><span class="pill" style="display:inline-block;background:#fff3ee;border-radius:999px;padding:9px 14px;font-size:12px;line-height:1;font-weight:800;letter-spacing:1.4px;color:#ff4b18;text-transform:uppercase;"><span class="dot">●&nbsp;&nbsp;</span>New consultation request</span></td>
                  <td class="desktop-ref" align="right" style="font-size:14px;font-weight:800;color:#16263f;">${safe.ref}</td>
                </tr></table>
              </td></tr>

              <tr><td class="pad hero" style="padding:34px 34px 0;">
                <div class="title" style="font-size:39px;line-height:1.12;font-weight:800;letter-spacing:-1.1px;color:#16263f;">${safe.fullName} is ready to build.</div>
                <div class="sub" style="margin-top:10px;font-size:16px;line-height:1.55;color:#687487;">A new appointment request was submitted through <strong style="color:#45536a;">igsabroso.com</strong>.</div>
              </td></tr>

              <tr><td class="pad appt-wrap" style="padding:28px 34px 0;">
                <table role="presentation" class="appt" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#142a47;border-radius:18px;"><tr><td class="appt-cell" style="padding:25px 28px;">
                  <div class="appt-label" style="font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#ffad96;">Preferred appointment</div>
                  <div class="desktop-appt" style="margin-top:10px;font-size:27px;line-height:1.2;font-weight:800;color:#fff;">${safe.desktopAppointment}</div>
                  <div class="desktop-appt" style="margin-top:8px;font-size:16px;line-height:1.45;color:#d5dfec;">${safe.time} &nbsp;·&nbsp; ${safe.projectType} project &nbsp;·&nbsp; ${safe.projectLocation}</div>
                  <div class="mobile-appt" style="display:none;">${safe.mobileAppointment}</div>
                  <div class="mobile-ref" style="display:none;">Booking reference: ${safe.ref}</div>
                </td></tr></table>
              </td></tr>

              <tr><td class="pad cols" style="padding:32px 34px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
                  <td class="stack info-card" width="48%" valign="top">
                    <div class="section-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Client contact</div><div class="rule" style="height:1px;background:#e8ebef;margin:10px 0 18px;"></div>
                    ${fieldHtmlV4_('Full name', safe.fullName, false)}
                    ${fieldHtmlV4_('Phone', safe.phoneNumber, true)}
                    ${fieldHtmlV4_('Email', safe.emailAddress, true)}
                  </td>
                  <td class="gap" width="4%">&nbsp;</td>
                  <td class="stack info-card" width="48%" valign="top">
                    <div class="section-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Project snapshot</div><div class="rule" style="height:1px;background:#e8ebef;margin:10px 0 18px;"></div>
                    ${fieldHtmlV4_('Project type', safe.projectType, false)}
                    ${fieldHtmlV4_('Location', safe.projectLocation, true)}
                    ${fieldHtmlV4_('Preferred service', safe.preferredService, true)}
                    ${fieldHtmlV4_('Approximate area', safe.approximateArea, true)}
                    ${fieldHtmlV4_('Budget range', safe.budgetRange, true)}
                  </td>
                </tr></table>
              </td></tr>

              <tr><td class="pad details" style="padding:30px 34px 0;">
                <table role="presentation" class="details-box" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7f9;border:1px solid #eaedf1;border-radius:16px;"><tr><td class="details-cell" style="padding:22px 24px;">
                  <div class="details-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Project details</div>
                  <div class="details-text" style="margin-top:12px;font-size:15px;line-height:1.65;color:#24354c;">${safe.projectDetails}</div>
                </td></tr></table>
              </td></tr>

              <tr><td class="pad actions" style="padding:30px 34px 0;">${action.html}</td></tr>

              <tr><td class="footer" style="padding-top:30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f8fa;"><tr><td class="footer-cell" style="padding:22px 34px;">
                  <table role="presentation" class="footer-grid" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
                    <td style="font-size:11px;line-height:1.5;color:#8a94a3;">Submitted securely through <strong style="color:#45536a;">igsabroso.com</strong></td>
                    <td class="footer-right" align="right" style="font-size:10px;line-height:1.5;color:#9aa3af;">Booking reference: ${safe.ref}</td>
                  </tr></table>
                  <div class="internal" style="padding-top:16px;text-align:center;font-size:9px;line-height:1.4;color:#a0a8b4;">Internal appointment notification<br><a href="https://caballerodigitalsolutions.com" target="_blank" style="display:inline-block;margin-top:5px;color:#ff4b18;text-decoration:none;font-weight:800;letter-spacing:.15px;">Powered by CDS</a></div>
                </td></tr></table>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    replyTo: replyTo,
  };
}

function fieldHtmlV4_(label, escapedValue, addGap) {
  return '<div' + (addGap ? ' class="field-gap" style="margin-top:18px;"' : '') + '>' +
    '<div class="label" style="font-size:12px;line-height:1.2;color:#8993a2;">' + escapeHtmlV4_(label) + '</div>' +
    '<div class="value" style="margin-top:5px;font-size:16px;line-height:1.35;font-weight:800;color:#16263f;word-break:break-word;">' + escapedValue + '</div>' +
    '</div>';
}

function buildClientActionV4_(emailAddress, phoneNumber, bookingReference, mobileCallUrl) {
  const actions = [];
  const plainText = [];
  if (isEmailAddressV4_(emailAddress)) {
    const href = 'mailto:' + encodeURIComponent(emailAddress) +
      '?subject=' + encodeURIComponent('Re: IG Sabroso consultation request ' + bookingReference);
    plainText.push('Reply to client: ' + emailAddress);
    actions.push(
      '<a class="button" href="' + href + '" style="display:block;box-sizing:border-box;width:100%;background:#ff4b18;color:#fff;text-align:center;text-decoration:none;font-size:13px;line-height:1;font-weight:800;letter-spacing:.3px;padding:16px 18px;border-radius:11px;">REPLY TO CLIENT</a>'
    );
  }

  const phone = cleanEmailValue_(phoneNumber);
  const tel = buildValidTelV625_(phone);
  if (tel) {
    const safeMobileCallUrl = cleanEmailValue_(mobileCallUrl);
    const callHref = /^https:\/\//i.test(safeMobileCallUrl)
      ? escapeHtmlV4_(safeMobileCallUrl)
      : 'tel:' + escapeHtmlV4_(tel);
    plainText.push('Call client: ' + phone);
    actions.push(
      '<a class="button" href="' + callHref + '" style="display:block;box-sizing:border-box;width:100%;background:#16263f;color:#fff;text-align:center;text-decoration:none;font-size:13px;line-height:1;font-weight:800;letter-spacing:.3px;padding:16px 18px;border-radius:11px;">CALL CLIENT</a>'
    );
  }

  if (actions.length === 2) {
    return {
      plainText: plainText.join('\n'),
      html: '<table role="presentation" class="contact-actions" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>' +
        '<td class="contact-action-cell" width="49%" valign="top">' + actions[0] + '</td>' +
        '<td class="contact-action-gap" width="2%">&nbsp;</td>' +
        '<td class="contact-action-cell" width="49%" valign="top">' + actions[1] + '</td>' +
        '</tr></table>',
    };
  }

  if (actions.length === 1) return { plainText: plainText[0], html: actions[0] };

  return {
    plainText: 'Client contact details were not provided.',
    html: '<div style="font-size:13px;line-height:1.5;color:#687487;">Client contact details were not provided.</div>',
  };
}

function buildValidTelV625_(value) {
  const original = cleanEmailValue_(value);
  const digits = original.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return '';
  return (original.charAt(0) === '+' ? '+' : '') + digits;
}

function formatBookingDateV4_(value) {
  const text = cleanEmailValue_(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) {
    return { desktop: text || 'Preferred date not provided', mobile: text || 'Date not provided' };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return {
    desktop: Utilities.formatDate(date, 'UTC', 'EEEE, d MMMM yyyy'),
    mobile: Utilities.formatDate(date, 'UTC', 'MMMM d, yyyy'),
  };
}

function formatBookingTimeV4_(value) {
  const text = cleanEmailValue_(value);
  if (!text) return '';

  const twelveHour = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(text);
  if (twelveHour) {
    return Number(twelveHour[1]) + ':' + twelveHour[2] + ' ' + twelveHour[3].toUpperCase();
  }

  const twentyFourHour = /^(\d{1,2}):(\d{2})$/.exec(text);
  if (!twentyFourHour) return text;

  const hours = Number(twentyFourHour[1]);
  const minutes = twentyFourHour[2];
  if (hours < 0 || hours > 23) return text;

  const suffix = hours >= 12 ? 'PM' : 'AM';
  const twelve = hours % 12 || 12;
  return twelve + ':' + minutes + ' ' + suffix;
}

function isEmailAddressV4_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailValue_(value));
}

function cleanEmailValue_(value) {
  return String(value == null ? '' : value).trim();
}

function escapeHtmlV4_(value) {
  return cleanEmailValue_(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\r?\n/g, '<br>');
}
