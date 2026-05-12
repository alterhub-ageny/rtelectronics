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
      className="group card-crystal relative overflow-hidden"
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="tag-crystal text-[10px] px-2.5 py-1">
            <Zap size={9} className="mr-0.5" />
            {product.badge}
          </span>
        </div>
      )}
      {product.originalPrice > product.price && (
        <div className="absolute top-3 right-10 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        </div>
      )}

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all opacity-0 group-hover:opacity-100"
      >
        <Heart size={12} className={wishlisted ? "fill-red-400 text-red-400" : ""} />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 mb-4 overflow-hidden bg-[#07070d]/50">
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="flex items-center gap-1 text-[10px] text-white/50 bg-black/50 px-2 py-1 rounded-full font-mono">
              <Zap size={8} className="text-rt-accent/60" />
              VIEW
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white/80 font-medium text-sm mb-1 group-hover:text-rt-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-white/30 text-[11px] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-white/50 text-[11px] font-mono">{product.rating}</span>
          </div>
          <span className="text-white/20 text-[10px] font-mono">
            ({Number(product.reviews || 0).toLocaleString()})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-rt-accent">
              ${Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-white/30 line-through font-mono">
                ${Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center text-rt-accent hover:bg-rt-accent/20 hover:border-rt-accent/40 transition-all"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
