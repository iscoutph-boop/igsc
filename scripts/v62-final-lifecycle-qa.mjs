import { mkdir, writeFile } from 'node:fs/promises';

const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
if (!url) throw new Error('GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing in deploy-preview.');

const response = await fetch(url, { redirect: 'follow' });
const text = await response.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = { raw: text.slice(0, 500) };
}

await mkdir('public', { recursive: true });
await writeFile(
  'public/v62-health.json',
  JSON.stringify(
    {
      httpStatus: response.status,
      ok: response.ok,
      body,
      checkedBy: 'IG Sabroso staging read-only health gate',
    },
    null,
    2,
  ),
  'utf8',
);

console.log(`V62_HEALTH_DIAGNOSTIC status=${response.status} version=${body?.version || 'unknown'}`);
