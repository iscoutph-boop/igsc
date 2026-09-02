from pathlib import Path

path = Path("apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs")
source = path.read_text(encoding="utf-8")

config_anchor = """  APPOINTMENTS_HEADER_ROW: 8,
};

function doGet(e) {"""
config_replacement = """  APPOINTMENTS_HEADER_ROW: 8,
};

const ABUSE_SCREENING_V63_ = {
  RECENT_DUPLICATE_TTL_SECONDS: 600,
  SUSPICIOUS_SCORE: 3,
  HIGH_CONFIDENCE_SCORE: 7,
  SOLICITATION_PHRASES: [
    'seo services',
    'seo service',
    'search engine optimization',
    'backlink',
    'link building',
    'guest post',
    'guest posting',
    'rank your website',
    'ranking on google',
    'first page of google',
    'lead generation',
    'digital marketing services',
    'website traffic',
    'increase traffic',
    'domain authority',
    'crypto promotion',
    'crypto investment',
    'investment opportunity',
    'forex trading',
    'token presale',
    'sponsored post',
    'advertising opportunity',
    'buy followers',
    'social media marketing'
  ],
  SALES_TEMPLATE_PHRASES: [
    'free website audit',
    'free seo audit',
    'guaranteed results',
    'special offer',
    'limited time offer',
    'our agency',
    'our team can help',
    'marketing proposal',
    'packages start',
    'contact me on whatsapp',
    'contact us on whatsapp',
    'contact me on telegram',
    'dear website owner',
    'i came across your website',
    'hope this message finds you well'
  ],
  SHORTENER_DOMAINS: [
    'bit.ly',
    'tinyurl.com',
    't.co',
    'rb.gy',
    'cutt.ly',
    'rebrand.ly',
    'is.gd',
    'shorturl.at',
    'ow.ly'
  ]
};

function doGet(e) {"""
if source.count(config_anchor) != 1:
    raise SystemExit("Config insertion anchor changed; refusing unsafe patch.")
source = source.replace(config_anchor, config_replacement, 1)

validation_anchor = """  if (cleanTextV6_(payload.privacyConsent) !== 'accepted') {
    throw new Error('Privacy consent is required.');
  }

  const preferredDate = parseBookingDateV6_(payload.preferredDate).normalized;"""
validation_replacement = """  if (cleanTextV6_(payload.privacyConsent) !== 'accepted') {
    throw new Error('Privacy consent is required.');
  }
  if (cleanTextV6_(payload.companyWebsite)) {
    throw new Error('Unable to process this request. Please contact the team directly if you need assistance.');
  }

  const abuseAssessment = assessCreateBookingAbuseV63_(payload);
  if (abuseAssessment.level === 'high') {
    throw new Error('Unable to process this request. Please contact the team directly if you need assistance.');
  }

  const preferredDate = parseBookingDateV6_(payload.preferredDate).normalized;"""
if source.count(validation_anchor) != 1:
    raise SystemExit("Validation insertion anchor changed; refusing unsafe patch.")
source = source.replace(validation_anchor, validation_replacement, 1)

duplicate_anchor = """    } else {
      bookingReference = nextBookingReferenceV6_(bookingsSheet, new Date());"""
duplicate_replacement = """    } else {
      if (isRecentDuplicateSubmissionV63_(payload)) {
        throw new Error('A matching request was received recently. Please wait before trying again.');
      }
      bookingReference = nextBookingReferenceV6_(bookingsSheet, new Date());"""
if source.count(duplicate_anchor) != 1:
    raise SystemExit("Duplicate insertion anchor changed; refusing unsafe patch.")
source = source.replace(duplicate_anchor, duplicate_replacement, 1)

notes_anchor = """        notes: (submissionId ? submissionMarkerV625_(submissionId) + '\\n' : '') +
          '[' + timestampV6_() + '] Website consultation request submitted.',
      };
      bookingRow = appendBookingRowV6_(bookingsSheet, booking);"""
notes_replacement = """        notes: (submissionId ? submissionMarkerV625_(submissionId) + '\\n' : '') +
          '[' + timestampV6_() + '] Website consultation request submitted.' +
          (abuseAssessment.level === 'suspicious'
            ? '\\n[' + timestampV6_() + '] Abuse screening: suspicious; manual review recommended.'
            : ''),
      };
      bookingRow = appendBookingRowV6_(bookingsSheet, booking);
      rememberRecentSubmissionV63_(payload);"""
if source.count(notes_anchor) != 1:
    raise SystemExit("Booking note insertion anchor changed; refusing unsafe patch.")
source = source.replace(notes_anchor, notes_replacement, 1)

helper_anchor = "function normalizeDateOutputV6_(value) {"
helpers = r"""function assessCreateBookingAbuseV63_(payload) {
  const text = normalizeAbuseTextV63_([
    payload.fullName,
    payload.projectLocation,
    payload.preferredService,
    payload.projectDetails
  ].join(' '));
  const solicitationHits = countAbusePhraseHitsV63_(text, ABUSE_SCREENING_V63_.SOLICITATION_PHRASES);
  const templateHits = countAbusePhraseHitsV63_(text, ABUSE_SCREENING_V63_.SALES_TEMPLATE_PHRASES);
  const urlSignals = inspectSubmittedUrlsV63_(cleanTextV6_(payload.projectDetails));

  let score = Math.min(solicitationHits, 4) * 2 + Math.min(templateHits, 3);
  if (urlSignals.urlCount >= 2) score += 1;
  if (urlSignals.urlCount >= 4) score += 2;
  if (urlSignals.uniqueDomains >= 2) score += 1;
  if (urlSignals.uniqueDomains >= 3) score += 1;
  if (urlSignals.shortenerCount > 0) score += 2;

  let signalGroups = 0;
  if (solicitationHits > 0) signalGroups += 1;
  if (templateHits > 0) signalGroups += 1;
  if (urlSignals.urlCount >= 2 || urlSignals.shortenerCount > 0) signalGroups += 1;

  const highConfidence = score >= ABUSE_SCREENING_V63_.HIGH_CONFIDENCE_SCORE &&
    (signalGroups >= 2 || solicitationHits >= 3);
  return {
    level: highConfidence
      ? 'high'
      : (score >= ABUSE_SCREENING_V63_.SUSPICIOUS_SCORE ? 'suspicious' : 'low'),
    score: score,
    solicitationHits: solicitationHits,
    templateHits: templateHits,
    urlSignals: urlSignals
  };
}

function normalizeAbuseTextV63_(value) {
  return cleanTextV6_(value)
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function countAbusePhraseHitsV63_(text, phrases) {
  let hits = 0;
  phrases.forEach(function (phrase) {
    if (text.indexOf(phrase) !== -1) hits += 1;
  });
  return hits;
}

function inspectSubmittedUrlsV63_(value) {
  const matches = cleanTextV6_(value).match(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi) || [];
  const domains = {};
  let shortenerCount = 0;

  matches.forEach(function (rawUrl) {
    const host = rawUrl
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split(/[\/?#]/)[0]
      .replace(/:\d+$/, '');
    if (!host) return;
    domains[host] = true;
    if (ABUSE_SCREENING_V63_.SHORTENER_DOMAINS.indexOf(host) !== -1) {
      shortenerCount += 1;
    }
  });

  return {
    urlCount: matches.length,
    uniqueDomains: Object.keys(domains).length,
    shortenerCount: shortenerCount
  };
}

function submissionFingerprintV63_(payload) {
  const normalized = [
    payload.fullName,
    payload.phoneNumber,
    payload.emailAddress,
    payload.projectType,
    payload.projectLocation,
    payload.preferredService,
    payload.preferredDate,
    payload.preferredTime,
    payload.budgetRange,
    payload.projectDetails
  ].map(normalizeAbuseTextV63_).join('|');
  let hash = 5381;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = ((hash * 33) ^ normalized.charCodeAt(index)) >>> 0;
  }
  return 'igs-create-v63-' + hash.toString(36);
}

function getAbuseCacheV63_() {
  try {
    if (typeof CacheService === 'undefined' || !CacheService.getScriptCache) return null;
    return CacheService.getScriptCache();
  } catch (_) {
    return null;
  }
}

function isRecentDuplicateSubmissionV63_(payload) {
  const cache = getAbuseCacheV63_();
  if (!cache) return false;
  try {
    return cache.get(submissionFingerprintV63_(payload)) === '1';
  } catch (_) {
    return false;
  }
}

function rememberRecentSubmissionV63_(payload) {
  const cache = getAbuseCacheV63_();
  if (!cache) return;
  try {
    cache.put(
      submissionFingerprintV63_(payload),
      '1',
      ABUSE_SCREENING_V63_.RECENT_DUPLICATE_TTL_SECONDS
    );
  } catch (_) {}
}

"""
if source.count(helper_anchor) != 1:
    raise SystemExit("Helper insertion anchor changed; refusing unsafe patch.")
source = source.replace(helper_anchor, helpers + helper_anchor, 1)

path.write_text(source, encoding="utf-8")
