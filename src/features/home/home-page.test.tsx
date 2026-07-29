import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeHeroContent } from "./home-page";

function BookingHarness() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <HomeHeroContent onOpenBooking={() => setBookingOpen(true)} />
      {bookingOpen ? <p role="status">Booking manager open</p> : null}
    </>
  );
}

describe("HomeHeroContent", () => {
  it("renders the approved conversion hierarchy and opens booking management", async () => {
    const user = userEvent.setup();
    render(<BookingHarness />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Dependable building solutions for homes, renovations, and civil works.",
      }),
    ).toBeTruthy();
    expect(screen.getByText("10+")).toBeTruthy();
    expect(screen.getByText("300+")).toBeTruthy();

    const discover = screen.getByRole("link", { name: "Discover More" });
    expect(discover.getAttribute("href")).toBe("/details#about");

    await user.click(screen.getByRole("button", { name: "Check Booking" }));
    expect(screen.getByRole("status").textContent).toBe("Booking manager open");
  });
});
