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
import residence from "@/assets/maintenance-residence.jpg";
import caballeroLogo from "@/assets/caballero-logo.png.asset.json";

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
      <main className="relative flex-1">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-stretch md:grid-cols-2">
          {/* LEFT */}
          <div className="order-1 flex flex-col justify-center px-6 py-10 sm:px-10 md:py-16 lg:px-16 lg:py-20">
            <div className="flex items-center gap-3">
              <img
                src={igsLogo}
                alt="IG Sabroso Construction logo"
                width={72}
                height={72}
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />
              <span className="leading-tight">
                <span className="block font-sans text-[clamp(0.95rem,3.4vw,1.35rem)] font-extrabold tracking-[-0.02em] text-[#152238]">
                  IG SABROSO CONSTRUCTION
                </span>
                <span className="mt-1 block text-[clamp(0.75rem,2.6vw,0.95rem)] font-semibold text-primary">
                  Elevate Your Lifestyle
                </span>
              </span>
            </div>

            <span aria-hidden="true" className="mt-7 block h-[3px] w-20 bg-primary" />

            <h1 className="mt-6 font-display text-[clamp(2.35rem,9vw,4.4rem)] font-black uppercase leading-[0.95] tracking-[-0.01em] text-[#111827]">
              We&rsquo;re updating
              <br />
              <span className="text-primary">our website.</span>
              <br />
              We&rsquo;ll be back soon!
            </h1>

            <p className="mt-6 max-w-md text-[clamp(0.95rem,3vw,1.05rem)] leading-7 text-[#5b6472]">
              We&rsquo;re working behind the scenes to bring you a better experience with a fresh
              new look and improved features.
            </p>

            {/* Mobile image + thank you panel */}
            <div className="order-2 mt-8 md:hidden">
              <MobileVisual />
            </div>

            <span aria-hidden="true" className="mt-9 block h-[3px] w-20 bg-primary" />

            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4">
              {VALUES.map(({ icon: Icon, label }) => (
                <li key={label.join(" ")} className="flex flex-col items-center text-center">
                  <Icon aria-hidden="true" size={30} strokeWidth={1.4} className="text-primary" />
                  <span className="mt-3 text-[0.68rem] font-bold uppercase leading-4 tracking-[0.04em] text-[#3c4553]">
                    {label[0]}
                    <br />
                    {label[1]}
                  </span>
                </li>
              ))}
            </ul>

            <section
              aria-labelledby="reach-us"
              className="mt-9 rounded-lg border border-[#e6e9ed] bg-white p-5 shadow-[0_10px_30px_rgba(21,34,56,0.06)] sm:flex sm:items-center sm:gap-6"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff1eb]">
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
              <div className="mt-4 grid gap-2 border-[#e6e9ed] sm:mt-0 sm:border-l sm:pl-6">
                <a
                  href={`mailto:${CDS_EMAIL}`}
                  className="flex min-h-11 items-center gap-3 text-sm text-[#3c4553] transition hover:text-primary"
                >
                  <Mail aria-hidden="true" size={17} className="shrink-0 text-[#6b7280]" />
                  <span className="break-all">{CDS_EMAIL}</span>
                </a>
                <a
                  href={CDS_WHATSAPP}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex min-h-11 items-center gap-3 text-sm text-[#3c4553] transition hover:text-primary"
                >
                  <MessageCircle aria-hidden="true" size={17} className="shrink-0 text-[#6b7280]" />
                  <span>{CDS_PHONE_DISPLAY}</span>
                </a>
              </div>
            </section>
          </div>

          {/* RIGHT (desktop visual) */}
          <div className="relative hidden md:block">
            <img
              src={residence}
              alt="Modern two-storey IG Sabroso residential project with wood accent facade and carport"
              width={1280}
              height={1600}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.65)_18%,rgba(255,255,255,0.05)_45%,transparent_70%)]"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-end p-6 lg:p-10">
              <ThankYouPanel />
            </div>
          </div>
        </div>
      </main>

      <CaballeroFooter />
    </div>
  );
}

function MobileVisual() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={residence}
        alt="Modern two-storey IG Sabroso residential project with wood accent facade and carport"
        width={1280}
        height={1600}
        loading="lazy"
        className="h-[clamp(230px,62vw,340px)] w-full object-cover"
      />
      <div className="absolute inset-x-3 bottom-3">
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
        "relative rounded-md bg-[rgba(23,28,36,0.82)] text-center text-white backdrop-blur-sm",
        compact ? "px-4 pb-4 pt-7" : "w-full max-w-sm px-8 pb-8 pt-10 lg:max-w-md",
      ].join(" ")}
    >
      <span className="absolute left-1/2 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary">
        <HardHat aria-hidden="true" size={20} className="text-white" />
      </span>
      <h2
        id="thank-you"
        className={[
          "font-display font-black uppercase tracking-[0.01em]",
          compact ? "text-xl" : "text-[clamp(1.4rem,2vw,1.9rem)]",
        ].join(" ")}
      >
        Thank you
      </h2>
      <p className="mt-2 text-sm text-white/85">for your patience and support.</p>
      <p className="mt-1 text-sm font-semibold text-primary">Great things are coming soon!</p>
    </section>
  );
}

function CaballeroFooter() {
  return (
    <footer className="w-full bg-[#171c24] px-6 py-10 text-center text-white sm:px-10">
      <a
        href={CDS_SITE}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex rounded-md focus-visible:outline-offset-4"
      >
        <img
          src={caballeroLogo.url}
          alt="Caballero Digital Solutions logo"
          width={494}
          height={252}
          loading="lazy"
          className="h-16 w-auto object-contain sm:h-20"
        />
      </a>
      <p className="mt-3">
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
            <span className="break-all">{CDS_EMAIL}</span>
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
