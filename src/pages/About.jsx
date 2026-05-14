import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Zap, Shield, Truck, HeadphonesIcon, Globe, Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: "50K+", label: t("about.customers") },
    { value: "10K+", label: t("about.deliveries") },
    { value: "99.9%", label: t("about.uptime") },
    { value: "4.9", label: t("about.rating") },
  ];

  const values = [
    { icon: Zap, title: t("about.innovation_title"), text: t("about.innovation_text") },
    { icon: Shield, title: t("about.security_title"), text: t("about.security_text") },
    { icon: Truck, title: t("about.velocity_title"), text: t("about.velocity_text") },
    { icon: HeadphonesIcon, title: t("about.support_title"), text: t("about.support_text") },
    { icon: Globe, title: t("about.global_title"), text: t("about.global_text") },
    { icon: Award, title: t("about.quality_title"), text: t("about.quality_text") },
  ];

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">{t("about.badge")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
          <span className="text-white/90">{t("about.title_1")}</span>
          <span className="text-crystal">{t("about.title_2")}</span>
        </h1>
        <p className="text-white/30 text-sm font-mono max-w-xl mx-auto leading-relaxed">
          {t("about.description")}
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
            <span className="text-white/90">{t("about.cta_title_1")}</span>
            <span className="text-crystal">{t("about.cta_title_2")}</span>
            <span className="text-white/40">{t("about.cta_title_3")}</span>
          </h2>
          <p className="text-white/25 text-xs font-mono mb-6 max-w-md mx-auto">
            {t("about.cta_text")}
          </p>
          <Link to="/products" className="btn-crystal text-xs inline-flex items-center gap-2 px-6 py-3">
            {t("about.explore")} <ChevronRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
