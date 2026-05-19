import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, Check, Mail, MapPin, Phone, Clock, Zap } from "lucide-react";
import { submitContact } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Contact() {
  const { t } = useTranslation();
  const addToast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { addToast(t("contact.fill_required"), "warning"); return; }
    setSending(true);
    try {
      await submitContact(form);
      setSent(true);
      addToast(t("contact.sent_toast"), "success");
    } catch { addToast(t("contact.failed"), "error"); }
    setSending(false);
  };

  const info = [
    { icon: MapPin, text: t("contact.address") },
    { icon: Phone, text: t("contact.phone") },
    { icon: Mail, text: t("contact.support_email") },
    { icon: Clock, text: t("contact.hours") },
  ];

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
          <span className="eyebrow">{t("contact.badge")}</span>
        </div>
        <h1 className="heading-md mb-3">
          <span className="text-[var(--color-text)]">{t("contact.title_1")}</span>
          <span className="text-gradient">{t("contact.title_2")}</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-xs font-mono max-w-md mx-auto">{t("contact.subtitle")}</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
        <div className="lg:col-span-3">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="heading-md mb-2">{t("contact.sent_title")}</h3>
              <p className="text-[var(--color-text-muted)] text-xs font-mono">{t("contact.sent_text")}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("contact.name")} className="input" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("contact.email")} className="input" />
              </div>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t("contact.subject")} className="input" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder={t("contact.message")} className="input resize-none" />
              <button type="submit" disabled={sending} className="btn btn-primary w-full justify-center">
                {sending ? <><span className="spinner w-4 h-4" /> {t("contact.transmitting")}</> : <><Send size={13} /> {t("contact.send_message")}</>}
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 space-y-3">
          {info.map((item) => (
            <div key={item.text} className="premium-card p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-hover)]/5 border border-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
