import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card-futuristic animate-pulse">
            <div className="h-56 bg-white/5 rounded-xl mb-5" />
            <div className="h-5 bg-white/5 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-full mb-1" />
            <div className="h-3 bg-white/5 rounded w-2/3 mb-3" />
            <div className="h-4 bg-white/5 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/40">
        <PackageOpen size={48} className="mb-4" />
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
