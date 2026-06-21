import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  XCircle,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";

import { callCRM, type BookingRecord } from "@/lib/bookings";

function useEscClose(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg my-auto">
        {children}
      </div>
    </motion.div>
  );
}

type LookupContext = { reference: string; contact: string };

type View =
  | { kind: "lookup" }
  | { kind: "details"; booking: BookingRecord; ctx: LookupContext }
  | { kind: "reschedule"; booking: BookingRecord; ctx: LookupContext }
  | { kind: "cancel"; booking: BookingRecord; ctx: LookupContext }
  | { kind: "reschedule-done"; booking: BookingRecord }
  | { kind: "cancel-done"; booking: BookingRecord };

export function CheckBookingModal({
  open,
  onClose,
  initialReference,
}: {
  open: boolean;
  onClose: () => void;
  initialReference?: string;
}) {
  useEscClose(open, onClose);
  const [view, setView] = useState<View>({ kind: "lookup" });
  const [ref, setRef] = useState("");
  const [contact, setContact] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [notFoundMsg, setNotFoundMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setView({ kind: "lookup" });
      setRef(""); setContact(""); setErr(null); setLoading(false); setNotFoundMsg(null);
    } else if (initialReference) {
      setRef(initialReference);
    }
  }, [open, initialReference]);

  const submitLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotFoundMsg(null);
    if (!ref.trim() || !contact.trim()) {
      setErr("Please complete both fields to find your booking.");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const data = await callCRM<{ booking?: BookingRecord }>("findBooking", {
        bookingReference: ref.trim(),
        contact: contact.trim(),
      });
      const rawBooking = (data.booking ?? (data.data?.booking as BookingRecord | undefined)) as Record<string, unknown> | undefined;
      if (!rawBooking) {
        setNotFoundMsg("Booking not found. Please check your booking reference and contact detail.");
      } else {
        const normalizedRef = String(
          rawBooking.bookingReference ?? rawBooking["Booking Reference"] ?? ref.trim(),
        );
        const booking = { ...rawBooking, bookingReference: normalizedRef } as BookingRecord;
        setView({ kind: "details", booking, ctx: { reference: ref.trim(), contact: contact.trim() } });
      }

    } catch (e2) {
      setNotFoundMsg(
        e2 instanceof Error && e2.message
          ? e2.message
          : "Booking not found. Please check your booking reference and contact detail.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-background rounded-3xl shadow-glow border border-border overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition"
            >
              <X size={16} />
            </button>

            <div className="px-7 pt-7 pb-6">
              {view.kind !== "lookup" && (
                <button
                  onClick={() => setView({ kind: "lookup" })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition mb-3"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}

              <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl gradient-brand text-primary-foreground shadow-soft">
                <CalendarCheck size={20} />
              </div>

              {view.kind === "lookup" && (
                <>
                  <h3 className="mt-4 text-2xl font-display font-bold">Manage Your Booking</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your booking reference and contact detail to view your appointment, reschedule, or cancel your booking.
                  </p>

                  <form onSubmit={submitLookup} className="mt-6 space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booking Reference</label>
                      <input
                        value={ref}
                        onChange={(e) => setRef(e.target.value)}
                        placeholder="Example: IGS-2026-0142"
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email or Phone Number</label>
                      <input
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Enter your email or phone number"
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    {err && <p className="text-xs text-destructive">{err}</p>}

                    {notFoundMsg && (
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
                        <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-destructive">Booking not found</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{notFoundMsg}</div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3.5 font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-70"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
                      {loading ? "Checking..." : "Find My Booking"}
                    </button>
                  </form>
                </>
              )}

              {view.kind === "details" && (
                <DetailsCard
                  booking={view.booking}
                  onReschedule={() => setView({ kind: "reschedule", booking: view.booking, ctx: view.ctx })}
                  onCancel={() => setView({ kind: "cancel", booking: view.booking, ctx: view.ctx })}
                />
              )}

              {view.kind === "reschedule" && (
                <RescheduleForm
                  booking={view.booking}
                  ctx={view.ctx}
                  onDone={(updated) => setView({ kind: "reschedule-done", booking: updated })}
                />
              )}

              {view.kind === "cancel" && (
                <CancelConfirm
                  booking={view.booking}
                  ctx={view.ctx}
                  onBack={() => setView({ kind: "details", booking: view.booking, ctx: view.ctx })}
                  onDone={(updated) => setView({ kind: "cancel-done", booking: updated })}
                />
              )}

              {view.kind === "reschedule-done" && (
                <>
                  <h3 className="mt-4 text-2xl font-display font-bold">Reschedule Request Received</h3>
                  <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/90">
                      Your reschedule request has been received. Our team will contact you to confirm the new schedule.
                    </p>
                  </div>
                  <DetailsCard booking={view.booking} onReschedule={() => { /* hidden after submit */ }} onCancel={() => { /* hidden after submit */ }} hideActions />
                  <button
                    onClick={onClose}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3 font-semibold shadow-glow hover:scale-[1.01] transition"
                  >
                    Done
                  </button>
                </>
              )}

              {view.kind === "cancel-done" && (
                <ResultCard
                  tone="info"
                  title="Cancellation Request Received"
                  message="Your booking cancellation request has been received."
                  reference={view.booking.bookingReference}
                  onClose={onClose}
                />
              )}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function statusBadgeClasses(status: string) {
  const s = status.toLowerCase();
  if (s.includes("confirm") || s.includes("scheduled")) return "bg-emerald-500 text-white";
  if (s.includes("cancel")) return "bg-destructive text-destructive-foreground";
  if (s.includes("reschedule")) return "bg-primary text-primary-foreground";
  return "bg-amber-500 text-white";
}

function getBookingValue(booking: Record<string, unknown> | BookingRecord, ...keys: string[]): string {
  const b = booking as Record<string, unknown>;
  for (const key of keys) {
    const v = b?.[key];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return "Not provided";
}

// Sentinel dates Google Sheets uses when a cell stores a time-only value.
// If Apps Script serializes that value as ISO, the hour is UTC; convert it
// to Philippine Time before showing it (01:30Z → 9:30am PHT).
const SHEETS_SENTINEL_DATE_RE = /^(1899-12-30|1900-01-0[01]|1970-01-01)/;

function isSheetsSentinel(raw: string): boolean {
  return SHEETS_SENTINEL_DATE_RE.test(raw);
}

function hasTzMarker(raw: string): boolean {
  return /(Z|[+\-]\d{2}:?\d{2})$/.test(raw);
}

const PHT_DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Manila",
});

const PHT_TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Manila",
});

function formatPhtTime(date: Date): string {
  return PHT_TIME_FMT.format(date)
    .replace(/\s?AM$/i, "am")
    .replace(/\s?PM$/i, "pm")
    .replace(/\s+/g, "");
}

function formatDisplayDate(dateValue: string): string {
  if (!dateValue) return "";
  const raw = String(dateValue).trim();

  // Real ISO datetime with TZ marker → convert to Philippine Time.
  if (raw.includes("T") && hasTzMarker(raw) && !isSheetsSentinel(raw)) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return PHT_DATE_FMT.format(d);
  }

  // Plain YYYY-MM-DD (or sentinel like "1899-12-30T..."): use components verbatim.
  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) {
    const year = Number(ymd[1]);
    const monthIndex = Number(ymd[2]) - 1;
    const day = Number(ymd[3]);
    // If sentinel, the date itself is meaningless — return empty so callers fall back.
    if (isSheetsSentinel(raw)) return "";
    // Build at noon UTC so Asia/Manila formatting never rolls back a day.
    const date = new Date(Date.UTC(year, monthIndex, day, 12, 0, 0));
    return PHT_DATE_FMT.format(date);
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return PHT_DATE_FMT.format(date);
}

function formatDisplayTime(timeValue: string): string {
  if (!timeValue) return "";
  const raw = String(timeValue).trim();

  // Plain HH:mm or HH:mm:ss — already Philippine wall-clock, no TZ shift.
  const hm = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (hm) {
    let hour = Number(hm[1]);
    const minute = hm[2];
    const suffix = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${hour}:${minute}${suffix}`;
  }

  // Human readable "10:30 AM".
  const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = ampm[2] || "00";
    const suffix = ampm[3].toLowerCase();
    hour = hour % 12 || 12;
    return `${hour}:${minute}${suffix}`;
  }

  // Any ISO datetime with a timezone marker — including Google Sheets
  // sentinel dates like 1899-12-30T01:30:00Z — must display in PHT.
  if (raw.includes("T") && hasTzMarker(raw)) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return formatPhtTime(d);
  }

  // Bare "T HH:mm" without TZ info — treat as Philippine wall-clock.
  const isoTime = raw.match(/T(\d{2}):(\d{2})/);
  if (isoTime) {
    let hour = Number(isoTime[1]);
    const minute = isoTime[2];
    const suffix = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${hour}:${minute}${suffix}`;
  }

  return raw;
}



function formatPreferredSchedule(
  preferredDate: string,
  preferredTime: string,
  preferredScheduleFromApi?: string,
): string {
  const date = formatDisplayDate(preferredDate);
  const time = formatDisplayTime(preferredTime);
  if (date && time) return `${date} — ${time}`;
  if (date) return date;
  if (time) return time;

  if (preferredScheduleFromApi) {
    const rawSchedule = preferredScheduleFromApi.trim();
    if (rawSchedule && rawSchedule !== "Not provided" && rawSchedule !== "Pending schedule confirmation") {
      if (/\dT\d/.test(rawSchedule)) {
        const parsedDate = formatDisplayDate(rawSchedule);
        const parsedTime = formatDisplayTime(rawSchedule);
        if (parsedDate && parsedTime) return `${parsedDate} — ${parsedTime}`;
        if (parsedTime) return parsedTime;
        if (parsedDate) return parsedDate;
      }
      return rawSchedule;
    }
  }

  return "Pending schedule confirmation";
}

function DetailsCard({
  booking,
  onReschedule,
  onCancel,
  hideActions,
}: {
  booking: BookingRecord;
  onReschedule: () => void;
  onCancel: () => void;
  hideActions?: boolean;
}) {
  const reference = getBookingValue(booking, "bookingReference", "Booking Reference");
  const fullName = getBookingValue(booking, "fullName", "Full Name");
  const phone = getBookingValue(booking, "phoneNumber", "Phone Number");
  const email = getBookingValue(booking, "emailAddress", "Email Address");
  const projectType = getBookingValue(booking, "projectType", "Project Type");
  const location = getBookingValue(booking, "projectLocation", "Project Location");
  const preferredDateRaw = getBookingValue(booking, "preferredDate", "Preferred Date");
  const preferredTimeRaw = getBookingValue(booking, "preferredTime", "Preferred Time");
  const rawStatus = getBookingValue(booking, "bookingStatus", "Booking Status");
  const status = rawStatus === "Not provided" ? "Pending Confirmation" : rawStatus;
  const cancelled = status.toLowerCase().includes("cancel");

  const preferredScheduleFromApi = getBookingValue(booking, "preferredSchedule", "Preferred Schedule");
  const schedule = formatPreferredSchedule(
    preferredDateRaw === "Not provided" ? "" : preferredDateRaw,
    preferredTimeRaw === "Not provided" ? "" : preferredTimeRaw,
    preferredScheduleFromApi === "Not provided" ? "" : preferredScheduleFromApi,
  );

  const contact = email !== "Not provided" && phone !== "Not provided"
    ? `${email} · ${phone}`
    : email !== "Not provided"
      ? email
      : phone;

  return (
    <>
      <h3 className="mt-4 text-2xl font-display font-bold">Appointment Request Found</h3>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl border border-primary/20 bg-[oklch(0.985_0.012_70)] dark:bg-surface/40 p-5 shadow-soft"
      >
        <div className="flex items-center justify-end">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${statusBadgeClasses(status)}`}>
            {status}
          </span>
        </div>

        <div className="mt-3 divide-y divide-border/60">
          <SimpleRow label="Reference" value={reference} mono />
          <SimpleRow label="Client" value={fullName} />
          {projectType !== "Not provided" && <SimpleRow label="Service" value={projectType} />}
          <SimpleRow label="Preferred Schedule" value={schedule} />
          <SimpleRow label="Contact" value={contact} />
          {location !== "Not provided" && <SimpleRow label="Location" value={location} />}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Our team will confirm your appointment through email or phone.
        </p>
      </motion.div>

      {!cancelled && !hideActions && (
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <button
            onClick={onReschedule}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-surface border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition"
          >
            <CalendarClock size={16} className="text-primary" /> Reschedule
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/40 text-destructive px-5 py-3 text-sm font-semibold hover:bg-destructive/10 transition"
          >
            <XCircle size={16} /> Cancel Request
          </button>
        </div>
      )}
    </>
  );
}

function SimpleRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  if (!value || value.trim() === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold pt-0.5 shrink-0">{label}</div>
      <div className={`text-sm font-semibold text-right break-words min-w-0 ${mono ? "font-mono tracking-wider" : ""}`}>{value}</div>
    </div>
  );
}


function toPlainDateValue(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") {
    const raw = value.trim();
    const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
    return raw;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return String(value).trim();
}

function toPlainTimeValue(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") {
    const raw = value.trim();
    const hm = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (hm) return `${String(Number(hm[1])).padStart(2, "0")}:${hm[2]}`;
    const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (ampm) {
      let hour = Number(ampm[1]);
      const minute = ampm[2] || "00";
      const suffix = ampm[3].toUpperCase();
      if (suffix === "PM" && hour < 12) hour += 12;
      if (suffix === "AM" && hour === 12) hour = 0;
      return `${String(hour).padStart(2, "0")}:${minute}`;
    }
    const isoTime = raw.match(/T(\d{2}):(\d{2}):/);
    if (isoTime) return `${isoTime[1]}:${isoTime[2]}`;
    return raw;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const hour = String(value.getHours()).padStart(2, "0");
    const minute = String(value.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  }
  return String(value).trim();
}

function RescheduleForm({
  booking,
  ctx,
  onDone,
}: {
  booking: BookingRecord;
  ctx: LookupContext;
  onDone: (b: BookingRecord) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setErr("Please choose a preferred date and time.");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const newPreferredDate = toPlainDateValue(date);
      const newPreferredTime = toPlainTimeValue(time);
      const reschedulePayload = {
        bookingReference: booking.bookingReference,
        contact: ctx.contact,
        newPreferredDate,
        newPreferredTime,
        rescheduleNotes: notes,
      };
      console.log("IGS reschedule payload:", reschedulePayload);
      await callCRM("rescheduleBooking", reschedulePayload);

      // Re-fetch booking, but always trust the freshly selected raw values for display.
      let refreshed: BookingRecord = {
        ...booking,
        preferredDate: newPreferredDate,
        preferredTime: newPreferredTime,
        bookingStatus: "Reschedule Requested",
      };
      try {
        const refreshedResult = await callCRM<{ booking?: BookingRecord }>("findBooking", {
          bookingReference: booking.bookingReference,
          contact: ctx.contact,
        });
        const rawBooking = (refreshedResult.booking ?? (refreshedResult.data?.booking as BookingRecord | undefined)) as Record<string, unknown> | undefined;
        if (rawBooking) {
          // Strip any backend-formatted schedule fields so the UI re-renders
          // from the freshly selected Philippine-time values (no TZ shift).
          const cleaned = { ...rawBooking };
          delete cleaned.preferredSchedule;
          delete cleaned["Preferred Schedule"];
          delete cleaned.preferredDate;
          delete cleaned["Preferred Date"];
          delete cleaned.preferredTime;
          delete cleaned["Preferred Time"];
          const merged: Record<string, unknown> = {
            ...cleaned,
            bookingReference: String(rawBooking.bookingReference ?? rawBooking["Booking Reference"] ?? booking.bookingReference),
            preferredDate: newPreferredDate,
            preferredTime: newPreferredTime,
          };
          refreshed = merged as unknown as BookingRecord;
        }
      } catch (refreshErr) {
        console.warn("IGS reschedule refresh failed:", refreshErr);
      }

      onDone(refreshed);
    } catch (e2) {
      setErr(
        e2 instanceof Error && e2.message
          ? e2.message
          : "We couldn't submit your reschedule request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="mt-4 text-2xl font-display font-bold">Reschedule Booking</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a new preferred date and time. Our team will confirm the final schedule.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Preferred Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason / Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any details about the new schedule (optional)."
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
        {err && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">{err}</div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3.5 font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-70"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarClock size={16} />}
          {loading ? "Submitting..." : "Submit Reschedule Request"}
        </button>
      </form>
    </>
  );
}

function CancelConfirm({
  booking,
  ctx,
  onBack,
  onDone,
}: {
  booking: BookingRecord;
  ctx: LookupContext;
  onBack: () => void;
  onDone: (b: BookingRecord) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const confirm = async () => {
    setErr(null);
    setLoading(true);
    try {
      await callCRM("cancelBooking", {
        bookingReference: booking.bookingReference,
        contact: ctx.contact,
        cancelReason: reason,
      });
      onDone({ ...booking, bookingStatus: "Cancellation Requested" });
    } catch (e2) {
      setErr(
        e2 instanceof Error && e2.message
          ? e2.message
          : "We couldn't submit your cancellation request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="mt-4 text-2xl font-display font-bold">Cancel Booking?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Are you sure you want to request cancellation for booking <span className="font-semibold text-foreground">{booking.bookingReference}</span>?
      </p>

      <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          You can always submit a new consultation request later if you change your mind.
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cancellation Reason (optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Let us know why you're cancelling (optional)."
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>

      {err && (
        <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">{err}</div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-surface border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition disabled:opacity-70"
        >
          Keep Booking
        </button>
        <button
          onClick={confirm}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-destructive text-destructive-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-70"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
          {loading ? "Submitting..." : "Confirm Cancellation"}
        </button>
      </div>
    </>
  );
}

function ResultCard({
  tone,
  title,
  message,
  reference,
  onClose,
}: {
  tone: "success" | "info";
  title: string;
  message: string;
  reference: string;
  onClose: () => void;
}) {
  const accent = tone === "success" ? "border-emerald-500/30 bg-emerald-500/10" : "border-primary/30 bg-primary/10";
  return (
    <>
      <h3 className="mt-4 text-2xl font-display font-bold">{title}</h3>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 rounded-2xl border ${accent} p-5`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className={tone === "success" ? "text-emerald-600 shrink-0 mt-0.5" : "text-primary shrink-0 mt-0.5"} />
          <p className="text-sm text-foreground/90">{message}</p>
        </div>
        <div className="mt-4 rounded-xl bg-background/70 border border-border px-4 py-2.5 text-xs font-mono tracking-wider text-center">
          {reference}
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3 font-semibold shadow-glow hover:scale-[1.01] transition"
      >
        Done
      </button>
    </>
  );
}


// Small reusable copy-to-clipboard reference pill used in the consultation success card.
export function ReferencePill({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 font-mono text-sm tracking-wider text-foreground hover:bg-primary/15 transition"
      aria-label="Copy booking reference"
    >
      <span className="font-semibold">{reference}</span>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/70 text-primary">
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </span>
    </button>
  );
}
