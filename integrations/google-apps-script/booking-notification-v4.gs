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

const IGS_EMAIL_V4_SENDER_NAME_ = 'IG Sabroso Appointments';

function sendBookingNotificationV4_(recipient, bookingReference, payload) {
  const notification = buildBookingNotificationV4_(bookingReference, payload);
  const options = {
    to: String(recipient || '').trim(),
    subject: notification.subject,
    body: notification.body,
    htmlBody: notification.htmlBody,
    name: IGS_EMAIL_V4_SENDER_NAME_,
  };

  if (notification.replyTo) options.replyTo = notification.replyTo;
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
    desktopAppointment: escapeHtmlV4_(date.desktop || 'Preferred date not provided'),
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
<table role="presentation" class="page" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf2f7;"><tr><td class="outer" align="center" style="padding:28px 12px 36px;">
<table role="presentation" class="shell" width="760" cellspacing="0" cellpadding="0" border="0" style="width:760px;max-width:760px;background:#fff;border-radius:25px;overflow:hidden;box-shadow:0 12px 38px rgba(22,38,63,.12);"><tr>
<td class="side-accent" width="8" style="width:8px;background:#ff4b18;font-size:0;line-height:0;">&nbsp;</td><td>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr><td class="brand" style="padding:29px 34px 22px;background:#fff;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="logo-cell" width="64" valign="middle"><div style="width:56px;height:56px;line-height:56px;text-align:center;border-radius:15px;background:#ff4b18;color:#fff;font-size:22px;font-weight:800;">IG</div></td><td class="brand-copy" valign="middle" style="padding-left:16px;"><div class="brand-name" style="font-size:21px;line-height:1.2;font-weight:800;color:#16263f;">IG SABROSO CONSTRUCTION</div><div class="tagline" style="margin-top:5px;font-size:14px;line-height:1.3;font-weight:700;color:#ff4b18;">Elevate Your Lifestyle</div></td></tr></table></td></tr>
<tr><td class="pad status" style="padding:5px 34px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td><span class="pill" style="display:inline-block;background:#fff3ee;border-radius:999px;padding:9px 14px;font-size:12px;line-height:1;font-weight:800;letter-spacing:1.4px;color:#ff4b18;text-transform:uppercase;"><span class="dot">●&nbsp;&nbsp;</span>New consultation request</span></td><td class="desktop-ref" align="right" style="font-size:14px;font-weight:800;color:#16263f;">${safe.ref}</td></tr></table></td></tr>
<tr><td class="pad hero" style="padding:34px 34px 0;"><div class="title" style="font-size:39px;line-height:1.12;font-weight:800;letter-spacing:-1.1px;color:#16263f;">${safe.fullName} is ready to build.</div><div class="sub" style="margin-top:10px;font-size:16px;line-height:1.55;color:#687487;">A new appointment request was submitted through <strong style="color:#45536a;">igsabroso.com</strong>.</div></td></tr>
<tr><td class="pad appt-wrap" style="padding:28px 34px 0;"><table role="presentation" class="appt" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#142a47;border-radius:18px;"><tr><td class="appt-cell" style="padding:25px 28px;"><div class="appt-label" style="font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#ffad96;">Preferred appointment</div><div class="desktop-appt" style="margin-top:10px;font-size:27px;line-height:1.2;font-weight:800;color:#fff;">${safe.desktopAppointment}</div><div class="desktop-appt" style="margin-top:8px;font-size:16px;line-height:1.45;color:#d5dfec;">${safe.time} &nbsp;·&nbsp; ${safe.projectType} project &nbsp;·&nbsp; ${safe.projectLocation}</div><div class="mobile-appt" style="display:none;">${safe.mobileAppointment}</div><div class="mobile-ref" style="display:none;">Booking reference: ${safe.ref}</div></td></tr></table></td></tr>
<tr><td class="pad cols" style="padding:32px 34px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="stack info-card" width="48%" valign="top"><div class="section-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Client contact</div><div class="rule" style="height:1px;background:#e8ebef;margin:10px 0 18px;"></div>${fieldHtmlV4_('Full name', safe.fullName, false)}${fieldHtmlV4_('Phone', safe.phoneNumber, true)}${fieldHtmlV4_('Email', safe.emailAddress, true)}</td><td class="gap" width="4%">&nbsp;</td><td class="stack info-card" width="48%" valign="top"><div class="section-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Project snapshot</div><div class="rule" style="height:1px;background:#e8ebef;margin:10px 0 18px;"></div>${fieldHtmlV4_('Project type', safe.projectType, false)}${fieldHtmlV4_('Location', safe.projectLocation, true)}${fieldHtmlV4_('Preferred service', safe.preferredService, true)}${fieldHtmlV4_('Approximate area', safe.approximateArea, true)}${fieldHtmlV4_('Budget range', safe.budgetRange, true)}</td></tr></table></td></tr>
<tr><td class="pad details" style="padding:30px 34px 0;"><table role="presentation" class="details-box" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7f9;border:1px solid #eaedf1;border-radius:16px;"><tr><td class="details-cell" style="padding:22px 24px;"><div class="details-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Project details</div><div class="details-text" style="margin-top:12px;font-size:15px;line-height:1.65;color:#24354c;">${safe.projectDetails}</div></td></tr></table></td></tr>
<tr><td class="pad actions" style="padding:30px 34px 0;">${action.html}</td></tr>
<tr><td class="footer" style="padding-top:30px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f8fa;"><tr><td class="footer-cell" style="padding:22px 34px;"><table role="presentation" class="footer-grid" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="font-size:11px;line-height:1.5;color:#8a94a3;">Submitted securely through <strong style="color:#45536a;">igsabroso.com</strong></td><td class="footer-right" align="right" style="font-size:10px;line-height:1.5;color:#9aa3af;">Booking reference: ${safe.ref}</td></tr></table><div class="internal" style="padding-top:16px;text-align:center;font-size:9px;line-height:1.4;color:#a0a8b4;">Internal appointment notification</div></td></tr></table></td></tr>
</table></td></tr></table></td></tr></table>
</body></html>`;

  return { subject: subject, body: body, htmlBody: htmlBody, replyTo: replyTo };
}

function fieldHtmlV4_(label, escapedValue, addGap) {
  return '<div' + (addGap ? ' class="field-gap" style="margin-top:18px;"' : '') + '>' +
    '<div class="label" style="font-size:12px;line-height:1.2;color:#8993a2;">' + escapeHtmlV4_(label) + '</div>' +
    '<div class="value" style="margin-top:5px;font-size:16px;line-height:1.35;font-weight:800;color:#16263f;word-break:break-word;">' + escapedValue + '</div></div>';
}

function buildClientActionV4_(emailAddress, phoneNumber, bookingReference) {
  if (emailAddress) {
    const href = 'mailto:' + encodeURIComponent(emailAddress) + '?subject=' + encodeURIComponent('Re: IG Sabroso consultation request ' + bookingReference);
    return { plainText: 'Reply to client: ' + emailAddress, html: '<a class="button" href="' + href + '" style="display:inline-block;background:#ff4b18;color:#fff;text-decoration:none;font-size:14px;line-height:1;font-weight:800;letter-spacing:.3px;padding:16px 24px;border-radius:11px;">REPLY TO CLIENT →</a>' };
  }
  const phone = cleanEmailValue_(phoneNumber);
  const tel = phone.replace(/[^+\d]/g, '');
  if (tel) return { plainText: 'Call client: ' + phone, html: '<a class="button" href="tel:' + escapeHtmlV4_(tel) + '" style="display:inline-block;background:#ff4b18;color:#fff;text-decoration:none;font-size:14px;line-height:1;font-weight:800;letter-spacing:.3px;padding:16px 24px;border-radius:11px;">CALL CLIENT →</a>' };
  return { plainText: 'Client contact details were not provided.', html: '<div style="font-size:13px;line-height:1.5;color:#687487;">Client contact details were not provided.</div>' };
}

function formatBookingDateV4_(value) {
  const text = cleanEmailValue_(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return { desktop: text || 'Preferred date not provided', mobile: text || 'Date not provided' };
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0));
  return { desktop: Utilities.formatDate(date, 'UTC', 'EEEE, d MMMM yyyy'), mobile: Utilities.formatDate(date, 'UTC', 'MMMM d, yyyy') };
}

function formatBookingTimeV4_(value) {
  const text = cleanEmailValue_(value);
  if (!text) return '';
  const twelveHour = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(text);
  if (twelveHour) return Number(twelveHour[1]) + ':' + twelveHour[2] + ' ' + twelveHour[3].toUpperCase();
  const twentyFourHour = /^(\d{1,2}):(\d{2})$/.exec(text);
  if (!twentyFourHour) return text;
  const hours = Number(twentyFourHour[1]);
  if (hours < 0 || hours > 23) return text;
  return (hours % 12 || 12) + ':' + twentyFourHour[2] + ' ' + (hours >= 12 ? 'PM' : 'AM');
}

function isEmailAddressV4_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailValue_(value));
}

function cleanEmailValue_(value) {
  return String(value == null ? '' : value).trim();
}

function escapeHtmlV4_(value) {
  return cleanEmailValue_(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\r?\n/g, '<br>');
}
