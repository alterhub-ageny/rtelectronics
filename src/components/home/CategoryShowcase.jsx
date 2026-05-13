import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

export default function CategoryShowcase() {
  const { categories } = useCategories();

  return (
    <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/10 bg-rt-accent/[0.03] mb-4">
          <Sparkles size={10} className="text-rt-accent/60" />
          <span className="section-eyebrow">Categories</span>
        </div>
        <h2 className="section-title mb-2">
          Shop by Category
        </h2>
        <p className="section-subtitle">
          Browse our full range of products
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
              className="group card-glass block p-5 h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300">
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
                <div className="flex items-center gap-1 text-white/15 group-hover:text-rt-accent/50 transition-colors">
                  <span className="text-[9px] font-mono">{cat.productCount}</span>
                  <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
              <h3 className="text-white/80 text-base font-semibold mb-0.5 group-hover:text-white transition-colors">
                {cat.name}
              </h3>
              <p className="text-white/20 text-[10px] font-mono tracking-wider">
                {cat.productCount} item{cat.productCount !== 1 ? "s" : ""}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
