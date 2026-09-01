const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing.');
const response = await fetch(url, { redirect: 'follow' });
if (!response.ok) throw new Error(`Apps Script health check returned HTTP ${response.status}`);
const text = await response.text();
let json;
try { json = JSON.parse(text); } catch { throw new Error(`Apps Script health check did not return JSON: ${text.slice(0, 240)}`); }
if (json.success !== true) throw new Error('Apps Script health response success was not true.');
if (json.version !== '6.2.1-staging-self-service') throw new Error(`Expected 6.2.1-staging-self-service, received ${json.version || 'no version'}.`);
console.log(`V6.2.1 health PASS: ${json.version}`);
