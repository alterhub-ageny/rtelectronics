import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Send, Check } from "lucide-react";
import { subscribeNewsletter, submitContact } from "../services/api";
import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategoryShowcase from "../components/home/CategoryShowcase";
import PromoSection from "../components/home/PromoSection";
import AnimatedSection from "../components/ui/AnimatedSection";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Home() {
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
      addToast("Subscribed", "success");
    } catch { addToast("Subscription failed", "error"); }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      addToast("Fill in all required fields", "warning");
      return;
    }
    setContactSending(true);
    try {
      await submitContact(contact);
      setContactSent(true);
      addToast("Message sent", "success");
    } catch { addToast("Failed to send", "error"); }
    setContactSending(false);
  };

  return (
    <>
      <HeroSection />

      <AnimatedSection>
        <FeaturedProducts />
      </AnimatedSection>

      <div className="depth-line mx-auto max-w-site" />

      <AnimatedSection>
        <CategoryShowcase />
      </AnimatedSection>

      <div className="depth-line mx-auto max-w-site" />

      <AnimatedSection>
        <PromoSection />
      </AnimatedSection>

      <AnimatedSection>
        <section className="max-w-site mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/[0.06] bg-rt-accent/[0.02] mb-4">
              <span className="w-1 h-1 rounded-full bg-rt-accent/40 animate-neural-pulse" />
              <span className="text-rt-accent/40 text-[9px] font-mono tracking-[0.2em] uppercase">Connect</span>
            </div>
            <h2 className="section-crystal-title text-3xl md:text-4xl mb-3">
              TRANSMIT SIGNAL
            </h2>
            <p className="text-white/15 text-sm font-mono max-w-lg mx-auto tracking-wider">
              Crystal neural network responds within 24 cycles.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {contactSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="crystal rounded-2xl p-10 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-rt-accent/[0.04] border border-rt-accent/[0.08] flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-rt-accent/40" />
                </div>
                <h3 className="text-lg font-display font-bold text-white/60 mb-2 tracking-wider">Signal Received</h3>
                <p className="text-white/20 text-xs font-mono">Neural decode in progress.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleContact} className="crystal rounded-2xl p-6 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="Name *"
                    className="input-crystal text-xs"
                  />
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="Email *"
                    className="input-crystal text-xs"
                  />
                </div>
                <textarea
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  rows={3}
                  placeholder="Message *"
                  className="input-crystal text-xs resize-none"
                />
                <button
                  type="submit"
                  disabled={contactSending}
                  className="btn-crystal w-full flex items-center justify-center gap-2 text-[10px] py-3"
                >
                  {contactSending ? (
                    <><span className="spinner-crystal w-3 h-3" /> TRANSMITTING</>
                  ) : (
                    <><Send size={12} /> SEND SIGNAL</>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </AnimatedSection>

      <section className="max-w-site mx-auto px-4 sm:px-6 pb-24">
        <div className="cta-crystal rounded-[24px] p-10 md:p-14 text-center border border-white/[0.02] relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/[0.06] bg-rt-accent/[0.02] mb-4">
              <Sparkles size={9} className="text-rt-accent/40" />
              <span className="text-rt-accent/40 text-[9px] font-mono tracking-[0.2em] uppercase">Subscribe</span>
            </div>
            <h2 className="section-crystal-title text-2xl md:text-4xl mb-3">
              JOIN THE CRYSTAL
            </h2>
            <p className="text-white/15 text-xs font-mono mb-6 max-w-md mx-auto tracking-wider">
              Early access to drops, crystalline insights, and member-only frequencies.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rt-accent/[0.04] border border-rt-accent/[0.08]">
                <Check size={14} className="text-rt-accent/40" />
                <span className="text-rt-accent/40 text-xs font-mono">SIGNAL LOCKED</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER CRYSTAL ADDRESS"
                  required
                  className="input-crystal text-xs text-center sm:text-left font-mono tracking-wider"
                />
                <button type="submit" className="btn-crystal text-[10px] px-6 py-3 whitespace-nowrap">
                  SYNCHRONIZE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {isAdmin && (
        <Link
          to="/admin"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl crystal text-rt-accent text-[10px] font-display font-bold tracking-wider group"
        >
          <Zap size={12} className="group-hover:rotate-12 transition-transform" />
          ADMIN
        </Link>
      )}
    </>
  );
}
