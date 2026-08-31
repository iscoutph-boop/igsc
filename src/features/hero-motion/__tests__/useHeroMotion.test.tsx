import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHeroMotion } from "../useHeroMotion";

function Harness({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const motion = useHeroMotion({ enabled: true, reducedMotion });
  return (
    <div
      data-testid="host"
      data-state={motion.state}
      onPointerMove={motion.onPointerMove}
      onPointerLeave={motion.onPointerLeave}
    >
      <div ref={motion.layerRef} data-testid="layer" />
    </div>
  );
}

function bounds(host: HTMLElement) {
  vi.spyOn(host, "getBoundingClientRect").mockReturnValue({
    bottom: 600,
    height: 600,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => undefined,
  });
}

describe("useHeroMotion", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("applies 40ms sketch and 70ms lighting intent gates", () => {
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    render(<Harness />);
    const host = screen.getByTestId("host");
    bounds(host);
    fireEvent.pointerMove(host, { clientX: 50, clientY: 300 });
    act(() => vi.advanceTimersByTime(39));
    expect(host.getAttribute("data-state")).toBe("idle");
    act(() => vi.advanceTimersByTime(1));
    expect(host.getAttribute("data-state")).toBe("sketchReveal");
    fireEvent.pointerMove(host, { clientX: 82, clientY: 300 });
    act(() => vi.advanceTimersByTime(70));
    expect(host.getAttribute("data-state")).toBe("finishedLights");
  });

  it("uses one rAF and resets immediately on exit", () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frames.push(cb);
      return frames.length;
    });
    render(<Harness />);
    const host = screen.getByTestId("host");
    bounds(host);
    fireEvent.pointerMove(host, { clientX: 50, clientY: 300 });
    fireEvent.pointerMove(host, { clientX: 52, clientY: 302 });
    expect(frames).toHaveLength(1);
    act(() => vi.advanceTimersByTime(40));
    fireEvent.pointerLeave(host);
    expect(host.getAttribute("data-state")).toBe("idle");
  });

  it("removes intent delay for reduced motion", () => {
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    render(<Harness reducedMotion />);
    const host = screen.getByTestId("host");
    bounds(host);
    fireEvent.pointerMove(host, { clientX: 82, clientY: 300 });
    act(() => vi.runOnlyPendingTimers());
    expect(host.getAttribute("data-state")).toBe("finishedLights");
  });
});
