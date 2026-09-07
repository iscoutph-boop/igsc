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

describe("Google Sheets final write-boundary safety", () => {
  it.each([
    ["=SUM(1,1)", "'=SUM(1,1)"],
    ["+cmd", "'+cmd"],
    ["-1+2", "'-1+2"],
    ["@IMPORTXML(\"https://example.com\")", "'@IMPORTXML(\"https://example.com\")"],
    ["  =SUM(1,1)", "'  =SUM(1,1)"],
    ["\t+cmd", "'\t+cmd"],
  ])("neutralizes formula-triggering input %s", (input, expected) => {
    const context = loadScript();
    expect(context.safeSheetValueV63_(input)).toBe(expected);
  });

  it("preserves ordinary strings and non-string values", () => {
    const context = loadScript();
    expect(context.safeSheetValueV63_("Juan Dela Cruz")).toBe("Juan Dela Cruz");
    expect(context.safeSheetValueV63_(42)).toBe(42);
    expect(context.safeSheetValueV63_(true)).toBe(true);
  });

  it("applies formula safety inside both shared Sheet write helpers", () => {
    expect(SOURCE_TEXT).toMatch(/headers\.map\([\s\S]*safeSheetValueV63_/);
    expect(SOURCE_TEXT).toContain("setValue(safeSheetValueV63_(fields[header]))");
  });
});
