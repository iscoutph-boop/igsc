import fs from "node:fs";

const path = "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs";
let source = fs.readFileSync(path, "utf8");

function replaceOnce(label, before, after) {
  if (!source.includes(before)) throw new Error(`Missing patch target: ${label}`);
  source = source.replace(before, after);
}

replaceOnce(
  "doGet call route",
  `function doGet(e) {\n  if (e && e.parameter && cleanTextV6_(e.parameter.open) === 'crm') {\n    return openCrmRecordRedirectV622_(e);\n  }\n\n  return jsonResponseV6_({`,
  `function doGet(e) {\n  const openAction = e && e.parameter ? cleanTextV6_(e.parameter.open) : '';\n  if (openAction === 'crm') {\n    return openCrmRecordRedirectV622_(e);\n  }\n  if (openAction === 'call') {\n    return openClientCallBridgeV625_(e);\n  }\n\n  return jsonResponseV6_({`,
);

replaceOnce(
  "admin ops call bridge",
  `function buildAdminOpsLinksV62_(reference, bookingRow) {\n  const serviceUrl = ScriptApp.getService().getUrl();\n  if (!serviceUrl) throw new Error('Apps Script Web App URL is unavailable.');\n  const crmUrl = serviceUrl + '?open=crm&ref=' + encodeURIComponent(reference) + '&row=' + Number(bookingRow);\n  return { crmUrl: crmUrl };\n}\n`,
  `function buildAdminOpsLinksV62_(reference, bookingRow, phoneNumber) {\n  const serviceUrl = ScriptApp.getService().getUrl();\n  if (!serviceUrl) throw new Error('Apps Script Web App URL is unavailable.');\n  const crmUrl = serviceUrl + '?open=crm&ref=' + encodeURIComponent(reference) + '&row=' + Number(bookingRow);\n  const tel = buildValidTelV625_(phoneNumber);\n  const callUrl = tel\n    ? serviceUrl + '?open=call&phone=' + encodeURIComponent(tel)\n    : '';\n  return { crmUrl: crmUrl, callUrl: callUrl };\n}\n\nfunction openClientCallBridgeV625_(e) {\n  const phone = e && e.parameter ? cleanTextV6_(e.parameter.phone) : '';\n  const tel = buildValidTelV625_(phone);\n  if (!tel) {\n    return HtmlService.createHtmlOutput(\n      '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +\n      '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;color:#16263f">' +\n      '<div style="max-width:460px;margin:72px auto;padding:28px;background:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(22,38,63,.12);text-align:center">' +\n      '<div style="font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18">IG Sabroso Internal</div>' +\n      '<h2 style="margin:12px 0 8px">Phone number unavailable</h2>' +\n      '<p style="margin:0;line-height:1.55;color:#687487">Open the latest appointment notification and confirm the client phone number.</p>' +\n      '</div></body></html>'\n    ).setTitle('IG Sabroso Call Client');\n  }\n\n  const telHref = 'tel:' + tel;\n  const safeTelHref = escapeHtmlSimpleV6_(telHref);\n  const safePhone = escapeHtmlSimpleV6_(tel);\n  const jsTelHref = JSON.stringify(telHref);\n  return HtmlService.createHtmlOutput(\n    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">' +\n    '<meta name="format-detection" content="telephone=no"></head>' +\n    '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;color:#16263f">' +\n    '<div style="max-width:460px;margin:72px auto;padding:28px;background:#fff;border-radius:18px;box-shadow:0 12px 36px rgba(22,38,63,.12);text-align:center">' +\n    '<div style="font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ff4b18">IG Sabroso Internal</div>' +\n    '<h2 style="margin:12px 0 8px">Opening phone dialer</h2>' +\n    '<p style="margin:0 0 20px;line-height:1.55;color:#687487">Calling <strong>' + safePhone + '</strong>. If the dialer does not open automatically, use the button below.</p>' +\n    '<a href="' + safeTelHref + '" style="display:block;background:#16263f;color:#fff;text-decoration:none;font-weight:800;padding:15px 18px;border-radius:10px">CALL CLIENT</a>' +\n    '</div>' +\n    '<script>try{window.location.replace(' + jsTelHref + ');}catch(e){window.location.href=' + jsTelHref + ';}</script>' +\n    '</body></html>'\n  ).setTitle('IG Sabroso Call Client');\n}\n`,
);

replaceOnce(
  "lifecycle call link",
  `  const links = buildAdminOpsLinksV62_(reference, bookingRow);\n  const reply = buildClientActionV4_(\n    isEmailAddressV4_(booking.emailAddress) ? booking.emailAddress : '',\n    booking.phoneNumber,\n    reference\n  );`,
  `  const links = buildAdminOpsLinksV62_(reference, bookingRow, booking.phoneNumber);\n  const reply = buildClientActionV4_(\n    isEmailAddressV4_(booking.emailAddress) ? booking.emailAddress : '',\n    booking.phoneNumber,\n    reference,\n    links.callUrl\n  );`,
);

replaceOnce(
  "client action signature",
  `function buildClientActionV4_(emailAddress, phoneNumber, bookingReference) {`,
  `function buildClientActionV4_(emailAddress, phoneNumber, bookingReference, mobileCallUrl) {`,
);

replaceOnce(
  "call href",
  `  const phone = cleanEmailValue_(phoneNumber);\n  const tel = buildValidTelV625_(phone);\n  if (tel) {\n    plainText.push('Call client: ' + phone);\n    actions.push(\n      '<a class="button" href="tel:' + escapeHtmlV4_(tel) + '" style="display:block;box-sizing:border-box;width:100%;background:#16263f;color:#fff;text-align:center;text-decoration:none;font-size:13px;line-height:1;font-weight:800;letter-spacing:.3px;padding:16px 18px;border-radius:11px;">CALL CLIENT</a>'\n    );\n  }`,
  `  const phone = cleanEmailValue_(phoneNumber);\n  const tel = buildValidTelV625_(phone);\n  if (tel) {\n    const safeMobileCallUrl = cleanEmailValue_(mobileCallUrl);\n    const callHref = /^https:\\/\\//i.test(safeMobileCallUrl)\n      ? escapeHtmlV4_(safeMobileCallUrl)\n      : 'tel:' + escapeHtmlV4_(tel);\n    plainText.push('Call client: ' + phone);\n    actions.push(\n      '<a class="button" href="' + callHref + '" style="display:block;box-sizing:border-box;width:100%;background:#16263f;color:#fff;text-align:center;text-decoration:none;font-size:13px;line-height:1;font-weight:800;letter-spacing:.3px;padding:16px 18px;border-radius:11px;">CALL CLIENT</a>'\n    );\n  }`,
);

fs.writeFileSync(path, source);
console.log("Patched Gmail mobile Call Client bridge.");
