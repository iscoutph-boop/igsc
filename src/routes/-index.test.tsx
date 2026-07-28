import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("home route composition", () => {
  it("keeps booking state route-owned without duplicating page landmarks", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const user = userEvent.setup();
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/"] }),
      context: { queryClient: new QueryClient() },
    });

    await router.load();
    render(<RouterProvider router={router} />);

    expect(document.querySelectorAll("main")).toHaveLength(1);
    expect(document.querySelectorAll("footer")).toHaveLength(1);

    await user.click(screen.getAllByRole("button", { name: "Manage your booking" })[0]);

    expect(screen.getByRole("heading", { name: "Manage Your Booking" })).toBeInTheDocument();
  });
});
