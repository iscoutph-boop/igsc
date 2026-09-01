// One-time deploy-preview persistence probe. Remove after QA.
const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
const email = process.env.QA_BOOKING_TEST_EMAIL;
if (!url) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing.');
if (!email) throw new Error('QA_BOOKING_TEST_EMAIL is missing.');

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({
    action: 'findBooking',
    payload: {
      bookingReference: 'IGS-2026-0018',
      contact: email,
    },
  }),
});

const text = await response.text();
console.log(`QA find HTTP status: ${response.status}`);
console.log(`QA find response: ${text}`);
if (!response.ok) throw new Error(`QA find HTTP failure: ${response.status}`);

let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  throw new Error('QA find returned non-JSON response.');
}

if (!parsed?.success) {
  throw new Error(`QA find failed: ${parsed?.message || 'Unknown CRM error'}`);
}

if (parsed?.booking?.fullName !== 'VMM FINAL V6.1 QA') {
  throw new Error(`QA find returned unexpected record: ${parsed?.booking?.fullName || 'missing fullName'}`);
}

console.log(`QA_FIND_VERIFIED=${parsed.booking.bookingReference}:${parsed.booking.fullName}:${parsed.booking.emailAddress}`);
