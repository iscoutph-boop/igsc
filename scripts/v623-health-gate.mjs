const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('Missing GOOGLE_APPS_SCRIPT_WEB_APP_URL');
const response = await fetch(url, { redirect: 'follow' });
const text = await response.text();
let health;
try { health = JSON.parse(text); } catch { throw new Error(`Health endpoint did not return JSON: ${text.slice(0,300)}`); }
if (!response.ok) throw new Error(`Health endpoint HTTP ${response.status}`);
if (health.version !== '6.2.3-demo-release-candidate') {
  throw new Error(`Expected 6.2.3-demo-release-candidate, got ${health.version || 'missing version'}`);
}
console.log(JSON.stringify({ok:true,version:health.version,timezone:health.timezone,message:health.message}));
