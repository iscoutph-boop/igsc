import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConsultationForm } from "@/routes/consultation";

describe("ConsultationForm", () => {
  it("renders the approved production inquiry fields and privacy consent", () => {
    render(<ConsultationForm onSuccess={() => undefined} />);
    expect(screen.getByLabelText(/Full name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Mobile number/i)).toBeTruthy();
    expect(screen.getByLabelText(/Project type/i)).toBeTruthy();
    expect(screen.getByLabelText(/Preferred service/i)).toBeTruthy();
    expect(screen.getByLabelText(/Approximate lot or floor area/i)).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: /privacy notice/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit consultation request" })).toBeTruthy();
  });
});
