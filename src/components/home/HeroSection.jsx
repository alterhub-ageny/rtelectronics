import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Truck, Shield, HeadphonesIcon, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/api";

const ICON_MAP = {
  laptop: "💻", smartphone: "📱", "gamepad-2": "🎮", tablet: "📟",
  watch: "⌚", headphones: "🎧", keyboard: "⌨️", dices: "🎲", gift: "🎁"
};

export default function HeroSection() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const featuredCats = categories.filter(c => c.featured).slice(0, 4);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--hero-bg)]">
      {/* Grid */}
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--hero-grid) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 0%, var(--hero-glow-1) 0%, transparent 60%), radial-gradient(ellipse at 70% 100%, var(--hero-glow-2) 0%, transparent 50%)" }} />
      
      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/3 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[var(--color-info)]/2 blur-[120px]" />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10 py-24 w-full">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          {/* Left content */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/15 bg-[var(--color-primary-subtle)] mb-8">
                <Sparkles size={11} className="text-[var(--color-primary)]" />
                <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">{t("hero.badge")}</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="heading-xl mb-6"
            >
              <span className="text-[var(--hero-heading-from)]">
                {t("hero.heading_1")}
              </span>
              <br />
              <span className="text-gradient">
                {t("hero.heading_2")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[var(--hero-text)] text-[1.0625rem] max-w-xl mb-10 leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products" className="btn btn-primary btn-lg group">
                {t("hero.shop_all")}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/products?category=gaming-pcs" className="btn btn-outline btn-lg">
                {t("hero.gaming_rigs")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-[var(--hero-border)]"
            >
              {[
                { icon: Truck, text: t("hero.free_shipping") },
                { icon: Shield, text: t("hero.warranty") },
                { icon: HeadphonesIcon, text: t("hero.support") },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-[var(--hero-text)] text-[0.8125rem]">
                  <item.icon size={14} className="text-[var(--color-primary)]/60" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - category cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3">
              {featuredCats.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Link to={`/products?category=${cat.slug}`}
                    className="group premium-card p-5 block"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{ICON_MAP[cat.icon] || "📦"}</span>
                      <ArrowRight size={12} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="font-semibold text-[0.9375rem] text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-[var(--color-text-muted)] text-[0.75rem] mt-1 font-mono">
                      {cat.productCount} products
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
