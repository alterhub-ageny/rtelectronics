import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilter from "../components/product/ProductFilter";

export default function Products() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const SORT_OPTIONS = [
    { value: "", label: t("products.sort_featured") },
    { value: "price-asc", label: t("products.sort_price_asc") },
    { value: "price-desc", label: t("products.sort_price_desc") },
    { value: "rating", label: t("products.sort_rating") },
    { value: "popular", label: t("products.sort_popular") },
  ];
  const { categories } = useCategories();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.sort) params.sort = filters.sort;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.minRating) params.minRating = filters.minRating;

  const { products, loading } = useProducts(params);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const q = {};
    if (newFilters.category) q.category = newFilters.category;
    if (newFilters.sort) q.sort = newFilters.sort;
    if (newFilters.minPrice) q.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) q.maxPrice = newFilters.maxPrice;
    if (newFilters.minRating) q.minRating = newFilters.minRating;
    setSearchParams(q, { replace: true });
  };

  const clearFilters = () => {
    setFilters({ category: "", sort: "", minPrice: "", maxPrice: "", minRating: "" });
    setSearchParams({}, { replace: true });
  };

  const hasFilters = Object.values(filters).some(Boolean);
  const catName = categories.find((c) => c.slug === filters.category)?.name;

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
          <span className="eyebrow">{catName || t("products.all_products")}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="heading-md">
              {catName || t("products.products_title")}
            </h1>
            <p className="text-[var(--color-text-muted)] text-[0.75rem] font-mono mt-1">
              {loading ? t("common.loading") : t("common.units_found", { count: products.length })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filters.sort || ""}
              onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
              className="select hidden sm:block"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all"
            >
              <SlidersHorizontal size={14} />
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.625rem] font-mono hover:bg-[var(--color-primary)]/5 transition-all"
              >
                <X size={12} /> {t("common.clear")}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className={`lg:col-span-1 ${showFilter ? "block" : "hidden lg:block"}`}>
          <ProductFilter filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
        </aside>
        <div className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
