const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing in deploy-preview.');

const CUSTOMER_EMAIL = 'v62-final-qa@example.com';
const QA_NAME = 'VMM V6.2 FINAL LIFECYCLE QA 20260901';

async function readJson(response, label) {
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${label} did not return JSON: ${text.slice(0, 240)}`);
  }
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const healthResponse = await fetch(url, { redirect: 'follow' });
if (!healthResponse.ok) throw new Error(`V6.2 health GET returned HTTP ${healthResponse.status}`);
const health = await readJson(healthResponse, 'health GET');
assert(health.success === true, 'Health response success was not true.');
assert(health.version === '6.2-staging-self-service', `Expected V6.2, received ${health.version || 'no version'}.`);
console.log(`V62_QA health PASS version=${health.version}`);

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
assert(create.booking?.bookingStatus === 'New', `Create status expected New, got ${create.booking?.bookingStatus}`);
console.log(`V62_QA create PASS reference=${reference}`);

const lookupNew = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
assert(lookupNew.booking?.bookingStatus === 'New', `Find after create expected New, got ${lookupNew.booking?.bookingStatus}`);
console.log('V62_QA find-after-create PASS');

const reschedule = await post('rescheduleBooking', {
  bookingReference: reference,
  contact: CUSTOMER_EMAIL,
  newPreferredDate: '2026-09-06',
  newPreferredTime: '16:30',
  rescheduleNotes: 'V6.2 final staging reschedule QA.',
});
assert(reschedule.booking?.bookingStatus === 'Rescheduled', `Reschedule status expected Rescheduled, got ${reschedule.booking?.bookingStatus}`);
console.log('V62_QA reschedule PASS');

const lookupRescheduled = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
assert(lookupRescheduled.booking?.bookingStatus === 'Rescheduled', `Find after reschedule expected Rescheduled, got ${lookupRescheduled.booking?.bookingStatus}`);
assert(String(lookupRescheduled.booking?.preferredDate || '').includes('2026-09-06'), `Rescheduled date mismatch: ${lookupRescheduled.booking?.preferredDate}`);
console.log('V62_QA find-after-reschedule PASS');

const cancel = await post('cancelBooking', {
  bookingReference: reference,
  contact: CUSTOMER_EMAIL,
  cancellationReason: 'V6.2 final staging cancellation QA cleanup.',
});
assert(cancel.booking?.bookingStatus === 'Cancelled', `Cancel status expected Cancelled, got ${cancel.booking?.bookingStatus}`);
console.log('V62_QA cancel PASS');

const lookupCancelled = await post('findBooking', { bookingReference: reference, contact: CUSTOMER_EMAIL });
assert(lookupCancelled.booking?.bookingStatus === 'Cancelled', `Find after cancel expected Cancelled, got ${lookupCancelled.booking?.bookingStatus}`);
console.log('V62_QA find-after-cancel PASS');
console.log(`V62_QA_RESULT ${JSON.stringify({ reference, customerEmail: CUSTOMER_EMAIL, finalStatus: lookupCancelled.booking.bookingStatus, version: health.version })}`);
