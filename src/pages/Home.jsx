import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, Check, Zap, Sparkles, ArrowRight } from "lucide-react";
import { subscribeNewsletter, submitContact } from "../services/api";
import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategoryShowcase from "../components/home/CategoryShowcase";
import PromoSection from "../components/home/PromoSection";
import AnimatedSection from "../components/ui/AnimatedSection";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const addToast = useToast();
  const { isAdmin } = useAuth();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      addToast(t("home.subscribed"), "success");
    } catch { addToast(t("home.subscription_failed"), "error"); }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      addToast(t("home.fill_required"), "warning");
      return;
    }
    setContactSending(true);
    try {
      await submitContact(contact);
      setContactSent(true);
      addToast(t("home.message_sent_title"), "success");
    } catch { addToast(t("home.failed_to_send"), "error"); }
    setContactSending(false);
  };

  const sectionClass = "max-w-site mx-auto px-4 sm:px-6";
  const badgeClass = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03]";

  return (
    <>
      <HeroSection />

      <AnimatedSection>
        <FeaturedProducts />
      </AnimatedSection>

      <div className={`${sectionClass}`}>
        <div className="divider" />
      </div>

      <AnimatedSection>
        <CategoryShowcase />
      </AnimatedSection>

      <div className={`${sectionClass}`}>
        <div className="divider" />
      </div>

      <AnimatedSection>
        <PromoSection />
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection>
        <section className={`${sectionClass} py-24`}>
          <div className="text-center mb-12">
            <div className={`${badgeClass} mb-4`}>
              <Sparkles size={10} className="text-[var(--color-primary)]/60" />
              <span className="eyebrow">{t("home.contact_badge")}</span>
            </div>
            <h2 className="heading-md mb-2">
              {t("home.get_in_touch")}
            </h2>
            <p className="section-subtitle">
              {t("home.contact_subtitle")}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {contactSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 text-center"
              >
                <div className="w-14 h-14 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{t("home.message_sent_title")}</h3>
                <p className="text-[var(--color-text-muted)] text-xs font-mono">{t("home.message_sent_text")}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleContact} className="glass-card p-6 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder={t("home.name")} className="input" />
                  <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder={t("home.email")} className="input" />
                </div>
                <textarea value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} rows={3} placeholder={t("home.message")} className="input resize-none" />
                <button type="submit" disabled={contactSending} className="btn btn-primary w-full justify-center">
                  {contactSending ? (
                    <><span className="spinner w-3 h-3" /> {t("home.sending")}</>
                  ) : (
                    <><Send size={14} /> {t("home.send_message")}</>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Newsletter */}
      <section className={`${sectionClass} pb-24`}>
        <div className="relative overflow-hidden rounded-[24px] p-12 md:p-16 text-center glass-panel">
          <div className="relative z-10">
            <div className={`${badgeClass} mb-4`}>
              <Sparkles size={10} className="text-[var(--color-primary)]/60" />
              <span className="eyebrow">{t("home.newsletter_badge")}</span>
            </div>
            <h2 className="heading-md mb-2">
              {t("home.stay_updated")}
            </h2>
            <p className="section-subtitle mb-8">
              {t("home.newsletter_text")}
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                <Check size={14} className="text-[var(--color-primary)]" />
                <span className="text-[var(--color-primary)] text-xs font-semibold">{t("home.subscribed")}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("home.enter_email")} required className="input flex-1" />
                <button type="submit" className="btn btn-primary">
                  {t("home.subscribe")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {isAdmin && (
        <Link
          to="/admin"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg glass-card text-[var(--color-primary)] text-xs font-semibold hover:shadow-lg transition-all"
        >
          <Zap size={14} />
          {t("home.admin")}
        </Link>
      )}
    </>
  );
}
