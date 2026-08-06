import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

describe("DetailsPage", () => {
  it("renders the approved long-form hybrid sections", async () => {
    const { container } = await renderRoute("/details");
    expect(await screen.findByRole("heading", { level: 2, name: /built on values/i })).toBeTruthy();
    expect(container.querySelector("#about")).toBeTruthy();
    expect(container.querySelector("#services")).toBeTruthy();
    expect(container.querySelector("#process")).toBeTruthy();
    expect(container.querySelector("#reviews")).toBeTruthy();
    expect(container.querySelector("#contact")).toBeTruthy();
    expect(container.querySelector("#estimator")).toBeNull();
  });
});
