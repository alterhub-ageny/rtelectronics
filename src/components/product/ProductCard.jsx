import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Zap, Heart } from "lucide-react";
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
    addToast(wishlisted ? "Removed from wishlist" : "Added to wishlist", wishlisted ? "info" : "info");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group card-futuristic relative overflow-hidden"
    >
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-rt-accent to-rt-accent2 text-white shadow-lg shadow-rt-accent/20">
            {product.badge}
          </span>
        </div>
      )}
      {product.originalPrice && (
        <div className="absolute top-4 right-12 z-10">
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        </div>
      )}

      <button onClick={handleWishlist} className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30 transition-all opacity-0 group-hover:opacity-100">
        <Heart size={16} className={wishlisted ? "fill-red-400 text-red-400" : ""} />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-56 mb-5 rounded-xl overflow-hidden bg-rt-dark/50">
          <img src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rt-darker/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="flex items-center gap-1 text-xs text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <Zap size={12} className="text-rt-accent" /> Quick View
            </span>
          </div>
        </div>
      </Link>

      <Link to={`/product/${product.id}`}>
        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-rt-accent transition-colors line-clamp-1">
          {product.name}
        </h3>
      </Link>

      <p className="text-white/40 text-xs mb-3 line-clamp-2 leading-relaxed">{product.description}</p>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-rt-gold fill-rt-gold" />
          <span className="text-white/70 text-sm font-medium">{product.rating}</span>
        </div>
        <span className="text-white/20 text-xs">({product.reviews.toLocaleString()} reviews)</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-display font-bold text-rt-accent">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-white/30 line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="p-2.5 rounded-xl bg-rt-accent/10 border border-rt-accent/20 text-rt-accent hover:bg-rt-accent/20 hover:border-rt-accent/40 transition-all"
        >
          <ShoppingCart size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
