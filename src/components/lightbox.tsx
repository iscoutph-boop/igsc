import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange?: (i: number) => void;
  alt?: string | string[];
  label?: string;
};

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
  label = "Image viewer",
}: LightboxProps) {
  const open = index >= 0 && index < images.length;
  const touchStart = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const [i, setI] = useState(index);

  useEffect(() => setI(index), [index]);

  const go = useCallback(
    (next: number) => {
      if (!images.length) return;
      const n = (next + images.length) % images.length;
      setI(n);
      onIndexChange?.(n);
    },
    [images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, i, onClose, open]);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      previouslyFocusedElement.current?.focus();
      previouslyFocusedElement.current = null;
    };
  }, [open]);

  if (!open) return null;
  const src = images[i];
  const multi = images.length > 1;
  const altText = Array.isArray(alt) ? (alt[i] ?? alt[0] ?? "Preview") : alt;

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {/* Close */}
        <button
          type="button"
          ref={closeButtonRef}
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white inline-flex items-center justify-center backdrop-blur-md border border-white/25 transition"
        >
          <X size={20} />
        </button>

        {/* Counter */}
        {multi && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/85 text-xs font-semibold tracking-wider bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
            {i + 1} / {images.length}
          </div>
        )}

        {/* Prev */}
        {multi && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              go(i - 1);
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white inline-flex items-center justify-center backdrop-blur-md border border-white/25 transition"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Image */}
        <motion.img
          key={src}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          src={src}
          alt={altText}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => {
            touchStart.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStart.current == null) return;
            const dx = e.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(dx) > 50 && multi) go(i + (dx < 0 ? 1 : -1));
            touchStart.current = null;
          }}
          className="max-w-[96vw] max-h-[92vh] object-contain select-none cursor-default"
          draggable={false}
        />

        {/* Next */}
        {multi && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              go(i + 1);
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white inline-flex items-center justify-center backdrop-blur-md border border-white/25 transition"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
