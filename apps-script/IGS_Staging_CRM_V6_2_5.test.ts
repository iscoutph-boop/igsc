import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const SOURCE_PATH = path.resolve(
  process.cwd(),
  "apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS.gs",
);

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
  vm.runInContext(fs.readFileSync(SOURCE_PATH, "utf8"), context);
  return context;
}

function bookingHarness() {
  const context = loadScript();
  const headers = [
    "Booking Reference",
    "Date Submitted",
    "Lead Source",
    "Full Name",
    "Phone Number",
    "Email Address",
    "Project Type",
    "Project Location",
    "Preferred Date",
    "Preferred Time",
    "Booking Status",
    "Priority",
    "Assigned To",
    "Budget Range",
    "Project Details",
    "Next Follow-Up",
    "Last Contacted",
    "Reschedule Requested?",
    "Cancel Requested?",
    "Notes",
    "Drive Folder / Files",
  ];
  const rows: Array<Record<string, string>> = [];
  const fieldMap: Record<string, string> = {
    "Booking Reference": "bookingReference",
    "Date Submitted": "submittedAt",
    "Lead Source": "leadSource",
    "Full Name": "fullName",
    "Phone Number": "phoneNumber",
    "Email Address": "emailAddress",
    "Project Type": "projectType",
    "Project Location": "projectLocation",
    "Preferred Date": "preferredDate",
    "Preferred Time": "preferredTime",
    "Booking Status": "bookingStatus",
    Priority: "priority",
    "Assigned To": "assignedTo",
    "Budget Range": "budgetRange",
    "Project Details": "projectDetails",
    "Reschedule Requested?": "rescheduleRequested",
    "Cancel Requested?": "cancelRequested",
    Notes: "notes",
  };
  const sheet = {
    getLastColumn: () => headers.length,
    getLastRow: () => 8 + rows.length,
    getRange: (row: number, column: number, rowCount = 1, columnCount = 1) => ({
      getDisplayValues: () => {
        if (row === 8) return [headers.slice(column - 1, column - 1 + columnCount)];
        return rows
          .slice(row - 9, row - 9 + rowCount)
          .map((booking) =>
            headers
              .slice(column - 1, column - 1 + columnCount)
              .map((header) => booking[fieldMap[header] ?? ""] ?? ""),
          );
      },
    }),
  };
  const adminSend = vi.fn();
  const customerSend = vi.fn();
  const appointmentWrite = vi.fn();
  const calendarWrite = vi.fn();
  let appointmentExists = false;
  let calendarExists = false;
  let adminCreateNotificationExists = false;

  context.LockService = {
    getScriptLock: () => ({ waitLock: vi.fn(), releaseLock: vi.fn() }),
  };
  context.Utilities = {
    formatDate: () => "2026-09-01 19:00",
  };
  context.getSheetV6_ = () => sheet;
  context.parseBookingDateV6_ = (value: string) => ({ normalized: value });
  context.parseBookingTimeV6_ = (value: string) => ({ normalized24: value, display: "10:30 AM" });
  context.nextBookingReferenceV6_ = () => `IGS-2026-${String(rows.length + 1).padStart(4, "0")}`;
  context.appendBookingRowV6_ = (_sheet: unknown, booking: Record<string, string>) => {
    rows.push({ ...booking });
    return 8 + rows.length;
  };
  appointmentWrite.mockImplementation(() => {
    appointmentExists = true;
  });
  calendarWrite.mockImplementation(() => {
    calendarExists = true;
  });
  adminSend.mockImplementation(() => {
    adminCreateNotificationExists = true;
  });
  context.appendAppointmentRowV6_ = appointmentWrite;
  context.getCalendarV6_ = () => ({});
  context.createBookingCalendarEventV6_ = calendarWrite;
  context.hasAppointmentRowV625_ = () => appointmentExists;
  context.hasBookingCalendarEventV625_ = () => calendarExists;
  context.hasSentAdminCreateNotificationV625_ = () => adminCreateNotificationExists;
  context.sendCustomerBookingConfirmationV6_ = customerSend;
  context.sendAdminLifecycleNotificationV62_ = adminSend;
  context.updateBookingFieldsV6_ = (row: number, fields: Record<string, string>) => {
    const booking = rows[row - 9];
    if (!booking) return;
    if (fields.Notes !== undefined) booking.notes = fields.Notes;
  };

  return { context, rows, adminSend, customerSend, appointmentWrite, calendarWrite };
}

const createPayload = {
  submissionId: "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
  fullName: "VMM Retry QA",
  phoneNumber: "+63 917 123 4567",
  emailAddress: "qa@example.com",
  projectType: "Residential",
  projectLocation: "Cagayan de Oro City",
  preferredService: "Project Consultation",
  approximateArea: "180 sqm",
  preferredDate: "2026-09-15",
  preferredTime: "10:30",
  budgetRange: "PHP 3,000,000 - PHP 5,000,000",
  projectDetails: "Controlled timeout recovery test.",
  privacyConsent: "accepted",
  leadSource: "Website",
};

describe("Apps Script V6.2.5 production-readiness behavior", () => {
  it("returns the original booking without repeating create side effects", () => {
    const { context, rows, adminSend, appointmentWrite, calendarWrite } = bookingHarness();

    const first = context.createBookingV6_(createPayload);
    const retry = context.createBookingV6_(createPayload);

    expect(first.bookingReference).toBe("IGS-2026-0001");
    expect(retry.bookingReference).toBe("IGS-2026-0001");
    expect(rows).toHaveLength(1);
    expect(appointmentWrite).toHaveBeenCalledTimes(1);
    expect(calendarWrite).toHaveBeenCalledTimes(1);
    expect(adminSend).toHaveBeenCalledTimes(1);
  });

  it("keeps customer create mail disabled while admin mail remains active", () => {
    const { context, adminSend, customerSend } = bookingHarness();

    context.createBookingV6_(createPayload);

    expect(customerSend).not.toHaveBeenCalled();
    expect(adminSend).toHaveBeenCalledTimes(1);
  });

  it("repairs a missing appointment on retry without repeating completed side effects", () => {
    const { context, rows, adminSend, appointmentWrite, calendarWrite } = bookingHarness();
    appointmentWrite.mockImplementationOnce(() => {
      throw new Error("temporary appointment write failure");
    });

    const first = context.createBookingV6_(createPayload);
    const retry = context.createBookingV6_(createPayload);

    expect(first.warnings).toContain("Appointment sheet: temporary appointment write failure");
    expect(retry.bookingReference).toBe(first.bookingReference);
    expect(rows).toHaveLength(1);
    expect(appointmentWrite).toHaveBeenCalledTimes(2);
    expect(calendarWrite).toHaveBeenCalledTimes(1);
    expect(adminSend).toHaveBeenCalledTimes(1);
  });

  it("repairs a missing calendar event on retry without repeating completed side effects", () => {
    const { context, rows, adminSend, appointmentWrite, calendarWrite } = bookingHarness();
    calendarWrite.mockImplementationOnce(() => {
      throw new Error("temporary calendar failure");
    });

    const first = context.createBookingV6_(createPayload);
    const retry = context.createBookingV6_(createPayload);

    expect(first.warnings).toContain("Calendar: temporary calendar failure");
    expect(retry.bookingReference).toBe(first.bookingReference);
    expect(rows).toHaveLength(1);
    expect(appointmentWrite).toHaveBeenCalledTimes(1);
    expect(calendarWrite).toHaveBeenCalledTimes(2);
    expect(adminSend).toHaveBeenCalledTimes(1);
  });

  it("repairs a missing admin notification on retry without repeating completed side effects", () => {
    const { context, rows, adminSend, appointmentWrite, calendarWrite } = bookingHarness();
    adminSend.mockImplementationOnce(() => {
      throw new Error("temporary admin mail failure");
    });

    const first = context.createBookingV6_(createPayload);
    const retry = context.createBookingV6_(createPayload);

    expect(first.warnings).toContain("Admin email: temporary admin mail failure");
    expect(retry.bookingReference).toBe(first.bookingReference);
    expect(rows).toHaveLength(1);
    expect(appointmentWrite).toHaveBeenCalledTimes(1);
    expect(calendarWrite).toHaveBeenCalledTimes(1);
    expect(adminSend).toHaveBeenCalledTimes(2);
  });

  it("does not resend admin mail when delivery succeeded before its CRM marker failed", () => {
    const { context, rows, adminSend, appointmentWrite, calendarWrite } = bookingHarness();
    const updateBookingFields = context.updateBookingFieldsV6_;
    let failAdminMarker = true;
    context.updateBookingFieldsV6_ = (row: number, fields: Record<string, string>) => {
      if (failAdminMarker && fields.Notes?.includes("[Create completed: admin email]")) {
        failAdminMarker = false;
        throw new Error("temporary marker write failure");
      }
      updateBookingFields(row, fields);
    };

    const first = context.createBookingV6_(createPayload);
    const retry = context.createBookingV6_(createPayload);

    expect(first.warnings).toContain("Admin email: temporary marker write failure");
    expect(retry.bookingReference).toBe(first.bookingReference);
    expect(rows).toHaveLength(1);
    expect(appointmentWrite).toHaveBeenCalledTimes(1);
    expect(calendarWrite).toHaveBeenCalledTimes(1);
    expect(adminSend).toHaveBeenCalledTimes(1);
    expect(rows[0].notes).toContain("[Create completed: admin email]");
  });

  it("keeps customer reschedule mail disabled while admin mail remains active", () => {
    const context = loadScript();
    const customerSend = vi.fn();
    const adminSend = vi.fn();
    const originalBooking = {
      bookingReference: "IGS-2026-0042",
      fullName: "VMM Retry QA",
      phoneNumber: "+63 917 123 4567",
      emailAddress: "qa@example.com",
      preferredDate: "2026-09-15",
      preferredTime: "10:30 AM",
      bookingStatus: "New",
      notes: "Original note",
    };
    const updatedBooking = {
      ...originalBooking,
      preferredDate: "2026-09-16",
      preferredTime: "11:30 AM",
      bookingStatus: "Rescheduled",
    };
    context.parseBookingDateV6_ = (value: string) => ({ normalized: value });
    context.parseBookingTimeV6_ = (value: string) => ({ normalized24: value, display: "11:30 AM" });
    context.findBookingRecordV6_ = () => ({ row: 9, booking: originalBooking });
    context.getCalendarV6_ = () => ({});
    context.bookingToCalendarPayloadV6_ = vi.fn(() => ({}));
    context.replaceBookingCalendarEventV62_ = vi.fn(() => ({}));
    context.updateBookingFieldsV6_ = vi.fn();
    context.updateAppointmentV6_ = vi.fn();
    context.readBookingByRowV6_ = () => updatedBooking;
    context.formatBookingScheduleV6_ = vi.fn(() => "schedule");
    context.sendCustomerLifecycleEmailV62_ = customerSend;
    context.sendAdminLifecycleNotificationV62_ = adminSend;
    context.Utilities = { formatDate: () => "2026-09-01 19:00" };

    context.rescheduleBookingV6_({
      bookingReference: originalBooking.bookingReference,
      contact: originalBooking.emailAddress,
      newPreferredDate: "2026-09-16",
      newPreferredTime: "11:30",
      rescheduleNotes: "QA reschedule",
    });

    expect(customerSend).not.toHaveBeenCalled();
    expect(adminSend).toHaveBeenCalledTimes(1);
  });

  it("keeps customer cancellation mail disabled while admin mail remains active", () => {
    const context = loadScript();
    const customerSend = vi.fn();
    const adminSend = vi.fn();
    const originalBooking = {
      bookingReference: "IGS-2026-0042",
      fullName: "VMM Retry QA",
      phoneNumber: "+63 917 123 4567",
      emailAddress: "qa@example.com",
      preferredDate: "2026-09-15",
      preferredTime: "10:30 AM",
      bookingStatus: "New",
      notes: "Original note",
    };
    const cancelledBooking = { ...originalBooking, bookingStatus: "Cancelled" };
    context.findBookingRecordV6_ = () => ({ row: 9, booking: originalBooking });
    context.getCalendarV6_ = () => ({});
    context.bookingToCalendarPayloadV6_ = vi.fn(() => ({}));
    context.deleteBookingCalendarEventsV6_ = vi.fn(() => 1);
    context.updateBookingFieldsV6_ = vi.fn();
    context.updateAppointmentV6_ = vi.fn();
    context.readBookingByRowV6_ = () => cancelledBooking;
    context.formatBookingScheduleV6_ = vi.fn(() => "schedule");
    context.sendCustomerLifecycleEmailV62_ = customerSend;
    context.sendAdminLifecycleNotificationV62_ = adminSend;
    context.Utilities = { formatDate: () => "2026-09-01 19:00" };

    context.cancelBookingV6_({
      bookingReference: originalBooking.bookingReference,
      contact: originalBooking.emailAddress,
      cancellationReason: "QA cancellation",
    });

    expect(customerSend).not.toHaveBeenCalled();
    expect(adminSend).toHaveBeenCalledTimes(1);
  });

  it("keeps legacy create requests available during the staging rollout", () => {
    const { context, rows } = bookingHarness();
    const legacyPayload = { ...createPayload };
    delete (legacyPayload as Partial<typeof createPayload>).submissionId;

    expect(() => context.createBookingV6_(legacyPayload)).not.toThrow();
    expect(rows).toHaveLength(1);
  });

  it("renders separate reply and call CTAs with a valid sanitized tel URI", () => {
    const context = loadScript();
    const actions = context.buildClientActionV4_(
      "qa@example.com",
      "+63 (917) 123-4567",
      "IGS-2026-0042",
    );

    expect(actions.html).toContain("REPLY TO CLIENT");
    expect(actions.html).toContain(
      "mailto:qa%40example.com?subject=Re%3A%20IG%20Sabroso%20consultation%20request%20IGS-2026-0042",
    );
    expect(actions.html).toContain("CALL CLIENT");
    expect(actions.html).toContain('href="tel:+639171234567"');
    expect(actions.html).not.toContain("REPLY TO CLIENT →");
    expect(actions.html).not.toContain("CALL CLIENT →");
  });

  it("hides Call Client when the phone value is not dialable", () => {
    const context = loadScript();
    const actions = context.buildClientActionV4_(
      "qa@example.com",
      "extension 123",
      "IGS-2026-0042",
    );

    expect(actions.html).toContain("REPLY TO CLIENT");
    expect(actions.html).not.toContain("CALL CLIENT");
    expect(actions.html).not.toContain("tel:");
  });

  it("preserves secure operational links and a clean CDS footer", () => {
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
        fullName: "VMM Retry QA",
        phoneNumber: "+63 (917) 123-4567",
        emailAddress: "qa@example.com",
        projectType: "Residential",
        projectLocation: "Cagayan de Oro City",
        budgetRange: "PHP 3,000,000 - PHP 5,000,000",
        projectDetails: "Controlled timeout recovery test.",
        preferredDate: "2026-09-15",
        preferredTime: "10:30 AM",
      },
      9,
      {},
    );

    expect(sent?.to).toBe("caballerodigitals@gmail.com");
    expect(sent?.htmlBody).toContain("REPLY TO CLIENT");
    expect(sent?.htmlBody).toContain("CALL CLIENT");
    expect(sent?.htmlBody).toContain("OPEN CRM RECORD");
    expect(sent?.htmlBody).not.toContain("docs.google.com/spreadsheets");
    expect(sent?.htmlBody).toContain(">Powered by CDS</a>");
    expect(sent?.htmlBody).not.toContain("Powered by CDS →");
    expect(sent).not.toHaveProperty("attachments");
  });
});
