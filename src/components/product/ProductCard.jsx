import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const addToast = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    addToast(`${product.name} added to cart`, "success");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product.id);
    addToast(wishlisted ? "Removed from wishlist" : "Added to wishlist", "info");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group card-crystal relative overflow-hidden cursor-default"
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="tag-crystal text-[8px] px-2 py-1">
            <Zap size={7} className="mr-0.5" />
            {product.badge}
          </span>
        </div>
      )}
      {product.originalPrice > product.price && (
        <div className="absolute top-3 right-10 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[8px] font-bold bg-red-500/5 text-red-400/60 border border-red-500/10">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        </div>
      )}

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg bg-black/20 backdrop-blur-sm border border-white/[0.03] flex items-center justify-center text-white/20 hover:text-red-400/60 hover:border-red-400/20 transition-all duration-500 opacity-0 group-hover:opacity-100"
      >
        <Heart size={11} className={wishlisted ? "fill-red-400/60 text-red-400/60" : ""} />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 mb-4 overflow-hidden bg-[#020208]/30">
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="flex items-center gap-1 text-[8px] text-white/30 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full font-mono">
              <Zap size={7} className="text-rt-accent/40" />
              VIEW
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white/60 font-display text-sm font-bold mb-1 group-hover:text-rt-accent/70 transition-colors line-clamp-1 tracking-wide">
            {product.name}
          </h3>
        </Link>

        <p className="text-white/15 text-[9px] mb-3 line-clamp-2 font-mono leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={9} className="text-rt-gold/60 fill-rt-gold/60" />
            <span className="text-white/40 text-[9px] font-mono">{product.rating}</span>
          </div>
          <span className="text-white/10 text-[8px] font-mono">
            ({Number(product.reviews || 0).toLocaleString()})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-display font-bold text-rt-accent/70">
              ${Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[9px] text-white/15 line-through font-mono">
                ${Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-8 h-8 rounded-xl bg-rt-accent/[0.04] border border-rt-accent/[0.08] flex items-center justify-center text-rt-accent/40 hover:bg-rt-accent/[0.08] hover:border-rt-accent/20 hover:text-rt-accent/70 transition-all duration-500 group/btn"
          >
            <ShoppingCart size={12} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
