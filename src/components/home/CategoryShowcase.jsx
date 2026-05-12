import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Laptop, Smartphone, Gamepad2, Tablet, Watch, Headphones, Mouse, Gem, Gift } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

const ICON_MAP = { laptop: Laptop, smartphone: Smartphone, "gamepad-2": Gamepad2, tablet: Tablet, watch: Watch, headphones: Headphones, keyboard: Mouse, dices: Gem, gift: Gift };

export default function CategoryShowcase() {
  const { categories } = useCategories();

  return (
    <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/[0.06] bg-rt-accent/[0.02] mb-4">
          <span className="w-1 h-1 rounded-full bg-rt-accent/40 animate-neural-pulse" />
          <span className="text-rt-accent/40 text-[9px] font-mono tracking-[0.2em] uppercase">Domains</span>
        </div>
        <h2 className="section-crystal-title text-3xl md:text-4xl mb-3">
          EXPLORE DIMENSIONS
        </h2>
        <p className="text-white/15 text-xs font-mono max-w-md mx-auto tracking-wider">
          Navigate our crystalline tech ecosystems.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] || Laptop;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.6 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group card-crystal p-5 flex flex-col items-center text-center h-full"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-rt-accent/20 transition-all duration-700">
                  <Icon size={17} className="text-white/30 group-hover:text-rt-accent/60 transition-colors duration-500" />
                </div>
                <h3 className="text-white/50 font-display text-[11px] font-bold mb-1 group-hover:text-rt-accent/70 transition-colors tracking-wider uppercase">
                  {cat.name}
                </h3>
                <p className="text-white/15 text-[8px] font-mono leading-relaxed line-clamp-2 tracking-wider">{cat.description}</p>
                <div className="mt-auto pt-3">
                  <ArrowRight size={11} className="text-white/15 group-hover:text-rt-accent/40 transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
