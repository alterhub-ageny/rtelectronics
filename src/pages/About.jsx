import { motion } from "framer-motion";
import { Zap, Shield, Truck, HeadphonesIcon, Globe, Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "50K+", label: "Customers" },
  { value: "10K+", label: "Deliveries" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9", label: "Rating" },
];

const values = [
  { icon: Zap, title: "Innovation", text: "Cutting-edge tech at the intersection of design and performance." },
  { icon: Shield, title: "Security", text: "Every transaction encrypted. Your data, your control." },
  { icon: Truck, title: "Velocity", text: "Free shipping over $99 with real-time tracking worldwide." },
  { icon: HeadphonesIcon, title: "Support", text: "Neural network assistance 24/7/365." },
  { icon: Globe, title: "Global", text: "Serving 50+ countries with localized infrastructure." },
  { icon: Award, title: "Quality", text: "Every product certified before reaching your door." },
];

export default function About() {
  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">About</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
          <span className="text-white/90">BUILDING </span>
          <span className="text-crystal">TOMORROW</span>
        </h1>
        <p className="text-white/30 text-sm font-mono max-w-xl mx-auto leading-relaxed">
          RT ELECTRONICS engineers the future of tech retail. We partner with leading brands to bring you next-generation products at the edge of possibility.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="crystal rounded-2xl p-5 text-center"
          >
            <p className="text-2xl md:text-3xl font-display font-bold text-rt-accent text-glow-crystal">{s.value}</p>
            <p className="text-white/30 text-[10px] font-mono tracking-wider mt-1 uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-crystal p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rt-accent/10 to-rt-accent2/5 border border-rt-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon size={18} className="text-rt-accent" />
              </div>
              <h3 className="text-white/80 font-display text-sm font-bold mb-1.5">{v.title}</h3>
              <p className="text-white/30 text-[11px] font-mono leading-relaxed">{v.text}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="cta-crystal rounded-[24px] p-10 md:p-14 text-center border border-white/[0.04] relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-xl md:text-3xl font-display font-bold mb-3">
            <span className="text-white/90">READY FOR THE </span>
            <span className="text-crystal">NEXT LEVEL</span>
            <span className="text-white/40">?</span>
          </h2>
          <p className="text-white/25 text-xs font-mono mb-6 max-w-md mx-auto">
            Browse our catalog and discover technology that redefines boundaries.
          </p>
          <Link to="/products" className="btn-crystal text-xs inline-flex items-center gap-2 px-6 py-3">
            EXPLORE <ChevronRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
