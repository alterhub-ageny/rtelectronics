import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

export default function CategoryShowcase() {
  const { t } = useTranslation();
  const { categories } = useCategories();

  return (
    <section className="max-w-site mx-auto px-4 sm:px-6 py-24">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
          <Sparkles size={10} className="text-[var(--color-primary)]/60" />
          <span className="eyebrow">{t("categories_page.title")}</span>
        </div>
        <h2 className="heading-md mb-2">
          {t("categories_page.heading")}
        </h2>
        <p className="section-subtitle">
          {t("categories_page.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.5 }}
          >
            <Link
              to={`/products?category=${cat.slug}`}
              className="group premium-card block p-5 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl group-hover:scale-110 transition-all duration-300 inline-block">
                  {cat.icon === "laptop" && "💻"}
                  {cat.icon === "smartphone" && "📱"}
                  {cat.icon === "gamepad-2" && "🎮"}
                  {cat.icon === "tablet" && "📟"}
                  {cat.icon === "watch" && "⌚"}
                  {cat.icon === "headphones" && "🎧"}
                  {cat.icon === "keyboard" && "⌨️"}
                  {cat.icon === "dices" && "🎲"}
                  {cat.icon === "gift" && "🎁"}
                </span>
                <div className="flex items-center gap-1 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                  <span className="text-[0.5625rem] font-mono">{cat.productCount}</span>
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
              <h3 className="font-semibold text-base text-[var(--color-text)] mb-0.5 group-hover:text-[var(--color-primary)] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono">
                {cat.productCount} item{cat.productCount !== 1 ? "s" : ""}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
