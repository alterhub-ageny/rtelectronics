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
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group card-glass relative overflow-hidden glass-shine"
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="tag">
            <Zap size={9} className="mr-0.5" />
            {product.badge}
          </span>
        </div>
      )}
      {product.originalPrice > product.price && (
        <div className="absolute top-3 right-10 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        </div>
      )}

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-[var(--product-overlay-bg)] backdrop-blur-sm border border-[var(--product-overlay-border)] flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all opacity-0 group-hover:opacity-100"
      >
        <Heart size={12} className={wishlisted ? "fill-red-400 text-red-400" : ""} />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-[var(--product-image-bg)]">
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "var(--product-image-gradient)" }} />
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <span className="flex items-center gap-1 text-[10px] text-white/50 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full font-mono border border-[var(--product-overlay-border)]">
                <Zap size={8} className="text-rt-accent/60" />
                {t("product_card.view")}
              </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white/70 font-medium text-sm mb-1 group-hover:text-white transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-white/25 text-[11px] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-white/50 text-[11px] font-mono">{product.rating}</span>
          </div>
          <span className="text-white/15 text-[10px] font-mono">
            ({Number(product.reviews || 0).toLocaleString()})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">
              ${Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="ml-1.5 text-[11px] text-white/20 line-through font-mono">
                ${Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-rt-accent/10 to-rt-accent/5 border border-rt-accent/15 flex items-center justify-center text-rt-accent hover:from-rt-accent/20 hover:to-rt-accent/10 hover:border-rt-accent/30 hover:shadow-lg hover:shadow-rt-accent/10 transition-all"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
