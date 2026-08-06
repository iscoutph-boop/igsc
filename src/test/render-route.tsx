import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { render, type RenderOptions } from "@testing-library/react";
import { routeTree } from "@/routeTree.gen";

export async function renderRoute(initialEntry: string, options?: RenderOptions) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  const router = createRouter({ routeTree, history, context: { queryClient } });

  await router.load();

  return {
    queryClient,
    router,
    ...render(<RouterProvider router={router} />, options),
  };
}
