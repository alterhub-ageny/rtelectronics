import { SlidersHorizontal, X } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function ProductFilter({ filters, onChange, onClear }) {
  const { categories } = useCategories();

  const update = (key, value) => onChange({ ...filters, [key]: value });

  const hasFilters = filters.category || filters.sort || filters.minPrice || filters.maxPrice || filters.minRating;

  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-white font-semibold">
          <SlidersHorizontal size={18} className="text-rt-accent" />
          Filters
        </div>
        {hasFilters && (
          <button onClick={onClear} className="text-xs text-rt-accent hover:text-white flex items-center gap-1 transition-colors">
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider font-medium mb-2 block">Category</label>
          <select
            value={filters.category || ""}
            onChange={(e) => update("category", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                       focus:outline-none focus:border-rt-accent/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider font-medium mb-2 block">Sort By</label>
          <select
            value={filters.sort || ""}
            onChange={(e) => update("sort", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                       focus:outline-none focus:border-rt-accent/50 transition-colors appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider font-medium mb-2 block">
            Price Range {filters.minPrice || filters.maxPrice ? `($${filters.minPrice || 0} - $${filters.maxPrice || "∞"})` : ""}
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => update("minPrice", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                         focus:outline-none focus:border-rt-accent/50 transition-colors"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                         focus:outline-none focus:border-rt-accent/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider font-medium mb-2 block">
            Min Rating {filters.minRating ? `(${filters.minRating}+)` : ""}
          </label>
          <div className="flex gap-2">
            {[4, 3].map((r) => (
              <button
                key={r}
                onClick={() => update("minRating", filters.minRating === r ? "" : r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filters.minRating == r
                    ? "bg-rt-accent/20 border border-rt-accent/40 text-rt-accent"
                    : "bg-white/5 border border-white/10 text-white/50 hover:border-white/30"
                }`}
              >
                {r}+ Stars
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
