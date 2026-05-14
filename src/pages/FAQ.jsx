import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDown, Search } from "lucide-react";

export default function FAQ() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState("");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
    { q: t("faq.q10"), a: t("faq.a10") },
  ];

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">{t("faq.badge")}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
          <span className="text-white/90">{t("faq.title_1")}</span>
          <span className="text-crystal">{t("faq.title_2")}</span>
        </h1>
        <div className="max-w-xs mx-auto mt-4">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("faq.search")}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-white/50 text-xs font-mono placeholder:text-white/15 focus:border-rt-accent/30 transition-all"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-2">
        {filtered.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className={`w-full text-left crystal rounded-2xl p-4 transition-all duration-300 ${
                open === i ? "border-rt-accent/20" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/70 text-sm font-medium">{faq.q}</span>
                <ChevronDown
                  size={14}
                  className={`text-white/30 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                />
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-white/30 text-xs font-mono mt-3 leading-relaxed overflow-hidden"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
