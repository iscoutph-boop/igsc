const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing in deploy-preview.');

const CUSTOMER_EMAIL = 'v62-final-qa@example.com';
const QA_NAME = 'VMM V6.2 ROUTE LIFECYCLE QA 20260901';

async function readJson(response, label) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} did not return JSON: ${text.slice(0, 240)}`);
  }
}

async function post(action, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`${action} returned HTTP ${response.status}`);
  const json = await readJson(response, action);
  if (!json.success) throw new Error(`${action} failed: ${json.message || 'unknown error'}`);
  return json;
}

const healthResponse = await fetch(url, { redirect: 'follow' });
const health = await readJson(healthResponse, 'health GET');
console.log(`V62_ROUTE health status=${healthResponse.status} version=${health.version || 'unknown'}`);

const create = await post('createBooking', {
  fullName: QA_NAME,
  phoneNumber: '09000006201',
  emailAddress: CUSTOMER_EMAIL,
  projectType: 'Residential',
  projectLocation: 'STAGING QA - Cagayan de Oro City',
  preferredService: 'Design and Build',
  approximateArea: '180 sqm',
  preferredDate: '2026-09-05',
  preferredTime: '14:15',
  budgetRange: 'PHP 3,000,000 - PHP 5,000,000',
  projectDetails: 'V6.2 FINAL STAGING ROUTE QA ONLY — not a real customer lead.',
  privacyConsent: 'accepted',
  leadSource: 'Website',
});
const reference = create.bookingReference;
console.log(`V62_ROUTE create reference=${reference} status=${create.booking?.bookingStatus || 'unknown'}`);

const found1 = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
console.log(`V62_ROUTE find1 status=${found1.booking?.bookingStatus || 'unknown'}`);

const reschedule = await post('rescheduleBooking', {
  bookingReference: reference,
  contact: CUSTOMER_EMAIL,
  newPreferredDate: '2026-09-06',
  newPreferredTime: '16:30',
  rescheduleNotes: 'V6.2 route lifecycle QA.',
});
console.log(`V62_ROUTE reschedule status=${reschedule.booking?.bookingStatus || 'unknown'}`);

const found2 = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
console.log(`V62_ROUTE find2 status=${found2.booking?.bookingStatus || 'unknown'}`);

const cancel = await post('cancelBooking', {
  bookingReference: reference,
  contact: CUSTOMER_EMAIL,
  cancellationReason: 'V6.2 route lifecycle QA cleanup.',
});
console.log(`V62_ROUTE cancel status=${cancel.booking?.bookingStatus || 'unknown'}`);

const found3 = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
console.log(`V62_ROUTE final status=${found3.booking?.bookingStatus || 'unknown'}`);
