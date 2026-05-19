import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ products, loading }) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="crystal rounded-2xl p-4">
            <div className="h-48 bg-white/5 rounded-xl mb-4 animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-2 bg-white/5 rounded w-full mb-1 animate-pulse" />
            <div className="h-2 bg-white/5 rounded w-2/3 mb-3 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/[0.02] border border-[var(--color-primary)]/[0.04] flex items-center justify-center mb-4">
          <PackageOpen size={24} className="text-[var(--color-primary)]/20" />
        </div>
        <p className="text-sm font-display font-bold text-white/30 tracking-wider">{t("common.no_units_found")}</p>
        <p className="text-[10px] font-mono text-white/15 mt-1">{t("common.adjust_filters")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
