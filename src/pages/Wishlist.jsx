import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProductsByIds } from "../services/api";
import ProductCard from "../components/product/ProductCard";

export default function Wishlist() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-rt-accent transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Heart size={28} className="text-rt-accent" />
            Wishlist
          </h1>
          <p className="text-white/40 mt-1">{products.length} saved items</p>
        </div>
        {products.length > 0 && (
          <button onClick={handleAddAll} className="btn-primary text-sm flex items-center gap-2">
            <ShoppingCart size={16} /> Add All to Cart
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/40">
          <Heart size={64} className="mb-6 opacity-30" />
          <p className="text-2xl font-display text-white/30 mb-2">Your wishlist is empty</p>
          <p className="text-sm mb-8">Save items you love by tapping the heart icon</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => { toggle(product.id); addToast("Removed from wishlist", "info"); }}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
