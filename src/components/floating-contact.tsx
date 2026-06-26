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

const ELEVENLABS_AGENT_ID = "agent_2001kvsbegs7fj19ds3f3sehg7xe";
const ELEVENLABS_WIDGET_SCRIPT = "https://unpkg.com/@elevenlabs/convai-widget-embed";

function ElevenLabsAgent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let script = document.querySelector(`script[src="${ELEVENLABS_WIDGET_SCRIPT}"]`) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.src = ELEVENLABS_WIDGET_SCRIPT;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    const el = document.createElement("elevenlabs-convai") as HTMLElement;
    el.setAttribute("agent-id", ELEVENLABS_AGENT_ID);

    // Contain the widget inside the chat box instead of letting it
    // attach to the full viewport.
    el.style.setProperty("position", "relative", "important");
    el.style.setProperty("width", "100%", "important");
    el.style.setProperty("height", "100%", "important");
    el.style.setProperty("top", "auto", "important");
    el.style.setProperty("left", "auto", "important");
    el.style.setProperty("right", "auto", "important");
    el.style.setProperty("bottom", "auto", "important");
    el.style.setProperty("--el-overlay-padding", "0px", "important");

    containerRef.current?.appendChild(el);

    // Center the widget bubble inside the chat box body.
    const injectCentering = () => {
      const shadow = el.shadowRoot;
      if (!shadow) return;
      const style = document.createElement("style");
      style.textContent = `
        .overlay {
          justify-content: center !important;
          align-items: center !important;
        }
      `;
      shadow.appendChild(style);
    };

    if (customElements.get("elevenlabs-convai")) {
      injectCentering();
    } else {
      customElements.whenDefined("elevenlabs-convai").then(injectCentering);
    }

    return () => {
      if (containerRef.current && containerRef.current.contains(el)) {
        containerRef.current.removeChild(el);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full flex-1 min-h-[180px] flex items-center justify-center" />;
}

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
    setMessages([]);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);

    if (mode !== "bot") return;

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
                    <span className="block text-sm font-bold">Talk to our Receptionist</span>
                    <span className="block text-xs text-muted-foreground">Speak with our AI receptionist</span>
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition" />
                </button>
              </div>
            ) : mode === "agent" ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 bg-surface/40 flex flex-col items-center">
                  <div className="text-center pt-2">
                    <div className="text-sm font-bold">Talk to our Receptionist</div>
                    <div className="text-xs text-muted-foreground">Start a voice call below</div>
                  </div>
                  <ElevenLabsAgent />
                </div>
                <div className="p-3 border-t border-border bg-background flex items-center justify-center">
                  <button onClick={reset} aria-label="Back" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <X size={14} /> Back to menu
                  </button>
                </div>
              </>
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
        className="relative rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-glow flex items-center justify-center overflow-hidden bg-transparent"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-background border-2 border-primary inline-flex items-center justify-center text-foreground">
              <X size={20} />
            </motion.span>
          ) : (
            <motion.img
              key="support"
              src={supportIconAsset.url}
              alt="Contact support"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full object-contain"
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
