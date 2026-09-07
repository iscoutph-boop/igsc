import { createHmac } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const SOURCE_PATH = path.resolve(
  process.cwd(),
  "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs",
);
const SOURCE_TEXT = fs.readFileSync(SOURCE_PATH, "utf8");

type ScriptContext = Record<string, any>;

const TEST_SECRET = "staging-test-secret-0123456789abcdef";
const NOW_SECONDS = 1_788_336_000;
const NONCE = "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d";

function signRequest(request: string, secret = TEST_SECRET) {
  return createHmac("sha256", secret).update(request, "utf8").digest("hex");
}

function buildEnvelope(
  action = "findBooking",
  payload: Record<string, unknown> = {
    bookingReference: "IGS-2026-0018",
    contact: "qa@example.com",
  },
  timestamp = NOW_SECONDS,
  nonce = NONCE,
  secret = TEST_SECRET,
) {
  const request = JSON.stringify({ version: 1, timestamp, nonce, action, payload });
  return { request, signature: signRequest(request, secret) };
}

function createHarness(secret: string | null = TEST_SECRET) {
  const cache = new Map<string, string>();
  const context: ScriptContext = {
    console,
    Date,
    JSON,
    Math,
    Object,
    RegExp,
    String,
    Number,
    Array,
    encodeURIComponent,
    decodeURIComponent,
  };

  context.PropertiesService = {
    getScriptProperties: () => ({
      getProperty: (name: string) => (name === "CRM_SHARED_SECRET" ? secret : null),
    }),
  };
  context.Utilities = {
    computeHmacSha256Signature: (value: string, key: string) =>
      Array.from(createHmac("sha256", key).update(value, "utf8").digest()),
    formatDate: () => "2026-09-02 18:00",
  };
  context.CacheService = {
    getScriptCache: () => ({
      get: (key: string) => cache.get(key) ?? null,
      put: (key: string, value: string) => {
        cache.set(key, value);
      },
    }),
  };
  context.ContentService = {
    MimeType: { JSON: "application/json" },
    createTextOutput: (value: string) => ({
      value,
      setMimeType() {
        return this;
      },
    }),
  };

  vm.createContext(context);
  vm.runInContext(SOURCE_TEXT, context);
  return { context, cache };
}

describe("Apps Script authenticated request boundary", () => {
  it("accepts a valid signed request and returns only the inner action and payload", () => {
    const { context, cache } = createHarness();
    const result = context.verifyAuthenticatedRequestV63_(buildEnvelope(), NOW_SECONDS);

    expect(result.action).toBe("findBooking");
    expect(result.payload).toMatchObject({
      bookingReference: "IGS-2026-0018",
      contact: "qa@example.com",
    });
    expect(cache.size).toBe(1);
  });

  it("rejects invalid signatures without revealing authentication details", () => {
    const { context } = createHarness();
    const envelope = buildEnvelope();
    envelope.signature = "0".repeat(64);

    expect(() => context.verifyAuthenticatedRequestV63_(envelope, NOW_SECONDS)).toThrow(
      "Unable to process this request.",
    );
  });

  it("rejects stale and future requests outside the freshness window", () => {
    const { context } = createHarness();

    expect(() =>
      context.verifyAuthenticatedRequestV63_(buildEnvelope("findBooking", undefined, NOW_SECONDS - 121), NOW_SECONDS),
    ).toThrow("Unable to process this request.");
    expect(() =>
      context.verifyAuthenticatedRequestV63_(
        buildEnvelope("findBooking", undefined, NOW_SECONDS + 121, "0e8af0f4-0d1f-45db-9e1b-1a8cb74f49ee"),
        NOW_SECONDS,
      ),
    ).toThrow("Unable to process this request.");
  });

  it("rejects a replayed nonce", () => {
    const { context } = createHarness();
    const envelope = buildEnvelope();

    expect(context.verifyAuthenticatedRequestV63_(envelope, NOW_SECONDS).action).toBe("findBooking");
    expect(() => context.verifyAuthenticatedRequestV63_(envelope, NOW_SECONDS)).toThrow(
      "Unable to process this request.",
    );
  });

  it("fails closed when the Apps Script shared secret is missing", () => {
    const { context } = createHarness(null);
    expect(() => context.verifyAuthenticatedRequestV63_(buildEnvelope(), NOW_SECONDS)).toThrow(
      "Unable to process this request.",
    );
  });

  it("rejects malformed envelopes and UUID nonces", () => {
    const { context } = createHarness();
    expect(() => context.verifyAuthenticatedRequestV63_({}, NOW_SECONDS)).toThrow(
      "Unable to process this request.",
    );
    expect(() =>
      context.verifyAuthenticatedRequestV63_(buildEnvelope("findBooking", undefined, NOW_SECONDS, "not-a-uuid"), NOW_SECONDS),
    ).toThrow("Unable to process this request.");
  });

  it("rejects the legacy unsigned body before booking side effects", () => {
    const { context } = createHarness();
    const createBooking = vi.fn(() => ({ bookingReference: "IGS-2026-9999" }));
    context.createBookingV6_ = createBooking;

    const response = context.doPost({
      postData: {
        contents: JSON.stringify({
          action: "createBooking",
          payload: { fullName: "Unsigned caller" },
        }),
      },
    });

    expect(createBooking).not.toHaveBeenCalled();
    expect(JSON.parse(response.value)).toMatchObject({
      success: false,
      message: "Unable to process this request.",
    });
  });
});
