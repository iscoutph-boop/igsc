import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const SOURCE_PATH = path.resolve(
  process.cwd(),
  "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs",
);
const SOURCE_TEXT = fs.readFileSync(SOURCE_PATH, "utf8");

// Apps Script functions are discovered dynamically after evaluating the .gs source.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function createHarness() {
  const context = loadScript();
  const rows: Array<Record<string, string>> = [];
  const appendBookingRow = vi.fn((_sheet: unknown, booking: Record<string, string>) => {
    rows.push({ ...booking });
    return 8 + rows.length;
  });
  const reconcileCreateSideEffects = vi.fn(() => ({ warnings: [] }));
  const cache = new Map<string, string>();

  context.Utilities = {
    formatDate: () => "2026-09-02 17:40",
  };
  context.CacheService = {
    getScriptCache: () => ({
      get: (key: string) => cache.get(key) ?? null,
      put: (key: string, value: string) => {
        cache.set(key, value);
      },
    }),
  };
  context.LockService = {
    getScriptLock: () => ({ waitLock: vi.fn(), releaseLock: vi.fn() }),
  };
  context.getSheetV6_ = () => ({});
  context.parseBookingDateV6_ = (value: string) => ({ normalized: value });
  context.parseBookingTimeV6_ = (value: string) => ({ normalized24: value, display: "10:30 AM" });
  context.findBookingBySubmissionIdV625_ = () => null;
  context.nextBookingReferenceV6_ = () => `IGS-2026-${String(rows.length + 1).padStart(4, "0")}`;
  context.appendBookingRowV6_ = appendBookingRow;
  context.reconcileCreateSideEffectsV625_ = reconcileCreateSideEffects;
  context.readBookingByRowV6_ = (row: number) => rows[row - 9] ?? {};

  return { context, rows, appendBookingRow, reconcileCreateSideEffects };
}

const basePayload = {
  submissionId: "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
  fullName: "Juan Dela Cruz",
  phoneNumber: "+63 917 123 4567",
  emailAddress: "juan@example.com",
  projectType: "Residential",
  projectLocation: "Imus City, Cavite",
  preferredService: "Design-Build Services",
  approximateArea: "180 sqm",
  preferredDate: "2026-09-20",
  preferredTime: "10:30",
  budgetRange: "PHP 3,000,000 - PHP 5,000,000",
  projectDetails: "We are planning a two-storey family home and would like a consultation.",
  privacyConsent: "accepted",
  leadSource: "Website",
  companyWebsite: "",
};

describe("Apps Script form abuse hardening", () => {
  it("rejects a filled honeypot at the Apps Script boundary before side effects", () => {
    const { context, appendBookingRow, reconcileCreateSideEffects } = createHarness();

    expect(() =>
      context.createBookingV6_({
        ...basePayload,
        companyWebsite: "https://spam.example",
      }),
    ).toThrow();

    expect(appendBookingRow).not.toHaveBeenCalled();
    expect(reconcileCreateSideEffects).not.toHaveBeenCalled();
  });

  it("blocks a high-confidence SEO solicitation before CRM, Calendar, or Gmail side effects", () => {
    const { context, appendBookingRow, reconcileCreateSideEffects } = createHarness();

    expect(() =>
      context.createBookingV6_({
        ...basePayload,
        projectDetails:
          "We offer SEO services, backlink link-building and guest-post placements to rank your website on Google. Get a free website audit and guaranteed results. See https://bit.ly/seo-offer and https://rank-fast.example/packages.",
      }),
    ).toThrow();

    expect(appendBookingRow).not.toHaveBeenCalled();
    expect(reconcileCreateSideEffects).not.toHaveBeenCalled();
  });

  it("allows a genuine project inquiry containing one legitimate URL", () => {
    const { context, rows, reconcileCreateSideEffects } = createHarness();

    const result = context.createBookingV6_({
      ...basePayload,
      projectDetails:
        "We are planning a house renovation. The current property reference is https://example.com/property-plan and we would like to discuss the structural scope.",
    });

    expect(result.bookingReference).toBe("IGS-2026-0001");
    expect(rows).toHaveLength(1);
    expect(reconcileCreateSideEffects).toHaveBeenCalledTimes(1);
  });

  it("does not block a legitimate inquiry because of one isolated marketing-related word", () => {
    const { context, rows } = createHarness();

    context.createBookingV6_({
      ...basePayload,
      projectDetails:
        "This will be a small commercial showroom. We need advice on signage, customer traffic flow, and construction phasing.",
    });

    expect(rows).toHaveLength(1);
  });

  it("blocks a recent identical submission with a new submission ID before duplicate side effects", () => {
    const { context, rows, reconcileCreateSideEffects } = createHarness();

    const first = context.createBookingV6_(basePayload);
    expect(first.bookingReference).toBe("IGS-2026-0001");

    expect(() =>
      context.createBookingV6_({
        ...basePayload,
        submissionId: "0e8af0f4-0d1f-45db-9e1b-1a8cb74f49ee",
      }),
    ).toThrow();

    expect(rows).toHaveLength(1);
    expect(reconcileCreateSideEffects).toHaveBeenCalledTimes(1);
  });
});
