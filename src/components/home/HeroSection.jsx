import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Cpu, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const depthWords = [
  { text: "NEURAL", x: "8%", y: "25%", delay: 0, size: "text-[8px]", opacity: "opacity-[0.08]" },
  { text: "CRYSTAL", x: "80%", y: "18%", delay: 0.8, size: "text-[9px]", opacity: "opacity-[0.06]" },
  { text: "QUANTUM", x: "12%", y: "72%", delay: 1.5, size: "text-[7px]", opacity: "opacity-[0.07]" },
  { text: "∞", x: "88%", y: "78%", delay: 2, size: "text-lg", opacity: "opacity-[0.05]" },
  { text: "VOID", x: "50%", y: "12%", delay: 0.5, size: "text-[10px]", opacity: "opacity-[0.04]" },
];

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
      <div className="absolute inset-0 bg-neural opacity-[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020208]/60 to-[#020208]" />

      {depthWords.map((word) => (
        <motion.span
          key={word.text}
          className={`absolute ${word.opacity} ${word.size} font-display font-bold tracking-[0.3em] pointer-events-none text-white select-none`}
          style={{ left: word.x, top: word.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: word.delay + 0.5, duration: 2 }}
        >
          {word.text}
        </motion.span>
      ))}

      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-1500 ease-out"
        style={{
          background: `radial-gradient(circle at center, rgb(var(--rt-accent) / 0.06), transparent 60%)`,
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="absolute inset-0">
        <div className="absolute top-16 left-8 w-20 h-20 border-l border-t border-rt-accent/[0.06] rounded-tl-xl" />
        <div className="absolute top-16 right-8 w-20 h-20 border-r border-t border-rt-accent/[0.06] rounded-tr-xl" />
        <div className="absolute bottom-16 left-8 w-20 h-20 border-l border-b border-rt-accent/[0.06] rounded-bl-xl" />
        <div className="absolute bottom-16 right-8 w-20 h-20 border-r border-b border-rt-accent/[0.06] rounded-br-xl" />
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/[0.06] bg-rt-accent/[0.02] mb-6">
                <span className="w-1 h-1 rounded-full bg-rt-accent/40 animate-neural-pulse" />
                <span className="text-rt-accent/50 text-[9px] font-mono tracking-[0.2em] uppercase">
                  v.∞ Crystal Architecture
                </span>
                <Sparkles size={8} className="text-rt-accent/30" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-6"
            >
              <span className="text-white/60 tracking-[-0.03em]">CRYSTAL</span>
              <br />
              <span className="text-crystal text-glow-crystal">INTELLIGENCE</span>
              <br />
              <span className="text-white/15 text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-grotesk font-light">
                /system.v2
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/20 text-sm max-w-xl mb-8 leading-relaxed font-grotesk font-light tracking-wide"
            >
              Crystalline neural networks power the next dimension of tech. From quantum laptops to immersive digital frontiers — engineered beyond conventional limits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products" className="btn-crystal text-[10px] flex items-center gap-2 group px-6 py-3">
                <span className="tracking-[0.15em]">EXPLORE</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/products?category=gaming-pcs"
                className="btn-ghost text-[10px] px-6 py-3 flex items-center gap-2"
              >
                <Cpu size={12} />
                <span className="tracking-[0.15em]">RIGS</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 mt-10 pt-6 border-t border-white/[0.02]"
            >
              {[
                { icon: Zap, text: "Free Ship $99+" },
                { icon: Shield, text: "Crystal Warranty" },
                { icon: Cpu, text: "Neural Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-white/15 text-[9px] font-mono tracking-wider">
                  <item.icon size={9} className="text-rt-accent/30" />
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
              <div className="absolute inset-0 bg-gradient-to-br from-rt-accent/5 via-transparent to-rt-magenta/5 rounded-[40px] blur-3xl" />
              <div className="relative grid grid-cols-2 gap-3">
                {[
                  { label: "LAPTOPS", sub: "M5 Quantum", accent: "from-rt-accent/10" },
                  { label: "PHONES", sub: "Crystal Gen", accent: "from-rt-magenta/10" },
                  { label: "GAMING", sub: "Neural Core", accent: "from-rt-accent/10" },
                  { label: "XR", sub: "Depth Field", accent: "from-rt-magenta/10" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="group card-crystal p-5 flex flex-col items-center text-center cursor-default"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} to-transparent border border-white/[0.04] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-700`}>
                      <span className="text-rt-accent/60 text-lg font-display font-bold">
                        {["◇", "○", "△", "◈"][i]}
                      </span>
                    </div>
                    <p className="text-white/60 font-display text-xs font-bold tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-white/15 text-[9px] font-mono mt-0.5">{item.sub}</p>
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
