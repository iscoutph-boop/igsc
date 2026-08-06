import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarSearch, Mail, MapPin, Phone } from "lucide-react";
import turnoverTeam from "@/assets/real/turnover-team.webp";
import {
  IGS_ADDRESS,
  IGS_EMAIL,
  IGS_MAPS_URL,
  IGS_PHONE_DISPLAY,
  IGS_PHONE_TEL,
} from "@/lib/contact";
import { RefinementSection } from "./refinement-shell";

export function ConsultationClose({ onManageBooking }: { onManageBooking: () => void }) {
  return (
    <RefinementSection id="contact">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-[#fff1eb] shadow-[0_22px_70px_rgba(21,34,56,0.09)]">
        <div className="grid lg:grid-cols-[1fr_0.9fr]">
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Contact IG Sabroso
            </p>
            <h2 className="mt-3 max-w-xl font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#152238] sm:text-6xl">
              Let’s build something great together.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5f6b78]">
              Share your project type, location, budget range, and preferred timeline. The team will
              review your inquiry and contact you to confirm the next step.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/consultation"
                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-extrabold text-white"
              >
                Book a consultation
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <button
                type="button"
                onClick={onManageBooking}
                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-xl border border-[#d8c9c1] bg-white px-6 text-sm font-extrabold text-[#152238]"
              >
                <CalendarSearch aria-hidden="true" size={18} />
                Manage booking
              </button>
            </div>

            <div className="mt-9 grid gap-4 text-sm text-[#53606e] sm:grid-cols-2">
              <a
                href={`tel:${IGS_PHONE_TEL}`}
                className="flex items-start gap-3 hover:text-primary"
              >
                <Phone aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-primary" />
                <span>{IGS_PHONE_DISPLAY}</span>
              </a>
              <a href={`mailto:${IGS_EMAIL}`} className="flex items-start gap-3 hover:text-primary">
                <Mail aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-primary" />
                <span className="break-all">{IGS_EMAIL}</span>
              </a>
              <a
                href={IGS_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 sm:col-span-2 hover:text-primary"
              >
                <MapPin aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-primary" />
                <span>{IGS_ADDRESS}</span>
              </a>
            </div>
          </div>

          <div className="min-h-[420px]">
            <img
              src={turnoverTeam}
              alt="IG Sabroso team and clients during a real project turnover event"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </RefinementSection>
  );
}
