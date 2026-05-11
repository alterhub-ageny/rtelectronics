import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Laptop, Smartphone, Gamepad2, Tablet, Headphones, Keyboard, Dices, Gift } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

const ICON_MAP = { laptop: Laptop, smartphone: Smartphone, "gamepad-2": Gamepad2, tablet: Tablet, headphones: Headphones, keyboard: Keyboard, dices: Dices, gift: Gift };

export default function CategoryShowcase() {
  const { categories } = useCategories();

  return (
    <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <span className="text-rt-accent text-sm font-mono tracking-widest uppercase">Categories</span>
        <h2 className="section-title mt-2">Shop by Category</h2>
        <p className="text-white/40 mt-3 max-w-xl mx-auto">
          Explore our curated collection of premium tech products and digital services
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] || Laptop;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group card-futuristic flex flex-col items-center text-center p-6 h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rt-accent/10 to-rt-accent2/10 border border-white/10 flex items-center justify-center mb-4 group-hover:border-rt-accent/30 group-hover:shadow-lg group-hover:shadow-rt-accent/10 transition-all duration-500">
                  <Icon size={26} className="text-rt-accent group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1 group-hover:text-rt-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{cat.description}</p>
                <div className="mt-3 text-rt-accent/60 group-hover:text-rt-accent transition-colors">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
