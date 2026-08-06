import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("labels ongoing visualizations explicitly", () => {
    render(<StatusBadge status="ongoing" visualizationOnly />);
    expect(screen.getByText("Ongoing Project — Architectural Visualization")).toBeTruthy();
  });
});
