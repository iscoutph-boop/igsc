const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing.');
const CUSTOMER_EMAIL = 'v62-final-qa@example.com';
const QA_NAME = 'VMM V6.2 FINAL LIFECYCLE QA 20260901';

async function readJson(response, label) {
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`${label} did not return JSON: ${text.slice(0, 240)}`); }
  return json;
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
function assert(condition, message) { if (!condition) throw new Error(message); }

const healthResponse = await fetch(url, { redirect: 'follow' });
if (!healthResponse.ok) throw new Error(`health GET returned HTTP ${healthResponse.status}`);
const health = await readJson(healthResponse, 'health GET');
assert(health.version === '6.2-staging-self-service', `Expected V6.2, got ${health.version}`);

const create = await post('createBooking', {
  fullName: QA_NAME,
  phoneNumber: '09000006200',
  emailAddress: CUSTOMER_EMAIL,
  projectType: 'Residential',
  projectLocation: 'STAGING QA - Cagayan de Oro City',
  preferredService: 'Design and Build',
  approximateArea: '180 sqm',
  preferredDate: '2026-09-05',
  preferredTime: '14:15',
  budgetRange: 'PHP 3,000,000 - PHP 5,000,000',
  projectDetails: 'V6.2 FINAL STAGING LIFECYCLE QA ONLY — not a real customer lead.',
  privacyConsent: 'accepted',
  leadSource: 'Website',
});
const reference = create.bookingReference;
assert(/^IGS-2026-\d{4}$/.test(reference || ''), `Invalid booking reference: ${reference}`);
assert(create.booking?.bookingStatus === 'New', `Create expected New, got ${create.booking?.bookingStatus}`);
console.log(`V62_QA create PASS ${reference}`);

const find1 = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
assert(find1.booking?.bookingStatus === 'New', `Find after create expected New, got ${find1.booking?.bookingStatus}`);

const reschedule = await post('rescheduleBooking', {
  bookingReference: reference,
  contact: CUSTOMER_EMAIL,
  newPreferredDate: '2026-09-06',
  newPreferredTime: '16:30',
  rescheduleNotes: 'V6.2 final staging reschedule QA.',
});
assert(reschedule.booking?.bookingStatus === 'Rescheduled', `Reschedule expected Rescheduled, got ${reschedule.booking?.bookingStatus}`);

const find2 = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
assert(find2.booking?.bookingStatus === 'Rescheduled', `Find after reschedule expected Rescheduled, got ${find2.booking?.bookingStatus}`);
assert(String(find2.booking?.preferredDate || '').includes('2026-09-06'), `Expected date 2026-09-06, got ${find2.booking?.preferredDate}`);

const cancel = await post('cancelBooking', {
  bookingReference: reference,
  contact: CUSTOMER_EMAIL,
  cancellationReason: 'V6.2 final staging cancellation QA cleanup.',
});
assert(cancel.booking?.bookingStatus === 'Cancelled', `Cancel expected Cancelled, got ${cancel.booking?.bookingStatus}`);

const find3 = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
assert(find3.booking?.bookingStatus === 'Cancelled', `Find after cancel expected Cancelled, got ${find3.booking?.bookingStatus}`);
console.log(`V62_QA_RESULT ${JSON.stringify({ reference, finalStatus: find3.booking.bookingStatus, version: health.version })}`);
