import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const startSource = fs.readFileSync(path.join(root, "src/start.ts"), "utf8");
const netlifyConfig = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");

describe("production security configuration", () => {
  it("installs same-origin CSRF protection for TanStack server functions", () => {
    expect(startSource).toContain("createCsrfMiddleware");
    expect(startSource).toContain('ctx.handlerType === "serverFn"');
    expect(startSource).toMatch(/requestMiddleware:\s*\[\s*csrfMiddleware\s*,/);
  });

  it("rate limits the server-function path per client IP", () => {
    expect(netlifyConfig).toContain('from = "/_serverFn/*"');
    expect(netlifyConfig).toContain("[redirects.rate_limit]");
    expect(netlifyConfig).toMatch(/window_limit\s*=\s*12/);
    expect(netlifyConfig).toMatch(/window_size\s*=\s*60/);
    expect(netlifyConfig).toContain('aggregate_by = ["ip", "domain"]');
  });

  it("uses a narrow CSP that hardens framing and plugin/base URL behavior without restricting app scripts", () => {
    expect(netlifyConfig).toContain("Content-Security-Policy");
    expect(netlifyConfig).toContain("base-uri 'self'");
    expect(netlifyConfig).toContain("object-src 'none'");
    expect(netlifyConfig).toContain("frame-ancestors 'self'");
  });

  it("documents the CRM signing secret as an empty server-only environment variable", () => {
    expect(envExample).toMatch(/^CRM_SHARED_SECRET=$/m);
    expect(envExample).toMatch(/CRM_SHARED_SECRET[\s\S]*(server-only|server only)/i);
    expect(envExample).toMatch(/CRM_SHARED_SECRET[\s\S]*(Script Property|Script Properties)/i);
    expect(envExample).not.toMatch(/^CRM_SHARED_SECRET=.+$/m);
  });
});
