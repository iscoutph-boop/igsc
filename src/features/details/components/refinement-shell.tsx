import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RefinementSectionProps = {
  id: string;
  children: ReactNode;
  tone?: "default" | "muted" | "plain";
  className?: string;
};

const toneClasses = {
  default: "bg-background",
  muted: "bg-secondary/45",
  plain: "bg-transparent",
};

export function RefinementSection({
  id,
  children,
  tone = "default",
  className,
}: RefinementSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 sm:py-24 lg:py-28", toneClasses[tone], className)}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">{children}</div>
    </section>
  );
}
