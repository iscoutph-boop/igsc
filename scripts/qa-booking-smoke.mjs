// One-time deploy-preview route discovery + booking probe. Remove after QA.
const configuredUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
const email = process.env.QA_BOOKING_TEST_EMAIL;

if (!configuredUrl) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing.');
if (!email) throw new Error('QA_BOOKING_TEST_EMAIL is missing.');

const idMatch = configuredUrl.match(/\/macros\/s\/([^/]+)\/exec$/);
if (!idMatch) throw new Error('Configured Apps Script URL shape is invalid.');

const baseId = idMatch[1];
const candidates = new Map();

for (const trChar of ['l', 'I']) {
  for (const voeChar of ['l', 'I']) {
    for (const gkChar of ['l', 'I']) {
      for (const tailOrder of ['mrd', 'mdr']) {
        let id = baseId
          .replace(/TR[lI]qc1/, `TR${trChar}qc1`)
          .replace(/Voe[lI]X/, `Voe${voeChar}X`)
          .replace(/Gk4[lI](?:mrd|mdr)/, `Gk4${gkChar}${tailOrder}`);
        const label = `TR=${trChar};VOE=${voeChar};GK=${gkChar};TAIL=${tailOrder}`;
        candidates.set(id, label);
      }
    }
  }
}

let working = null;

for (const [id, label] of candidates.entries()) {
  const url = `https://script.google.com/macros/s/${id}/exec`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'qaRouteProbe', payload: {} }),
    });
    if (!response.ok) continue;
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      continue;
    }
    if (parsed?.success === false && String(parsed?.message || '').includes('Invalid action: qaRouteProbe')) {
      working = { id, label, url };
      break;
    }
  } catch {
    // Try the next candidate.
  }
}

if (!working) {
  throw new Error('No candidate Apps Script deployment ID produced the expected V6.1 JSON response. Check Web App access/deployment URL.');
}

console.log(`QA_WORKING_VARIANT=${working.label}`);

const request = {
  action: 'createBooking',
  payload: {
    fullName: 'VMM FINAL V6.1 QA',
    phoneNumber: '+639171234567',
    emailAddress: email,
    projectType: 'Residential Construction',
    projectLocation: 'Cagayan de Oro City, Misamis Oriental',
    preferredService: 'Project Consultation',
    approximateArea: '120 sqm',
    preferredDate: '2026-09-03',
    preferredTime: '2:00 PM',
    budgetRange: 'QA TEST ONLY',
    projectDetails: `FINAL V6.1 STAGING QA — production readiness validation. Winning route variant: ${working.label}`,
    privacyConsent: 'accepted',
    leadSource: `Netlify QA ${working.label}`,
  },
};

const response = await fetch(working.url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(request),
});

const text = await response.text();
if (!response.ok) throw new Error(`QA booking HTTP failure: ${response.status}`);

let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  throw new Error('QA booking returned non-JSON response.');
}

if (!parsed?.success) {
  throw new Error(`QA booking failed: ${parsed?.message || 'Unknown CRM error'}`);
}

console.log(`QA_BOOKING_REFERENCE=${parsed.bookingReference || parsed.booking?.bookingReference || 'UNKNOWN'}`);
