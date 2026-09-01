// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckBookingModal } from "./booking-modals";

const callCRMMock = vi.fn();

vi.mock("@/lib/bookings", () => ({
  callCRM: (...args: unknown[]) => callCRMMock(...args),
}));

vi.mock("@/components/schedule-picker", () => ({
  SchedulePicker: ({
    onDateChange,
    onTimeChange,
  }: {
    onDateChange: (date: Date) => void;
    onTimeChange: (time: string) => void;
  }) => (
    <button
      type="button"
      onClick={() => {
        onDateChange(new Date(2026, 8, 15));
        onTimeChange("10:30");
      }}
    >
      Pick QA schedule
    </button>
  ),
}));

const booking = {
  bookingReference: "IGS-2026-0018",
  fullName: "VMM QA",
  phoneNumber: "09171234567",
  emailAddress: "customer@example.com",
  projectType: "Residential",
  projectLocation: "Cagayan de Oro City",
  projectDetails: "QA booking",
  preferredDate: "2026-09-03",
  preferredTime: "14:00",
  bookingStatus: "New",
};

describe("CheckBookingModal immediate self-service", () => {
  beforeEach(() => {
    callCRMMock.mockReset();
  });

  it("cancels immediately with the normalized reason contract", async () => {
    const user = userEvent.setup();
    callCRMMock.mockResolvedValueOnce({ success: true, booking }).mockResolvedValueOnce({
      success: true,
      booking: { ...booking, bookingStatus: "Cancelled" },
    });

    render(<CheckBookingModal open onClose={() => {}} />);

    await user.type(screen.getByPlaceholderText(/IGS-2026/i), booking.bookingReference);
    await user.type(screen.getByPlaceholderText(/email or phone/i), booking.emailAddress);
    await user.click(screen.getByRole("button", { name: /find my booking/i }));

    await screen.findByText(/appointment request found/i);
    await user.click(screen.getByRole("button", { name: /^cancel booking$/i }));
    await user.type(screen.getByLabelText(/cancellation reason/i), "Schedule changed");
    await user.click(screen.getByRole("button", { name: /yes, cancel booking/i }));

    await waitFor(() => {
      expect(callCRMMock).toHaveBeenLastCalledWith("cancelBooking", {
        bookingReference: booking.bookingReference,
        contact: booking.emailAddress,
        cancellationReason: "Schedule changed",
      });
    });

    expect(await screen.findByText(/^booking cancelled$/i)).toBeTruthy();
    expect(
      screen.getByText(/no appointment remains scheduled for this booking reference/i),
    ).toBeTruthy();
  });

  it("offers completed-state self-service action labels after lookup", async () => {
    const user = userEvent.setup();
    callCRMMock.mockResolvedValueOnce({ success: true, booking });

    render(<CheckBookingModal open onClose={() => {}} />);

    await user.type(screen.getByPlaceholderText(/IGS-2026/i), booking.bookingReference);
    await user.type(screen.getByPlaceholderText(/email or phone/i), booking.emailAddress);
    await user.click(screen.getByRole("button", { name: /find my booking/i }));

    expect(await screen.findByRole("button", { name: /^reschedule booking$/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^cancel booking$/i })).toBeTruthy();
  });

  it("does not promise a customer email after rescheduling", async () => {
    const user = userEvent.setup();
    callCRMMock.mockResolvedValueOnce({ success: true, booking }).mockResolvedValueOnce({
      success: true,
      booking: {
        ...booking,
        preferredDate: "2026-09-15",
        preferredTime: "10:30",
        bookingStatus: "Rescheduled",
      },
    });

    render(<CheckBookingModal open onClose={() => {}} />);
    await user.type(screen.getByPlaceholderText(/IGS-2026/i), booking.bookingReference);
    await user.type(screen.getByPlaceholderText(/email or phone/i), booking.emailAddress);
    await user.click(screen.getByRole("button", { name: /find my booking/i }));
    await user.click(await screen.findByRole("button", { name: /^reschedule booking$/i }));
    await user.click(screen.getByRole("button", { name: /pick qa schedule/i }));
    await user.click(screen.getByRole("button", { name: /confirm new schedule/i }));

    expect(await screen.findByText(/^booking rescheduled$/i)).toBeTruthy();
    expect(screen.getByText(/latest schedule is shown below/i)).toBeTruthy();
    expect(screen.queryByText(/confirmation email/i)).toBeNull();
  });
});
