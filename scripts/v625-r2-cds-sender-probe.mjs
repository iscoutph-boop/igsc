import { randomUUID } from 'node:crypto';

const endpoint = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!endpoint) throw new Error('Missing GOOGLE_APPS_SCRIPT_WEB_APP_URL');

const expectedVersion = '6.2.5-production-readiness-r2';
const stamp = Date.now();
const submissionId = randomUUID();
const customerEmail = `qa-cds-sender-${stamp}@igsabroso.invalid`;
const phoneNumber = '+639000000001';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(response, label) {
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${label} returned non-JSON: ${text.slice(0, 400)}`);
  }
  assert(response.ok, `${label} HTTP ${response.status}: ${JSON.stringify(json)}`);
  return json;
}

async function call(action, payload) {
  const response = await fetch(endpoint, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });
  const json = await readJson(response, action);
  assert(json.success === true, `${action} failed: ${JSON.stringify(json)}`);
  return json;
}

const health = await readJson(await fetch(endpoint, { redirect: 'follow' }), 'health');
assert(health.version === expectedVersion, `Expected ${expectedVersion}, got ${health.version || 'missing version'}`);

const created = await call('createBooking', {
  submissionId,
  fullName: 'IGS CDS SENDER IDENTITY QA',
  phoneNumber,
  emailAddress: customerEmail,
  projectType: 'Residential',
  projectLocation: 'Cagayan de Oro City',
  preferredService: 'Project Consultation',
  approximateArea: '120 sqm',
  preferredDate: '2026-09-20',
  preferredTime: '09:30',
  budgetRange: 'PHP 3,000,000 - PHP 5,000,000',
  projectDetails: `CDS sender identity QA. Submission ${submissionId}`,
  privacyConsent: 'accepted',
  leadSource: 'Website',
});

const reference = created.bookingReference || created.booking?.bookingReference;
assert(/^IGS-2026-\d{4}$/.test(reference || ''), `Unexpected booking reference: ${reference}`);
assert(created.booking?.bookingStatus === 'New', `Expected New, got ${created.booking?.bookingStatus}`);

const found = await call('findBooking', { bookingReference: reference, contact: phoneNumber });
assert(found.booking?.bookingStatus === 'New', `Expected New on find, got ${found.booking?.bookingStatus}`);

const cancelled = await call('cancelBooking', {
  bookingReference: reference,
  contact: phoneNumber,
  cancellationReason: 'CDS sender identity staging QA cleanup',
});
assert(cancelled.booking?.bookingStatus === 'Cancelled', `Expected Cancelled, got ${cancelled.booking?.bookingStatus}`);

console.log(JSON.stringify({
  qa: 'PASS',
  version: health.version,
  bookingReference: reference,
  submissionId,
  customerEmail,
  finalStatus: cancelled.booking?.bookingStatus,
}));
