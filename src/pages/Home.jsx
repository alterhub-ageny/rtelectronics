import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const addToast = useToast();
  const { user, isAdmin } = useAuth();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      addToast("Subscribed successfully!", "success");
    } catch {
      addToast("Subscription failed", "error");
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) { addToast("Fill in all required fields", "warning"); return; }
    setContactSending(true);
    try {
      await submitContact(contact);
      setContactSent(true);
      addToast("Message sent! We'll get back to you soon.", "success");
    } catch { addToast("Failed to send", "error"); }
    setContactSending(false);
  };

  return (
    <>
      <HeroSection />
      <AnimatedSection>
        <FeaturedProducts />
      </AnimatedSection>
      <AnimatedSection>
        <CategoryShowcase />
      </AnimatedSection>
      <AnimatedSection>
        <PromoSection />
      </AnimatedSection>

      <AnimatedSection>
        <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <span className="text-rt-accent text-sm font-mono tracking-widest uppercase">Connect</span>
            <h2 className="section-title mt-2">Send Us a Message</h2>
            <p className="text-white/40 mt-2 max-w-xl mx-auto">Have a question or need help? Drop us a message and we'll reply within 24 hours.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            {contactSent ? (
              <div className="glass rounded-2xl p-12 text-center border border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-rt-accent3/10 border border-rt-accent3/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rt-accent3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/50">Thank you for reaching out. Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your Name *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                  <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Your Email *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                </div>
                <input value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <textarea value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} rows={4} placeholder="Your Message *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" />
                <button type="submit" disabled={contactSending} className="btn-primary w-full flex items-center justify-center gap-2">
                  {contactSending ? "Sending..." : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </section>
      </AnimatedSection>

      <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
        <div className="glass rounded-3xl p-10 md:p-16 text-center border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rt-accent/5 via-transparent to-rt-accent2/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Join the <span className="text-gradient">Future</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8">
              Subscribe for exclusive deals, early access to new drops, and tech insights.
            </p>
            {subscribed ? (
              <p className="text-rt-accent3 text-lg font-medium">You're subscribed! Check your inbox for the latest deals.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                  className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-rt-accent/50 transition-all" />
                <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {isAdmin && (
        <Link to="/admin"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rt-accent to-rt-accent2 text-white text-sm font-bold shadow-lg shadow-rt-accent/30 hover:shadow-rt-accent/50 hover:scale-105 transition-all duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          Admin Panel
        </Link>
      )}
    </>
  );
}
