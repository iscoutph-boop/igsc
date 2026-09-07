import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const SOURCE_PATH = path.resolve(
  process.cwd(),
  "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs",
);
const SOURCE_TEXT = fs.readFileSync(SOURCE_PATH, "utf8");

type ScriptContext = Record<string, any>;

function loadScript(): ScriptContext {
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
  vm.createContext(context);
  vm.runInContext(SOURCE_TEXT, context);
  return context;
}

function emptySheet() {
  return {
    getLastRow: () => 8,
    getLastColumn: () => 1,
    getRange: () => ({ getDisplayValues: () => [] }),
  };
}

describe("secure booking references", () => {
  it("generates a high-entropy UUID-derived reference for new bookings", () => {
    const context = loadScript();
    context.Utilities = {
      formatDate: () => "2026",
      getUuid: () => "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
    };

    expect(context.nextBookingReferenceV6_(emptySheet(), new Date("2026-09-02T00:00:00Z"))).toBe(
      "IGS-2026-7C7F0A90EC474A0D9F51A4939D71EA0D",
    );
  });

  it("keeps legacy sequential references valid while recognizing secure references", () => {
    const context = loadScript();
    expect(context.isValidBookingReferenceV63_("IGS-2026-0042")).toBe(true);
    expect(
      context.isValidBookingReferenceV63_("IGS-2026-7C7F0A90EC474A0D9F51A4939D71EA0D"),
    ).toBe(true);
    expect(context.isValidBookingReferenceV63_("IGS-2026-guessable")).toBe(false);
  });
});

describe("failed booking lookup throttling", () => {
  it("blocks a targeted booking reference after five failed contact checks", () => {
    const context = loadScript();
    const cache = new Map<string, string>();
    context.CacheService = {
      getScriptCache: () => ({
        get: (key: string) => cache.get(key) ?? null,
        put: (key: string, value: string) => cache.set(key, value),
        remove: (key: string) => cache.delete(key),
      }),
    };
    context.findBookingRecordV6_ = () => ({
      row: 9,
      booking: {
        bookingReference: "IGS-2026-0042",
        emailAddress: "owner@example.com",
        phoneNumber: "+639171234567",
      },
    });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(() =>
        context.findBookingV6_({
          bookingReference: "IGS-2026-0042",
          contact: `wrong${attempt}@example.com`,
        }),
      ).toThrow("Booking not found. Please check your booking reference and contact detail.");
    }

    expect(() =>
      context.findBookingV6_({
        bookingReference: "IGS-2026-0042",
        contact: "owner@example.com",
      }),
    ).toThrow("Too many booking lookup attempts. Please wait a few minutes and try again.");
  });

  it("clears failed-attempt state after a valid lookup", () => {
    const context = loadScript();
    const cache = new Map<string, string>();
    context.CacheService = {
      getScriptCache: () => ({
        get: (key: string) => cache.get(key) ?? null,
        put: (key: string, value: string) => cache.set(key, value),
        remove: (key: string) => cache.delete(key),
      }),
    };
    const booking = {
      bookingReference: "IGS-2026-0042",
      emailAddress: "owner@example.com",
      phoneNumber: "+639171234567",
    };
    context.findBookingRecordV6_ = () => ({ row: 9, booking });

    expect(() =>
      context.findBookingV6_({ bookingReference: booking.bookingReference, contact: "wrong@example.com" }),
    ).toThrow();
    expect(context.findBookingV6_({ bookingReference: booking.bookingReference, contact: booking.emailAddress })).toMatchObject({ booking });

    for (let attempt = 0; attempt < 4; attempt += 1) {
      expect(() =>
        context.findBookingV6_({
          bookingReference: booking.bookingReference,
          contact: `wrong-again${attempt}@example.com`,
        }),
      ).toThrow("Booking not found. Please check your booking reference and contact detail.");
    }
    expect(context.findBookingV6_({ bookingReference: booking.bookingReference, contact: booking.emailAddress })).toMatchObject({ booking });
  });
});
