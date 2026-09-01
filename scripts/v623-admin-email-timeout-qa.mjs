// V6.2.3 staging-only admin-recipient + timeout reproduction gate.
const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('Missing GOOGLE_APPS_SCRIPT_WEB_APP_URL');

const now = () => Date.now();
async function fetchText(label, input, init) {
  const started = now();
  const res = await fetch(input, init);
  const text = await res.text();
  const ms = now() - started;
  console.log(JSON.stringify({label,status:res.status,contentType:res.headers.get('content-type')||'',ms,preview:text.slice(0,180)}));
  if (!res.ok) throw new Error(`${label} HTTP ${res.status}: ${text.slice(0,220)}`);
  return {text, ms, contentType: res.headers.get('content-type')||''};
}
function parseJson(label, text) {
  try { return JSON.parse(text); }
  catch { throw new Error(`${label} returned non-JSON: ${text.slice(0,300)}`); }
}
async function post(action, payload) {
  const {text, ms, contentType} = await fetchText(action, url, {
    method: 'POST',
    redirect: 'follow',
    headers: {'Content-Type':'text/plain;charset=utf-8'},
    body: JSON.stringify({action, payload}),
  });
  const data = parseJson(action, text);
  if (data.success === false) throw new Error(`${action} failed: ${data.message||'unknown error'}`);
  return {data, ms, contentType};
}

const healthRaw = await fetchText('health', url, {redirect:'follow'});
const health = parseJson('health', healthRaw.text);
if (health.version !== '6.2.3-demo-release-candidate') throw new Error(`Expected V6.2.3, got ${health.version||'missing'}`);

const customer = {
  fullName: 'VMM ADMIN EMAIL TIMEOUT QA 20260901',
  phoneNumber: '+639171230623',
  emailAddress: 'vencemichael06@gmail.com',
  projectType: 'Residential Construction',
  projectLocation: 'QA - Manila',
  preferredService: 'Site Visit / Consultation',
  approximateArea: 'QA only',
  preferredDate: '2026-09-12',
  preferredTime: '10:30',
  budgetRange: 'QA TEST ONLY',
  projectDetails: 'Admin recipient and inactivity-timeout verification only.',
  privacyConsent: 'accepted',
  leadSource: 'Website',
};

const created = await post('createBooking', customer);
const ref = created.data.bookingReference || created.data.booking?.bookingReference;
if (!ref) throw new Error('No booking reference returned');
if (created.data.booking?.bookingStatus !== 'New') throw new Error(`Expected New, got ${created.data.booking?.bookingStatus}`);

const found = await post('findBooking', {bookingReference: ref, contact: customer.emailAddress});
if (found.data.booking?.bookingStatus !== 'New') throw new Error(`Find expected New, got ${found.data.booking?.bookingStatus}`);

const cancelled = await post('cancelBooking', {
  bookingReference: ref,
  contact: customer.emailAddress,
  cancellationReason: 'QA cleanup after admin email/timeout verification.',
});
if (cancelled.data.booking?.bookingStatus !== 'Cancelled') throw new Error(`Cancel expected Cancelled, got ${cancelled.data.booking?.bookingStatus}`);

console.log(JSON.stringify({ok:true,version:health.version,bookingReference:ref,createMs:created.ms,findMs:found.ms,cancelMs:cancelled.ms,finalStatus:cancelled.data.booking.bookingStatus}));
