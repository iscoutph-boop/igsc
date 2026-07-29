import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EstimatorSection } from "./estimator-section";

describe("EstimatorSection", () => {
  it("keeps the detailed estimate disabled until required values are valid", async () => {
    const user = userEvent.setup();

    render(<EstimatorSection />);

    const action = screen.getByRole("link", {
      name: "Get Detailed Estimate",
    });

    expect(action.getAttribute("aria-disabled")).toBe("true");

    await user.selectOptions(screen.getByLabelText("Project Type"), "Residential");
    await user.type(screen.getByLabelText("Project Location"), "Imus City, Cavite");
    await user.type(screen.getByLabelText("Floor Area (sqm)"), "100");
    await user.selectOptions(screen.getByLabelText("Number of Floors"), "2");
    await user.click(screen.getByRole("radio", { name: "Elegant" }));

    expect(action.getAttribute("aria-disabled")).toBe("false");
    expect(screen.getByText("PHP 4,000,000 - PHP 4,500,000")).toBeTruthy();
  });
});
