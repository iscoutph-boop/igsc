import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, Headphones, X, Send, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import supportIconAsset from "@/assets/support-icon.png.asset.json";
import { IGS_PHONE_WA } from "@/lib/contact";

type Mode = null | "menu" | "bot" | "agent";
type Msg = { from: "bot" | "user"; text: string };

const BOT_QUESTIONS = [
  "What type of project are you planning? (e.g. residential, renovation, commercial)",
  "Where is the project located? (Barangay, City, Province)",
  "Approximately how many square meters?",
  "What's your estimated budget range?",
  "Preferred consultation date?",
  "Which service do you need? (construction, design-build, 3D rendering, etc.)",
];

const AGENT_INTRO: Msg[] = [
  { from: "bot", text: "Hi! You're now connected to an IGS agent line. Please describe your inquiry and our team will reply on your preferred channel." },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Allow other components to programmatically open the widget.
  useEffect(() => {
    const handler = () => { setOpen(true); setMode("menu"); };
    window.addEventListener("igs:open-contact", handler);
    return () => window.removeEventListener("igs:open-contact", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const startBot = () => {
    setMode("bot");
    setStep(0);
    setMessages([{ from: "bot", text: "Hi! I'm the IGS assistant. I'll ask a few quick questions to help you book a consultation." }, { from: "bot", text: BOT_QUESTIONS[0] }]);
  };

  const startAgent = () => {
    setMode("agent");
    setMessages(AGENT_INTRO);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);

    if (mode === "bot") {
      const next = step + 1;
      setTimeout(() => {
        if (next < BOT_QUESTIONS.length) {
          setMessages((m) => [...m, { from: "bot", text: BOT_QUESTIONS[next] }]);
          setStep(next);
        } else {
          setMessages((m) => [
            ...m,
            { from: "bot", text: "Thank you! Our team will reach out shortly. Ready to lock in a slot? Tap 'Book Consultation' below." },
          ]);
        }
      }, 350);
    } else if (mode === "agent") {
      setTimeout(() => {
        setMessages((m) => [...m, { from: "bot", text: "Got it — an IGS team member will follow up. You can also message us on WhatsApp for a faster response." }]);
      }, 400);
    }
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi IG Sabroso Construction! I'd like to inquire about a project.");
    window.open(`https://wa.me/${IGS_PHONE_WA}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const reset = () => { setMode("menu"); setMessages([]); setStep(0); setInput(""); };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[90vw] max-w-[360px] bg-background border border-border rounded-3xl shadow-glow overflow-hidden flex flex-col"
            style={{ maxHeight: "min(560px, 80vh)" }}
          >
            {/* Header */}
            <div className="gradient-brand text-primary-foreground p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/95 p-1 shrink-0">
                <img src={logoAsset.url} alt="IGS" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold leading-tight">IG Sabroso</div>
                <div className="text-[11px] opacity-90">How can we help today?</div>
              </div>
              <button
                aria-label="Close"
                onClick={() => { setOpen(false); reset(); }}
                className="p-1.5 rounded-full hover:bg-white/15 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            {mode === "menu" || mode === null ? (
              <div className="p-4 space-y-2.5">
                <button onClick={openWhatsApp} className="w-full flex items-center gap-3 rounded-2xl p-3 border border-border hover:border-emerald-500/60 hover:bg-emerald-500/5 transition text-left group">
                  <span className="h-10 w-10 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center"><MessageCircle size={18} /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">WhatsApp Chat</span>
                    <span className="block text-xs text-muted-foreground">Fastest replies via WhatsApp</span>
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition" />
                </button>
                <button onClick={startBot} className="w-full flex items-center gap-3 rounded-2xl p-3 border border-border hover:border-primary/60 hover:bg-primary/5 transition text-left group">
                  <span className="h-10 w-10 rounded-full gradient-brand text-primary-foreground inline-flex items-center justify-center"><Bot size={18} /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">Chat Bot</span>
                    <span className="block text-xs text-muted-foreground">Quick project Q&A to prep your inquiry</span>
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition" />
                </button>
                <button onClick={startAgent} className="w-full flex items-center gap-3 rounded-2xl p-3 border border-border hover:border-primary/60 hover:bg-primary/5 transition text-left group">
                  <span className="h-10 w-10 rounded-full bg-foreground text-background inline-flex items-center justify-center"><Headphones size={18} /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">Agent Chat</span>
                    <span className="block text-xs text-muted-foreground">Send a message to our team</span>
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition" />
                </button>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-surface/40">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`max-w-[85%] text-sm rounded-2xl px-3 py-2 ${m.from === "bot" ? "bg-background border border-border" : "ml-auto gradient-brand text-primary-foreground"}`}>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border bg-background flex items-center gap-2">
                  <button onClick={reset} aria-label="Back" className="p-2 rounded-full hover:bg-muted transition"><X size={16} /></button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    placeholder="Type a message..."
                    className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button onClick={sendMessage} aria-label="Send" className="h-9 w-9 inline-flex items-center justify-center rounded-full gradient-brand text-primary-foreground"><Send size={15} /></button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => { setOpen((v) => !v); if (!open) setMode("menu"); }}
        aria-label="Open IG Sabroso contact"
        className="relative bg-background border-2 border-primary rounded-full h-16 w-16 shadow-glow flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="text-foreground">
              <X size={22} />
            </motion.span>
          ) : (
            <motion.img
              key="logo"
              src={logoAsset.url}
              alt="IGS"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-12 w-12 object-contain"
            />
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
