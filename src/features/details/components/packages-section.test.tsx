import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PackagesSection } from "./packages-section";

describe("PackagesSection", () => {
  it("selects a package with keyboard-accessible radio semantics", async () => {
    const user = userEvent.setup();

    render(<PackagesSection />);

    const elegant = screen.getByRole("radio", { name: /^Elegant/i });
    const standard = screen.getByRole("radio", { name: /^Standard/i });

    expect(elegant).toHaveProperty("checked", true);

    await user.click(standard);

    expect(standard).toHaveProperty("checked", true);
    expect(screen.getByRole("heading", { name: "Standard Finish" })).toBeTruthy();
  });
});
