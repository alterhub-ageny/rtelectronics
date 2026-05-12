import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { createChatConversation, sendChatMessage, getChatMessages } from "../../services/api";

const CONV_KEY = "rt-chat-conv";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [convId, setConvId] = useState(() => localStorage.getItem(CONV_KEY));
  const [conv, setConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", subject: "" });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const messagesEnd = useRef(null);
  const { user } = useAuth();
  const addToast = useToast();

  useEffect(() => { if (open) document.body.style.overflow = "hidden"; else document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  const scrollToBottom = () => messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const loadMessages = useCallback(async () => {
    if (!convId) return;
    try {
      const data = await getChatMessages(convId);
      setConv(data);
      setMessages(data.messages || []);
    } catch {}
  }, [convId]);

  useEffect(() => { if (convId && open) { loadMessages(); const iv = setInterval(loadMessages, 5000); return () => clearInterval(iv); } }, [convId, open, loadMessages]);

  useEffect(() => {
    if (user && convId && open) {
      const { name, email } = user;
      setForm(f => ({ ...f, name: f.name || name, email: f.email || email }));
    }
  }, [user, convId, open]);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStarting(true);
    try {
      const c = await createChatConversation(form);
      setConvId(c.id);
      localStorage.setItem(CONV_KEY, c.id);
      setConv(c);
      addToast("Chat started!", "success");
    } catch (err) { addToast(err.message, "error"); }
    setStarting(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !convId) return;
    setSending(true);
    try {
      await sendChatMessage({ conversationId: convId, message: input.trim(), name: conv?.name || form.name });
      setInput("");
      await loadMessages();
    } catch (err) { addToast(err.message, "error"); }
    setSending(false);
  };

  const handleReset = () => {
    localStorage.removeItem(CONV_KEY);
    setConvId(null);
    setConv(null);
    setMessages([]);
  };

  const name = conv?.name || form.name || user?.name || "";

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={`fixed bottom-6 z-50 transition-all duration-300 ${open ? "right-4 sm:right-6" : "left-6"}`}>
        {!open ? (
          <button onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rt-accent to-rt-accent2 text-white shadow-lg shadow-rt-accent/30 hover:shadow-rt-accent/50 hover:scale-105 transition-all flex items-center justify-center group"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        ) : (
          <div className="w-[360px] sm:w-[400px] h-[520px] glass rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rt-accent"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <span className="text-white text-sm font-medium">Chat with us</span>
                  {conv && <span className="text-[10px] text-emerald-400 ml-2">● Online</span>}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!conv ? (
                <form onSubmit={handleStart} className="space-y-3 pt-4">
                  <p className="text-white/50 text-sm mb-4">Hi! How can we help you today? Leave your details and we'll get back to you.</p>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your Email *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                  <button type="submit" disabled={starting} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                    {starting ? "Starting..." : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Start Chat</>}
                  </button>
                </form>
              ) : (
                <>
                  {!messages.length && <div className="text-center py-8 text-white/30 text-sm">No messages yet. Send us a message!</div>}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === "admin" ? "bg-white/10 text-white/90 rounded-tl-md" : "bg-rt-accent/20 text-white border border-rt-accent/20 rounded-tr-md"}`}>
                        <p className="text-xs text-white/40 mb-0.5">{m.sender === "admin" ? "Support" : name}</p>
                        <p>{m.message}</p>
                        <p className="text-[10px] text-white/30 mt-1 text-right">{m.createdAt?.slice(11, 16)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEnd} />
                </>
              )}
            </div>

            {conv && (
              <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-white/10">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <button type="submit" disabled={sending || !input.trim()} className="p-2.5 rounded-xl bg-rt-accent text-white disabled:opacity-30 hover:bg-rt-accent2 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            )}

            {conv && (
              <button onClick={handleReset} className="text-[10px] text-white/20 hover:text-white/40 text-center py-1.5 border-t border-white/5 transition-colors">Start new conversation</button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
