import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Shield, Truck, CreditCard } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";

export default function CartSummary() {
  const { t } = useTranslation();
  const { totalPrice, items } = useCart();
  const shipping = totalPrice > 499 ? 0 : 19.99;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-white/5 sticky top-28"
    >
      <h3 className="text-lg font-display font-bold text-white mb-6">{t("cart_summary.order_summary")}</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">{t("cart_summary.subtotal", { count: items.length })}</span>
          <span className="text-white font-mono">MAD {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">{t("cart_summary.shipping")}</span>
          <span className={shipping === 0 ? "text-emerald-400 font-mono" : "text-white font-mono"}>
            {shipping === 0 ? t("cart_summary.free") : `MAD ${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">{t("cart_summary.tax")}</span>
          <span className="text-white font-mono">MAD {tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between">
          <span className="text-white font-semibold">{t("cart_summary.total")}</span>
          <span className="text-[var(--color-primary)] font-display font-bold text-xl">MAD {total.toFixed(2)}</span>
        </div>
      </div>

      <Button className="w-full mb-4 text-base" href="/checkout">
        <ShoppingBag size={18} className="inline mr-2" />
        {t("cart_summary.checkout")}
      </Button>

      <div className="space-y-3">
        {[
          { icon: Shield, text: t("cart_summary.secure") },
          { icon: Truck, text: t("cart_summary.free_shipping") },
          { icon: CreditCard, text: t("cart_summary.payment_methods") },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-white/40">
            <Icon size={14} className="text-[var(--color-primary)] shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
