const email = process.env.QA_BOOKING_TEST_EMAIL;
if (!email) throw new Error('QA_BOOKING_TEST_EMAIL missing');

const base = 'AKfycbziiFGQQcfY0avo_ozTRIqc1VFueZCwaVoeIXfdkpE5L1X9cancnGk4lmrdYSUvmwgF';
const variants = new Set([base]);
const expand = (items, from, replacements) => {
  const out = new Set(items);
  for (const item of items) {
    for (const r of replacements) out.add(item.replace(from, r));
  }
  return out;
};
let ids = new Set(variants);
ids = expand(ids, 'Y0avo', ['YOavo']);
ids = expand(ids, 'TRIqc1', ['TRlqc1', 'TR1qc1']);
ids = expand(ids, 'VoeIX', ['VoelX', 'Voe1X']);
ids = expand(ids, 'Gk4lmrd', ['Gk4Imrd', 'Gk41mrd']);
ids = expand(ids, 'cbzii', ['cbzil']);

let validUrl = null;
for (const id of ids) {
  const url = `https://script.google.com/macros/s/${id}/exec`;
  try {
    const r = await fetch(url, { redirect: 'follow' });
    const t = await r.text();
    if (r.ok && t.includes('6.1-staging-email-ui')) {
      validUrl = url;
      console.log('V61_ENDPOINT_FOUND=' + url);
      break;
    }
  } catch (_) {}
}

if (!validUrl) throw new Error(`No V6.1 endpoint found across ${ids.size} deployment-ID candidates`);

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
    projectDetails: 'FINAL V6.1 STAGING QA — production readiness validation. Synthetic test booking from Netlify Deploy Preview.',
    privacyConsent: 'accepted',
    leadSource: 'Netlify Deploy Preview QA'
  }
};

const response = await fetch(validUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(request),
  redirect: 'follow'
});
const text = await response.text();
console.log('QA_POST_STATUS=' + response.status);
console.log('QA_POST_RESPONSE=' + text);
if (!response.ok) throw new Error('Booking POST HTTP ' + response.status);
let parsed;
try { parsed = JSON.parse(text); } catch { throw new Error('Booking POST returned non-JSON'); }
if (!parsed?.success) throw new Error(parsed?.message || 'Booking POST failed');
console.log('QA_BOOKING_REFERENCE=' + (parsed.bookingReference || parsed.booking?.bookingReference || 'UNKNOWN'));
