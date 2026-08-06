import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

describe("ProjectDetailPage", () => {
  it("renders verified project facts and the consultation action", async () => {
    await renderRoute("/projects/o-residence");
    expect(await screen.findByRole("heading", { level: 1, name: "O Residence" })).toBeTruthy();
    expect(screen.getByText("174 sqm")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /discuss a similar project/i }).getAttribute("href"),
    ).toBe("/consultation");
  });
});
