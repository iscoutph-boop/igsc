import { StrictMode, useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Lightbox } from "./lightbox";

const images = [
  { src: "/one.webp", alt: "Alivio Project — image 1 of 2" },
  { src: "/two.webp", alt: "Alivio Project — image 2 of 2" },
];

describe("Lightbox", () => {
  it("navigates with ArrowRight and closes with Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onIndexChange = vi.fn();

    render(<Lightbox images={images} index={0} onClose={onClose} onIndexChange={onIndexChange} />);

    expect(screen.getByRole("dialog", { name: "Project image viewer" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Alivio Project — image 1 of 2",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");

    expect(
      screen.getByRole("img", {
        name: "Alivio Project — image 2 of 2",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(onIndexChange).toHaveBeenCalledWith(1);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("preserves touch swipe navigation", () => {
    render(<Lightbox images={images} index={0} onClose={() => undefined} />);

    const firstImage = screen.getByRole("img", { name: /image 1 of 2/ });
    fireEvent.touchStart(firstImage, {
      touches: [{ clientX: 200 }],
    });
    fireEvent.touchEnd(firstImage, {
      changedTouches: [{ clientX: 100 }],
    });

    expect(
      screen.getByRole("img", {
        name: /image 2 of 2/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("restores focus to the triggering element after closing", async () => {
    const user = userEvent.setup();

    function FocusHarness() {
      const [index, setIndex] = useState(-1);
      const triggerRef = useRef<HTMLButtonElement>(null);

      return (
        <>
          <button ref={triggerRef} type="button" onClick={() => setIndex(0)}>
            Open gallery
          </button>
          <Lightbox
            images={images}
            index={index}
            onClose={() => setIndex(-1)}
            returnFocusRef={triggerRef}
          />
        </>
      );
    }

    render(<FocusHarness />);

    const trigger = screen.getByRole("button", { name: "Open gallery" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", {
      name: "Project image viewer",
    });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await user.click(screen.getByRole("button", { name: "Close image viewer" }));

    expect(trigger).toHaveFocus();
  });

  it("keeps focus in the dialog during StrictMode effect replay", () => {
    function StrictModeHarness() {
      const triggerRef = useRef<HTMLButtonElement>(null);

      return (
        <>
          <button ref={triggerRef} type="button">
            Return target
          </button>
          <Lightbox
            images={images}
            index={0}
            onClose={() => undefined}
            returnFocusRef={triggerRef}
          />
        </>
      );
    }

    render(
      <StrictMode>
        <StrictModeHarness />
      </StrictMode>,
    );

    expect(screen.getByRole("dialog", { name: "Project image viewer" })).toHaveFocus();
  });

  it("updates the visible image when the external index changes", () => {
    const { rerender } = render(<Lightbox images={images} index={0} onClose={() => undefined} />);

    expect(screen.getByRole("img", { name: /image 1 of 2/ })).toBeInTheDocument();

    rerender(<Lightbox images={images} index={1} onClose={() => undefined} />);

    expect(screen.getByRole("img", { name: /image 2 of 2/ })).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("closes when the backdrop is activated", () => {
    const onClose = vi.fn();

    render(<Lightbox images={images} index={0} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog", { name: "Project image viewer" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("keeps Tab and Shift+Tab focus inside the dialog", async () => {
    const user = userEvent.setup();

    render(<Lightbox images={images} index={0} onClose={() => undefined} />);

    const close = screen.getByRole("button", { name: "Close image viewer" });
    const next = screen.getByRole("button", { name: "Next image" });

    next.focus();
    await user.tab();
    expect(close).toHaveFocus();

    close.focus();
    await user.tab({ shift: true });
    expect(next).toHaveFocus();
  });

  it("keeps navigation and close controls usable after an image fails", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Lightbox images={images} index={0} onClose={onClose} />);

    fireEvent.error(
      screen.getByRole("img", {
        name: "Alivio Project — image 1 of 2",
      }),
    );

    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
    const previous = screen.getByRole("button", { name: "Previous image" });
    const next = screen.getByRole("button", { name: "Next image" });
    const close = screen.getByRole("button", { name: "Close image viewer" });

    await user.click(next);
    expect(
      screen.getByRole("img", {
        name: "Alivio Project — image 2 of 2",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();

    await user.click(previous);
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();

    await user.click(close);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("normalizes legacy strings and renders optional object captions", async () => {
    const user = userEvent.setup();

    render(
      <Lightbox
        images={[
          "/legacy.webp",
          {
            src: "/captioned.webp",
            alt: "Captioned project image",
            caption: "Warm timber details in the completed living area.",
          },
        ]}
        index={0}
        onClose={() => undefined}
        alt="Legacy project image"
      />,
    );

    expect(screen.getByRole("img", { name: "Legacy project image" })).toHaveAttribute(
      "src",
      "/legacy.webp",
    );

    await user.click(screen.getByRole("button", { name: "Next image" }));

    expect(screen.getByRole("img", { name: "Captioned project image" })).toHaveAttribute(
      "src",
      "/captioned.webp",
    );
    expect(
      screen.getByText("Warm timber details in the completed living area."),
    ).toBeInTheDocument();
  });
});
