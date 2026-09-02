from pathlib import Path

path = Path("apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs")
source = path.read_text(encoding="utf-8")

old = """function doPost(e) {
  try {
    const body = parseRequestBodyV6_(e);
    const action = cleanTextV6_(body.action);
    const payload = body.payload || {};
    if (!action) throw new Error('Missing action.');

    let result;
"""

new = """function doPost(e) {
  try {
    let verified;
    try {
      const body = parseRequestBodyV6_(e);
      verified = verifyAuthenticatedRequestV63_(body);
    } catch (_) {
      throw new Error('Unable to process this request.');
    }
    const action = verified.action;
    const payload = verified.payload;

    let result;
"""

if old not in source:
    raise SystemExit("Expected doPost authentication target was not found")
source = source.replace(old, new, 1)

marker = "/** Run once after pasting to authorize Spreadsheet, Calendar and Mail scopes. */"
helpers = r"""
const CRM_REQUEST_AUTH_V63_ = {
  VERSION: 1,
  MAX_CLOCK_SKEW_SECONDS: 120,
  NONCE_TTL_SECONDS: 300,
  MAX_REQUEST_CHARS: 20000,
};

function authenticationFailureV63_() {
  return new Error('Unable to process this request.');
}

function getCrmSharedSecretV63_() {
  try {
    const properties = PropertiesService.getScriptProperties();
    const secret = String(properties.getProperty('CRM_SHARED_SECRET') || '').trim();
    if (secret.length < 32) throw authenticationFailureV63_();
    return secret;
  } catch (_) {
    throw authenticationFailureV63_();
  }
}

function hmacBytesToHexV63_(bytes) {
  if (!Array.isArray(bytes)) throw authenticationFailureV63_();
  return bytes.map(function (byte) {
    const normalized = ((Number(byte) % 256) + 256) % 256;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function constantTimeEqualV63_(left, right) {
  const a = String(left == null ? '' : left);
  const b = String(right == null ? '' : right);
  const maxLength = Math.max(a.length, b.length, 1);
  let difference = a.length ^ b.length;
  for (let index = 0; index < maxLength; index += 1) {
    const leftCode = index < a.length ? a.charCodeAt(index) : 0;
    const rightCode = index < b.length ? b.charCodeAt(index) : 0;
    difference |= leftCode ^ rightCode;
  }
  return difference === 0;
}

function verifyAuthenticatedRequestV63_(body, nowSeconds) {
  try {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw authenticationFailureV63_();
    const request = typeof body.request === 'string' ? body.request : '';
    const signature = typeof body.signature === 'string' ? body.signature.toLowerCase() : '';
    if (!request || request.length > CRM_REQUEST_AUTH_V63_.MAX_REQUEST_CHARS) throw authenticationFailureV63_();
    if (!/^[0-9a-f]{64}$/.test(signature)) throw authenticationFailureV63_();

    const secret = getCrmSharedSecretV63_();
    const computed = hmacBytesToHexV63_(Utilities.computeHmacSha256Signature(request, secret));
    if (!constantTimeEqualV63_(computed, signature)) throw authenticationFailureV63_();

    let parsed;
    try {
      parsed = JSON.parse(request);
    } catch (_) {
      throw authenticationFailureV63_();
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw authenticationFailureV63_();
    if (parsed.version !== CRM_REQUEST_AUTH_V63_.VERSION) throw authenticationFailureV63_();

    const timestamp = Number(parsed.timestamp);
    const current = Number.isInteger(nowSeconds) ? nowSeconds : Math.floor(Date.now() / 1000);
    if (!Number.isInteger(timestamp) || Math.abs(current - timestamp) > CRM_REQUEST_AUTH_V63_.MAX_CLOCK_SKEW_SECONDS) {
      throw authenticationFailureV63_();
    }

    const nonce = String(parsed.nonce || '').toLowerCase();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(nonce)) {
      throw authenticationFailureV63_();
    }

    const action = String(parsed.action || '');
    if (['createBooking', 'findBooking', 'rescheduleBooking', 'cancelBooking'].indexOf(action) === -1) {
      throw authenticationFailureV63_();
    }
    const payload = parsed.payload;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw authenticationFailureV63_();

    const cache = CacheService.getScriptCache();
    if (!cache) throw authenticationFailureV63_();
    const nonceKey = 'igs-auth-v63-' + nonce;
    if (cache.get(nonceKey)) throw authenticationFailureV63_();
    cache.put(nonceKey, '1', CRM_REQUEST_AUTH_V63_.NONCE_TTL_SECONDS);

    return { action: action, payload: payload };
  } catch (_) {
    throw authenticationFailureV63_();
  }
}

"""

if marker not in source:
    raise SystemExit("Expected authorization marker was not found")
source = source.replace(marker, helpers + marker, 1)
path.write_text(source, encoding="utf-8")
