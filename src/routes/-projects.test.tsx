import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";

async function renderProjectsRoute(initialEntry: string) {
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history,
    context: { queryClient },
  });

  await router.load();
  render(<RouterProvider router={router} />);

  return router;
}

describe("/projects route search", () => {
  it("clears project on category change and preserves category on project selection", async () => {
    const user = userEvent.setup();
    const router = await renderProjectsRoute("/projects?category=ongoing&project=alonzo");

    await user.click(screen.getByRole("button", { name: "Design Projects" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/projects");
      expect(router.state.location.search).toEqual({
        category: "design",
        project: undefined,
      });
      expect(router.state.location.searchStr).toBe("?category=design");
    });

    await user.click(screen.getByRole("button", { name: "View Wong Project gallery" }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({
        category: "design",
        project: "wong",
      });
      expect(router.state.location.searchStr).toBe("?category=design&project=wong");
    });
  });

  it("normalizes invalid search values before rendering the route", async () => {
    const router = await renderProjectsRoute("/projects?category=unverified&project=%20");

    expect(router.state.location.search).toEqual({
      category: "all",
      project: undefined,
    });
    expect(screen.getByText("13 projects")).toBeInTheDocument();
  });
});
