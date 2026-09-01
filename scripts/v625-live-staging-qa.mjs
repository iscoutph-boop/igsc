import { randomUUID } from 'node:crypto';

const endpoint = 'https://script.google.com/macros/s/AKfycbziiFGQQcfY0avo_ozTRIqc1VFueZCwaVoeIXfdkpE5L1X9cancnGk4lmrdYSUvmwgF/exec';
const expectedVersion = '6.2.5-production-readiness';
const stamp = Date.now();
const submissionId = randomUUID();
const customerEmail = `vencemichael06+v625qa-${stamp}@gmail.com`;
const phoneNumber = '+639171234567';

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
  const started = Date.now();
  const response = await fetch(endpoint, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });
  const json = await readJson(response, action);
  assert(json.success === true, `${action} failed: ${JSON.stringify(json)}`);
  console.log(JSON.stringify({ action, ms: Date.now() - started, success: json.success, bookingReference: json.bookingReference || json.booking?.bookingReference, status: json.booking?.bookingStatus, duplicatePrevented: json.duplicatePrevented ?? false }));
  return json;
}

const healthResponse = await fetch(endpoint, { redirect: 'follow' });
const health = await readJson(healthResponse, 'health');
assert(health.version === expectedVersion, `Expected ${expectedVersion}, got ${health.version || 'missing version'}`);
console.log(JSON.stringify({ health: 'PASS', version: health.version, timezone: health.timezone }));

const createPayload = {
  submissionId,
  fullName: 'VMM V6.2.5 FINAL STAGING QA',
  phoneNumber,
  emailAddress: customerEmail,
  projectType: 'Residential',
  projectLocation: 'Cagayan de Oro City',
  preferredService: 'Project Consultation',
  approximateArea: '180 sqm',
  preferredDate: '2026-09-15',
  preferredTime: '10:30',
  budgetRange: 'PHP 3,000,000 - PHP 5,000,000',
  projectDetails: `Controlled V6.2.5 staging lifecycle QA. Submission ${submissionId}`,
  privacyConsent: 'accepted',
  leadSource: 'Website',
};

const created = await call('createBooking', createPayload);
const reference = created.bookingReference || created.booking?.bookingReference;
assert(/^IGS-2026-\d{4}$/.test(reference || ''), `Unexpected booking reference: ${reference}`);
assert(created.booking?.bookingStatus === 'New', `Expected New after create, got ${created.booking?.bookingStatus}`);

const duplicate = await call('createBooking', createPayload);
const duplicateReference = duplicate.bookingReference || duplicate.booking?.bookingReference;
assert(duplicateReference === reference, `Duplicate retry changed reference: ${reference} -> ${duplicateReference}`);
assert(duplicate.duplicatePrevented === true, 'Duplicate retry did not report duplicatePrevented=true');

const foundNew = await call('findBooking', { bookingReference: reference, contact: phoneNumber });
assert(foundNew.booking?.bookingStatus === 'New', `Expected New after find, got ${foundNew.booking?.bookingStatus}`);

const rescheduled = await call('rescheduleBooking', {
  bookingReference: reference,
  contact: phoneNumber,
  newPreferredDate: '2026-09-16',
  newPreferredTime: '14:30',
  rescheduleNotes: 'V6.2.5 staging QA reschedule',
});
assert(rescheduled.booking?.bookingStatus === 'Rescheduled', `Expected Rescheduled, got ${rescheduled.booking?.bookingStatus}`);

const foundRescheduled = await call('findBooking', { bookingReference: reference, contact: phoneNumber });
assert(foundRescheduled.booking?.bookingStatus === 'Rescheduled', `Expected Rescheduled after find, got ${foundRescheduled.booking?.bookingStatus}`);

const cancelled = await call('cancelBooking', {
  bookingReference: reference,
  contact: phoneNumber,
  cancellationReason: 'V6.2.5 controlled staging QA cancellation',
});
assert(cancelled.booking?.bookingStatus === 'Cancelled', `Expected Cancelled, got ${cancelled.booking?.bookingStatus}`);

const foundCancelled = await call('findBooking', { bookingReference: reference, contact: phoneNumber });
assert(foundCancelled.booking?.bookingStatus === 'Cancelled', `Expected Cancelled after find, got ${foundCancelled.booking?.bookingStatus}`);

console.log(JSON.stringify({
  qa: 'PASS',
  version: health.version,
  bookingReference: reference,
  submissionId,
  customerEmail,
  finalStatus: foundCancelled.booking?.bookingStatus,
}));
