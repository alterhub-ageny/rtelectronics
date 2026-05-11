import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

export default function Cart() {
  const { items, clearCart } = useCart();

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-rt-accent transition-colors mb-3 text-sm">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 className="section-title flex items-center gap-3">
            <ShoppingBag size={32} className="text-rt-accent" />
            Shopping Cart
          </h1>
          <p className="text-white/40 mt-1">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-sm text-white/30 hover:text-red-400 transition-colors">
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 text-white/40"
        >
          <ShoppingBag size={64} className="mb-6 opacity-30" />
          <p className="text-2xl font-display text-white/30 mb-2">Your cart is empty</p>
          <p className="text-sm mb-8">Looks like you haven't added anything yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
