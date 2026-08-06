import type { ComponentProps, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProcessSection } from "./process-section";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();

  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: ComponentProps<"a"> & { children: ReactNode; to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

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
