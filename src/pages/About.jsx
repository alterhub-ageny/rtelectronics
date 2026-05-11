import { motion } from "framer-motion";
import { Zap, Shield, Truck, HeadphonesIcon, Globe, Award } from "lucide-react";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Delivered" },
  { value: "99.9%", label: "Satisfaction Rate" },
  { value: "4.9", label: "Average Rating" },
];

const values = [
  { icon: Zap, title: "Innovation First", text: "We bring the latest tech at the best prices, always ahead of the curve." },
  { icon: Shield, title: "Trust & Security", text: "Every transaction is encrypted and protected. Your data never leaves your control." },
  { icon: Truck, title: "Lightning Delivery", text: "Free shipping on orders over $499 with tracked delivery worldwide." },
  { icon: HeadphonesIcon, title: "24/7 Support", text: "Our tech experts are available around the clock to help you." },
  { icon: Globe, title: "Global Reach", text: "Serving customers in over 50 countries with localized payment options." },
  { icon: Award, title: "Premium Quality", text: "Every product is tested and certified before reaching your doorstep." },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <span className="text-rt-accent text-sm font-mono tracking-widest uppercase">About Us</span>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mt-3 mb-4">
          Building the <span className="text-gradient">Future</span> of Tech Retail
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          RT ELECTRONICS was founded with a single mission: to make cutting-edge technology accessible to everyone. 
          We partner with leading brands to bring you the best products at unbeatable prices.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 text-center border border-white/5"
          >
            <p className="text-3xl md:text-4xl font-display font-bold text-rt-accent text-glow">{s.value}</p>
            <p className="text-white/40 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-rt-accent/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rt-accent/10 to-rt-accent2/10 border border-white/10 flex items-center justify-center mb-4">
                <Icon size={24} className="text-rt-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">{v.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{v.text}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="glass rounded-3xl p-10 md:p-16 text-center border border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rt-accent/5 via-transparent to-rt-accent2/5" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Ready to Experience the Future?</h2>
          <p className="text-white/50 max-w-lg mx-auto mb-8">Browse our catalog and discover technology that inspires.</p>
          <a href="/products" className="btn-primary text-lg">Explore Products</a>
        </div>
      </motion.div>
    </div>
  );
}
