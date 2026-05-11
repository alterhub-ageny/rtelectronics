import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { submitContact } from "../services/api";
import { useToast } from "../context/ToastContext";

const contactInfo = [
  { icon: MapPin, label: "Visit Us", text: "123 Tech Hub, Innovation City, TC 10001" },
  { icon: Phone, label: "Call Us", text: "+1 (800) RT-TECH", sub: "Mon-Fri 9AM-8PM EST" },
  { icon: Mail, label: "Email", text: "support@rtelectronics.com", sub: "We reply within 24hrs" },
  { icon: Clock, label: "Hours", text: "Mon-Sat: 9AM - 9PM EST", sub: "Sunday: 10AM - 6PM EST" },
];

export default function Contact() {
  const addToast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { addToast("Please fill all required fields", "warning"); return; }
    setSending(true);
    try {
      await submitContact(form);
      setSent(true);
      addToast("Message sent successfully!", "success");
    } catch { addToast("Failed to send message", "error"); }
    finally { setSending(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-12">
        <span className="text-rt-accent text-sm font-mono tracking-widest uppercase">Contact</span>
        <h1 className="section-title mt-2">Get in Touch</h1>
        <p className="text-white/40 mt-2 max-w-xl mx-auto">Have a question, feedback, or need help? We're here for you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-rt-accent" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-white/60 text-sm">{item.text}</p>
                    {item.sub && <p className="text-white/30 text-xs mt-0.5">{item.sub}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-white/5">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="text-rt-accent3 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/50 mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn-secondary">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Subject</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all resize-none" placeholder="Tell us more..." />
                </div>
                <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2">
                  {sending ? "Sending..." : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
