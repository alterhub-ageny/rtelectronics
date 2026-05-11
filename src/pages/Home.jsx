import { useState } from "react";
import { subscribeNewsletter } from "../services/api";
import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategoryShowcase from "../components/home/CategoryShowcase";
import PromoSection from "../components/home/PromoSection";
import AnimatedSection from "../components/ui/AnimatedSection";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const addToast = useToast();

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
    </>
  );
}
