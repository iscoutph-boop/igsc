import type { ReactNode } from "react";

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  action,
  className = "",
  level = 2,
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  level?: 1 | 2;
}) {
  const HeadingTag = level === 1 ? "h1" : "h2";

  return (
    <div
      className={[
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" ? "mx-auto max-w-3xl text-center md:block" : "",
        className,
      ].join(" ")}
    >
      <div className={align === "center" ? "mx-auto" : "max-w-3xl"}>
        {label ? (
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">{label}</p>
        ) : null}
        <HeadingTag className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </HeadingTag>
        {description ? (
          <div className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
