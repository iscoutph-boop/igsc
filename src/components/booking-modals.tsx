import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck, Loader2, CheckCircle2, MapPin, Clock, User, FileText } from "lucide-react";

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

const STATUSES = ["Pending Confirmation", "Confirmed", "Site Visit Scheduled"] as const;

export function CheckBookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEscClose(open, onClose);
  const [ref, setRef] = useState("");
  const [contact, setContact] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    client: string; service: string; schedule: string; status: string; notes: string;
  }>(null);

  useEffect(() => {
    if (!open) {
      setRef(""); setContact(""); setErr(null); setLoading(false); setResult(null);
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim() || !contact.trim()) {
      setErr("Please complete both fields to check your booking.");
      return;
    }
    setErr(null);
    setLoading(true);
    setTimeout(() => {
      const seed = (ref + contact).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
      const status = STATUSES[seed % STATUSES.length];
      setResult({
        client: contact.includes("@") ? contact.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Valued Client",
        service: ["Residential Build", "Renovation", "Construction Management"][seed % 3],
        schedule: ["Jan 15, 2026 · 10:00 AM", "Feb 02, 2026 · 02:00 PM", "Mar 09, 2026 · 09:30 AM"][seed % 3],
        status,
        notes: status === "Confirmed"
          ? "Our project lead will reach out 24 hours before the scheduled visit."
          : status === "Site Visit Scheduled"
          ? "Please prepare site access and a contact person for the walkthrough."
          : "Our team is reviewing your request and will confirm shortly.",
      });
      setLoading(false);
    }, 800);
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
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl gradient-brand text-primary-foreground shadow-soft">
                <CalendarCheck size={20} />
              </div>
              <h3 className="mt-4 text-2xl font-display font-bold">Manage Your Booking</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View your appointment details, reschedule your site visit, or cancel your booking.
              </p>

              {!result && (
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booking Reference</label>
                    <input
                      value={ref}
                      onChange={(e) => setRef(e.target.value)}
                      placeholder="e.g. IGS-2026-0142"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email or Phone</label>
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="you@email.com or 09XX XXX XXXX"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  {err && <p className="text-xs text-destructive">{err}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3.5 font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
                    {loading ? "Checking…" : "Find My Booking"}
                  </button>
                </form>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-border bg-surface/40 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-bold">Booking Found</div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                      result.status === "Confirmed" ? "bg-emerald-500 text-white" :
                      result.status === "Site Visit Scheduled" ? "bg-primary text-primary-foreground" :
                      "bg-amber-500 text-white"
                    }`}>{result.status}</span>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm">
                    <Row icon={<User size={14} />} label="Client" value={result.client} />
                    <Row icon={<FileText size={14} />} label="Service" value={result.service} />
                    <Row icon={<Clock size={14} />} label="Preferred Schedule" value={result.schedule} />
                    <Row icon={<MapPin size={14} />} label="Notes" value={result.notes} />
                  </div>
                  <button
                    onClick={() => { setResult(null); setRef(""); setContact(""); }}
                    className="mt-5 w-full text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                  >
                    Check another booking
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

const PROJECT_TYPES = ["Residential Build", "Renovation", "Construction Management", "Commercial", "Apartment"];

export function ConsultationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEscClose(open, onClose);
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: PROJECT_TYPES[0], date: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({ name: "", phone: "", email: "", type: PROJECT_TYPES[0], date: "", message: "" });
      setErr({}); setDone(false); setLoading(false);
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ne: Record<string, string> = {};
    if (!form.name.trim()) ne.name = "Required";
    if (!form.phone.trim()) ne.phone = "Required";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) ne.email = "Valid email required";
    if (!form.date) ne.date = "Required";
    setErr(ne);
    if (Object.keys(ne).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 700);
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

            <div className="px-7 pt-7 pb-7">
              {!done ? (
                <>
                  <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl gradient-brand text-primary-foreground shadow-soft">
                    <CalendarCheck size={20} />
                  </div>
                  <h3 className="mt-4 text-2xl font-display font-bold">Book a Consultation</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about your project — we'll get back within one business day.
                  </p>
                  <form onSubmit={submit} className="mt-5 grid grid-cols-2 gap-3">
                    <Input col={2} label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} err={err.name} />
                    <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} err={err.phone} />
                    <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} err={err.email} />
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Project Type</Label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <Input label="Preferred Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} err={err.date} />
                    <div className="col-span-2">
                      <Label>Message</Label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        placeholder="Tell us about your project, lot size, or budget range."
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3.5 font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-70"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
                      {loading ? "Submitting…" : "Request Consultation"}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="mt-4 text-2xl font-display font-bold">Request received.</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Thanks, {form.name.split(" ")[0]}. Our team will contact you at <span className="font-semibold text-foreground">{form.email}</span> within one business day.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3 text-sm font-semibold shadow-glow hover:scale-[1.02] transition"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</label>;
}

function Input({ label, value, onChange, err, type = "text", col = 1 }: { label: string; value: string; onChange: (v: string) => void; err?: string; type?: string; col?: 1 | 2 }) {
  return (
    <div className={col === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${err ? "border-destructive" : "border-border"}`}
      />
      {err && <p className="text-[11px] text-destructive mt-1">{err}</p>}
    </div>
  );
}
