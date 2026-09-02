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

describe("Apps Script strict schedule validation", () => {
  it("rejects impossible calendar dates", () => {
    const context = loadScript();
    expect(() => context.parseBookingDateV6_("2026-02-31")).toThrow("Invalid booking date");
    expect(context.parseBookingDateV6_("2026-02-28").normalized).toBe("2026-02-28");
  });

  it.each(["07:30", "08:15", "17:30", "22:00", "99:99"])(
    "rejects unsupported booking time %s",
    (value) => {
      const context = loadScript();
      expect(() => context.parseBookingTimeV6_(value)).toThrow("Invalid booking time");
    },
  );

  it.each(["08:00", "08:30", "12:00", "16:30", "17:00"])(
    "accepts the published 30-minute business-hour slot %s",
    (value) => {
      const context = loadScript();
      expect(context.parseBookingTimeV6_(value).normalized24).toBe(value);
    },
  );
});
