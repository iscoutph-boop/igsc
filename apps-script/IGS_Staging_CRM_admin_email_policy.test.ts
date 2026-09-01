import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const SOURCE_PATH = path.resolve(
  process.cwd(),
  "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS.gs",
);

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
  vm.runInContext(fs.readFileSync(SOURCE_PATH, "utf8"), context);
  return context;
}

describe("IG Sabroso admin email policy", () => {
  it("routes admin mail only to caballerodigitals and removes Calendar CTA/link", () => {
    const context = loadScript();
    let sent: Record<string, string> | undefined;

    context.ScriptApp = {
      getService: () => ({ getUrl: () => "https://script.google.com/macros/s/staging/exec" }),
    };
    context.formatBookingScheduleV6_ = () => "September 15, 2026 — 10:30 AM";
    context.MailApp = {
      sendEmail: (options: Record<string, string>) => {
        sent = options;
      },
    };

    context.sendAdminLifecycleNotificationV62_(
      "created",
      "IGS-2026-0042",
      {
        fullName: "Admin Email Policy QA",
        phoneNumber: "+63 (917) 123-4567",
        emailAddress: "client@example.com",
        projectType: "Residential",
        projectLocation: "Cagayan de Oro City",
        budgetRange: "PHP 3,000,000 - PHP 5,000,000",
        projectDetails: "Admin-only notification policy QA.",
        preferredDate: "2026-09-15",
        preferredTime: "10:30 AM",
      },
      9,
      {},
    );

    const source = fs.readFileSync(SOURCE_PATH, "utf8");
    expect(source).toContain("ADMIN_EMAIL: 'caballerodigitals@gmail.com'");
    expect(source).toContain("CUSTOMER_EMAIL_NOTIFICATIONS_ENABLED: false");
    expect(source).not.toContain("vencemichael06@gmail.com");
    expect(sent?.to).toBe("caballerodigitals@gmail.com");
    expect(sent?.htmlBody).toContain("OPEN CRM RECORD");
    expect(sent?.htmlBody).toContain("REPLY TO CLIENT");
    expect(sent?.htmlBody).toContain("CALL CLIENT");
    expect(sent?.htmlBody).not.toContain("OPEN CALENDAR");
    expect(sent?.htmlBody).not.toContain("VIEW APPOINTMENT");
    expect(sent?.htmlBody).not.toContain("VIEW UPDATED APPOINTMENT");
    expect(sent?.htmlBody).not.toContain("calendar.google.com");
    expect(sent?.body).not.toContain("Calendar:");
  });
});
