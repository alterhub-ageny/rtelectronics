import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilter from "../components/product/ProductFilter";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
  });

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

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title">Products</h1>
        <p className="text-white/40 mt-2">
          {loading ? "Loading..." : `${products.length} products found`}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilter filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
        </aside>
        <div className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
