import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

describe("ProjectsPage", () => {
  it("filters the curated portfolio and links to project pages", async () => {
    const user = userEvent.setup();
    await renderRoute("/projects");

    expect(
      await screen.findByRole("heading", { level: 1, name: /selected real projects/i }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /view O Residence/i }).getAttribute("href")).toBe(
      "/projects/o-residence",
    );

    await user.click(screen.getByRole("button", { name: "Commercial" }));
    expect(screen.getByText("Keystone Building")).toBeTruthy();
    expect(screen.queryByText("O Residence")).toBeNull();
  });
});
