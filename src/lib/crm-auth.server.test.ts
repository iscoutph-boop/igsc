import { describe, expect, it } from "vitest";
import { buildSignedCrmEnvelope, requireCrmSharedSecret } from "./crm-auth.server";

describe("CRM server-to-server authentication", () => {
  it("builds a deterministic signed request envelope without exposing the secret", () => {
    const secret = "staging-test-secret-0123456789abcdef";
    const envelope = buildSignedCrmEnvelope(
      "createBooking",
      { fullName: "Juan Dela Cruz", companyWebsite: "" },
      secret,
      1_788_336_000,
      "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
    );

    expect(envelope.request).toBe(
      JSON.stringify({
        version: 1,
        timestamp: 1_788_336_000,
        nonce: "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
        action: "createBooking",
        payload: { fullName: "Juan Dela Cruz", companyWebsite: "" },
      }),
    );
    expect(envelope.signature).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(envelope)).not.toContain(secret);
    expect(envelope.signature).toBe(
      "daffd23dd163fa9c58f5b0e8b9b3f2c4655d304828c4f32f2718c3ca5da7810f",
    );
  });

  it("fails closed when the shared secret is missing or too short", () => {
    expect(() => requireCrmSharedSecret(undefined)).toThrow("Booking service is not configured.");
    expect(() => requireCrmSharedSecret("short")).toThrow("Booking service is not configured.");
  });

  it("never includes the configured secret in validation errors", () => {
    const secret = "a-very-sensitive-staging-secret-value-123456";
    let message = "";
    try {
      requireCrmSharedSecret(secret);
      buildSignedCrmEnvelope("", {}, secret, 1_788_336_000, "bad-nonce");
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    expect(message).not.toContain(secret);
  });
});
