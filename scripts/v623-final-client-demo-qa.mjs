const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('Missing GOOGLE_APPS_SCRIPT_WEB_APP_URL');

async function getJson(response, label) {
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`${label} returned non-JSON: ${text.slice(0,300)}`); }
  if (!response.ok) throw new Error(`${label} HTTP ${response.status}`);
  if (data.success === false) throw new Error(`${label} failed: ${data.message || 'unknown error'}`);
  return data;
}

async function post(action, payload) {
  return getJson(await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
  }), action);
}

const health = await getJson(await fetch(url, { redirect: 'follow' }), 'health');
if (health.version !== '6.2.3-demo-release-candidate') {
  throw new Error(`Expected 6.2.3-demo-release-candidate, got ${health.version || 'missing version'}`);
}

const customer = {
  fullName: 'VMM V6.2.3 CLIENT DEMO QA',
  phoneNumber: '+639171234567',
  emailAddress: 'vencemichael06@gmail.com',
  projectType: 'Residential Construction',
  projectLocation: 'Client Demo QA - Manila',
  preferredService: 'Site Visit / Consultation',
  approximateArea: 'QA only',
  budgetRange: 'QA TEST ONLY',
  projectDetails: 'FINAL V6.2.3 CLIENT DEMO QA ONLY — not a real customer inquiry.',
  preferredDate: '2026-09-10',
  preferredTime: '14:15',
  leadSource: 'Website',
  privacyConsent: 'accepted',
};

const created = await post('createBooking', customer);
const ref = created.bookingReference || created.booking?.bookingReference;
if (!ref) throw new Error('createBooking did not return a booking reference');
if (created.booking?.bookingStatus !== 'New') throw new Error(`Expected New after create, got ${created.booking?.bookingStatus}`);

const contact = customer.emailAddress;
const found1 = await post('findBooking', { bookingReference: ref, contact });
if (found1.booking?.bookingStatus !== 'New') throw new Error(`Expected New on first find, got ${found1.booking?.bookingStatus}`);

const rescheduled = await post('rescheduleBooking', {
  bookingReference: ref,
  contact,
  newPreferredDate: '2026-09-11',
  newPreferredTime: '16:30',
  rescheduleNotes: 'V6.2.3 final client demo QA reschedule.',
});
if (rescheduled.booking?.bookingStatus !== 'Rescheduled') throw new Error(`Expected Rescheduled, got ${rescheduled.booking?.bookingStatus}`);
if (rescheduled.booking?.preferredDate !== '2026-09-11') throw new Error(`Expected 2026-09-11 after reschedule, got ${rescheduled.booking?.preferredDate}`);

const found2 = await post('findBooking', { bookingReference: ref, contact });
if (found2.booking?.bookingStatus !== 'Rescheduled') throw new Error(`Expected Rescheduled on second find, got ${found2.booking?.bookingStatus}`);

const cancelled = await post('cancelBooking', {
  bookingReference: ref,
  contact,
  cancellationReason: 'V6.2.3 final client demo QA cleanup.',
});
if (cancelled.booking?.bookingStatus !== 'Cancelled') throw new Error(`Expected Cancelled, got ${cancelled.booking?.bookingStatus}`);

const found3 = await post('findBooking', { bookingReference: ref, contact });
if (found3.booking?.bookingStatus !== 'Cancelled') throw new Error(`Expected Cancelled on final find, got ${found3.booking?.bookingStatus}`);

console.log(JSON.stringify({
  ok: true,
  version: health.version,
  bookingReference: ref,
  finalStatus: found3.booking.bookingStatus,
  finalPreferredDate: found3.booking.preferredDate,
  finalPreferredTime: found3.booking.preferredTime,
}));
