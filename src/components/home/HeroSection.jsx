import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rt-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rt-accent2/5 rounded-full blur-[120px]" />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-rt-accent/10 border border-rt-accent/20 text-rt-accent text-xs font-semibold flex items-center gap-1">
                <Sparkles size={14} /> Next-Gen Tech Store
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.1] mb-6"
            >
              The Future of
              <br />
              <span className="text-gradient text-glow">Technology</span>
              <br />
              Is Here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/50 max-w-xl mb-8 leading-relaxed"
            >
              From cutting-edge laptops and gaming rigs to premium audio and digital game credits — 
              RT ELECTRONICS brings you the finest tech ecosystem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" className="btn-primary text-lg flex items-center gap-2 group">
                Explore Now
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/products?category=gaming-pcs" className="btn-secondary text-lg">
                Gaming Rigs
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-rt-accent/20 via-transparent to-rt-accent2/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {["Laptops", "Phones", "Gaming", "Audio"].map((text, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-rt-accent/30 transition-all duration-500 group"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        {["💻", "📱", "🎮", "🎧"][i]}
                      </div>
                      <p className="text-white/70 font-medium text-sm">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
