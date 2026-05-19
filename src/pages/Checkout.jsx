import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Check, Gift, Truck, Percent, FileText, X, Banknote } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder, validateCoupon } from "../services/api";

export default function Checkout() {
  const { t } = useTranslation();
  const { items, totalPrice, clearCart } = useCart();
  const SHIPPING_METHODS = [
    { id: "standard", label: t("checkout.standard"), time: t("checkout.standard_time"), cost: 19.99 },
    { id: "express", label: t("checkout.express"), time: t("checkout.express_time"), cost: 39.99 },
    { id: "overnight", label: t("checkout.overnight"), time: t("checkout.overnight_time"), cost: 69.99 },
  ];
  const { user } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponErr, setCouponErr] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [giftWrap, setGiftWrap] = useState(false);
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", address: "",
    city: "", phone: "",
  });

  const shipping = SHIPPING_METHODS.find((s) => s.id === shippingMethod)?.cost || 0;
  const freeShipping = totalPrice > 499;
  const effectiveShipping = freeShipping ? 0 : shipping;
  const tax = totalPrice * 0.08;
  const giftWrapCost = giftWrap ? 4.99 : 0;
  const couponDiscount = coupon ? (coupon.type === "free_shipping" ? effectiveShipping : coupon.discount) : 0;
  const total = Math.max(0, totalPrice + effectiveShipping + tax + giftWrapCost - couponDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponErr("");
    try {
      const res = await validateCoupon(couponCode, totalPrice);
      setCoupon(res.coupon);
      addToast(t("checkout.coupon_applied_toast"), "success");
    } catch (err) {
      setCouponErr(err.message);
      setCoupon(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) { addToast(t("checkout.fill_required"), "warning"); return; }
    setSubmitting(true);
    try {
      await createOrder({
        items,
        total,
        shipping: effectiveShipping,
        tax,
        coupon,
        shippingMethod,
        giftWrap,
        notes,
        phone: form.phone,
        address: { street: form.address, city: form.city },
      });
      clearCart();
      setAdvanceAmount(Math.round(total * 0.1 * 100) / 100);
      setDone(true);
      setShowAdvance(true);
    } catch { addToast(t("checkout.order_failed"), "error"); }
    finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="glass-card p-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-[var(--color-primary)]" />
          </div>
          <h2 className="heading-md mb-2">{t("checkout.order_confirmed")}</h2>
          <p className="text-[var(--color-text-muted)] text-xs font-mono mb-6">{t("checkout.order_confirmed_text")}</p>
          <button onClick={() => setShowAdvance(true)} className="btn btn-primary mb-3 w-full justify-center">
            {t("checkout.advance_pay_now")}
          </button>
          <Link to="/products" className="block text-[var(--color-text-muted)] hover:text-[var(--color-primary)] text-xs font-mono transition-colors">{t("checkout.continue")}</Link>
        </motion.div>

        <AnimatePresence>
          {showAdvance && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdvance(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowAdvance(false)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--color-text-muted)] transition-all"><X size={16} /></button>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Banknote size={22} className="text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-wider mb-1">{t("checkout.advance_title")}</h3>
                <p className="text-[var(--color-text-muted)] text-xs mb-4">{t("checkout.advance_text")}</p>

                <div className="bg-[var(--card-bg)] rounded-xl p-4 mb-4 border border-[var(--card-border)]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[var(--color-text-muted)] text-xs">{t("checkout.advance_amount")}</span>
                    <span className="text-[var(--color-primary)] font-mono font-bold text-lg">MAD {advanceAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[var(--card-border)] pt-3">
                    <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono whitespace-pre-line leading-relaxed">{t("checkout.advance_instructions")}</p>
                  </div>
                </div>

                <p className="text-amber-400/70 text-[0.625rem] font-mono mb-4">{t("checkout.advance_reminder")}</p>

                <button onClick={() => { setShowAdvance(false); navigate("/products"); }} className="btn btn-primary w-full justify-center">
                  {t("checkout.advance_pay_later")}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!items.length) { navigate("/cart"); return null; }

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6 text-[0.6875rem] font-mono">
        <ArrowLeft size={13} /> {t("checkout.back_to_cart")}
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] mb-4">
          <span className="eyebrow">{t("checkout.badge")}</span>
        </div>
        <h1 className="heading-md">
          {t("checkout.complete_order")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text)] tracking-wider mb-5">{t("checkout.shipping_data")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("checkout.full_name")}</label>
                <input required value={form.name} onChange={update("name")} placeholder="John Doe" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("checkout.email")}</label>
                <input required type="email" value={form.email} onChange={update("email")} placeholder="john@example.com" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("checkout.phone")}</label>
                <input required type="tel" value={form.phone} onChange={update("phone")} placeholder="+212 6XX XXX XXX" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("checkout.address")}</label>
                <input required value={form.address} onChange={update("address")} placeholder="123 Tech Street" className="input" />
              </div>
              <div>
                <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("checkout.city")}</label>
                <input required value={form.city} onChange={update("city")} placeholder="Casablanca" className="input" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text)] tracking-wider mb-4 flex items-center gap-2">
              <Truck size={14} className="text-[var(--color-primary)]" /> {t("checkout.shipping_title")}
            </h2>
            <div className="space-y-2">
              {SHIPPING_METHODS.map((s) => (
                <label key={s.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === s.id ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.04]" : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--color-text-muted)]/30"
                }`}>
                  <input type="radio" name="shipping" value={s.id} checked={shippingMethod === s.id} onChange={() => setShippingMethod(s.id)} className="accent-[var(--color-primary)]" />
                  <div className="flex-1">
                    <p className="text-[var(--color-text)] text-xs font-medium">{s.label}</p>
                    <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono">{s.time}</p>
                  </div>
                  <span className="text-[var(--color-text-muted)] text-xs font-mono">
                    {freeShipping && s.id === "standard" ? t("checkout.free") : `MAD ${s.cost}`}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text)] tracking-wider mb-4 flex items-center gap-2">
              <Gift size={14} className="text-[var(--color-primary)]" /> {t("checkout.extras")}
            </h2>
            <label className="flex items-center gap-3 mb-3 cursor-pointer p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <input type="checkbox" checked={giftWrap} onChange={() => setGiftWrap(!giftWrap)} className="accent-[var(--color-primary)] w-3.5 h-3.5" />
              <div>
                <p className="text-[var(--color-text)] text-xs">{t("checkout.gift_wrap")}</p>
                <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono">{t("checkout.gift_wrap_desc")}</p>
              </div>
            </label>
            <div>
              <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block flex items-center gap-1"><FileText size={11} /> {t("checkout.notes")}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={t("checkout.special_instructions")}
                className="input resize-none" />
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4 sticky top-28">
            <div className="glass-card p-5">
              <h3 className="text-[var(--color-text-muted)] text-xs font-semibold tracking-wider mb-3 flex items-center gap-2">
                <Percent size={12} className="text-[var(--color-primary)]" /> {t("checkout.coupon")}
              </h3>
              <div className="flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={t("checkout.enter_code")}
                  className="flex-1 input" />
                <button type="button" onClick={handleApplyCoupon} className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[0.6875rem] font-medium hover:bg-[var(--color-primary)]/20 transition-all">{t("checkout.apply")}</button>
              </div>
              {coupon && <p className="text-[var(--color-primary)]/60 text-[0.625rem] mt-2 font-mono">{t("checkout.coupon_applied")}</p>}
              {couponErr && <p className="text-red-400 text-[0.625rem] mt-2 font-mono">! {couponErr}</p>}
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-wider mb-4">{t("checkout.summary")}</h3>
              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 bg-[var(--card-bg)] rounded-xl p-2">
                    <img src={item.images?.[0] || ""} alt={item.name} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--color-text-muted)] text-[0.6875rem] truncate">{item.name}</p>
                      <p className="text-[var(--color-text-muted)] text-[0.5625rem] font-mono opacity-60">x{item.quantity}</p>
                    </div>
                    <span className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono">MAD {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-xs border-t border-[var(--card-border)] pt-3">
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)] font-mono text-[0.6875rem]">{t("checkout.subtotal")}</span><span className="text-[var(--color-text)] font-mono text-[0.6875rem] opacity-70">MAD {totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)] font-mono text-[0.6875rem]">{t("checkout.shipping_line")}</span><span className={`font-mono text-[0.6875rem] ${freeShipping ? "text-emerald-400" : "text-[var(--color-text)] opacity-70"}`}>{freeShipping ? t("checkout.free") : `MAD ${effectiveShipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)] font-mono text-[0.6875rem]">{t("checkout.tax_line")}</span><span className="text-[var(--color-text)] font-mono text-[0.6875rem] opacity-70">MAD {tax.toFixed(2)}</span></div>
                {giftWrap && <div className="flex justify-between"><span className="text-[var(--color-text-muted)] font-mono text-[0.6875rem]">{t("checkout.gift_wrap_line")}</span><span className="text-[var(--color-text)] font-mono text-[0.6875rem] opacity-70">MAD 4.99</span></div>}
                {coupon && <div className="flex justify-between"><span className="text-[var(--color-primary)]/50 font-mono text-[0.6875rem]">{t("checkout.discount", { code: coupon.code })}</span><span className="text-[var(--color-primary)] font-mono text-[0.6875rem]">-MAD {couponDiscount.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t border-[var(--card-border)] pt-2 mt-2">
                  <span className="text-[var(--color-text)] text-sm font-bold">{t("checkout.total")}</span>
                  <span className="price text-base">MAD {total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary w-full justify-center mt-4">
                {submitting ? <><span className="spinner w-4 h-4" /> {t("checkout.processing")}</> : <><Banknote size={13} /> {t("checkout.place_order")}</>}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
