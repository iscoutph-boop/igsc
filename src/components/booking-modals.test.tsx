import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const callCRMMock = vi.fn();

vi.mock("@/lib/bookings", () => ({
  callCRM: (...args: unknown[]) => callCRMMock(...args),
}));

import { CheckBookingModal } from "./booking-modals";

describe("CheckBookingModal cancellation", () => {
  beforeEach(() => {
    callCRMMock.mockReset();
  });

  it("sends the entered cancellation reason using the CRM schema field", async () => {
    const user = userEvent.setup();
    const reference = "IGS-2026-9999";
    const contact = "qa@example.com";
    const reason = "Schedule no longer works for the client.";

    callCRMMock.mockImplementation(async (action: string) => {
      if (action === "findBooking") {
        return {
          success: true,
          booking: {
            bookingReference: reference,
            fullName: "QA Client",
            phoneNumber: "09000000000",
            emailAddress: contact,
            projectType: "Residential",
            projectLocation: "Cagayan de Oro City",
            preferredDate: "2026-09-03",
            preferredTime: "10:00",
            bookingStatus: "New",
            projectDetails: "Staging QA",
          },
        };
      }

      return { success: true };
    });

    render(<CheckBookingModal open onClose={() => undefined} initialReference={reference} />);

    const referenceInput = screen.getByPlaceholderText("Example: IGS-2026-0142");
    const contactInput = screen.getByPlaceholderText("Enter your email or phone number");

    await user.clear(referenceInput);
    await user.type(referenceInput, reference);
    await user.type(contactInput, contact);
    await user.click(screen.getByRole("button", { name: "Find My Booking" }));

    await screen.findByRole("heading", { name: "Appointment Request Found" });
    await user.click(screen.getByRole("button", { name: "Cancel Request" }));
    await screen.findByRole("heading", { name: "Cancel Booking?" });

    await user.type(screen.getByPlaceholderText(/why you're cancelling/i), reason);
    await user.click(screen.getByRole("button", { name: "Confirm Cancellation" }));

    await waitFor(() => {
      expect(callCRMMock).toHaveBeenCalledWith("cancelBooking", {
        bookingReference: reference,
        contact,
        cancellationReason: reason,
      });
    });
  });
});
