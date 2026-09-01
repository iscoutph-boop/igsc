from pathlib import Path

path = Path("apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs")
text = path.read_text()
start = text.index("function buildAdminOpsLinksV62_(")
end = text.index("function adminInfoRowV62_(", start)

replacement = r'''function buildAdminOpsLinksV62_(reference, bookingRow, phoneNumber) {
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
  if (!tel) {
    return HtmlService.createHtmlOutput(
      '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
      '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;color:#16263f">' +
      '<div style="max-width:460px;margin:72px auto;padding:28px;background:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(22,38,63,.12);text-align:center">' +
      '<div style="font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18">IG Sabroso Internal</div>' +
      '<h2 style="margin:12px 0 8px">Phone number unavailable</h2>' +
      '<p style="margin:0;line-height:1.55;color:#687487">Open the latest appointment notification and confirm the client phone number.</p>' +
      '</div></body></html>'
    ).setTitle('IG Sabroso Call Client');
  }

  const telHref = 'tel:' + tel;
  const safeTelHref = escapeHtmlSimpleV6_(telHref);
  const safePhone = escapeHtmlSimpleV6_(tel);
  const jsTelHref = JSON.stringify(telHref);
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="format-detection" content="telephone=no"></head>' +
    '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;color:#16263f">' +
    '<div style="max-width:460px;margin:72px auto;padding:28px;background:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(22,38,63,.12);text-align:center">' +
    '<div style="font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18">IG Sabroso Internal</div>' +
    '<h2 style="margin:12px 0 8px">Opening phone dialer</h2>' +
    '<p style="margin:0 0 20px;line-height:1.55;color:#687487">Calling <strong>' + safePhone + '</strong>. If the dialer does not open automatically, use the button below.</p>' +
    '<a href="' + safeTelHref + '" style="display:block;background:#16263f;color:#fff;text-decoration:none;font-weight:800;padding:15px 18px;border-radius:10px">CALL CLIENT</a>' +
    '</div>' +
    '<script>try{window.location.replace(' + jsTelHref + ');}catch(e){window.location.href=' + jsTelHref + ';}</script>' +
    '</body></html>'
  ).setTitle('IG Sabroso Call Client');
}

'''

path.write_text(text[:start] + replacement + text[end:])
