import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5"
    >
      <Link to={`/product/${item.id}`} className="shrink-0">
        <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.id}`} className="text-white font-medium hover:text-[var(--color-primary)] transition-colors line-clamp-1">
          {item.name}
        </Link>
        <p className="text-[var(--color-primary)] font-display font-bold text-lg mt-1">
          ${(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-white font-medium text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
