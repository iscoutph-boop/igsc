/*
 * IG Sabroso Construction — Approved Consultation Email UI V4
 *
 * PURPOSE
 * - Presentation-only module for the existing Google Apps Script CRM.
 * - Keeps the current create/find/reschedule/cancel, Sheets, and Calendar logic unchanged.
 * - Replaces only the admin consultation-notification email presentation.
 *
 * INTEGRATION
 * Call:
 *   sendIgSabrosoConsultationEmailV4FromPayload_(ADMIN_EMAIL, payload, bookingReference);
 *
 * Use the existing admin/notification email variable already present in Code.gs.
 * Do not hardcode credentials or change the deployed web-app URL.
 */

const IGS_EMAIL_V4_CONFIG_ = Object.freeze({
  brandName: 'IG SABROSO CONSTRUCTION',
  tagline: 'Elevate Your Lifestyle',
  senderName: 'IG Sabroso Appointments',
  siteHost: 'igsabroso.com',
  timezone: 'Asia/Manila',
  navy: '#16263f',
  navyPanel: '#142a47',
  orange: '#ff4b18',
  orangeSoft: '#fff0e9',
  orangeBorder: '#f3d4c6',
  bodyText: '#16263f',
  mutedText: '#687487',
  panel: '#f7f8fa',
});

/**
 * Adapter for the existing website payload.
 * This function deliberately accepts only the booking payload + generated reference.
 */
function sendIgSabrosoConsultationEmailV4FromPayload_(recipientEmail, payload, bookingReference) {
  const booking = {
    bookingReference: bookingReference || payload.bookingReference || '',
    fullName: payload.fullName || '',
    phoneNumber: payload.phoneNumber || '',
    emailAddress: payload.emailAddress || '',
    projectType: payload.projectType || '',
    projectLocation: payload.projectLocation || '',
    preferredService: payload.preferredService || '',
    approximateArea: payload.approximateArea || '',
    preferredDate: payload.preferredDate || '',
    preferredTime: payload.preferredTime || '',
    budgetRange: payload.budgetRange || '',
    projectDetails: payload.projectDetails || '',
  };

  return sendIgSabrosoConsultationEmailV4_(recipientEmail, booking);
}

/**
 * Sends the approved branded admin notification.
 * Preserve any separate client-confirmation email already used by the backend.
 */
function sendIgSabrosoConsultationEmailV4_(recipientEmail, booking) {
  const recipient = String(recipientEmail || '').trim();
  if (!recipient) {
    throw new Error('IG Sabroso notification recipient is not configured.');
  }

  const email = buildIgSabrosoConsultationEmailV4_(booking || {});
  const message = {
    to: recipient,
    subject: email.subject,
    body: email.body,
    htmlBody: email.htmlBody,
    name: IGS_EMAIL_V4_CONFIG_.senderName,
  };

  if (email.replyTo) {
    message.replyTo = email.replyTo;
  }

  MailApp.sendEmail(message);
  return email;
}

/**
 * Pure renderer. Returns subject, text fallback, HTML body, and Reply-To.
 */
function buildIgSabrosoConsultationEmailV4_(booking) {
  const reference = cleanEmailTextV4_(booking.bookingReference) || 'Booking reference pending';
  const fullName = cleanEmailTextV4_(booking.fullName) || 'New client';
  const phone = cleanEmailTextV4_(booking.phoneNumber) || 'Not provided';
  const emailAddress = cleanEmailTextV4_(booking.emailAddress);
  const projectType = cleanEmailTextV4_(booking.projectType) || 'Not provided';
  const location = cleanEmailTextV4_(booking.projectLocation) || 'Not provided';
  const service = cleanEmailTextV4_(booking.preferredService) || 'Not provided';
  const area = cleanEmailTextV4_(booking.approximateArea) || 'Not provided';
  const budget = cleanEmailTextV4_(booking.budgetRange) || 'Not provided';
  const details = cleanEmailTextV4_(booking.projectDetails) || 'No additional project details were provided.';
  const dateInfo = formatIgSabrosoEmailDateV4_(booking.preferredDate);
  const timeDisplay = formatIgSabrosoEmailTimeV4_(booking.preferredTime);

  const subject = 'New consultation request - ' + reference + ' - ' + fullName;
  const mobileAppointment = [dateInfo.mobileDate, timeDisplay].filter(Boolean).join(', ') || 'Schedule to be confirmed';
  const desktopDate = dateInfo.desktopDate || 'Schedule to be confirmed';
  const projectDescriptor = projectType === 'Not provided' ? projectType : projectType + ' project';
  const desktopMeta = [timeDisplay, projectDescriptor, location].filter(Boolean).join(' · ');

  const replyHref = emailAddress
    ? 'mailto:' + encodeURIComponent(emailAddress) + '?subject=' + encodeURIComponent('Re: IG Sabroso consultation request ' + reference)
    : '';

  const plainText = [
    IGS_EMAIL_V4_CONFIG_.brandName + ' — ' + IGS_EMAIL_V4_CONFIG_.tagline,
    'NEW CONSULTATION REQUEST',
    '',
    fullName + ' is ready to build.',
    'A new appointment request was submitted through ' + IGS_EMAIL_V4_CONFIG_.siteHost + '.',
    '',
    'Preferred appointment: ' + mobileAppointment,
    'Booking reference: ' + reference,
    '',
    'CLIENT CONTACT',
    'Full name: ' + fullName,
    'Phone: ' + phone,
    'Email: ' + (emailAddress || 'Not provided'),
    '',
    'PROJECT SNAPSHOT',
    'Project type: ' + projectType,
    'Location: ' + location,
    'Preferred service: ' + service,
    'Approximate area: ' + area,
    'Budget range: ' + budget,
    '',
    'PROJECT DETAILS',
    details,
    '',
    emailAddress ? 'Reply to client: ' + emailAddress : 'No client email was provided; use the phone number above.',
    'Submitted securely through ' + IGS_EMAIL_V4_CONFIG_.siteHost,
  ].join('\n');

  const h = escapeEmailHtmlV4_;
  const htmlBody = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
    @media only screen and (max-width:620px){
      body,.page{background:#fff!important}
      .outer{padding:0!important}
      .shell{width:100%!important;max-width:100%!important;border-radius:0!important;box-shadow:none!important}
      .side-accent{display:none!important}
      .brand{background:#16263f!important;border-top:5px solid #ff4b18!important;padding:20px 18px 18px!important}
      .logo-cell{display:none!important}
      .brand-copy{padding-left:0!important}
      .brand-name{color:#fff!important;font-size:15px!important;line-height:1.2!important}
      .tagline{color:#efa08c!important;font-size:10px!important;font-weight:400!important}
      .pad{padding-left:14px!important;padding-right:14px!important}
      .status{padding-top:25px!important}
      .pill{padding:0!important;background:transparent!important;font-size:9px!important;letter-spacing:1.5px!important}
      .dot{display:none!important}
      .desktop-ref,.desktop-appt,.desktop-footer-note{display:none!important}
      .mobile-appt{display:block!important}
      .hero{padding-top:8px!important}
      .title{font-size:24px!important;line-height:1.12!important;letter-spacing:-.3px!important}
      .sub{font-size:13px!important;line-height:1.5!important;margin-top:8px!important}
      .appt-wrap{padding-top:20px!important}
      .appt{background:#fff0e9!important;border:1px solid #f3d4c6!important;border-radius:13px!important}
      .appt-cell{padding:17px 16px!important}
      .appt-label{font-size:9px!important;color:#c86645!important;letter-spacing:1.2px!important}
      .mobile-appt{font-size:18px!important;line-height:1.25!important;color:#1d2b42!important;font-weight:800!important;margin-top:8px!important}
      .mobile-ref{display:block!important;font-size:10px!important;color:#7f7780!important;margin-top:8px!important}
      .cols{padding-top:18px!important}
      .stack{display:block!important;width:100%!important}
      .gap{display:none!important}
      .info-card{display:block!important;background:#f7f8fa!important;border-radius:13px!important;padding:17px 16px!important;margin-bottom:14px!important}
      .section-title{font-size:15px!important;letter-spacing:0!important;text-transform:none!important;color:#1d2b42!important}
      .rule{display:none!important}
      .label{font-size:8px!important;letter-spacing:1.1px!important;text-transform:uppercase!important;color:#8b919b!important}
      .value{font-size:13px!important;line-height:1.3!important}
      .field-gap{margin-top:15px!important}
      .details{padding-top:1px!important}
      .details-box{background:#fff!important;border:0!important}
      .details-cell{padding:0!important}
      .details-title{font-size:15px!important;letter-spacing:0!important;text-transform:none!important;color:#1d2b42!important}
      .details-text{font-size:12px!important;line-height:1.55!important;margin-top:8px!important}
      .actions{padding-top:21px!important}
      .button{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important;padding:14px 16px!important;border-radius:8px!important;font-size:13px!important}
      .footer{margin-top:10px!important;background:#f7f8fa!important}
      .footer-cell{padding:22px 14px!important}
      .footer-grid td{display:block!important;width:100%!important;text-align:left!important}
      .footer-right{padding-top:13px!important}
      .internal{text-align:left!important;padding-top:17px!important;font-size:9px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#edf2f7;font-family:Arial,Helvetica,sans-serif;color:#16263f;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">New consultation request from ${h(fullName)}.</div>
  <table role="presentation" class="page" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf2f7;">
    <tr>
      <td class="outer" align="center" style="padding:28px 12px 36px;">
        <table role="presentation" class="shell" width="760" cellspacing="0" cellpadding="0" border="0" style="width:760px;max-width:760px;background:#fff;border-radius:25px;overflow:hidden;box-shadow:0 12px 38px rgba(22,38,63,.12);">
          <tr>
            <td class="side-accent" width="8" style="width:8px;background:#ff4b18;font-size:0;line-height:0;">&nbsp;</td>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="brand" style="padding:29px 34px 22px;background:#fff;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="logo-cell" width="64" valign="middle">
                          <div style="width:56px;height:56px;line-height:56px;text-align:center;border-radius:15px;background:#ff4b18;color:#fff;font-size:22px;font-weight:800;">IG</div>
                        </td>
                        <td class="brand-copy" valign="middle" style="padding-left:16px;">
                          <div class="brand-name" style="font-size:21px;line-height:1.2;font-weight:800;color:#16263f;">${IGS_EMAIL_V4_CONFIG_.brandName}</div>
                          <div class="tagline" style="margin-top:5px;font-size:14px;line-height:1.3;font-weight:700;color:#ff4b18;">${IGS_EMAIL_V4_CONFIG_.tagline}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad status" style="padding:5px 34px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td><span class="pill" style="display:inline-block;background:#fff3ee;border-radius:999px;padding:9px 14px;font-size:12px;line-height:1;font-weight:800;letter-spacing:1.4px;color:#ff4b18;text-transform:uppercase;"><span class="dot">●&nbsp;&nbsp;</span>New consultation request</span></td>
                        <td class="desktop-ref" align="right" style="font-size:14px;font-weight:800;color:#16263f;">${h(reference)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad hero" style="padding:34px 34px 0;">
                    <div class="title" style="font-size:39px;line-height:1.12;font-weight:800;letter-spacing:-1.1px;color:#16263f;">${h(fullName)} is ready to build.</div>
                    <div class="sub" style="margin-top:10px;font-size:16px;line-height:1.55;color:#687487;">A new appointment request was submitted through <strong style="color:#45536a;">${IGS_EMAIL_V4_CONFIG_.siteHost}</strong>.</div>
                  </td>
                </tr>
                <tr>
                  <td class="pad appt-wrap" style="padding:28px 34px 0;">
                    <table role="presentation" class="appt" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#142a47;border-radius:18px;">
                      <tr>
                        <td class="appt-cell" style="padding:25px 28px;">
                          <div class="appt-label" style="font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#ffad96;">Preferred appointment</div>
                          <div class="desktop-appt" style="margin-top:10px;font-size:27px;line-height:1.2;font-weight:800;color:#fff;">${h(desktopDate)}</div>
                          <div class="desktop-appt" style="margin-top:8px;font-size:16px;line-height:1.45;color:#d5dfec;">${h(desktopMeta)}</div>
                          <div class="mobile-appt" style="display:none;">${h(mobileAppointment)}</div>
                          <div class="mobile-ref" style="display:none;">Booking reference: ${h(reference)}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad cols" style="padding:32px 34px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="stack info-card" width="48%" valign="top">
                          ${buildIgSabrosoInfoCardV4_('Client contact', [
                            ['Full name', fullName],
                            ['Phone number', phone],
                            ['Email address', emailAddress || 'Not provided'],
                          ])}
                        </td>
                        <td class="gap" width="4%">&nbsp;</td>
                        <td class="stack info-card" width="48%" valign="top">
                          ${buildIgSabrosoInfoCardV4_('Project snapshot', [
                            ['Project type', projectType],
                            ['Location', location],
                            ['Preferred service', service],
                            ['Approximate area', area],
                            ['Budget range', budget],
                          ])}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad details" style="padding:28px 34px 0;">
                    <table role="presentation" class="details-box" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f8fa;border:1px solid #edf0f4;border-radius:16px;">
                      <tr>
                        <td class="details-cell" style="padding:21px 24px;">
                          <div class="details-title" style="font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">Project details</div>
                          <div class="details-text" style="margin-top:10px;font-size:14px;line-height:1.6;color:#27354a;">${h(details)}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad actions" style="padding:24px 34px 0;">
                    ${replyHref
                      ? `<a class="button" href="${h(replyHref)}" style="display:inline-block;background:#ff4b18;color:#fff;text-decoration:none;border-radius:10px;padding:15px 28px;font-size:14px;font-weight:800;letter-spacing:.2px;">REPLY TO CLIENT →</a>`
                      : `<div style="font-size:13px;line-height:1.5;color:#687487;">No client email was provided. Please use the phone number in Client contact.</div>`}
                  </td>
                </tr>
                <tr>
                  <td class="footer" style="padding-top:24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f8fa;">
                      <tr>
                        <td class="footer-cell" style="padding:20px 34px;">
                          <table role="presentation" class="footer-grid" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="font-size:11px;line-height:1.5;color:#8a93a0;">Submitted securely through <strong style="color:#16263f;">${IGS_EMAIL_V4_CONFIG_.siteHost}</strong></td>
                              <td class="footer-right" align="right" style="font-size:10px;line-height:1.5;color:#9aa2ad;">Internal appointment notification</td>
                            </tr>
                          </table>
                          <div class="internal desktop-footer-note" style="margin-top:14px;padding-top:14px;border-top:1px solid #e8ebef;text-align:center;font-size:9px;line-height:1.4;color:#a1a7b0;">IG Sabroso Construction · Consultation notification</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: subject,
    body: plainText,
    htmlBody: htmlBody,
    replyTo: emailAddress || '',
  };
}

function buildIgSabrosoInfoCardV4_(title, fields) {
  const h = escapeEmailHtmlV4_;
  let content = `<div class="section-title" style="font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18;">${h(title)}</div><div class="rule" style="height:1px;background:#edf0f4;margin:10px 0 18px;"></div>`;

  fields.forEach(function(field, index) {
    const gapClass = index ? ' field-gap' : '';
    content += `<div class="${gapClass.trim()}" style="${index ? 'margin-top:17px;' : ''}"><div class="label" style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8a93a0;">${h(field[0])}</div><div class="value" style="margin-top:5px;font-size:14px;line-height:1.35;font-weight:700;color:#16263f;word-break:break-word;">${h(field[1])}</div></div>`;
  });

  return content;
}

function formatIgSabrosoEmailDateV4_(value) {
  const raw = cleanEmailTextV4_(value);
  if (!raw) return { desktopDate: '', mobileDate: '' };

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let date;

  if (iso) {
    date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12, 0, 0);
  } else {
    date = new Date(raw);
  }

  if (isNaN(date.getTime())) {
    return { desktopDate: raw, mobileDate: raw };
  }

  return {
    desktopDate: Utilities.formatDate(date, IGS_EMAIL_V4_CONFIG_.timezone, 'EEEE, d MMMM yyyy'),
    mobileDate: Utilities.formatDate(date, IGS_EMAIL_V4_CONFIG_.timezone, 'MMMM d, yyyy'),
  };
}

function formatIgSabrosoEmailTimeV4_(value) {
  const raw = cleanEmailTextV4_(value);
  if (!raw) return '';

  const twelveHour = raw.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (twelveHour) {
    return Number(twelveHour[1]) + ':' + twelveHour[2] + ' ' + twelveHour[3].toUpperCase();
  }

  const twentyFourHour = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!twentyFourHour) return raw;

  const hours = Number(twentyFourHour[1]);
  const minutes = twentyFourHour[2];
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return displayHour + ':' + minutes + ' ' + suffix;
}

function cleanEmailTextV4_(value) {
  return String(value == null ? '' : value).trim();
}

function escapeEmailHtmlV4_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
