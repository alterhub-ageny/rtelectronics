import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Mail, MapPin, Phone, Clock, Zap } from "lucide-react";
import { submitContact } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Contact() {
  const addToast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { addToast("Fill in required fields", "warning"); return; }
    setSending(true);
    try {
      await submitContact(form);
      setSent(true);
      addToast("Message sent", "success");
    } catch { addToast("Failed to send", "error"); }
    setSending(false);
  };

  const info = [
    { icon: MapPin, text: "123 Tech Hub, Innovation City" },
    { icon: Phone, text: "+1 (800) RT-TECH" },
    { icon: Mail, text: "support@rtelectronics.com" },
    { icon: Clock, text: "24/7 Neural Support" },
  ];

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">Contact</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
          <span className="text-white/90">TRANSMIT </span>
          <span className="text-crystal">SIGNAL</span>
        </h1>
        <p className="text-white/25 text-xs font-mono max-w-md mx-auto">
          Our team typically responds within 24 cycles.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
        <div className="lg:col-span-3">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="crystal rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-rt-accent" />
              </div>
              <h3 className="text-lg font-display font-bold text-white/90 mb-2">Transmission Complete</h3>
              <p className="text-white/30 text-xs font-mono">We'll decode your message shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="crystal rounded-2xl p-6 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name *" className="input-crystal text-xs" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your Email *" className="input-crystal text-xs" />
              </div>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="input-crystal text-xs" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Your Message *" className="input-crystal text-xs resize-none" />
              <button type="submit" disabled={sending} className="btn-crystal w-full flex items-center justify-center gap-2 text-xs py-3">
                {sending ? <><span className="spinner-crystal w-4 h-4" /> TRANSMITTING</> : <><Send size={13} /> SEND MESSAGE</>}
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 space-y-3">
          {info.map((item) => (
            <div key={item.text} className="crystal rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rt-accent/10 to-rt-accent2/5 border border-rt-accent/10 flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-rt-accent" />
              </div>
              <div>
                <p className="text-white/50 text-[11px] font-mono">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
