import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders one semantic level-two heading with its accent in the same heading", () => {
    render(<SectionHeading title="Built on trust." accent="Driven by excellence." />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading.textContent).toBe("Built on trust. Driven by excellence.");
  });
});
