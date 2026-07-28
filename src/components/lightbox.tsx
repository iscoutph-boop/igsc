import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = string | { src: string; alt: string; caption?: string };

export type LightboxProps = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  alt?: string;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Shared image lightbox used across About, Client Collaboration, Meetings,
 * Project Portfolio, and Project Detail galleries.
 * - Click backdrop or close button to close
 * - Left/right arrows on desktop
 * - Swipe left/right on mobile
 * - ESC to close, ←/→ to navigate
 */
export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  alt = "Preview",
  returnFocusRef,
}: LightboxProps) {
  const open = index >= 0 && index < images.length;
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [failedSources, setFailedSources] = useState<Set<string>>(() => new Set());

  const normalizedImages = useMemo(
    () => images.map((image) => (typeof image === "string" ? { src: image, alt } : image)),
    [alt, images],
  );

  useEffect(() => setCurrentIndex(index), [index]);

  const go = useCallback(
    (next: number) => {
      if (!images.length) return;
      const normalizedIndex = (next + images.length) % images.length;
      setCurrentIndex(normalizedIndex);
      onIndexChange?.(normalizedIndex);
    },
    [images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;

    const returnFocusElement = returnFocusRef?.current ?? null;
    dialogRef.current?.focus();

    return () => {
      returnFocusElement?.focus();
    };
  }, [open, returnFocusRef]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(displayIndex - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(displayIndex + 1);
      return;
    }

    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
    const first = focusableElements[0];
    const last = focusableElements.at(-1);

    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!dialog.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  const displayIndex =
    currentIndex >= 0 && currentIndex < normalizedImages.length ? currentIndex : index;
  const currentImage = normalizedImages[displayIndex];
  const multi = normalizedImages.length > 1;
  const imageFailed = failedSources.has(currentImage.src);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStart.current == null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX == null) {
      touchStart.current = null;
      return;
    }

    const distance = endX - touchStart.current;
    if (Math.abs(distance) > 50 && multi) {
      go(displayIndex + (distance < 0 ? 1 : -1));
    }
    touchStart.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Project image viewer"
        tabIndex={-1}
      >
        <button
          type="button"
          aria-label="Close image viewer"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
        >
          <X size={20} />
        </button>

        {multi && (
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-white/85 backdrop-blur"
            aria-live="polite"
          >
            {displayIndex + 1} / {normalizedImages.length}
          </div>
        )}

        {multi && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              go(displayIndex - 1);
            }}
            className="absolute top-1/2 left-3 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <motion.figure
          key={`${currentImage.src}-${displayIndex}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            touchStart.current = null;
          }}
          className="m-0 flex max-h-[92vh] max-w-[96vw] flex-col items-center justify-center"
        >
          {imageFailed ? (
            <div
              className="flex min-h-44 min-w-44 items-center justify-center rounded-xl bg-white/10 px-8 py-12 text-sm font-medium text-white/80"
              role="status"
            >
              Image unavailable
            </div>
          ) : (
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              onError={() => {
                setFailedSources((sources) => {
                  if (sources.has(currentImage.src)) return sources;
                  const nextSources = new Set(sources);
                  nextSources.add(currentImage.src);
                  return nextSources;
                });
              }}
              className="max-h-[86vh] max-w-[96vw] cursor-default object-contain select-none"
              draggable={false}
            />
          )}
          {currentImage.caption && (
            <figcaption className="max-w-2xl px-4 pt-3 text-center text-sm text-white/85">
              {currentImage.caption}
            </figcaption>
          )}
        </motion.figure>

        {multi && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              go(displayIndex + 1);
            }}
            className="absolute top-1/2 right-3 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
