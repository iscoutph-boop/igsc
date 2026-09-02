import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const SOURCE_PATH = path.resolve(
  process.cwd(),
  "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs",
);
const SOURCE_TEXT = fs.readFileSync(SOURCE_PATH, "utf8");
const EXPECTED_CALENDAR_ID =
  "9a8c649815522b6ac9366068aa0a8e3b930046d1d5e6483a0db709f509156ca5@group.calendar.google.com";

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

describe("staging Calendar identity hardening", () => {
  it("pins lifecycle sync to the existing dedicated Calendar ID", () => {
    expect(SOURCE_TEXT).toContain(`CALENDAR_ID: '${EXPECTED_CALENDAR_ID}'`);
    expect(SOURCE_TEXT).toContain("CalendarApp.getCalendarById(CONFIG.CALENDAR_ID)");
  });

  it("returns only the pinned calendar when the CDS execution account can access it", () => {
    const context = loadScript();
    const calendar = { getId: () => EXPECTED_CALENDAR_ID, getName: () => "IGS Website Appointments" };
    const getCalendarById = vi.fn(() => calendar);
    context.CalendarApp = {
      getCalendarById,
      createCalendar: vi.fn(() => {
        throw new Error("runtime must never create a replacement calendar");
      }),
    };

    expect(context.ensureWebsiteCalendarV623_()).toBe(calendar);
    expect(getCalendarById).toHaveBeenCalledWith(EXPECTED_CALENDAR_ID);
  });

  it("fails closed when CDS cannot access the original calendar", () => {
    const context = loadScript();
    const createCalendar = vi.fn();
    context.CalendarApp = {
      getCalendarById: vi.fn(() => null),
      createCalendar,
    };

    expect(() => context.ensureWebsiteCalendarV623_()).toThrow(/not accessible/i);
    expect(createCalendar).not.toHaveBeenCalled();
  });
});
