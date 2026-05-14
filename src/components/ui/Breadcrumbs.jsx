import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
      <Link to="/" className="text-white/40 hover:text-rt-accent transition-colors">{t("breadcrumbs.home")}</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-white/20" />
          {item.href ? (
            <Link to={item.href} className="text-white/40 hover:text-rt-accent transition-colors">{item.label}</Link>
          ) : (
            <span className="text-white/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
