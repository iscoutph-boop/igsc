import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Concept03DesktopHeroMedia,
  Concept03MobileHeroMedia,
} from "@/features/home/concept03-hero-media";

const DESKTOP_POINTER_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function installMatchMedia({ desktop = true, reducedMotion = false } = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        query === DESKTOP_POINTER_QUERY
          ? desktop
          : query === "(prefers-reduced-motion: reduce)"
            ? reducedMotion
            : false,
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

    fireEvent.pointerMove(root, { clientX: 20 });
    act(() => animationFrames.shift()?.(0));
    expect(root.getAttribute("data-preview")).toBe("finished");

    fireEvent.pointerMove(root, { clientX: 80 });
    act(() => animationFrames.shift()?.(0));
    expect(root.getAttribute("data-preview")).toBe("lights");

    fireEvent.pointerLeave(root);
    expect(root.getAttribute("data-preview")).toBe("rest");
  });

  it("skips the intro and interaction for reduced motion", () => {
    installMatchMedia({ reducedMotion: true });
    render(<Concept03DesktopHeroMedia />);

    expect(screen.queryByTestId("concept03-intro-video")).toBeNull();
    expect(screen.getByTestId("concept03-desktop-hero-media").getAttribute("data-preview")).toBe(
      "rest",
    );
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
