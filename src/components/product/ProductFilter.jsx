import { useTranslation } from "react-i18next";
import { SlidersHorizontal, X } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

export default function ProductFilter({ filters, onChange, onClear }) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const SORT_OPTIONS = [
    { value: "", label: t("products.sort_featured") },
    { value: "price-asc", label: t("products.sort_price_asc") },
    { value: "price-desc", label: t("products.sort_price_desc") },
    { value: "rating", label: t("products.sort_rating") },
    { value: "popular", label: t("products.sort_popular") },
  ];

  const update = (key, value) => onChange({ ...filters, [key]: value });

  const hasFilters = filters.category || filters.sort || filters.minPrice || filters.maxPrice || filters.minRating;

  return (
    <div className="crystal rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-white/40 font-display text-[11px] font-bold tracking-wider">
          <SlidersHorizontal size={13} className="text-rt-accent/40" />
          {t("products.filters")}
        </div>
        {hasFilters && (
          <button onClick={onClear} className="text-[9px] text-rt-accent/40 hover:text-white/40 flex items-center gap-1 transition-colors font-mono">
            <X size={10} /> {t("common.clear")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[9px] text-white/20 font-mono tracking-wider mb-2 block">{t("products.category")}</label>
          <select
            value={filters.category || ""}
            onChange={(e) => update("category", e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5 text-white/40 text-[11px] focus:border-rt-accent/20 focus:text-white/60 transition-all appearance-none cursor-pointer font-grotesk"
          >
            <option value="">{t("products.all_categories")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] text-white/20 font-mono tracking-wider mb-2 block">{t("products.sort")}</label>
          <select
            value={filters.sort || ""}
            onChange={(e) => update("sort", e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5 text-white/40 text-[11px] focus:border-rt-accent/20 focus:text-white/60 transition-all appearance-none cursor-pointer font-grotesk"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] text-white/20 font-mono tracking-wider mb-2 block">
            {t("products.price_range")} {filters.minPrice || filters.maxPrice ? `[${filters.minPrice || 0} - ${filters.maxPrice || "∞"}]` : ""}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t("products.min")}
              value={filters.minPrice || ""}
              onChange={(e) => update("minPrice", e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5 text-white/40 text-[11px] placeholder:text-white/10 focus:border-rt-accent/20 focus:text-white/60 transition-all font-mono"
            />
            <input
              type="number"
              placeholder={t("products.max")}
              value={filters.maxPrice || ""}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5 text-white/40 text-[11px] placeholder:text-white/10 focus:border-rt-accent/20 focus:text-white/60 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] text-white/20 font-mono tracking-wider mb-2 block">
            {t("products.min_rating")} {filters.minRating ? `[${filters.minRating}+]` : ""}
          </label>
          <div className="flex gap-2">
            {[4, 3].map((r) => (
              <button
                key={r}
                onClick={() => update("minRating", filters.minRating === r ? "" : r)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-mono transition-all ${
                  filters.minRating == r
                    ? "bg-rt-accent/[0.04] border border-rt-accent/20 text-rt-accent/50"
                    : "bg-white/[0.02] border border-white/[0.03] text-white/20 hover:border-white/10"
                }`}
              >
                {r}+ ★
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
