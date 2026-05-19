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
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-[var(--color-text-muted)] font-display text-[11px] font-bold tracking-wider">
          <SlidersHorizontal size={13} className="text-[var(--color-primary)]/60" />
          {t("products.filters")}
        </div>
        {hasFilters && (
          <button onClick={onClear} className="text-[9px] text-[var(--color-primary)]/60 hover:text-[var(--color-text-muted)] flex items-center gap-1 transition-colors font-mono">
            <X size={10} /> {t("common.clear")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[9px] text-[var(--color-text-muted)] font-mono tracking-wider mb-2 block">{t("products.category")}</label>
          <select
            value={filters.category || ""}
            onChange={(e) => update("category", e.target.value)}
            className="select"
          >
            <option value="">{t("products.all_categories")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] text-[var(--color-text-muted)] font-mono tracking-wider mb-2 block">{t("products.sort")}</label>
          <select
            value={filters.sort || ""}
            onChange={(e) => update("sort", e.target.value)}
            className="select"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] text-[var(--color-text-muted)] font-mono tracking-wider mb-2 block">
            {t("products.price_range")} {filters.minPrice || filters.maxPrice ? `[${filters.minPrice || 0} - ${filters.maxPrice || "∞"}]` : ""}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t("products.min")}
              value={filters.minPrice || ""}
              onChange={(e) => update("minPrice", e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder={t("products.max")}
              value={filters.maxPrice || ""}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] text-[var(--color-text-muted)] font-mono tracking-wider mb-2 block">
            {t("products.min_rating")} {filters.minRating ? `[${filters.minRating}+]` : ""}
          </label>
          <div className="flex gap-2">
            {[4, 3].map((r) => (
              <button
                key={r}
                onClick={() => update("minRating", filters.minRating === r ? "" : r)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-mono transition-all ${
                  filters.minRating == r
                    ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)]"
                    : "bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
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
