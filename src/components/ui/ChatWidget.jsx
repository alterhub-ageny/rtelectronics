import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createChatConversation, sendChatMessage, getChatMessages } from "../../services/api";

const CONV_KEY = "rt-chat-conv";

export default function ChatWidget() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [convId, setConvId] = useState(() => localStorage.getItem(CONV_KEY));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [starting, setStarting] = useState(false);
  const bottomRef = useRef();

  const scroll = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scroll, [messages]);

  const loadMessages = useCallback(async () => {
    if (!convId) return;
    try {
      const d = await getChatMessages(convId);
      setMessages(d.messages || []);
    } catch {}
  }, [convId]);

  useEffect(() => {
    if (!open || !convId) return;
    loadMessages();
    const iv = setInterval(loadMessages, 5000);
    return () => clearInterval(iv);
  }, [open, convId, loadMessages]);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setStarting(true);
    try {
      const d = await createChatConversation({ name, email });
      setConvId(d.id);
      localStorage.setItem(CONV_KEY, d.id);
    } catch {}
    setStarting(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !convId) return;
    const msg = text.trim();
    setText("");
    try {
      await sendChatMessage({ conversationId: convId, name, message: msg });
      await loadMessages();
    } catch {}
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-[320px] crystal rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--hero-border)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rt-accent/40 animate-pulse" />
                <span className="text-[var(--hero-text)] text-[11px] font-display font-bold tracking-wider">{t("chat.channel")}</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/[0.03] text-[var(--hero-text)] hover:text-[var(--color-text)] transition-all">
                <X size={13} />
              </button>
            </div>

            {!convId ? (
              <form onSubmit={handleStart} className="p-4 space-y-2.5">
                <p className="text-[var(--color-text-muted)] text-[9px] font-mono mb-2 tracking-wider">{t("chat.init_text")}</p>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("chat.name")} required className="input-crystal text-[10px] py-2" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("chat.email")} required className="input-crystal text-[10px] py-2" />
                <button type="submit" disabled={starting} className="btn-crystal w-full text-[9px] py-2.5 flex items-center justify-center gap-1.5">
                  {starting ? <span className="spinner-crystal w-2.5 h-2.5" /> : <><MessageCircle size={11} /> {t("chat.connect")}</>}
                </button>
              </form>
            ) : (
              <div className="flex flex-col h-[300px]">
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {!messages.length && (
                    <div className="text-center py-8">
                      <p className="text-[var(--color-text-muted)] text-[9px] font-mono">{t("chat.channel_open")}</p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 ${
                          m.sender === "admin"
                            ? "bg-white/[0.05] border border-[var(--color-border)] text-[var(--color-text)]"
                            : "bg-rt-accent/[0.06] border border-rt-accent/[0.12] text-[var(--color-text)]"
                        }`}
                      >
                        <p className="text-[8px] text-[var(--color-text-muted)] font-mono mb-0.5 tracking-wider">{m.sender === "admin" ? t("chat.support") : name.toUpperCase()}</p>
                        <p className="text-[11px]">{m.message}</p>
                        <p className="text-[7px] text-[var(--color-text-muted)] mt-1 text-right font-mono">{m.createdAt?.slice(11, 16)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-[var(--hero-border)]">
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("chat.placeholder")} className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2 text-[var(--color-text)] text-[11px] placeholder:text-[var(--color-text-muted)] focus:border-rt-accent/40 transition-all font-mono" />
                  <button type="submit" disabled={!text.trim()} className="p-2 rounded-xl bg-rt-accent/[0.08] text-rt-accent/60 disabled:opacity-20 hover:bg-rt-accent/[0.12] hover:text-rt-accent transition-all">
                    <Send size={13} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-11 h-11 rounded-2xl crystal flex items-center justify-center group shadow-2xl hover:scale-105 transition-transform duration-500"
      >
        {open ? (
          <X size={17} className="text-rt-accent/40" />
        ) : (
          <MessageCircle size={17} className="text-rt-accent/40 animate-neural-pulse" />
        )}
      </button>
    </div>
  );
}
