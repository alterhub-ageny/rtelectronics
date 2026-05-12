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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
              <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">Connect</span>
            </div>
            <h2 className="section-crystal-title text-3xl md:text-4xl mb-3">
              TRANSMIT SIGNAL
            </h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">
              Our team typically responds within 24 hours.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {contactSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="crystal rounded-2xl p-10 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-rt-accent" />
                </div>
                <h3 className="text-lg font-bold text-white/80 mb-2">Transmission Complete</h3>
                <p className="text-white/40 text-xs">We'll decode your message shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleContact} className="crystal rounded-2xl p-6 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="Name *"
                    className="input-crystal"
                  />
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="Email *"
                    className="input-crystal"
                  />
                </div>
                <textarea
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  rows={3}
                  placeholder="Message *"
                  className="input-crystal resize-none"
                />
                <button
                  type="submit"
                  disabled={contactSending}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  {contactSending ? (
                    <><span className="spinner-crystal" /> SENDING</>
                  ) : (
                    <><Send size={14} /> SEND MESSAGE</>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </AnimatedSection>

      <section className="max-w-site mx-auto px-4 sm:px-6 pb-24">
        <div className="cta-crystal rounded-[24px] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/10 mb-4">
              <Sparkles size={10} className="text-rt-accent" />
              <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">Subscribe</span>
            </div>
            <h2 className="section-crystal-title text-2xl md:text-4xl mb-3">
              JOIN THE CRYSTAL
            </h2>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Early access to drops, insights, and exclusive offers.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rt-accent/10 border border-rt-accent/20">
                <Check size={14} className="text-rt-accent" />
                <span className="text-rt-accent text-sm font-medium">SIGNAL LOCKED</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="input-crystal flex-1"
                />
                <button type="submit" className="btn-primary px-6 py-2.5 whitespace-nowrap">
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {isAdmin && (
        <Link
          to="/admin"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl card-edge text-rt-accent text-xs font-semibold"
        >
          <Zap size={14} />
          ADMIN
        </Link>
      )}
    </>
  );
}
