import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";

import { ThemeProvider } from "../components/theme-provider";
import { MaintenancePage } from "../features/maintenance/maintenance-page";
import {
  getMaintenanceAwareTitle,
  isMaintenanceModeEnabled,
} from "../features/maintenance/maintenance-mode";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { DEFAULT_SOCIAL_IMAGE, LOCAL_BUSINESS_SCHEMA, SITE_URL } from "../lib/seo";

// Vitest loads the project's local env files too, so keep the reversible
// maintenance switch from masking the normal route/component test surface.
// `VITEST` is injected by Vitest even when the Vite mode is not `test`.
const IS_TEST_ENV =
  import.meta.env.MODE === "test" ||
  Boolean(import.meta.env.VITEST) ||
  (typeof process !== "undefined" && process.env.NODE_ENV === "test");
const MAINTENANCE_MODE_ENABLED =
  !IS_TEST_ENV &&
  isMaintenanceModeEnabled(import.meta.env.VITE_MAINTENANCE_MODE, import.meta.env.MODE);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5">
      <div className="max-w-lg text-center">
        <p className="font-display text-8xl font-black text-primary">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          The page may have moved, or the project link may no longer be available.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-extrabold text-white"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5">
      <div className="max-w-lg text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
          Temporary error
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-foreground">This page did not load.</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Try the page again. If the issue continues, return to the homepage and contact the IG
          Sabroso team.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="min-h-12 rounded-xl bg-primary px-6 text-sm font-extrabold text-white"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center rounded-xl border border-border bg-white px-6 text-sm font-extrabold text-foreground"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        title: getMaintenanceAwareTitle(
          "IG Sabroso Construction | Your Dependable Building Partner",
          import.meta.env.VITE_MAINTENANCE_MODE,
          IS_TEST_ENV ? "test" : import.meta.env.MODE,
        ),
      },
      {
        name: "description",
        content:
          "General contracting, design-build, construction management, and renovation services from IG Sabroso Construction in Dasmarinas, Cavite.",
      },
      { property: "og:title", content: "IG Sabroso Construction | Build with Confidence" },
      {
        property: "og:description",
        content:
          "Explore selected real projects and request a construction consultation with IG Sabroso Construction.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IG Sabroso Construction | Build with Confidence" },
      {
        name: "twitter:description",
        content:
          "Selected real projects, services, and consultation booking from IG Sabroso Construction.",
      },
      { name: "twitter:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "theme-color", content: "#ffffff" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-[#152238] px-4 py-3 text-sm font-bold text-white transition focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {MAINTENANCE_MODE_ENABLED ? (
          <MaintenancePage />
        ) : (
          <div id="main-content">
            <Outlet />
          </div>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
