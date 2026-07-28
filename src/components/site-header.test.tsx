import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";
import { ThemeProvider } from "./theme-provider";

class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [];

  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

async function renderHeader(initialEntry: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>
    ),
  });
  const routes = ["/", "/details", "/projects", "/projects/example", "/consultation"].map((path) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
    }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  });

  await router.load();
  render(<RouterProvider router={router} />);

  return router;
}

describe("SiteHeader navigation", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", NoopIntersectionObserver);
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks only the current landing hash active on the home route", async () => {
    await renderHeader("/#services");

    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("navigates the mobile Projects item to /projects and closes the menu", async () => {
    const user = userEvent.setup();
    const router = await renderHeader("/consultation");

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const projectLinks = screen.getAllByRole("link", { name: "Projects" });
    await user.click(projectLinks.at(-1)!);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/projects");
    });
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: "Projects" })).toHaveLength(1);
    });
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
  });

  it("keeps Projects active on a nested project path", async () => {
    await renderHeader("/projects/example");

    const projects = screen.getByRole("link", { name: "Projects" });
    expect(projects).toHaveClass("text-primary-foreground");
    expect(projects).toHaveAttribute("aria-current", "page");

    for (const label of ["Home", "About", "Services", "Process"]) {
      const landingLink = screen.getByRole("link", { name: label });
      expect(landingLink).not.toHaveClass("text-primary-foreground");
      expect(landingLink).not.toHaveAttribute("aria-current");
    }
  });
});
