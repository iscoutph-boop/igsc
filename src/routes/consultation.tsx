import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { CheckBookingModal, ReferencePill } from "@/components/booking-modals";
import { callCRM } from "@/lib/bookings";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Request a Consultation — IG Sabroso Construction" },
      { name: "description", content: "Let's create something extraordinary. Reach out to IG Sabroso Construction for residential, renovation, and civil works in Dasmariñas, Cavite." },
      { property: "og:title", content: "Consultation — IG Sabroso Construction" },
      { property: "og:description", content: "Tell us about your project — we'll get back to you shortly." },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      fullName: String(fd.get("fullName") ?? "").trim(),
      phoneNumber: String(fd.get("phoneNumber") ?? "").trim(),
      emailAddress: String(fd.get("emailAddress") ?? "").trim(),
      projectType: String(fd.get("projectType") ?? "").trim(),
      projectLocation: String(fd.get("projectLocation") ?? "").trim(),
      preferredDate: String(fd.get("preferredDate") ?? "").trim(),
      preferredTime: String(fd.get("preferredTime") ?? "").trim(),
      budgetRange: String(fd.get("budgetRange") ?? "").trim(),
      projectDetails: String(fd.get("projectDetails") ?? "").trim(),
      leadSource: "Website",
    };

    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await callCRM("createBooking", payload);
      const ref = data.bookingReference || data.booking?.bookingReference;
      if (!ref) throw new Error("We couldn't generate your booking reference. Please try again.");
      setBookingReference(ref);
      form.reset();
      // Scroll the confirmation card into view
      setTimeout(() => {
        document.getElementById("consultation-confirmation")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't submit your request right now. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SiteHeader />
      <main className="w-full">
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full gradient-brand opacity-20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full gradient-brand opacity-15 blur-3xl" />
          </div>

          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-primary font-semibold justify-center">
                <span className="h-px w-8 bg-primary" /> Get In Touch
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05]">
                Let's create something <span className="text-gradient-brand">extraordinary.</span>
              </h1>
              <p className="mt-6 text-muted-foreground text-base md:text-lg">
                Have a project in mind? Tell us a bit about it and our team will be in touch shortly.
              </p>
            </motion.div>

            <div className="mt-16 grid lg:grid-cols-5 gap-8">
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 glass rounded-3xl p-8 shadow-card h-fit"
              >
                <h2 className="font-display font-bold text-2xl">Contact Details</h2>
                <p className="text-sm text-muted-foreground mt-2">We're here Monday — Saturday.</p>

                <div className="mt-8 space-y-5">
                  <Info icon={Phone} label="Phone" value="+63 917 123 4567" />
                  <Info icon={Mail} label="Email" value="info@igsabrosoconstruction.com" />
                  <Info icon={MapPin} label="Location" value="Dasmariñas, Cavite, Philippines" />
                  <Info icon={Clock} label="Business Hours" value="Mon – Sat · 8:00 AM – 5:00 PM" />
                </div>

                <div className="mt-8 p-5 rounded-2xl gradient-brand text-primary-foreground">
                  <div className="text-xs uppercase tracking-wider opacity-80">Built to Last</div>
                  <div className="mt-1 font-display font-bold text-lg leading-tight">
                    Build with confidence,<br />build with Sabroso.
                  </div>
                </div>
              </motion.aside>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-3 glass rounded-3xl p-8 md:p-10 shadow-card relative overflow-hidden"
              >
                <h2 className="font-display font-bold text-2xl">Request a Consultation</h2>
                <p className="text-sm text-muted-foreground mt-1">Tell us about your project and our team will contact you to confirm your site visit.</p>

                <form onSubmit={onSubmit} className="mt-8 grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" name="fullName" placeholder="Juan Dela Cruz" required />
                  <Field label="Phone Number" name="phoneNumber" placeholder="+63 ..." required />
                  <Field label="Email Address" name="emailAddress" type="email" placeholder="you@example.com" className="sm:col-span-2" />

                  <div>
                    <Label>Project Type <span className="text-destructive">*</span></Label>
                    <select
                      name="projectType"
                      required
                      defaultValue=""
                      className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    >
                      <option value="" disabled>Select a service</option>
                      <option>Residential Construction</option>
                      <option>Renovation & Remodeling</option>
                      <option>Civil Works</option>
                      <option>Design-Build</option>
                      <option>Architectural Drawings</option>
                      <option>3D Rendering</option>
                    </select>
                  </div>

                  <Field label="Project Location" name="projectLocation" placeholder="City, Province" />

                  <Field label="Preferred Date" name="preferredDate" type="date" />
                  <Field label="Preferred Time" name="preferredTime" type="time" />

                  <div className="sm:col-span-2">
                    <Label>Budget Range</Label>
                    <select
                      name="budgetRange"
                      defaultValue=""
                      className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    >
                      <option value="">Prefer not to say</option>
                      <option>Below ₱500,000</option>
                      <option>₱500,000 – ₱1,000,000</option>
                      <option>₱1,000,000 – ₱3,000,000</option>
                      <option>₱3,000,000 – ₱5,000,000</option>
                      <option>Above ₱5,000,000</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Project Details <span className="text-destructive">*</span></Label>
                    <textarea
                      name="projectDetails"
                      required
                      rows={5}
                      placeholder="Tell us about your project, location, timeline, and preferred consultation schedule."
                      className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="sm:col-span-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
                      <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-destructive">We couldn't submit your request</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{errorMsg}</div>
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center gap-3 gradient-brand text-primary-foreground rounded-full pl-7 pr-2 py-3 font-semibold shadow-glow hover:scale-[1.02] transition disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {loading ? "Submitting..." : "Request Consultation"}
                      <span className="bg-background/25 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                      </span>
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {bookingReference && (
                    <motion.div
                      id="consultation-confirmation"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-8 rounded-3xl border border-primary/30 bg-[oklch(0.985_0.012_70)] dark:bg-surface/40 p-6 md:p-8 shadow-card"
                    >
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
                          <CheckCircle2 size={22} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-xl">Consultation Request Received</h3>
                          <p className="mt-1.5 text-sm text-muted-foreground">
                            Thank you. Your consultation request has been submitted successfully. Our team will contact you shortly to confirm your schedule.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-bold">Your Booking Reference</div>
                        <div className="mt-2.5">
                          <ReferencePill reference={bookingReference} />
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Please save this reference number. You'll need it to manage, reschedule, or cancel your booking.
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setManageOpen(true)}
                          className="inline-flex items-center gap-2 gradient-brand text-primary-foreground rounded-full px-5 py-3 text-sm font-semibold shadow-glow hover:scale-[1.02] transition"
                        >
                          <CalendarCheck size={16} /> Manage My Booking
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingReference(null)}
                          className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition"
                        >
                          Submit another request
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>

      <CheckBookingModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        initialReference={bookingReference ?? undefined}
      />
    </PageTransition>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-11 w-11 shrink-0 rounded-2xl gradient-brand text-primary-foreground flex items-center justify-center shadow-soft">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{children}</label>;
}

function Field({
  label, name, type = "text", placeholder, required, className = "",
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  );
}
