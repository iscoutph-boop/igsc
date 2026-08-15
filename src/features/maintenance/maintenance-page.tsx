import {
  Code2,
  Globe,
  HardHat,
  Handshake,
  Mail,
  MessageCircle,
  Monitor,
  Palette,
  PencilRuler,
  ShieldCheck,
  Target,
} from "lucide-react";

import igsLogo from "@/assets/igs-official-logo.png";
import cdsBrand from "@/assets/cds-brand.png";
import heroResidence from "@/assets/real/maintenance-house-reference.png";

const CDS_EMAIL = "caballerodigitals@gmail.com";
const CDS_PHONE_DISPLAY = "+65 8780 5776";
const CDS_WHATSAPP = "https://wa.me/6587805776";
const CDS_SITE = "https://caballerodigitalsolutions.com";

const VALUES = [
  { icon: HardHat, label: ["QUALITY", "CONSTRUCTION"] },
  { icon: PencilRuler, label: ["INNOVATIVE", "DESIGN"] },
  { icon: ShieldCheck, label: ["BUILT ON", "INTEGRITY"] },
  { icon: Handshake, label: ["COMMITMENT TO", "EXCELLENCE"] },
];

const CDS_SERVICES = [
  { icon: Code2, label: "WEB DEVELOPMENT" },
  { icon: Palette, label: "UI/UX DESIGN" },
  { icon: Target, label: "BRANDING" },
  { icon: Monitor, label: "DIGITAL SOLUTIONS" },
];

export function MaintenancePage() {
  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-white">
      <main id="main-content" className="relative flex-1">
        <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-stretch lg:h-[clamp(665px,100vh,760px)] lg:grid-cols-[43.5%_56.5%]">
          <HeroArtwork className="absolute inset-0 hidden lg:block" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_29%,rgba(255,255,255,0.62)_42%,rgba(255,255,255,0.12)_58%,transparent_72%)] lg:block"
          />

          <section className="relative flex flex-col justify-start overflow-hidden px-6 py-10 sm:px-10 lg:min-h-0 lg:px-12 lg:pt-10 lg:pl-16 lg:pr-4 lg:pt-10">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src={igsLogo}
                  alt="IG Sabroso Construction logo"
                  width={72}
                  height={72}
                  className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
                />
                <span className="leading-tight">
                  <span className="block font-sans text-[clamp(0.92rem,1.7vw,1.18rem)] font-extrabold tracking-[-0.02em] text-[#152238]">
                    IG SABROSO CONSTRUCTION
                  </span>
                  <span className="mt-1 block text-[clamp(0.72rem,1.2vw,0.82rem)] font-semibold text-primary">
                    Elevate Your Lifestyle
                  </span>
                </span>
              </div>

              <span aria-hidden="true" className="mt-6 block h-[3px] w-16 bg-primary" />

              <h1 className="mt-5 max-w-[530px] font-display text-[clamp(2.6rem,5.2vw,3.55rem)] font-black uppercase leading-[0.93] tracking-[-0.015em] text-[#111827]">
                We&rsquo;re updating
                <br />
                <span className="text-primary">our website.</span>
                <br />
                We&rsquo;ll be back soon!
              </h1>

              <p className="mt-5 max-w-[26rem] text-[clamp(0.9rem,1.3vw,1rem)] leading-6 text-[#5b6472]">
                We&rsquo;re working behind the scenes to bring you a better experience with a fresh
                new look and improved features.
              </p>

              <div className="mt-8 lg:hidden">
                <MobileVisual />
              </div>

              <span aria-hidden="true" className="mt-6 block h-[3px] w-16 bg-primary" />

              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                {VALUES.map(({ icon: Icon, label }) => (
                  <li key={label.join(" ")} className="flex flex-col items-center text-center">
                    <Icon aria-hidden="true" size={28} strokeWidth={1.4} className="text-primary" />
                    <span className="mt-2 text-[0.63rem] font-bold uppercase leading-4 tracking-[0.04em] text-[#3c4553]">
                      {label[0]}
                      <br />
                      {label[1]}
                    </span>
                  </li>
                ))}
              </ul>

              <section
                aria-labelledby="reach-us"
                className="mt-7 rounded-lg border border-[#e6e9ed] bg-white p-3 shadow-[0_10px_30px_rgba(21,34,56,0.06)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(165px,auto)] lg:items-center lg:gap-3 lg:pr-1"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1eb]">
                    <Mail aria-hidden="true" size={20} className="text-primary" />
                  </span>
                  <span>
                    <h2 id="reach-us" className="font-sans text-base font-extrabold text-[#152238]">
                      Need to reach us?
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[#6b7280]">
                      You can still contact us for inquiries and consultations.
                    </p>
                  </span>
                </div>

                <div className="mt-4 grid min-w-0 gap-1 border-[#e6e9ed] lg:mt-0 lg:border-l lg:pl-4">
                  <a
                    href={`mailto:${CDS_EMAIL}`}
                    className="flex min-h-9 min-w-0 items-center gap-1.5 whitespace-nowrap text-[0.68rem] text-[#3c4553] transition hover:text-primary"
                  >
                    <Mail aria-hidden="true" size={15} className="shrink-0 text-[#6b7280]" />
                    <span>{CDS_EMAIL}</span>
                  </a>
                  <a
                    href={CDS_WHATSAPP}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-h-9 min-w-0 items-center gap-1.5 whitespace-nowrap text-[0.68rem] text-[#3c4553] transition hover:text-primary"
                  >
                    <MessageCircle
                      aria-hidden="true"
                      size={15}
                      className="shrink-0 text-[#6b7280]"
                    />
                    <span>{CDS_PHONE_DISPLAY}</span>
                  </a>
                </div>
              </section>
            </div>
          </section>

          <div className="relative z-10 hidden min-h-0 lg:block">
            <div className="absolute bottom-7 right-[18%] flex justify-end">
              <ThankYouPanel />
            </div>
          </div>
        </div>
      </main>

      <CaballeroFooter />
    </div>
  );
}

function HeroArtwork({ className = "" }: { className?: string }) {
  return (
    <div className={["overflow-hidden", className].join(" ")}>
      <img
        src={heroResidence}
        alt="IG Sabroso residence shown as a professional architectural pencil sketch transitioning into the finished home"
        className="absolute inset-0 h-full w-full object-cover object-[58%_52%] lg:object-[center_52%]"
      />
    </div>
  );
}

function MobileVisual() {
  return (
    <div>
      <HeroArtwork className="relative h-[clamp(285px,78vw,350px)] w-full rounded-lg" />
      <div className="mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-[320px]">
        <ThankYouPanel compact />
      </div>
    </div>
  );
}

function ThankYouPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby="thank-you"
      className={[
        "relative rounded-md bg-[rgba(23,28,36,0.9)] text-center text-white backdrop-blur-sm",
        compact ? "px-4 pb-4 pt-7" : "w-[280px] max-w-[calc(100vw-2rem)] px-7 pb-6 pt-8",
      ].join(" ")}
    >
      <span className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary">
        <HardHat aria-hidden="true" size={18} className="text-white" />
      </span>
      <h2
        id="thank-you"
        className={[
          "font-display font-black uppercase tracking-[0.01em]",
          compact ? "text-xl" : "text-2xl leading-[1.2]",
        ].join(" ")}
      >
        Thank you
      </h2>
      <p className="mt-2 text-xs leading-4 text-white/85">for your patience and support.</p>
      <p className="mt-1 text-xs font-semibold leading-4 text-primary">
        Great things are coming soon!
      </p>
    </section>
  );
}

function CaballeroFooter() {
  return (
    <footer className="w-full bg-[#171c24] px-6 py-8 text-center text-white sm:px-10">
      <a
        href={CDS_SITE}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex rounded-md focus-visible:outline-offset-4"
      >
        <span className="maintenance-cds-brand-lockup">
          <img
            src={cdsBrand}
            alt="Caballero Digital Solutions CDS brand lockup"
            className="maintenance-cds-brand-image"
          />
        </span>
      </a>

      <p className="mt-2">
        <a
          href={CDS_SITE}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[#e03a2f] hover:underline"
        >
          caballerodigitalsolutions.com
        </a>
      </p>

      <ul className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {CDS_SERVICES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-[0.7rem] font-bold tracking-wide">
            <Icon aria-hidden="true" size={16} className="text-[#e03a2f]" />
            {label}
          </li>
        ))}
      </ul>

      <ul className="mx-auto mt-5 flex max-w-3xl flex-col items-center justify-center gap-1 text-sm text-white/85 sm:flex-row sm:gap-8">
        <li>
          <a
            href={`mailto:${CDS_EMAIL}`}
            className="flex min-h-11 items-center gap-2 hover:text-white"
          >
            <Mail aria-hidden="true" size={16} className="text-white/70" />
            <span>{CDS_EMAIL}</span>
          </a>
        </li>
        <li>
          <a
            href={CDS_WHATSAPP}
            target="_blank"
            rel="noreferrer noopener"
            className="flex min-h-11 items-center gap-2 hover:text-white"
          >
            <MessageCircle aria-hidden="true" size={16} className="text-white/70" />
            {CDS_PHONE_DISPLAY}
          </a>
        </li>
        <li>
          <a
            href={CDS_SITE}
            target="_blank"
            rel="noreferrer noopener"
            className="flex min-h-11 items-center gap-2 hover:text-white"
          >
            <Globe aria-hidden="true" size={16} className="text-white/70" />
            caballerodigitalsolutions.com
          </a>
        </li>
      </ul>

      <p className="mt-5 text-xs text-white/70">
        Proudly designed and developed by{" "}
        <a
          href={CDS_SITE}
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-[#e03a2f] hover:underline"
        >
          Caballero Digital Solutions
        </a>
      </p>
    </footer>
  );
}
