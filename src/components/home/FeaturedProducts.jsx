import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { getFeatured } from "../../services/api";
import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getFeatured().then(setProducts).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="max-w-site mx-auto px-4 sm:px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
            <Sparkles size={10} className="text-[var(--color-primary)]/60" />
            <span className="eyebrow">{t("home.featured")}</span>
          </div>
          <h2 className="section-title">
            {t("home.top_picks")}
          </h2>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-[0.625rem] font-mono tracking-wider group"
        >
          {t("home.view_all")} <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link to="/products" className="btn btn-outline">
          {t("home.view_all")} <ArrowRight size={10} />
        </Link>
      </div>
    </section>
  );
}
