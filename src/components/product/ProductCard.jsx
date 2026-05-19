import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";

export default function ProductCard({ product, index = 0 }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const addToast = useToast();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    addToast(t("product_card.added_to_cart", { name: product.name }), "success");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product.id);
    addToast(wishlisted ? t("product_card.removed_from_wishlist") : t("product_card.added_to_wishlist"), "info");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group premium-card"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="badge">
            <Zap size={9} />
            {product.badge}
          </span>
        )}
      </div>
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[0.625rem] font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5">
            -{discount}%
          </span>
        </div>
      )}

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-[var(--product-overlay-bg)] backdrop-blur-sm border border-[var(--product-overlay-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-400 hover:border-red-400/30 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
      >
        <Heart size={12} className={wishlisted ? "fill-red-400 text-red-400" : ""} />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-[var(--product-image-bg)]">
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
            <span className="flex items-center gap-1.5 text-[0.625rem] text-[var(--color-text-muted)] bg-[var(--product-overlay-bg)] backdrop-blur-sm px-2.5 py-1 rounded-full border border-[var(--product-overlay-border)]">
              <Zap size={8} className="text-[var(--color-primary)]/60" />
              {t("product_card.view")}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[var(--color-text-muted)] text-[0.6875rem] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono">{product.rating}</span>
          </div>
          <span className="text-[var(--color-text-muted)] text-[0.625rem] font-mono opacity-50">
            ({Number(product.reviews || 0).toLocaleString()})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="price text-lg">
              MAD {Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-[0.6875rem] text-[var(--color-text-muted)] line-through font-mono opacity-50">
                MAD {Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-lg bg-[var(--card-bg-hover)] border border-[var(--card-border)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/20"
          >
            <ShoppingCart size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
