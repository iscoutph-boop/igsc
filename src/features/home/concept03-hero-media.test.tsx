import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Concept03DesktopHeroMedia,
  Concept03MobileHeroMedia,
} from "@/features/home/concept03-hero-media";

const DESKTOP_POINTER_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function installMatchMedia({ desktop = true, reducedMotion = false } = {}) {
  const queryStates = new Map<
    string,
    Set<{
      matches: boolean;
      listeners: Set<(event: Event) => void>;
    }>
  >();

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => {
      const state = {
        matches:
          query === DESKTOP_POINTER_QUERY
            ? desktop
            : query === "(prefers-reduced-motion: reduce)"
              ? reducedMotion
              : false,
        listeners: new Set<(event: Event) => void>(),
      };
      const states = queryStates.get(query) ?? new Set();
      states.add(state);
      queryStates.set(query, states);

      return {
        get matches() {
          return state.matches;
        },
        media: query,
        onchange: null,
        addListener: (listener: (event: Event) => void) => state.listeners.add(listener),
        removeListener: (listener: (event: Event) => void) => state.listeners.delete(listener),
        addEventListener: (_event: string, listener: (event: Event) => void) =>
          state.listeners.add(listener),
        removeEventListener: (_event: string, listener: (event: Event) => void) =>
          state.listeners.delete(listener),
        dispatchEvent: (event: Event) => {
          state.listeners.forEach((listener) => listener(event));
          return true;
        },
      };
    }),
  });

  return {
    setMatches(query: string, matches: boolean) {
      queryStates.get(query)?.forEach((state) => {
        state.matches = matches;
        state.listeners.forEach((listener) => listener(new Event("change")));
      });
    },
  };
}

class LoadedImage {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;

  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

describe("Concept03 hero media", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.stubGlobal("Image", LoadedImage);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it("plays the desktop intro once, then enables the two hover preview states", async () => {
    installMatchMedia();
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });

    render(<Concept03DesktopHeroMedia />);

    const root = screen.getByTestId("concept03-desktop-hero-media");
    const baseImage = screen.getByAltText(/architectural sketch to completed construction/i);
    const video = screen.getByTestId("concept03-intro-video");
    expect(video).toBeTruthy();

    fireEvent.load(baseImage);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });
    fireEvent.play(video);
    fireEvent.ended(video);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    expect(screen.queryByTestId("concept03-intro-video")).toBeNull();
    expect(root.getAttribute("data-interaction-ready")).toBe("true");
    expect(sessionStorage.getItem("igs-concept03-intro-played")).toBe("true");

    const finishedImage = root.querySelector<HTMLImageElement>('img[src*="hero-finished"]');
    expect(finishedImage?.getAttribute("style")).toContain("mask-image");

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
    window.dispatchEvent(new Event("resize"));

    fireEvent.pointerMove(root, { clientX: 20 });
    act(() => animationFrames.shift()?.(0));
    expect(root.getAttribute("data-preview")).toBe("finished");

    fireEvent.pointerMove(root, { clientX: 80 });
    act(() => animationFrames.shift()?.(0));
    expect(root.getAttribute("data-preview")).toBe("lights");

    fireEvent.pointerLeave(root);
    expect(root.getAttribute("data-preview")).toBe("rest");
  });

  it("damps and clamps the reveal while gating and fading the house lights", async () => {
    installMatchMedia();
    sessionStorage.setItem("igs-concept03-intro-played", "true");
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });

    render(<Concept03DesktopHeroMedia />);

    const root = screen.getByTestId("concept03-desktop-hero-media");
    const baseImage = screen.getByAltText(/architectural sketch to completed construction/i);
    fireEvent.load(baseImage);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });

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
    window.dispatchEvent(new Event("resize"));

    const finishedImage = root.querySelector<HTMLImageElement>('img[src*="hero-finished"]');
    const lightsLayer = root.querySelector<HTMLDivElement>('[aria-hidden="true"]:has(img)');
    expect(finishedImage?.getAttribute("style")).toContain("mask-image");
    expect(lightsLayer).toBeTruthy();

    fireEvent.pointerMove(root, { clientX: 0 });
    act(() => animationFrames.shift()?.(0));
    const firstReveal = Number.parseFloat(
      finishedImage?.style.getPropertyValue("--hero-reveal-position") ?? "NaN",
    );
    expect(firstReveal).toBeGreaterThan(44);
    expect(firstReveal).toBeLessThan(58);

    fireEvent.pointerMove(root, { clientX: 100 });
    let timestamp = 16;
    for (let index = 0; index < 120 && animationFrames.length > 0; index += 1) {
      act(() => animationFrames.shift()?.(timestamp));
      timestamp += 16;
    }
    const maxReveal = Number.parseFloat(
      finishedImage?.style.getPropertyValue("--hero-reveal-position") ?? "NaN",
    );
    expect(maxReveal).toBeLessThanOrEqual(82);

    fireEvent.pointerMove(root, { clientX: 55 });
    expect(root.getAttribute("data-preview")).toBe("finished");
    act(() => animationFrames.shift()?.(timestamp));

    fireEvent.pointerMove(root, { clientX: 80 });
    expect(root.getAttribute("data-preview")).toBe("lights");
    act(() => animationFrames.shift()?.(timestamp + 16));
    const lightsOpacity = Number.parseFloat(lightsLayer?.style.opacity ?? "NaN");
    expect(lightsOpacity).toBeGreaterThan(0);
    expect(lightsOpacity).toBeLessThan(1);

    fireEvent.pointerLeave(root);
    expect(root.getAttribute("data-preview")).toBe("rest");
    act(() => animationFrames.shift()?.(timestamp + 32));
    const revealDuringReturn = Number.parseFloat(
      finishedImage?.style.getPropertyValue("--hero-reveal-position") ?? "NaN",
    );
    expect(revealDuringReturn).toBeGreaterThan(58);

    for (let index = 0; index < 120 && animationFrames.length > 0; index += 1) {
      act(() => animationFrames.shift()?.(timestamp + 48 + index * 16));
    }
    expect(
      Number.parseFloat(finishedImage?.style.getPropertyValue("--hero-reveal-position") ?? "NaN"),
    ).toBeCloseTo(58, 1);
    expect(Number.parseFloat(lightsLayer?.style.opacity ?? "NaN")).toBe(0);
  });

  it("skips the intro and interaction for reduced motion", () => {
    installMatchMedia({ reducedMotion: true });
    render(<Concept03DesktopHeroMedia />);

    expect(screen.queryByTestId("concept03-intro-video")).toBeNull();
    expect(screen.getByTestId("concept03-desktop-hero-media").getAttribute("data-preview")).toBe(
      "rest",
    );
  });

  it("keeps pointer-follow interaction disabled for reduced motion", async () => {
    installMatchMedia({ reducedMotion: true });
    sessionStorage.setItem("igs-concept03-intro-played", "true");
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });

    render(<Concept03DesktopHeroMedia />);

    const root = screen.getByTestId("concept03-desktop-hero-media");
    const baseImage = screen.getByAltText(/architectural sketch to completed construction/i);
    fireEvent.load(baseImage);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });

    fireEvent.pointerMove(root, { clientX: 80 });
    expect(root.getAttribute("data-preview")).toBe("rest");
    expect(animationFrames).toHaveLength(0);
  });

  it("re-enables the desktop interaction after a mobile breakpoint round trip", async () => {
    const media = installMatchMedia({ desktop: false });
    sessionStorage.setItem("igs-concept03-intro-played", "true");
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });

    render(<Concept03DesktopHeroMedia />);

    const root = screen.getByTestId("concept03-desktop-hero-media");
    const baseImage = screen.getByAltText(/architectural sketch to completed construction/i);
    fireEvent.load(baseImage);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });
    expect(root.getAttribute("data-interaction-ready")).toBe("false");

    await act(async () => {
      media.setMatches(DESKTOP_POINTER_QUERY, true);
    });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(root.getAttribute("data-interaction-ready")).toBe("true");

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
    window.dispatchEvent(new Event("resize"));
    fireEvent.pointerMove(root, { clientX: 80 });
    act(() => animationFrames.shift()?.(0));
    expect(root.getAttribute("data-preview")).toBe("lights");

    await act(async () => {
      media.setMatches(DESKTOP_POINTER_QUERY, false);
      await Promise.resolve();
    });
    expect(root.getAttribute("data-interaction-ready")).toBe("false");
    expect(root.getAttribute("data-preview")).toBe("rest");

    await act(async () => {
      media.setMatches(DESKTOP_POINTER_QUERY, true);
    });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(root.getAttribute("data-interaction-ready")).toBe("true");

    fireEvent.pointerMove(root, { clientX: 80 });
    expect(root.getAttribute("data-preview")).toBe("lights");
  });

  it("cancels a pending visual animation when unmounted", async () => {
    installMatchMedia();
    sessionStorage.setItem("igs-concept03-intro-played", "true");
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    const cancelAnimationFrame = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(<Concept03DesktopHeroMedia />);
    const root = screen.getByTestId("concept03-desktop-hero-media");
    const baseImage = screen.getByAltText(/architectural sketch to completed construction/i);
    fireEvent.load(baseImage);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });

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
    window.dispatchEvent(new Event("resize"));
    fireEvent.pointerMove(root, { clientX: 80 });

    expect(animationFrames).toHaveLength(1);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it("preloads overlays when the base image completed before hydration", async () => {
    installMatchMedia();
    sessionStorage.setItem("igs-concept03-intro-played", "true");
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(1536);

    render(<Concept03DesktopHeroMedia />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });

    expect(
      screen.getByTestId("concept03-desktop-hero-media").getAttribute("data-interaction-ready"),
    ).toBe("true");
  });

  it("keeps the mobile hero static and free of video controls", () => {
    installMatchMedia({ desktop: false });
    render(<Concept03MobileHeroMedia />);

    const mobileHero = screen.getByTestId("concept03-mobile-hero-media");
    const mobileImage = screen.getByAltText(/architectural sketch to completed construction/i);
    expect(mobileHero.querySelector("video")).toBeNull();
    expect(mobileImage).toBeTruthy();

    fireEvent.error(mobileImage);
    const fallbackSource = mobileImage.getAttribute("src");
    expect(mobileImage.getAttribute("data-fallback-applied")).toBe("true");

    fireEvent.error(mobileImage);
    expect(mobileImage.getAttribute("src")).toBe(fallbackSource);
  });
});
