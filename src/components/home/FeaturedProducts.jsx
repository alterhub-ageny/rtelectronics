import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getFeatured } from "../../services/api";
import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getFeatured().then(setProducts).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-rt-accent text-sm font-mono tracking-widest uppercase">Featured</span>
          <h2 className="section-title mt-2">Popular Products</h2>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-2 text-white/50 hover:text-rt-accent transition-colors text-sm group"
        >
          View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link to="/products" className="btn-secondary text-sm">
          View All Products <ArrowRight size={14} className="inline ml-1" />
        </Link>
      </div>
    </section>
  );
}
