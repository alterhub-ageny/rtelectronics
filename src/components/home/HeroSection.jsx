import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Cpu, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const glowRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={glowRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-neural opacity-[0.015]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070d]/60 to-[#07070d]" />

      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at center, rgb(var(--accent) / 0.04), transparent 60%)`,
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="absolute inset-0">
        <div className="absolute top-16 left-8 w-20 h-20 border-l border-t border-white/5 rounded-tl-xl" />
        <div className="absolute top-16 right-8 w-20 h-20 border-r border-t border-white/5 rounded-tr-xl" />
        <div className="absolute bottom-16 left-8 w-20 h-20 border-l border-b border-white/5 rounded-bl-xl" />
        <div className="absolute bottom-16 right-8 w-20 h-20 border-r border-b border-white/5 rounded-br-xl" />
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
                <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">
                  v.2 Precision Architecture
                </span>
                <Sparkles size={10} className="text-rt-accent" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6"
            >
              <span className="text-white tracking-[-0.03em]">CRYSTAL</span>
              <br />
              <span className="text-crystal">INTELLIGENCE</span>
              <br />
              <span className="text-white/30 text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] font-light">
                /system.v2
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 text-base max-w-xl mb-8 leading-relaxed"
            >
              Crystalline neural networks power the next dimension of tech. From quantum laptops to immersive digital frontiers — engineered beyond conventional limits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products" className="btn-primary text-sm flex items-center gap-2 px-6 py-3">
                EXPLORE
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/products?category=gaming-pcs"
                className="btn-secondary text-sm px-6 py-3 flex items-center gap-2"
              >
                <Cpu size={14} />
                GAMING
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 mt-10 pt-6 border-t border-white/5"
            >
              {[
                { icon: Zap, text: "Free Shipping $99+" },
                { icon: Shield, text: "2 Year Warranty" },
                { icon: Cpu, text: "24/7 Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-white/40 text-xs font-mono">
                  <item.icon size={12} className="text-rt-accent/60" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rt-accent/5 via-transparent to-rt-accent/5 rounded-[40px] blur-3xl" />
              <div className="relative grid grid-cols-2 gap-3">
                {[
                  { label: "LAPTOPS", sub: "M5 Quantum", accent: "from-rt-accent/10" },
                  { label: "PHONES", sub: "Crystal Gen", accent: "from-rt-accent/10" },
                  { label: "GAMING", sub: "Neural Core", accent: "from-rt-accent/10" },
                  { label: "XR", sub: "Depth Field", accent: "from-rt-accent/10" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="group card-edge p-5 flex flex-col items-center text-center cursor-default"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-rt-accent text-lg font-bold">
                        {["◇", "○", "△", "◈"][i]}
                      </span>
                    </div>
                    <p className="text-white/80 font-semibold text-xs tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">{item.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
