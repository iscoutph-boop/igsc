# V6.3 Security Hardening Progress

- Server HMAC signing contract: implemented and previously verified green.
- Apps Script HMAC validation, +/-120 second freshness, UUID v4 nonce validation, 300 second replay cache, action allowlist, and fail-closed legacy unsigned request handling: implemented on staging source.
- Next gate: verify the full current test suite and production build before adding final-boundary Google Sheets formula-injection protection.

Production remains untouched; PR #4 remains the staging release vehicle.
