import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  accent: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  accent,
  eyebrow,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header className={cn("space-y-4", centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary",
            centered && "justify-center",
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-primary" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-bold leading-[1.02] text-foreground sm:text-5xl lg:text-[3.35rem]">
        {title} <span className="text-primary">{accent}</span>
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-[62ch] text-base leading-7 text-muted-foreground sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
