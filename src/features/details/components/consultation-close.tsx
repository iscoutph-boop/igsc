import { ArrowRight, Clock3, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { RefinementSection } from "./refinement-shell";

type ConsultationCloseProps = {
  onManageBooking: () => void;
};

const contactRows = [
  {
    label: "Phone",
    value: "0917 894 8989",
    href: "tel:+639178948989",
    icon: Phone,
  },
  {
    label: "Email",
    value: "letsbuild@igsabrosoconstruction.com",
    href: "mailto:letsbuild@igsabrosoconstruction.com",
    icon: Mail,
  },
  {
    label: "Office",
    value: "3rd Floor Keystone Bldg. B8 L3 Brgy. San Isidro Labrador 2, Dasmarinas City, Cavite",
    href: null,
    icon: MapPin,
  },
  {
    label: "Hours",
    value: "Monday to Saturday, 8:00 AM to 5:00 PM",
    href: null,
    icon: Clock3,
  },
];

export function ConsultationClose({ onManageBooking }: ConsultationCloseProps) {
  return (
    <RefinementSection id="contact" tone="muted">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        <div>
          <h2 className="max-w-[13ch] text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Ready to build with <span className="text-primary">confidence?</span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-lg leading-8 text-muted-foreground">
            Tell us about your project and get a clear next step from our team.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="/consultation"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
            >
              Book a consultation
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <button
              type="button"
              onClick={onManageBooking}
              className="min-h-11 rounded-full px-4 text-sm font-bold text-foreground underline decoration-primary underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Manage booking
            </button>
          </div>
        </div>

        <aside className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <UserRound aria-hidden="true" size={22} />
            </span>
            <h3 className="text-2xl font-bold text-foreground">Talk to our team</h3>
          </div>
          <dl className="mt-6">
            {contactRows.map((row) => {
              const Icon = row.icon;
              const content = row.href ? (
                <a
                  href={row.href}
                  className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              );

              return (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.5rem_1fr] gap-4 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <Icon aria-hidden="true" className="mt-0.5 text-primary" size={21} />
                  <div>
                    <dt className="sr-only">{row.label}</dt>
                    <dd className="text-sm leading-6 text-foreground">{content}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </aside>
      </div>
    </RefinementSection>
  );
}
