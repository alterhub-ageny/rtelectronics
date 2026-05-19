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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
          <span className="eyebrow">{t("about.badge")}</span>
        </div>
        <h1 className="heading-xl mb-4">
          <span className="text-[var(--color-text)]">{t("about.title_1")}</span>
          <span className="text-gradient">{t("about.title_2")}</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm font-mono max-w-xl mx-auto leading-relaxed">
          {t("about.description")}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="glass-card p-5 text-center"
          >
            <p className="heading-lg text-[var(--color-primary)]">{s.value}</p>
            <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono tracking-wider mt-1 uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="premium-card p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-hover)]/5 border border-[var(--color-primary)]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon size={18} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-sm text-[var(--color-text)] mb-1.5">{v.title}</h3>
              <p className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono leading-relaxed">{v.text}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="glass-panel rounded-[24px] p-10 md:p-14 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="heading-md mb-3">
            <span className="text-[var(--color-text)]">{t("about.cta_title_1")}</span>
            <span className="text-gradient">{t("about.cta_title_2")}</span>
            <span className="text-[var(--color-text-muted)]">{t("about.cta_title_3")}</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-xs font-mono mb-6 max-w-md mx-auto">{t("about.cta_text")}</p>
          <Link to="/products" className="btn btn-primary">
            {t("about.explore")} <ChevronRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
