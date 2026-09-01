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

describe("mobile Call Client bridge", () => {
  it("routes admin Call Client through HTTPS instead of a Gmail tel link", () => {
    const context = loadScript();
    context.ScriptApp = {
      getService: () => ({ getUrl: () => "https://script.google.com/macros/s/staging/exec" }),
    };

    const links = context.buildAdminOpsLinksV62_(
      "IGS-2026-0042",
      9,
      "+63 (917) 123-4567",
    );
    const actions = context.buildClientActionV4_(
      "qa@example.com",
      "+63 (917) 123-4567",
      "IGS-2026-0042",
      links.callUrl,
    );

    expect(links.callUrl).toBe(
      "https://script.google.com/macros/s/staging/exec?open=call&phone=%2B639171234567",
    );
    expect(actions.html).toContain(
      'href="https://script.google.com/macros/s/staging/exec?open=call&amp;phone=%2B639171234567"',
    );
    expect(actions.html).toContain("CALL CLIENT");
    expect(actions.html).not.toContain('href="tel:');
  });

  it("renders a mobile dial handoff with a native tel fallback", () => {
    const context = loadScript();
    let html = "";
    context.HtmlService = {
      createHtmlOutput: (value: string) => {
        html = value;
        return { setTitle: () => ({ html }) };
      },
    };

    context.openClientCallBridgeV625_({ parameter: { phone: "+639171234567" } });

    expect(html).toContain("tel:+639171234567");
    expect(html).toContain("window.location.replace");
    expect(html).toContain("CALL CLIENT");
    expect(html).toContain('name="format-detection" content="telephone=no"');
  });

  it("does not render a dial URI for an invalid phone value", () => {
    const context = loadScript();
    let html = "";
    context.HtmlService = {
      createHtmlOutput: (value: string) => {
        html = value;
        return { setTitle: () => ({ html }) };
      },
    };

    context.openClientCallBridgeV625_({ parameter: { phone: "extension 123" } });

    expect(html).toContain("Phone number unavailable");
    expect(html).not.toContain("tel:");
  });
});
