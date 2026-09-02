from pathlib import Path

TARGET = Path("apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs")
source = TARGET.read_text(encoding="utf-8")

AUTH_BLOCK = r'''const CRM_AUTH_V63_ = {
  PROTOCOL_VERSION: 1,
  MAX_CLOCK_SKEW_SECONDS: 120,
  NONCE_TTL_SECONDS: 300,
  NONCE_CACHE_PREFIX: 'igs-auth-nonce-v63-'
};

const PUBLIC_REQUEST_FAILURE_V63_ = 'Unable to process this request.';

function getCrmSharedSecretV63_() {
  try {
    const properties = PropertiesService.getScriptProperties();
    const secret = cleanTextV6_(properties.getProperty('CRM_SHARED_SECRET'));
    if (secret.length < 32) throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    return secret;
  } catch (_) {
    throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
  }
}

function bytesToHexV63_(bytes) {
  return (bytes || []).map(function (value) {
    const normalized = Number(value) & 255;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function constantTimeEqualV63_(left, right) {
  const a = String(left || '').toLowerCase();
  const b = String(right || '').toLowerCase();
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

function getRequestAuthCacheV63_() {
  try {
    if (typeof CacheService === 'undefined' || !CacheService.getScriptCache) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }
    const cache = CacheService.getScriptCache();
    if (!cache || typeof cache.get !== 'function' || typeof cache.put !== 'function') {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }
    return cache;
  } catch (_) {
    throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
  }
}

function verifyAuthenticatedRequestV63_(body, nowSeconds) {
  try {
    if (!body || typeof body.request !== 'string' || body.request.length < 2 || body.request.length > 20000) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const suppliedSignature = cleanTextV6_(body.signature).toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(suppliedSignature)) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const secret = getCrmSharedSecretV63_();
    const expectedSignature = bytesToHexV63_(
      Utilities.computeHmacSha256Signature(body.request, secret)
    );
    if (!constantTimeEqualV63_(suppliedSignature, expectedSignature)) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const request = JSON.parse(body.request);
    if (!request || Number(request.version) !== CRM_AUTH_V63_.PROTOCOL_VERSION) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const timestamp = Number(request.timestamp);
    const currentSeconds = Number.isInteger(nowSeconds)
      ? nowSeconds
      : Math.floor(new Date().getTime() / 1000);
    if (!Number.isInteger(timestamp) || Math.abs(currentSeconds - timestamp) > CRM_AUTH_V63_.MAX_CLOCK_SKEW_SECONDS) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const nonce = cleanTextV6_(request.nonce).toLowerCase();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(nonce)) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const action = cleanTextV6_(request.action);
    if (['createBooking', 'findBooking', 'rescheduleBooking', 'cancelBooking'].indexOf(action) === -1) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const payload = request.payload;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    const cache = getRequestAuthCacheV63_();
    const nonceKey = CRM_AUTH_V63_.NONCE_CACHE_PREFIX + nonce;
    if (cache.get(nonceKey) === '1') {
      throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }
    cache.put(nonceKey, '1', CRM_AUTH_V63_.NONCE_TTL_SECONDS);

    return { action: action, payload: payload };
  } catch (_) {
    throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
  }
}

'''

GET_MARKER = "function doGet(e) {"
if "function verifyAuthenticatedRequestV63_(body, nowSeconds)" not in source:
    if source.count(GET_MARKER) != 1:
        raise SystemExit("Expected exactly one doGet marker")
    source = source.replace(GET_MARKER, AUTH_BLOCK + GET_MARKER, 1)

OLD_DO_POST = r'''function doPost(e) {
  try {
    const body = parseRequestBodyV6_(e);
    const action = cleanTextV6_(body.action);
    const payload = body.payload || {};
    if (!action) throw new Error('Missing action.');

    let result;
    switch (action) {
      case 'createBooking':
        result = createBookingV6_(payload);
        break;
      case 'findBooking':
        result = findBookingV6_(payload);
        break;
      case 'rescheduleBooking':
        result = rescheduleBookingV6_(payload);
        break;
      case 'cancelBooking':
        result = cancelBookingV6_(payload);
        break;
      default:
        throw new Error('Invalid action: ' + action);
    }

    return jsonResponseV6_(Object.assign({ success: true }, result || {}));
  } catch (error) {
    return jsonResponseV6_({
      success: false,
      message: error && error.message ? String(error.message) : 'CRM request failed.',
    });
  }
}'''

NEW_DO_POST = r'''function doPost(e) {
  try {
    const body = parseRequestBodyV6_(e);
    const verified = verifyAuthenticatedRequestV63_(body);
    const action = verified.action;
    const payload = verified.payload;

    let result;
    switch (action) {
      case 'createBooking':
        result = createBookingV6_(payload);
        break;
      case 'findBooking':
        result = findBookingV6_(payload);
        break;
      case 'rescheduleBooking':
        result = rescheduleBookingV6_(payload);
        break;
      case 'cancelBooking':
        result = cancelBookingV6_(payload);
        break;
      default:
        throw new Error(PUBLIC_REQUEST_FAILURE_V63_);
    }

    return jsonResponseV6_(Object.assign({ success: true }, result || {}));
  } catch (error) {
    return jsonResponseV6_({
      success: false,
      message: error && error.message ? String(error.message) : 'CRM request failed.',
    });
  }
}'''

if NEW_DO_POST not in source:
    if source.count(OLD_DO_POST) != 1:
        raise SystemExit("Expected exactly one legacy doPost block")
    source = source.replace(OLD_DO_POST, NEW_DO_POST, 1)

SHEET_HELPER = r'''function safeSheetValueV63_(value) {
  if (typeof value !== 'string') return value;
  const inspected = value.replace(/^[\s\u00a0\u1680\u2000-\u200b\u2028\u2029\u202f\u205f\u3000]*/, '');
  return /^[=+\-@]/.test(inspected) ? "'" + value : value;
}

'''

SHEET_MARKER = "function appendRowByHeadersV6_(sheet, headerRow, data) {"
if "function safeSheetValueV63_(value)" not in source:
    if source.count(SHEET_MARKER) != 1:
        raise SystemExit("Expected exactly one appendRowByHeadersV6_ marker")
    source = source.replace(SHEET_MARKER, SHEET_HELPER + SHEET_MARKER, 1)

OLD_APPEND_VALUE = "return Object.prototype.hasOwnProperty.call(data, header) ? data[header] : '';"
NEW_APPEND_VALUE = "return safeSheetValueV63_(Object.prototype.hasOwnProperty.call(data, header) ? data[header] : '');"
if NEW_APPEND_VALUE not in source:
    if source.count(OLD_APPEND_VALUE) != 1:
        raise SystemExit("Expected exactly one append-row value expression")
    source = source.replace(OLD_APPEND_VALUE, NEW_APPEND_VALUE, 1)

OLD_UPDATE_VALUE = "sheet.getRange(row, index + 1).setValue(fields[header]);"
NEW_UPDATE_VALUE = "sheet.getRange(row, index + 1).setValue(safeSheetValueV63_(fields[header]));"
if NEW_UPDATE_VALUE not in source:
    if source.count(OLD_UPDATE_VALUE) != 1:
        raise SystemExit("Expected exactly one update-field value expression")
    source = source.replace(OLD_UPDATE_VALUE, NEW_UPDATE_VALUE, 1)

TARGET.write_text(source, encoding="utf-8")
print("Applied V6.3 Apps Script request authentication and Sheet write hardening.")
