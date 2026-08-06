import officialLogo from "@/assets/igs-official-logo.png";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className={["flex items-center", compact ? "gap-2.5" : "gap-3.5"].join(" ")}>
      <img
        src={officialLogo}
        alt=""
        aria-hidden="true"
        className={
          compact
            ? "h-10 w-11 shrink-0 object-contain"
            : "h-12 w-[3.35rem] shrink-0 object-contain lg:h-[3.2rem] lg:w-[3.65rem]"
        }
      />
      <span className="min-w-0 leading-none">
        <span
          className={[
            "block whitespace-nowrap font-sans font-extrabold tracking-[-0.035em] text-[#152238]",
            compact ? "text-[0.72rem] sm:text-xs" : "text-[0.78rem] sm:text-sm lg:text-[0.9rem]",
          ].join(" ")}
        >
          IG SABROSO
          <span className={compact ? "block" : "ml-1.5 inline"}>CONSTRUCTION</span>
        </span>
        <span
          className={[
            "block font-semibold tracking-[0.025em] text-primary",
            compact ? "mt-1 text-[0.58rem]" : "mt-1.5 text-[0.62rem] sm:text-[0.68rem]",
          ].join(" ")}
        >
          Elevate Your Lifestyle
        </span>
      </span>
    </span>
  );
}
