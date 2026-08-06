import type { ProjectStatus } from "@/content/projects";

export function StatusBadge({
  status,
  visualizationOnly = false,
}: {
  status: ProjectStatus;
  visualizationOnly?: boolean;
}) {
  const label =
    status === "ongoing" && visualizationOnly
      ? "Ongoing Project — Architectural Visualization"
      : status === "ongoing"
        ? "Ongoing Project"
        : "Completed Project";

  return (
    <span
      className={[
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]",
        status === "ongoing"
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
