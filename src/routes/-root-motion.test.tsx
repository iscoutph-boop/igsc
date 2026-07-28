import { render, screen } from "@testing-library/react";
import { useReducedMotionConfig } from "framer-motion";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RootMotionBoundary } from "./__root";

function MotionPreferenceProbe() {
  const reduceMotion = useReducedMotionConfig();
  return <output>{String(reduceMotion)}</output>;
}

describe("RootMotionBoundary", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("passes the user's reduced-motion preference to descendant motion components", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    render(
      <RootMotionBoundary>
        <MotionPreferenceProbe />
      </RootMotionBoundary>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("true");
  });
});
