import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { callCRMMock } = vi.hoisted(() => ({ callCRMMock: vi.fn() }));

vi.mock("@/lib/bookings", () => ({
  callCRM: (...args: unknown[]) => callCRMMock(...args),
}));

vi.mock("@/components/schedule-picker", () => ({
  SchedulePicker: ({ dateName, timeName }: { dateName?: string; timeName?: string }) => (
    <div>
      <input type="hidden" name={dateName} value="2026-09-15" />
      <input type="hidden" name={timeName} value="10:30" />
    </div>
  ),
}));

import { ConsultationForm } from "@/routes/consultation";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: "VMM Retry QA" } });
  fireEvent.change(screen.getByLabelText(/Mobile number/i), {
    target: { value: "+639171234567" },
  });
  fireEvent.change(screen.getByLabelText(/Project type/i), { target: { value: "Residential" } });
  fireEvent.change(screen.getByLabelText(/Preferred service/i), {
    target: { value: "Project Consultation" },
  });
  fireEvent.change(screen.getByLabelText(/Project location/i), {
    target: { value: "Cagayan de Oro City" },
  });
  fireEvent.change(screen.getByLabelText(/Project description/i), {
    target: { value: "Controlled timeout recovery test." },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /privacy notice/i }));
}

describe("ConsultationForm", () => {
  beforeEach(() => callCRMMock.mockReset());

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

  it("adds one stable submission id to the CRM create payload", async () => {
    callCRMMock.mockResolvedValue({
      success: true,
      bookingReference: "IGS-2026-0042",
    });

    render(<ConsultationForm onSuccess={() => undefined} />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Submit consultation request" }));

    await waitFor(() => expect(callCRMMock).toHaveBeenCalledTimes(1));
    const payload = callCRMMock.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(callCRMMock.mock.calls[0]?.[0]).toBe("createBooking");
    expect(payload.submissionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(payload.companyWebsite).toBe("");
  });

  it("forwards the honeypot value to server validation", async () => {
    callCRMMock.mockRejectedValue(new Error("Spam submission rejected"));

    const { container } = render(<ConsultationForm onSuccess={() => undefined} />);
    fillValidForm();
    const honeypot = container.querySelector<HTMLInputElement>('input[name="companyWebsite"]');
    expect(honeypot).toBeTruthy();
    fireEvent.change(honeypot!, { target: { value: "https://spam.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit consultation request" }));

    await waitFor(() => expect(callCRMMock).toHaveBeenCalledTimes(1));
    expect(callCRMMock.mock.calls[0]?.[1]).toMatchObject({
      companyWebsite: "https://spam.example",
    });
  });
});
