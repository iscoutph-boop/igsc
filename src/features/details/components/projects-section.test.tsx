import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectsSection } from "./projects-section";

describe("ProjectsSection", () => {
  it("filters real project results and offers a recovery action for no results", async () => {
    const user = userEvent.setup();

    render(<ProjectsSection onOpenImage={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "Commercial" }));

    expect(screen.getByText("Keystone Building")).toBeTruthy();

    await user.type(screen.getByRole("searchbox", { name: "Search projects" }), "not-a-project");

    expect(screen.getByText("No projects match these filters.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getAllByText("A Residence").length).toBeGreaterThan(0);
  });
});
