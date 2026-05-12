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
    <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/[0.06] bg-rt-accent/[0.02] mb-4">
            <span className="w-1 h-1 rounded-full bg-rt-accent/40 animate-neural-pulse" />
            <span className="text-rt-accent/40 text-[9px] font-mono tracking-[0.2em] uppercase">Featured</span>
          </div>
          <h2 className="section-crystal-title text-3xl md:text-4xl">
            SIGNATURE PICKS
          </h2>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-1.5 text-white/20 hover:text-rt-accent transition-colors text-[10px] font-mono group tracking-wider"
        >
          DISCOVER ALL <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link to="/products" className="btn-ghost text-[10px] px-4 py-2 inline-flex items-center gap-1.5">
          DISCOVER ALL <ArrowRight size={10} />
        </Link>
      </div>
    </section>
  );
}
