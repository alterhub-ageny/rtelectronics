import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createChatConversation, sendChatMessage, getChatMessages } from "../../services/api";

const CONV_KEY = "rt-chat-conv";

export default function ChatWidget() {
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rt-accent/40 animate-neural-pulse" />
                <span className="text-white/50 text-[11px] font-display font-bold tracking-wider">CHANNEL</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/[0.03] text-white/20 hover:text-white/40 transition-all">
                <X size={13} />
              </button>
            </div>

            {!convId ? (
              <form onSubmit={handleStart} className="p-4 space-y-2.5">
                <p className="text-white/20 text-[9px] font-mono mb-2 tracking-wider">Initialize neural channel:</p>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="input-crystal text-[10px] py-2" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input-crystal text-[10px] py-2" />
                <button type="submit" disabled={starting} className="btn-crystal w-full text-[9px] py-2.5 flex items-center justify-center gap-1.5">
                  {starting ? <span className="spinner-crystal w-2.5 h-2.5" /> : <><MessageCircle size={11} /> CONNECT</>}
                </button>
              </form>
            ) : (
              <div className="flex flex-col h-[300px]">
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {!messages.length && (
                    <div className="text-center py-8">
                      <p className="text-white/15 text-[9px] font-mono">Channel open. Send a message.</p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 ${
                          m.sender === "admin"
                            ? "bg-white/[0.03] text-white/50"
                            : "bg-rt-accent/[0.04] border border-rt-accent/[0.06] text-white/60"
                        }`}
                      >
                        <p className="text-[8px] text-white/15 font-mono mb-0.5 tracking-wider">{m.sender === "admin" ? "SUPPORT" : name.toUpperCase()}</p>
                        <p className="text-[11px]">{m.message}</p>
                        <p className="text-[7px] text-white/15 mt-1 text-right font-mono">{m.createdAt?.slice(11, 16)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-white/[0.02]">
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type message..." className="flex-1 bg-white/[0.01] border border-white/[0.03] rounded-xl px-3 py-2 text-white/40 text-[11px] placeholder:text-white/10 focus:border-rt-accent/20 transition-all font-mono" />
                  <button type="submit" disabled={!text.trim()} className="p-2 rounded-xl bg-rt-accent/[0.06] text-rt-accent/40 disabled:opacity-10 hover:bg-rt-accent/[0.1] hover:text-rt-accent/60 transition-all">
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
