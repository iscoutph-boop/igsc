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
  it("routes admin Call Client through an HTTPS CRM-bound link instead of a Gmail tel link", () => {
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
      "https://script.google.com/macros/s/staging/exec?open=call&ref=IGS-2026-0042&row=9",
    );
    expect(actions.html).toContain(
      'href="https://script.google.com/macros/s/staging/exec?open=call&amp;ref=IGS-2026-0042&amp;row=9"',
    );
    expect(actions.html).toContain("CALL CLIENT");
    expect(actions.html).not.toContain('href="tel:');
    expect(links.callUrl).not.toContain("phone=");
  });

  it("renders a professional branded CRM-verified call surface with native dialer handoff", () => {
    const context = loadScript();
    let html = "";
    context.HtmlService = {
      createHtmlOutput: (value: string) => {
        html = value;
        return { setTitle: () => ({ html }) };
      },
    };
    context.readBookingByRowV6_ = () => ({
      bookingReference: "IGS-2026-0042",
      fullName: "Juan Dela Cruz",
      phoneNumber: "+63 (917) 123-4567",
    });

    context.openClientCallBridgeV625_({ parameter: { ref: "IGS-2026-0042", row: "9" } });

    expect(html).toContain("IG SABROSO CONSTRUCTION");
    expect(html).toContain("Call client");
    expect(html).toContain("Verified CRM contact");
    expect(html).toContain("Juan Dela Cruz");
    expect(html).toContain("IGS-2026-0042");
    expect(html).toContain("+639171234567");
    expect(html).toContain("Opens your device phone app");
    expect(html).toContain("Powered by CDS");
    expect(html).toContain("tel:+639171234567");
    expect(html).toContain("window.location.replace");
    expect(html).toContain("CALL CLIENT");
    expect(html).toContain('name="format-detection" content="telephone=no"');
  });

  it("rejects an arbitrary phone query that is not bound to a matching CRM reference and row", () => {
    const context = loadScript();
    let html = "";
    context.HtmlService = {
      createHtmlOutput: (value: string) => {
        html = value;
        return { setTitle: () => ({ html }) };
      },
    };

    context.openClientCallBridgeV625_({ parameter: { phone: "+639171234567" } });

    expect(html).toContain("Phone number unavailable");
    expect(html).toContain("IG SABROSO CONSTRUCTION");
    expect(html).toContain("Verified CRM contact required");
    expect(html).toContain("Powered by CDS");
    expect(html).not.toContain("tel:");
  });

  it("does not render a dial URI when the CRM row does not match the requested booking reference", () => {
    const context = loadScript();
    let html = "";
    context.HtmlService = {
      createHtmlOutput: (value: string) => {
        html = value;
        return { setTitle: () => ({ html }) };
      },
    };
    context.readBookingByRowV6_ = () => ({
      bookingReference: "IGS-2026-9999",
      phoneNumber: "+639171234567",
    });

    context.openClientCallBridgeV625_({ parameter: { ref: "IGS-2026-0042", row: "9" } });

    expect(html).toContain("Phone number unavailable");
    expect(html).toContain("Verified CRM contact required");
    expect(html).not.toContain("tel:");
  });
});
