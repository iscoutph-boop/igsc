import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProcessSection } from "./process-section";

describe("ProcessSection", () => {
  it("changes the selected phase with keyboard controls", async () => {
    const user = userEvent.setup();

    render(<ProcessSection />);

    const consultation = screen.getByRole("tab", {
      name: "Consultation",
    });
    const planning = screen.getByRole("tab", { name: "Planning" });

    expect(consultation.getAttribute("aria-selected")).toBe("true");

    planning.focus();
    await user.keyboard("{Enter}");

    expect(planning.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Designs, drawings, schedules, and strategy.")).toBeTruthy();
  });
});
