import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarCheck,
  Loader2,
  CheckCircle2,
  MapPin,
  Clock,
  User,
  FileText,
  AlertCircle,
  CalendarClock,
  XCircle,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { findBooking, updateBooking, type BookingRecord } from "@/lib/bookings";

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

type View =
  | { kind: "lookup" }
  | { kind: "details"; booking: BookingRecord }
  | { kind: "reschedule"; booking: BookingRecord }
  | { kind: "cancel"; booking: BookingRecord }
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
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setView({ kind: "lookup" });
      setRef(""); setContact(""); setErr(null); setLoading(false); setNotFound(false);
    } else if (initialReference) {
      setRef(initialReference);
    }
  }, [open, initialReference]);

  const submitLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    if (!ref.trim() || !contact.trim()) {
      setErr("Please complete both fields to find your booking.");
      return;
    }
    setErr(null);
    setLoading(true);
    setTimeout(() => {
      const found = findBooking(ref, contact);
      setLoading(false);
      if (found) {
        setView({ kind: "details", booking: found });
      } else {
        setNotFound(true);
      }
    }, 500);
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

                    {notFound && (
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
                        <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-destructive">Booking not found</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Please check your booking reference and contact detail.
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3.5 font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-70"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
                      {loading ? "Searching…" : "Find My Booking"}
                    </button>
                  </form>
                </>
              )}

              {view.kind === "details" && (
                <DetailsCard
                  booking={view.booking}
                  onReschedule={() => setView({ kind: "reschedule", booking: view.booking })}
                  onCancel={() => setView({ kind: "cancel", booking: view.booking })}
                />
              )}

              {view.kind === "reschedule" && (
                <RescheduleForm
                  booking={view.booking}
                  onDone={(updated) => setView({ kind: "reschedule-done", booking: updated })}
                />
              )}

              {view.kind === "cancel" && (
                <CancelConfirm
                  booking={view.booking}
                  onBack={() => setView({ kind: "details", booking: view.booking })}
                  onDone={(updated) => setView({ kind: "cancel-done", booking: updated })}
                />
              )}

              {view.kind === "reschedule-done" && (
                <ResultCard
                  tone="success"
                  title="Reschedule request received"
                  message="Your reschedule request has been received. Our team will contact you to confirm the new schedule."
                  reference={view.booking.reference}
                  onClose={onClose}
                />
              )}

              {view.kind === "cancel-done" && (
                <ResultCard
                  tone="info"
                  title="Cancellation request received"
                  message="Your booking cancellation request has been received."
                  reference={view.booking.reference}
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
  if (status === "Confirmed" || status === "Site Visit Scheduled") return "bg-emerald-500 text-white";
  if (status === "Cancelled" || status === "Cancellation Requested") return "bg-destructive text-destructive-foreground";
  if (status === "Reschedule Requested") return "bg-primary text-primary-foreground";
  return "bg-amber-500 text-white";
}

function DetailsCard({
  booking,
  onReschedule,
  onCancel,
}: {
  booking: BookingRecord;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  const submitted = new Date(booking.submittedAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
  const cancelled = booking.status === "Cancelled" || booking.status === "Cancellation Requested";

  return (
    <>
      <h3 className="mt-4 text-2xl font-display font-bold">Your Booking</h3>
      <p className="mt-1 text-sm text-muted-foreground">Reference {booking.reference}</p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 rounded-2xl border border-primary/20 bg-[oklch(0.985_0.012_70)] dark:bg-surface/40 p-5 shadow-soft"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-bold">Booking Found</div>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${statusBadgeClasses(booking.status)}`}>
            {booking.status}
          </span>
        </div>
        <div className="mt-3 grid gap-3 text-sm">
          <Row icon={<User size={14} />} label="Client" value={booking.client} />
          <Row icon={<FileText size={14} />} label="Project Type" value={booking.projectType} />
          <Row icon={<Clock size={14} />} label="Submitted" value={submitted} />
          <Row
            icon={<CalendarClock size={14} />}
            label="Appointment Schedule"
            value={booking.schedule ?? "To be confirmed by our team"}
          />
          {booking.reschedule && (
            <Row
              icon={<MapPin size={14} />}
              label="Reschedule Requested"
              value={`${booking.reschedule.date} · ${booking.reschedule.time}`}
            />
          )}
        </div>
      </motion.div>

      {!cancelled && (
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <button
            onClick={onReschedule}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-surface border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition"
          >
            <CalendarClock size={16} className="text-primary" /> Reschedule Booking
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/40 text-destructive px-5 py-3 text-sm font-semibold hover:bg-destructive/10 transition"
          >
            <XCircle size={16} /> Cancel Booking
          </button>
        </div>
      )}
    </>
  );
}

function RescheduleForm({ booking, onDone }: { booking: BookingRecord; onDone: (b: BookingRecord) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setErr("Please choose a preferred date and time.");
      return;
    }
    setErr(null);
    setLoading(true);
    setTimeout(() => {
      const updated = updateBooking(booking.reference, {
        status: "Reschedule Requested",
        reschedule: { date, time, notes, requestedAt: new Date().toISOString() },
      });
      setLoading(false);
      onDone(updated ?? booking);
    }, 500);
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
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any details about the new schedule (optional)."
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3.5 font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-70"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarClock size={16} />}
          {loading ? "Submitting…" : "Submit Reschedule Request"}
        </button>
      </form>
    </>
  );
}

function CancelConfirm({
  booking,
  onBack,
  onDone,
}: {
  booking: BookingRecord;
  onBack: () => void;
  onDone: (b: BookingRecord) => void;
}) {
  const [loading, setLoading] = useState(false);
  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = updateBooking(booking.reference, {
        status: "Cancellation Requested",
        cancelledAt: new Date().toISOString(),
      });
      setLoading(false);
      onDone(updated ?? booking);
    }, 500);
  };

  return (
    <>
      <h3 className="mt-4 text-2xl font-display font-bold">Cancel Booking?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Are you sure you want to cancel booking <span className="font-semibold text-foreground">{booking.reference}</span>? This cannot be undone.
      </p>

      <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          You can always submit a new consultation request later if you change your mind.
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-surface border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition"
        >
          Keep Booking
        </button>
        <button
          onClick={confirm}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-destructive text-destructive-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-70"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
          {loading ? "Submitting…" : "Confirm Cancellation"}
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

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
        <div className="text-sm font-semibold break-words">{value}</div>
      </div>
    </div>
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

// ConsultationModal kept for compatibility (not used by any current page).
const PROJECT_TYPES = ["Residential Build", "Renovation", "Construction Management", "Commercial", "Apartment"];
export function ConsultationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEscClose(open, onClose);
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: PROJECT_TYPES[0], date: "", message: "" });
  const [done, setDone] = useState(false);
  useEffect(() => { if (!open) { setDone(false); } }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="relative bg-background rounded-3xl shadow-glow border border-border overflow-hidden"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition">
              <X size={16} />
            </button>
            <div className="px-7 pt-7 pb-7">
              <h3 className="text-2xl font-display font-bold">Request a Consultation</h3>
              <p className="mt-1 text-sm text-muted-foreground">Tell us about your project and our team will contact you to confirm your site visit.</p>
              {!done ? (
                <button onClick={() => setDone(true)} className="mt-6 inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3 text-sm font-semibold">Submit</button>
              ) : (
                <p className="mt-6 text-sm">Submitted — {form.name}</p>
              )}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
