import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, Headphones } from "lucide-react";

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 mb-1"
          >
            <a
              href="tel:+639171234567"
              className="flex items-center gap-3 bg-background/95 backdrop-blur-xl border border-border shadow-card rounded-full pl-4 pr-5 py-3 text-sm font-semibold hover:shadow-glow hover:-translate-y-0.5 transition"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-primary-foreground">
                <Phone size={16} />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Call us</span>
                <span className="block">+63 917 123 4567</span>
              </span>
            </a>
            <a
              href="https://wa.me/639171234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-background/95 backdrop-blur-xl border border-border shadow-card rounded-full pl-4 pr-5 py-3 text-sm font-semibold hover:shadow-glow hover:-translate-y-0.5 transition"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                <MessageCircle size={16} />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Chat on WhatsApp</span>
                <span className="block">Live Customer Care</span>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Customer Care"
        className="relative gradient-brand text-primary-foreground rounded-full h-14 w-14 md:h-16 md:w-16 shadow-glow flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "icon"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X size={22} /> : <Headphones size={22} />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-full gradient-brand opacity-60 animate-ping" />
        )}
      </motion.button>
    </div>
  );
}
