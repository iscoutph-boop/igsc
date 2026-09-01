// One-time deploy-preview integration probe. Remove after QA verification.
const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
const email = process.env.QA_BOOKING_TEST_EMAIL;

if (!url) {
  throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing.');
}

if (!email) {
  throw new Error('QA_BOOKING_TEST_EMAIL is missing.');
}

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
    projectDetails: 'FINAL V6.1 STAGING QA — production readiness validation. Synthetic test booking created from Netlify Deploy Preview build environment.',
    privacyConsent: 'accepted',
    leadSource: 'Netlify Deploy Preview QA',
  },
};

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
  body: JSON.stringify(request),
});

const text = await response.text();
console.log(`QA booking HTTP status: ${response.status}`);
console.log(`QA booking response: ${text}`);

if (!response.ok) {
  throw new Error(`QA booking HTTP failure: ${response.status}`);
}

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
