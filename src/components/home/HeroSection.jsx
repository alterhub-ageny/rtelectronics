import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Truck, Shield, HeadphonesIcon, Sparkles } from "lucide-react";
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

  return (
    <section className="dark-section relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A14] via-[#07070D] to-[#05050A]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.4) 0%, transparent 70%), radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.05) 0%, transparent 50%)" }}
      />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rt-accent/5 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/3 rounded-full blur-[100px] animate-float" />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10 py-20 w-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/10 bg-rt-accent/[0.03] mb-6">
                <Sparkles size={10} className="text-rt-accent/60" />
                <span className="section-eyebrow">{t("hero.badge")}</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                {t("hero.heading_1")}
              </span>
              <br />
              <span className="text-gradient-dual">
                {t("hero.heading_2")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/30 text-base max-w-xl mb-8 leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products" className="btn-primary text-xs">
                {t("hero.shop_all")} <ArrowRight size={12} />
              </Link>
              <Link to="/products?category=gaming-pcs" className="btn-outline text-[10px]">
                {t("hero.gaming_rigs")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 mt-10 pt-6 border-t border-white/[0.04]"
            >
              {[
                { icon: Truck, text: t("hero.free_shipping") },
                { icon: Shield, text: t("hero.warranty") },
                { icon: HeadphonesIcon, text: t("hero.support") },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-white/25 text-xs font-mono">
                  <item.icon size={12} className="text-rt-accent/50" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3">
              {categories.filter(c => c.featured).slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group card-glass p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      {ICON_MAP[cat.icon] || "📦"}
                    </span>
                    <ArrowRight size={11} className="text-white/20 group-hover:text-rt-accent/60 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                  <p className="text-white/70 font-semibold text-base group-hover:text-white transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-white/25 text-[10px] mt-0.5 font-mono tracking-wider">
                    {cat.productCount} products
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
