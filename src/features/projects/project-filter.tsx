import { projectFilters, type ProjectFilter } from "./project-data";

export type ProjectFilterBarProps = {
  category: ProjectFilter;
  onCategoryChange: (category: ProjectFilter) => void;
};

export function ProjectFilterBar({ category, onCategoryChange }: ProjectFilterBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Project categories"
      className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-2"
    >
      {projectFilters.map((filter) => {
        const selected = filter.value === category;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onCategoryChange(filter.value)}
            className={`min-h-11 flex-none border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
