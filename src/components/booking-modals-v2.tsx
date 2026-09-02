import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  X,
  XCircle,
} from "lucide-react";

import { SchedulePicker } from "@/components/schedule-picker";
import { callCRM, type BookingRecord } from "@/lib/bookings";

type LookupContext = { reference: string; contact: string };

type View =
  | { kind: "lookup" }
  | { kind: "details"; booking: BookingRecord; ctx: LookupContext }
  | { kind: "reschedule"; booking: BookingRecord; ctx: LookupContext }
  | { kind: "cancel"; booking: BookingRecord; ctx: LookupContext }
  | { kind: "reschedule-done"; booking: BookingRecord }
  | { kind: "cancel-done"; booking: BookingRecord };

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
const SHEETS_SENTINEL_DATE_RE = /^(1899-12-30|1900-01-0[01]|1970-01-01)/;

function useModalEffects(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);
}

function normalizeBooking(raw: Record<string, unknown>, fallbackReference: string): BookingRecord {
  return {
    ...(raw as unknown as BookingRecord),
    bookingReference: String(
      raw.bookingReference ?? raw["Booking Reference"] ?? fallbackReference,
    ),
  };
}

function getBookingValue(
  booking: Record<string, unknown> | BookingRecord,
  ...keys: string[]
): string {
  const record = booking as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "Not provided";
}

function hasTimezone(raw: string) {
  return /(?:Z|[+-]\d{2}:?\d{2})$/.test(raw);
}

function isSheetsSentinel(raw: string) {
  return SHEETS_SENTINEL_DATE_RE.test(raw);
}

function formatWallClockTime(hour24: number, minute: string) {
  const suffix = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minute}${suffix}`;
}

function formatPhtTime(date: Date) {
  return PHT_TIME_FMT.format(date)
    .replace(/\s?AM$/i, "am")
    .replace(/\s?PM$/i, "pm")
    .replace(/\s+/g, "");
}

function formatDisplayDate(value: string) {
  if (!value) return "";
  const raw = String(value).trim();
  if (raw.includes("T") && hasTimezone(raw) && !isSheetsSentinel(raw)) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return PHT_DATE_FMT.format(date);
  }
  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd && !isSheetsSentinel(raw)) {
    const date = new Date(Date.UTC(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]), 12));
    return PHT_DATE_FMT.format(date);
  }
  return "";
}

function formatDisplayTime(value: string) {
  if (!value) return "";
  const raw = String(value).trim();
  const hm = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (hm) return formatWallClockTime(Number(hm[1]), hm[2]);

  const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = ampm[2] || "00";
    const suffix = ampm[3].toUpperCase();
    if (suffix === "PM" && hour < 12) hour += 12;
    if (suffix === "AM" && hour === 12) hour = 0;
    return formatWallClockTime(hour, minute);
  }

  if (raw.includes("T") && hasTimezone(raw)) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return formatPhtTime(date);
  }

  const iso = raw.match(/T(\d{2}):(\d{2})/);
  if (iso) return formatWallClockTime(Number(iso[1]), iso[2]);
  return raw;
}

function formatPreferredSchedule(booking: BookingRecord) {
  const dateRaw = getBookingValue(booking, "preferredDate", "Preferred Date");
  const timeRaw = getBookingValue(booking, "preferredTime", "Preferred Time");
  const date = formatDisplayDate(dateRaw === "Not provided" ? "" : dateRaw);
  const time = formatDisplayTime(timeRaw === "Not provided" ? "" : timeRaw);
  if (date && time) return `${date} — ${time}`;
  if (date) return date;
  if (time) return time;
  const api = getBookingValue(booking, "preferredSchedule", "Preferred Schedule");
  return api === "Not provided" ? "Pending schedule confirmation" : api;
}

function toPlainDateValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toPlainTimeValue(value: string) {
  const raw = String(value).trim();
  const hm = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (hm) return `${String(Number(hm[1])).padStart(2, "0")}:${hm[2]}`;
  const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!ampm) return raw;
  let hour = Number(ampm[1]);
  const minute = ampm[2] || "00";
  if (ampm[3].toUpperCase() === "PM" && hour < 12) hour += 12;
  if (ampm[3].toUpperCase() === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function statusClasses(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return "bg-red-50 text-red-700 border-red-200";
  if (normalized.includes("reschedul")) return "bg-[#fff1eb] text-[#c43f17] border-[#ffd1bf]";
  if (normalized.includes("confirm") || normalized.includes("scheduled")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function CheckBookingModal({
  open,
  onClose,
  initialReference,
}: {
  open: boolean;
  onClose: () => void;
  initialReference?: string;
}) {
  useModalEffects(open, onClose);
  const titleId = useId();
  const [view, setView] = useState<View>({ kind: "lookup" });
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setView({ kind: "lookup" });
      setReference("");
      setContact("");
      setError(null);
      setLoading(false);
      return;
    }
    if (initialReference) setReference(initialReference);
  }, [open, initialReference]);

  async function findBooking(event: React.FormEvent) {
    event.preventDefault();
    if (!reference.trim() || !contact.trim()) {
      setError("Enter both your booking reference and the email or phone number used for the booking.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCRM<{ booking?: BookingRecord }>("findBooking", {
        bookingReference: reference.trim(),
        contact: contact.trim(),
      });
      const raw = (result.booking ?? result.data?.booking) as Record<string, unknown> | undefined;
      if (!raw) throw new Error("Booking not found. Check your reference and contact detail.");
      setView({
        kind: "details",
        booking: normalizeBooking(raw, reference.trim()),
        ctx: { reference: reference.trim(), contact: contact.trim() },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not find that booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div className="flex min-h-full items-center justify-center py-4">
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[560px] overflow-hidden rounded-[1.6rem] border border-[#e4e7ec] bg-white shadow-[0_24px_80px_rgba(15,31,55,0.24)]"
            >
              <div className="h-1.5 bg-[#ff4b18]" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close manage booking"
                className="absolute right-4 top-5 grid min-h-11 min-w-11 place-items-center rounded-xl text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#16263f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18]"
              >
                <X size={18} />
              </button>

              <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8">
                {view.kind !== "lookup" ? (
                  <button
                    type="button"
                    onClick={() => setView({ kind: "lookup" })}
                    className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-bold text-[#667085] transition hover:text-[#16263f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18]"
                  >
                    <ArrowLeft size={16} /> Back to lookup
                  </button>
                ) : null}

                <div className="grid size-12 place-items-center rounded-2xl bg-[#16263f] text-white">
                  <CalendarCheck size={22} />
                </div>

                {view.kind === "lookup" ? (
                  <>
                    <h2 id={titleId} className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#16263f]">
                      Manage your booking
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                      Use your booking reference plus the email or phone number submitted with the consultation.
                    </p>
                    <form onSubmit={findBooking} className="mt-6 space-y-5">
                      <label className="block">
                        <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#475467]">Booking reference</span>
                        <input
                          value={reference}
                          onChange={(event) => setReference(event.target.value)}
                          placeholder="Example: IGS-2026-0142"
                          autoComplete="off"
                          className="mt-2 h-12 w-full rounded-xl border border-[#d0d5dd] px-4 text-sm text-[#16263f] outline-none transition focus:border-[#ff4b18] focus:ring-2 focus:ring-[#ff4b18]/15"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#475467]">Email or phone number</span>
                        <input
                          value={contact}
                          onChange={(event) => setContact(event.target.value)}
                          placeholder="Enter your email or phone number"
                          autoComplete="email"
                          className="mt-2 h-12 w-full rounded-xl border border-[#d0d5dd] px-4 text-sm text-[#16263f] outline-none transition focus:border-[#ff4b18] focus:ring-2 focus:ring-[#ff4b18]/15"
                        />
                      </label>
                      {error ? <AlertMessage message={error} /> : null}
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#ff4b18] px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-white transition hover:bg-[#dc3f13] disabled:cursor-wait disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18] focus-visible:ring-offset-2"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <CalendarCheck size={18} />}
                        {loading ? "Checking booking" : "Find my booking"}
                      </button>
                    </form>
                  </>
                ) : null}

                {view.kind === "details" ? (
                  <BookingDetails
                    booking={view.booking}
                    onReschedule={() => setView({ kind: "reschedule", booking: view.booking, ctx: view.ctx })}
                    onCancel={() => setView({ kind: "cancel", booking: view.booking, ctx: view.ctx })}
                  />
                ) : null}

                {view.kind === "reschedule" ? (
                  <RescheduleForm
                    booking={view.booking}
                    ctx={view.ctx}
                    onDone={(booking) => setView({ kind: "reschedule-done", booking })}
                  />
                ) : null}

                {view.kind === "cancel" ? (
                  <CancelForm
                    booking={view.booking}
                    ctx={view.ctx}
                    onBack={() => setView({ kind: "details", booking: view.booking, ctx: view.ctx })}
                    onDone={(booking) => setView({ kind: "cancel-done", booking })}
                  />
                ) : null}

                {view.kind === "reschedule-done" ? (
                  <CompletedState
                    title="Booking rescheduled"
                    message="Your preferred consultation schedule has been updated. The latest schedule is shown below."
                    booking={view.booking}
                    onClose={onClose}
                  />
                ) : null}

                {view.kind === "cancel-done" ? (
                  <CompletedState
                    title="Booking cancelled"
                    message="Your consultation booking has been cancelled. No appointment remains scheduled for this booking reference."
                    booking={view.booking}
                    onClose={onClose}
                  />
                ) : null}
              </div>
            </motion.section>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AlertMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
      <AlertCircle className="mt-0.5 shrink-0" size={18} />
      <span>{message}</span>
    </div>
  );
}

function BookingDetails({
  booking,
  onReschedule,
  onCancel,
  hideActions = false,
}: {
  booking: BookingRecord;
  onReschedule: () => void;
  onCancel: () => void;
  hideActions?: boolean;
}) {
  const reference = getBookingValue(booking, "bookingReference", "Booking Reference");
  const fullName = getBookingValue(booking, "fullName", "Full Name");
  const email = getBookingValue(booking, "emailAddress", "Email Address");
  const phone = getBookingValue(booking, "phoneNumber", "Phone Number");
  const projectType = getBookingValue(booking, "projectType", "Project Type");
  const location = getBookingValue(booking, "projectLocation", "Project Location");
  const rawStatus = getBookingValue(booking, "bookingStatus", "Booking Status");
  const status = rawStatus === "Not provided" ? "Pending confirmation" : rawStatus;
  const cancelled = status.toLowerCase().includes("cancel");
  const contact = email !== "Not provided" ? email : phone;

  return (
    <>
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#16263f]">Appointment request found</h2>
      <div className="mt-5 rounded-2xl border border-[#e4e7ec] bg-[#f8fafc] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs font-bold tracking-[0.08em] text-[#475467]">{reference}</p>
          <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] ${statusClasses(status)}`}>{status}</span>
        </div>
        <dl className="mt-4 divide-y divide-[#e4e7ec]">
          <InfoRow label="Client" value={fullName} />
          <InfoRow label="Project" value={projectType} />
          <InfoRow label="Preferred schedule" value={formatPreferredSchedule(booking)} />
          <InfoRow label="Contact" value={contact} />
          <InfoRow label="Location" value={location} />
        </dl>
      </div>

      {!cancelled && !hideActions ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onReschedule}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d0d5dd] bg-white px-5 text-sm font-extrabold text-[#16263f] transition hover:border-[#ff4b18] hover:text-[#ff4b18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18]"
          >
            <CalendarClock size={17} /> Reschedule booking
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-sm font-extrabold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <XCircle size={17} /> Cancel booking
          </button>
        </div>
      ) : null}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "Not provided") return null;
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[145px_1fr] sm:gap-5">
      <dt className="text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#98a2b3]">{label}</dt>
      <dd className="break-words text-sm font-bold text-[#344054] sm:text-right">{value}</dd>
    </div>
  );
}

function RescheduleForm({
  booking,
  ctx,
  onDone,
}: {
  booking: BookingRecord;
  ctx: LookupContext;
  onDone: (booking: BookingRecord) => void;
}) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const notesId = useId();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!date || !time) {
      setError("Choose a new consultation date and time.");
      return;
    }
    setError(null);
    setLoading(true);
    const newPreferredDate = toPlainDateValue(date);
    const newPreferredTime = toPlainTimeValue(time);
    try {
      const result = await callCRM<{ booking?: BookingRecord }>("rescheduleBooking", {
        bookingReference: booking.bookingReference,
        contact: ctx.contact,
        newPreferredDate,
        newPreferredTime,
        rescheduleNotes: notes.trim(),
      });
      const returned = (result.booking ?? result.data?.booking) as Record<string, unknown> | undefined;
      onDone({
        ...(returned ? normalizeBooking(returned, booking.bookingReference) : booking),
        preferredDate: newPreferredDate,
        preferredTime: newPreferredTime,
        bookingStatus: "Rescheduled",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not update the schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#16263f]">Reschedule booking</h2>
      <p className="mt-2 text-sm leading-6 text-[#667085]">Choose the new preferred schedule. Once confirmed here, your booking and calendar schedule are updated immediately.</p>
      <form onSubmit={submit} className="mt-5 space-y-5">
        <SchedulePicker
          date={date}
          time={time}
          onDateChange={setDate}
          onTimeChange={setTime}
          layout="stacked"
          required
        />
        <div>
          <label htmlFor={notesId} className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#475467]">Reason / notes</label>
          <textarea
            id={notesId}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Optional context for the IG Sabroso team"
            className="mt-2 w-full resize-none rounded-xl border border-[#d0d5dd] px-4 py-3 text-sm outline-none transition focus:border-[#ff4b18] focus:ring-2 focus:ring-[#ff4b18]/15"
          />
        </div>
        {error ? <AlertMessage message={error} /> : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#ff4b18] px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-white transition hover:bg-[#dc3f13] disabled:cursor-wait disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18] focus-visible:ring-offset-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <CalendarClock size={18} />}
          {loading ? "Updating schedule" : "Confirm new schedule"}
        </button>
      </form>
    </>
  );
}

function CancelForm({
  booking,
  ctx,
  onBack,
  onDone,
}: {
  booking: BookingRecord;
  ctx: LookupContext;
  onBack: () => void;
  onDone: (booking: BookingRecord) => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reasonId = useId();

  async function confirm() {
    setError(null);
    setLoading(true);
    try {
      const result = await callCRM<{ booking?: BookingRecord }>("cancelBooking", {
        bookingReference: booking.bookingReference,
        contact: ctx.contact,
        cancellationReason: reason.trim(),
      });
      const returned = (result.booking ?? result.data?.booking) as Record<string, unknown> | undefined;
      onDone({
        ...(returned ? normalizeBooking(returned, booking.bookingReference) : booking),
        bookingStatus: "Cancelled",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not cancel the booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#16263f]">Cancel booking?</h2>
      <p className="mt-2 text-sm leading-6 text-[#667085]">This immediately cancels booking <strong className="text-[#16263f]">{booking.bookingReference}</strong> and removes its scheduled Calendar event.</p>
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
        This action is final for this booking reference. You can submit a new consultation later if your plans change.
      </div>
      <div className="mt-5">
        <label htmlFor={reasonId} className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#475467]">Cancellation reason (optional)</label>
        <textarea
          id={reasonId}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          placeholder="Optional reason for the IG Sabroso team"
          className="mt-2 w-full resize-none rounded-xl border border-[#d0d5dd] px-4 py-3 text-sm outline-none transition focus:border-[#ff4b18] focus:ring-2 focus:ring-[#ff4b18]/15"
        />
      </div>
      {error ? <div className="mt-4"><AlertMessage message={error} /></div> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="min-h-12 rounded-xl border border-[#d0d5dd] bg-white px-5 text-sm font-extrabold text-[#16263f] transition hover:bg-[#f8fafc] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18]"
        >
          Keep booking
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={loading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          {loading ? <Loader2 className="animate-spin" size={17} /> : <XCircle size={17} />}
          {loading ? "Cancelling" : "Yes, cancel booking"}
        </button>
      </div>
    </>
  );
}

function CompletedState({
  title,
  message,
  booking,
  onClose,
}: {
  title: string;
  message: string;
  booking: BookingRecord;
  onClose: () => void;
}) {
  return (
    <div role="status" aria-live="polite">
      <div className="mt-4 grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <CheckCircle2 size={23} />
      </div>
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#16263f]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#667085]">{message}</p>
      <div className="mt-5 rounded-2xl border border-[#e4e7ec] bg-[#f8fafc] p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98a2b3]">Booking reference</p>
        <div className="mt-3"><ReferencePill reference={booking.bookingReference} /></div>
        {title.toLowerCase().includes("rescheduled") ? (
          <p className="mt-4 text-sm font-bold text-[#344054]">{formatPreferredSchedule(booking)}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 min-h-12 w-full rounded-xl bg-[#16263f] px-5 text-sm font-extrabold text-white transition hover:bg-[#223a5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18] focus-visible:ring-offset-2"
      >
        Done
      </button>
    </div>
  );
}

export function ReferencePill({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyReference}
      className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl border border-[#ffd1bf] bg-[#fff1eb] px-4 font-mono text-sm font-bold tracking-[0.06em] text-[#16263f] transition hover:border-[#ff4b18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4b18]"
      aria-label="Copy booking reference"
    >
      <span className="truncate">{reference}</span>
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white text-[#ff4b18]">
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </span>
    </button>
  );
}
