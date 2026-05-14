import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Trash2, ShoppingCart, ArrowRight, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const { t } = useTranslation();
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const addToast = useToast();

  const handleRemove = (id, name) => {
    removeItem(id);
    addToast(`${name} ${t("cart.removed")}`, "info");
  };

  if (!items.length) {
    return (
      <div className="max-w-site mx-auto px-4 sm:px-6 py-20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={24} className="text-rt-accent" />
          </div>
          <h2 className="text-xl font-display font-bold text-white/80 mb-2">{t("cart.empty_title")}</h2>
          <p className="text-white/30 text-xs font-mono mb-6">{t("cart.empty_text")}</p>
          <Link to="/products" className="btn-crystal text-xs inline-flex items-center gap-2 px-5 py-2.5">
            {t("cart.browse_products")} <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">{t("cart.badge")}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white/90">
          {t("cart.title")} <span className="text-white/30">({totalItems})</span>
        </h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="crystal rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl bg-rt-dark/50 border border-white/[0.04] overflow-hidden shrink-0">
                <img src={item.images?.[0] || ""} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white/70 text-sm font-medium truncate">{item.name}</h3>
                <p className="text-rt-accent text-xs font-mono mt-0.5">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border border-white/[0.06] rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.04] transition-all text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-white/60 text-xs font-mono">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.04] transition-all text-xs"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <div className="crystal rounded-2xl p-5 space-y-4">
            <h3 className="text-white/60 font-display text-xs font-bold tracking-wider">{t("cart.order_summary")}</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-white/30"><span>{t("cart.items")}</span><span className="text-white/50">{totalItems}</span></div>
              <div className="flex justify-between text-white/30"><span>{t("cart.subtotal")}</span><span className="text-rt-accent">${Number(totalPrice).toFixed(2)}</span></div>
              <div className="flex justify-between text-white/30"><span>{t("cart.shipping")}</span><span className="text-white/50">{t("cart.calculated_next")}</span></div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-xs font-mono">{t("cart.total")}</span>
              <span className="text-lg font-display font-bold text-rt-accent">${Number(totalPrice).toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn-crystal w-full flex items-center justify-center gap-2 text-xs py-3"
            >
              <Zap size={14} /> {t("cart.checkout")} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
