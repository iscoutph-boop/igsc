import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Concept03DesktopHeroMedia,
  Concept03MobileHeroMedia,
} from "@/features/home/concept03-hero-media";

const DESKTOP = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function media({ desktop = true, reduced = false } = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query === DESKTOP ? desktop : query === REDUCED ? reduced : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

class LoadedImage {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

async function load() {
  fireEvent.load(screen.getByAltText(/architectural sketch to completed construction/i));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(180);
    await Promise.resolve();
  });
}

function setBounds(root: HTMLElement) {
  vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
    bottom: 650,
    height: 650,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => undefined,
  });
}

describe("Concept03 hero media", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("Image", LoadedImage);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps the base high priority and loads four decorative layers after it", async () => {
    media();
    render(<Concept03DesktopHeroMedia />);
    expect(screen.getByAltText(/architectural sketch/i).getAttribute("fetchpriority")).toBe("high");
    expect(screen.queryByTestId("hero-motion-layers")).toBeNull();
    await load();
    expect(
      screen
        .getByTestId("concept03-desktop-hero-media")
        .querySelectorAll('img[aria-hidden="true"]'),
    ).toHaveLength(4);
  });

  it("loads interaction layers when the base image completed before hydration", async () => {
    media();
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(1536);
    render(<Concept03DesktopHeroMedia />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
      await Promise.resolve();
    });
    expect(screen.queryByTestId("hero-motion-layers")).not.toBeNull();
  });

  it("maps pointer intent to approved states and exit", async () => {
    media();
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    render(<Concept03DesktopHeroMedia />);
    await load();
    const root = screen.getByTestId("concept03-desktop-hero-media");
    setBounds(root);
    expect(root.getAttribute("data-interaction-ready")).toBe("true");
    fireEvent.pointerMove(root, { clientX: 50, clientY: 300 });
    act(() => vi.advanceTimersByTime(40));
    expect(root.getAttribute("data-hero-state")).toBe("sketchReveal");
    fireEvent.pointerMove(root, { clientX: 82, clientY: 300 });
    act(() => vi.advanceTimersByTime(70));
    expect(root.getAttribute("data-hero-state")).toBe("finishedLights");
    fireEvent.pointerLeave(root);
    expect(root.getAttribute("data-hero-state")).toBe("idle");
  });

  it("keeps touch static and mobile unchanged", async () => {
    media({ desktop: false });
    render(<Concept03DesktopHeroMedia />);
    await load();
    expect(screen.queryByTestId("hero-motion-layers")).toBeNull();
    render(<Concept03MobileHeroMedia />);
    expect(screen.getByTestId("concept03-mobile-hero-media").querySelector("video")).toBeNull();
  });
});
