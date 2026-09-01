const endpoint = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!endpoint) throw new Error('Missing GOOGLE_APPS_SCRIPT_WEB_APP_URL');

const expectedVersion = '6.2.5-production-readiness-r2';
const response = await fetch(endpoint, { redirect: 'follow' });
const text = await response.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  throw new Error(`R2 health returned non-JSON: ${text.slice(0, 300)}`);
}
if (!response.ok) throw new Error(`R2 health HTTP ${response.status}: ${JSON.stringify(json)}`);
if (json.version !== expectedVersion) {
  throw new Error(`Expected ${expectedVersion}, got ${json.version || 'missing version'}`);
}
console.log(JSON.stringify({ health: 'PASS', version: json.version, timezone: json.timezone || null }));
