import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Zap } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProductsByIds } from "../services/api";
import ProductCard from "../components/product/ProductCard";

export default function Wishlist() {
  const { t } = useTranslation();
  const { ids, toggle } = useWishlist();
  const { addItem } = useCart();
  const addToast = useToast();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (ids.length) {
      getProductsByIds(ids).then(setProducts).catch(() => {});
    } else {
      setProducts([]);
    }
  }, [ids]);

  const handleAddAll = () => {
    products.forEach((p) => addItem(p));
    addToast(`Added ${products.length} items to cart`, "success");
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6 text-[0.6875rem] font-mono">
        <ArrowLeft size={13} /> {t("wishlist.back")}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
            <span className="eyebrow">{t("wishlist.badge")}</span>
          </div>
          <h1 className="heading-md">
            {t("wishlist.title_1")} <span className="text-gradient">{t("wishlist.title_2")}</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-xs font-mono mt-1">{t("wishlist.units", { count: products.length })}</p>
        </div>
        {products.length > 0 && (
          <button onClick={handleAddAll} className="btn btn-primary">
            <Zap size={13} /> {t("wishlist.add_all")}
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 flex items-center justify-center mb-4">
            <Heart size={24} className="text-[var(--color-primary)]/40" />
          </div>
          <p className="heading-md mb-1">{t("wishlist.empty_title")}</p>
          <p className="text-[var(--color-text-muted)] text-xs font-mono mb-6">{t("wishlist.empty_text")}</p>
          <Link to="/products" className="btn btn-primary">{t("wishlist.browse_products")}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => { toggle(product.id); addToast("Removed from wishlist", "info"); }}
                  className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg bg-[var(--product-overlay-bg)] backdrop-blur-sm border border-[var(--product-overlay-border)] flex items-center justify-center text-red-400/60 hover:text-red-400 hover:border-red-400/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
