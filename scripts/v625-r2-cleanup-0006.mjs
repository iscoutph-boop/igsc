const endpoint = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!endpoint) throw new Error('Missing GOOGLE_APPS_SCRIPT_WEB_APP_URL');

const response = await fetch(endpoint, {
  method: 'POST',
  redirect: 'follow',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    action: 'cancelBooking',
    payload: {
      bookingReference: 'IGS-2026-0006',
      contact: '+639000000001',
      cancellationReason: 'CDS sender identity staging QA cleanup',
    },
  }),
});

const text = await response.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  throw new Error(`cleanup returned non-JSON: ${text.slice(0, 400)}`);
}
if (!response.ok || json.success !== true) {
  throw new Error(`cleanup failed: HTTP ${response.status} ${JSON.stringify(json)}`);
}
if (json.booking?.bookingStatus !== 'Cancelled') {
  throw new Error(`cleanup expected Cancelled, got ${json.booking?.bookingStatus || 'missing'}`);
}
console.log(JSON.stringify({ cleanup: 'PASS', bookingReference: 'IGS-2026-0006', status: 'Cancelled' }));
