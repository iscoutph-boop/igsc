import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import consultationImage from "@/assets/real/turnover-ribbon.webp";
import { CheckBookingModal, ReferencePill } from "@/components/booking-modals";
import { PageTransition } from "@/components/page-transition";
import { SchedulePicker } from "@/components/schedule-picker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { callCRM } from "@/lib/bookings";
import { trackEvent } from "@/lib/analytics";
import { buildCanonicalUrl, DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";
import {
  IGS_ADDRESS,
  IGS_EMAIL,
  IGS_MAPS_URL,
  IGS_PHONE_DISPLAY,
  IGS_PHONE_TEL,
} from "@/lib/contact";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Book a Consultation | IG Sabroso Construction" },
      {
        name: "description",
        content:
          "Tell IG Sabroso Construction about your project location, service needs, area, budget range, and preferred consultation schedule.",
      },
      { property: "og:title", content: "Book a Consultation | IG Sabroso Construction" },
      { property: "og:url", content: buildCanonicalUrl("/consultation") },
      {
        property: "og:description",
        content: "Start a clear project conversation with the IG Sabroso team.",
      },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: buildCanonicalUrl("/consultation") }],
  }),
  component: ConsultationPage,
});

export function ConsultationPage() {
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  return (
    <PageTransition>
      <SiteHeader />
      <main className="bg-[#f7f8fa]">
        <section className="py-14 sm:py-18 lg:py-22">
          <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
            <div className="max-w-4xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Project consultation
              </p>
              <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.045em] text-[#152238] sm:text-6xl lg:text-7xl">
                Let’s build something great together.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#667085] sm:text-lg">
                Share the essential project details. The IG Sabroso team will review your inquiry
                and contact you to confirm the next step or preferred appointment schedule.
              </p>
            </div>

            <div className="mt-10 grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <aside className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_18px_54px_rgba(21,34,56,0.08)] lg:sticky lg:top-28">
                <img
                  src={consultationImage}
                  alt="IG Sabroso team and client at a real completed-project turnover"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-7 sm:p-8">
                  <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-[#152238]">
                    Contact details
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#667085]">
                    Office hours are Monday to Saturday, 8:00 AM to 5:00 PM.
                  </p>
                  <div className="mt-7 space-y-5 text-sm text-[#53606e]">
                    <a
                      href={`tel:${IGS_PHONE_TEL}`}
                      className="flex items-start gap-3 hover:text-primary"
                    >
                      <Phone
                        aria-hidden="true"
                        size={19}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <span>{IGS_PHONE_DISPLAY}</span>
                    </a>
                    <a
                      href={`mailto:${IGS_EMAIL}`}
                      className="flex items-start gap-3 hover:text-primary"
                    >
                      <Mail aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-primary" />
                      <span className="break-all">{IGS_EMAIL}</span>
                    </a>
                    <a
                      href={IGS_MAPS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-3 hover:text-primary"
                    >
                      <MapPin
                        aria-hidden="true"
                        size={19}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <span>{IGS_ADDRESS}</span>
                    </a>
                    <div className="flex items-start gap-3">
                      <Clock
                        aria-hidden="true"
                        size={19}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <span>Monday to Saturday, 8:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                  <div className="mt-7 rounded-2xl bg-[#fff1eb] p-5">
                    <div className="flex items-center gap-3 text-sm font-extrabold text-[#152238]">
                      <ShieldCheck aria-hidden="true" size={20} className="text-primary" />
                      Your project information stays private.
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[#667085]">
                      Details are used only to review and respond to your consultation request.
                    </p>
                  </div>
                </div>
              </aside>

              <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(21,34,56,0.08)] sm:p-8 lg:p-10">
                {bookingReference ? (
                  <SuccessPanel
                    bookingReference={bookingReference}
                    onManage={() => setManageOpen(true)}
                    onReset={() => setBookingReference(null)}
                  />
                ) : (
                  <ConsultationForm onSuccess={setBookingReference} />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <CheckBookingModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        initialReference={bookingReference ?? undefined}
      />
    </PageTransition>
  );
}

export function ConsultationForm({ onSuccess }: { onSuccess: (reference: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  const [preferredTime, setPreferredTime] = useState("");
  const submissionIdRef = useRef<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get("companyWebsite") ?? "").trim();

    if (!submissionIdRef.current) submissionIdRef.current = crypto.randomUUID();
    const payload = {
      submissionId: submissionIdRef.current,
      fullName: String(formData.get("fullName") ?? "").trim(),
      phoneNumber: String(formData.get("phoneNumber") ?? "").trim(),
      emailAddress: String(formData.get("emailAddress") ?? "").trim(),
      projectType: String(formData.get("projectType") ?? "").trim(),
      projectLocation: String(formData.get("projectLocation") ?? "").trim(),
      preferredService: String(formData.get("preferredService") ?? "").trim(),
      approximateArea: String(formData.get("approximateArea") ?? "").trim(),
      preferredDate: String(formData.get("preferredDate") ?? "").trim(),
      preferredTime: String(formData.get("preferredTime") ?? "").trim(),
      budgetRange: String(formData.get("budgetRange") ?? "").trim(),
      projectDetails: String(formData.get("projectDetails") ?? "").trim(),
      privacyConsent: formData.get("privacyConsent") === "accepted" ? "accepted" : "",
      leadSource: "Website",
      companyWebsite: honeypot,
    };

    if (!payload.preferredDate || !payload.preferredTime) {
      setErrorMessage("Select a preferred consultation date and time.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    trackEvent("consultation_form_start", { projectType: payload.projectType });
    try {
      const response = await callCRM("createBooking", payload);
      const reference = response.bookingReference || response.booking?.bookingReference;
      if (!reference) throw new Error("A booking reference was not returned.");
      form.reset();
      submissionIdRef.current = null;
      setPreferredDate(undefined);
      setPreferredTime("");
      trackEvent("consultation_form_success", { projectType: payload.projectType });
      onSuccess(reference);
    } catch (error) {
      trackEvent("consultation_form_error", { projectType: payload.projectType });
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "We could not submit your request. Please try again or contact the team directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#152238]">
          Request a consultation
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#667085]">
          Required fields are marked. Use verified information so the team can respond accurately.
        </p>
      </div>

      <TextField label="Full name" name="fullName" autoComplete="name" required />
      <TextField label="Mobile number" name="phoneNumber" type="tel" autoComplete="tel" required />
      <TextField
        label="Email address"
        name="emailAddress"
        type="email"
        autoComplete="email"
        className="sm:col-span-2"
      />

      <SelectField label="Project type" name="projectType" required>
        <option value="">Select project type</option>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Renovation</option>
        <option>Multi-unit / Apartment</option>
        <option>Other</option>
      </SelectField>

      <SelectField label="Preferred service" name="preferredService" required>
        <option value="">Select service</option>
        <option>General Contracting</option>
        <option>Design-Build Services</option>
        <option>Construction Management</option>
        <option>Renovation and Remodeling</option>
        <option>Project Consultation</option>
      </SelectField>

      <TextField
        label="Project location"
        name="projectLocation"
        placeholder="Barangay, city, province"
        required
      />
      <TextField
        label="Approximate lot or floor area"
        name="approximateArea"
        placeholder="Example: 180 sqm"
      />

      <div className="sm:col-span-2">
        <SchedulePicker
          date={preferredDate}
          time={preferredTime}
          onDateChange={setPreferredDate}
          onTimeChange={setPreferredTime}
          dateName="preferredDate"
          timeName="preferredTime"
          required
        />
      </div>

      <SelectField label="Budget range" name="budgetRange" className="sm:col-span-2">
        <option value="">Prefer not to say</option>
        <option>Below PHP 1,000,000</option>
        <option>PHP 1,000,000 - PHP 3,000,000</option>
        <option>PHP 3,000,000 - PHP 5,000,000</option>
        <option>PHP 5,000,000 - PHP 10,000,000</option>
        <option>Above PHP 10,000,000</option>
      </SelectField>

      <label className="sm:col-span-2">
        <span className="text-sm font-bold text-[#344054]">
          Project description <span className="text-primary">*</span>
        </span>
        <textarea
          name="projectDetails"
          required
          rows={6}
          placeholder="Describe the project, priorities, current site condition, target timeline, and important requirements."
          className="mt-2 w-full resize-y rounded-xl border border-[#dce1e6] bg-white px-4 py-3 text-sm leading-7 text-foreground outline-none transition placeholder:text-[#98a2b3] focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company website
          <input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="sm:col-span-2 flex items-start gap-3 rounded-xl bg-[#f7f8fa] p-4 text-sm leading-6 text-[#53606e]">
        <input
          type="checkbox"
          name="privacyConsent"
          value="accepted"
          required
          className="mt-1 size-4 shrink-0 accent-[#f4511e]"
        />
        <span>
          I have read the privacy notice and consent to IG Sabroso Construction using these details
          to review and respond to my project inquiry.
        </span>
      </label>

      {errorMessage ? (
        <div
          role="alert"
          className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle aria-hidden="true" size={19} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_14px_38px_rgba(244,81,30,0.2)] transition hover:bg-[#dc3f13] disabled:cursor-wait disabled:opacity-65"
        >
          {loading ? (
            <>
              <Loader2 aria-hidden="true" size={19} className="animate-spin" />
              Submitting request
            </>
          ) : (
            <>
              Submit consultation request
              <ArrowRight aria-hidden="true" size={19} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-[#344054]">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        {...props}
        className="mt-2 h-12 w-full rounded-xl border border-[#dce1e6] bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-[#98a2b3] focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  className = "",
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-[#344054]">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 h-12 w-full rounded-xl border border-[#dce1e6] bg-white px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {children}
      </select>
    </label>
  );
}

function SuccessPanel({
  bookingReference,
  onManage,
  onReset,
}: {
  bookingReference: string;
  onManage: () => void;
  onReset: () => void;
}) {
  return (
    <section id="consultation-confirmation" aria-live="polite">
      <span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <CheckCircle2 aria-hidden="true" size={27} />
      </span>
      <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-[#152238]">
        Consultation request received.
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#667085]">
        The IG Sabroso team will review your project details and contact you to confirm your
        preferred appointment schedule.
      </p>
      <div className="mt-7 rounded-2xl border border-border bg-[#f7f8fa] p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
          Booking reference
        </p>
        <div className="mt-3">
          <ReferencePill reference={bookingReference} />
        </div>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          Save this reference to review, reschedule, or cancel the appointment request.
        </p>
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onManage}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white"
        >
          <CalendarCheck aria-hidden="true" size={18} />
          Manage booking
        </button>
        <button
          type="button"
          onClick={onReset}
          className="min-h-12 rounded-xl border border-border bg-white px-5 text-sm font-extrabold text-[#152238]"
        >
          Submit another request
        </button>
      </div>
    </section>
  );
}
