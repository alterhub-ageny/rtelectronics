import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-7xl md:text-8xl font-display font-bold text-crystal text-glow-crystal mb-4"
      >
        404
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-white/50 font-display mb-2"
      >
        {t("notfound.title")}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/20 text-xs font-mono mb-8 max-w-sm"
      >
        {t("notfound.text")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <Link to="/" className="btn-crystal text-xs flex items-center gap-2 px-5 py-2.5">
          <Home size={14} /> {t("notfound.return")}
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-ghost text-xs flex items-center gap-2 px-5 py-2.5"
        >
          <ArrowLeft size={14} /> {t("notfound.back")}
        </button>
      </motion.div>
    </div>
  );
}
