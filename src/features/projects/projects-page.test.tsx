import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { renderWithRouter } from "@/test/render-with-router";
import { projects } from "./project-data";
import { ProjectsPage, type ProjectsPageProps } from "./projects-page";

const renderProjectsPage = async (props: Partial<ProjectsPageProps> = {}) => {
  const onCategoryChange = vi.fn();
  const onProjectSelect = vi.fn();

  await renderWithRouter(
    <ThemeProvider>
      <ProjectsPage
        category="all"
        onCategoryChange={onCategoryChange}
        onProjectSelect={onProjectSelect}
        {...props}
      />
    </ThemeProvider>,
  );

  return { onCategoryChange, onProjectSelect };
};

describe("ProjectsPage", () => {
  it("shows all 13 verified projects and reports a category change", async () => {
    const user = userEvent.setup();
    const { onCategoryChange } = await renderProjectsPage();

    expect(screen.getByText("13 projects")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^View .+ gallery$/ })).toHaveLength(13);

    await user.click(screen.getByRole("button", { name: "Design Projects" }));

    expect(onCategoryChange).toHaveBeenCalledWith("design");
  });

  it("shows the exact visible result count for a filtered category", async () => {
    await renderProjectsPage({ category: "design" });

    expect(screen.getByText("4 projects")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^View .+ gallery$/ })).toHaveLength(4);
  });

  it("clears an incompatible selected project when the category changes", async () => {
    const user = userEvent.setup();
    const { onProjectSelect } = await renderProjectsPage({ selectedSlug: "alivio" });

    await user.click(screen.getByRole("button", { name: "Design Projects" }));

    expect(onProjectSelect).toHaveBeenCalledWith(undefined);
  });

  it("renders the selected Alivio project and its six accessible image buttons", async () => {
    await renderProjectsPage({ selectedSlug: "alivio" });

    expect(screen.getByRole("heading", { name: "Alivio Project", level: 2 })).toBeInTheDocument();
    for (const image of projects[0].images) {
      expect(screen.getByRole("button", { name: image.alt })).toBeInTheDocument();
    }
  });

  it("ignores an unknown selected slug while preserving the result count", async () => {
    await renderProjectsPage({ selectedSlug: "not-approved" });

    expect(screen.getByText("13 projects")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "not-approved" })).not.toBeInTheDocument();
  });

  it("offers a reset when the catalog is empty", async () => {
    const user = userEvent.setup();
    const { onCategoryChange } = await renderProjectsPage({
      catalog: [],
      category: "design",
    });

    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(screen.getByText("0 projects")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show all projects" }));

    expect(onCategoryChange).toHaveBeenCalledWith("all");
  });

  it("keeps the Alivio project action available when its cover fails", async () => {
    await renderProjectsPage();

    const projectButton = screen.getByRole("button", {
      name: "View Alivio Project gallery",
    });
    fireEvent.error(within(projectButton).getByRole("img", { name: "Alivio Project cover" }));

    expect(within(projectButton).getByText("Image unavailable")).toBeInTheDocument();
    expect(projectButton).toBeEnabled();
  });

  it("reports the selected project slug", async () => {
    const user = userEvent.setup();
    const { onProjectSelect } = await renderProjectsPage();

    await user.click(screen.getByRole("button", { name: "View Alivio Project gallery" }));

    expect(onProjectSelect).toHaveBeenCalledWith("alivio");
  });

  it("opens all six full images in the shared lightbox and restores thumbnail focus", async () => {
    const user = userEvent.setup();
    await renderProjectsPage({ selectedSlug: "alivio" });

    const trigger = screen.getByRole("button", {
      name: projects[0].images[0].alt,
    });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Project image viewer" })).toBeInTheDocument();
    expect(screen.getByText("1 / 6")).toBeInTheDocument();

    for (const image of projects[0].images) {
      expect(screen.getByRole("img", { name: image.alt })).toHaveAttribute("src", image.full);
      if (image !== projects[0].images.at(-1)) {
        await user.click(screen.getByRole("button", { name: "Next image" }));
      }
    }

    await user.click(screen.getByRole("button", { name: "Close image viewer" }));

    expect(trigger).toHaveFocus();
  });
});
