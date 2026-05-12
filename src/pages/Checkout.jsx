import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Lock, Gift, Truck, Percent, FileText } from "lucide-react";
import TrustBadges from "../components/extra/TrustBadges";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder, validateCoupon } from "../services/api";

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard", time: "5-7 business days", cost: 19.99 },
  { id: "express", label: "Express", time: "2-3 business days", cost: 39.99 },
  { id: "overnight", label: "Overnight", time: "1 business day", cost: 69.99 },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponErr, setCouponErr] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [giftWrap, setGiftWrap] = useState(false);
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", address: "",
    city: "", zip: "", card: "",
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
      addToast(`Coupon applied!`, "success");
    } catch (err) {
      setCouponErr(err.message);
      setCoupon(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) { addToast("Please fill all required fields", "warning"); return; }
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
        address: { street: form.address, city: form.city, zip: form.zip },
      });
      clearCart();
      setDone(true);
    } catch { addToast("Order failed. Please try again.", "error"); }
    finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="crystal rounded-[24px] p-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-rt-accent" />
          </div>
          <h2 className="text-xl font-display font-bold text-white/90 mb-2">ORDER CONFIRMED</h2>
          <p className="text-white/30 text-xs font-mono mb-6">Your transmission has been received. Confirmation signal incoming.</p>
          <Link to="/products" className="btn-crystal text-xs inline-flex items-center gap-2 px-5 py-2.5">CONTINUE</Link>
        </motion.div>
      </div>
    );
  }

  if (!items.length) { navigate("/cart"); return null; }

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-white/30 hover:text-rt-accent transition-colors mb-6 text-[11px] font-mono">
        <ArrowLeft size={13} /> BACK TO CART
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">Checkout</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white/90">
          COMPLETE <span className="text-crystal">ORDER</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="crystal rounded-2xl p-5">
            <h2 className="text-sm font-display font-bold text-white/80 tracking-wider mb-5">SHIPPING DATA</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">FULL NAME *</label>
                <input required value={form.name} onChange={update("name")} placeholder="John Doe" className="input-crystal text-xs py-2.5" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">EMAIL *</label>
                <input required type="email" value={form.email} onChange={update("email")} placeholder="john@example.com" className="input-crystal text-xs py-2.5" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">ADDRESS *</label>
                <input required value={form.address} onChange={update("address")} placeholder="123 Tech Street" className="input-crystal text-xs py-2.5" />
              </div>
              <div>
                <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">CITY *</label>
                <input required value={form.city} onChange={update("city")} placeholder="New York" className="input-crystal text-xs py-2.5" />
              </div>
              <div>
                <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">ZIP *</label>
                <input required value={form.zip} onChange={update("zip")} placeholder="10001" className="input-crystal text-xs py-2.5" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="crystal rounded-2xl p-5">
            <h2 className="text-sm font-display font-bold text-white/80 tracking-wider mb-4 flex items-center gap-2">
              <Truck size={14} className="text-rt-accent" /> SHIPPING
            </h2>
            <div className="space-y-2">
              {SHIPPING_METHODS.map((s) => (
                <label key={s.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === s.id ? "border-rt-accent/30 bg-rt-accent/8" : "border-white/[0.06] bg-white/[0.02] hover:border-white/20"
                }`}>
                  <input type="radio" name="shipping" value={s.id} checked={shippingMethod === s.id} onChange={() => setShippingMethod(s.id)} className="accent-rt-accent" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs font-medium">{s.label}</p>
                    <p className="text-white/20 text-[10px] font-mono">{s.time}</p>
                  </div>
                  <span className="text-white/50 text-xs font-mono">
                    {freeShipping && s.id === "standard" ? "FREE" : `$${s.cost}`}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="crystal rounded-2xl p-5">
            <h2 className="text-sm font-display font-bold text-white/80 tracking-wider mb-4 flex items-center gap-2">
              <Gift size={14} className="text-rt-accent" /> EXTRAS
            </h2>
            <label className="flex items-center gap-3 mb-3 cursor-pointer p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <input type="checkbox" checked={giftWrap} onChange={() => setGiftWrap(!giftWrap)} className="accent-rt-accent w-3.5 h-3.5" />
              <div>
                <p className="text-white/60 text-xs">Gift Wrap <span className="text-white/20">(+$4.99)</span></p>
                <p className="text-white/20 text-[10px] font-mono">Eco-friendly premium wrapping</p>
              </div>
            </label>
            <div>
              <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block flex items-center gap-1"><FileText size={11} /> NOTES</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Special instructions..."
                className="input-crystal text-xs py-2 resize-none" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="crystal rounded-2xl p-5">
            <h2 className="text-sm font-display font-bold text-white/80 tracking-wider mb-4 flex items-center gap-2">
              <CreditCard size={14} className="text-rt-accent" /> PAYMENT
            </h2>
            <div>
              <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">CARD NUMBER</label>
              <div className="relative">
                <input required value={form.card} onChange={update("card")} placeholder="4242 4242 4242 4242" maxLength={19}
                  className="input-crystal text-xs py-2.5 pl-10" />
                <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4 sticky top-28">
            <div className="crystal rounded-2xl p-5">
              <h3 className="text-white/60 text-xs font-display font-bold tracking-wider mb-3 flex items-center gap-2">
                <Percent size={12} className="text-rt-accent" /> COUPON
              </h3>
              <div className="flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="ENTER CODE"
                  className="flex-1 input-crystal text-[11px] py-2" />
                <button type="button" onClick={handleApplyCoupon} className="px-3.5 py-2 rounded-xl bg-rt-accent/10 border border-rt-accent/20 text-rt-accent text-[11px] font-medium hover:bg-rt-accent/20 transition-all">APPLY</button>
              </div>
              {coupon && <p className="text-rt-accent/60 text-[10px] mt-2 font-mono">// Coupon applied</p>}
              {couponErr && <p className="text-red-400 text-[10px] mt-2 font-mono">! {couponErr}</p>}
            </div>

            <div className="crystal rounded-2xl p-5">
              <h3 className="text-sm font-display font-bold text-white/80 tracking-wider mb-4">SUMMARY</h3>
              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 bg-white/[0.02] rounded-xl p-2">
                    <img src={item.images?.[0] || ""} alt={item.name} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-[11px] truncate">{item.name}</p>
                      <p className="text-white/20 text-[9px] font-mono">x{item.quantity}</p>
                    </div>
                    <span className="text-white/50 text-[11px] font-mono">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-xs border-t border-white/[0.04] pt-3">
                <div className="flex justify-between"><span className="text-white/30 font-mono text-[11px]">Subtotal</span><span className="text-white/60 font-mono text-[11px]">${totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/30 font-mono text-[11px]">Shipping</span><span className={`font-mono text-[11px] ${freeShipping ? "text-rt-accent" : "text-white/60"}`}>{freeShipping ? "FREE" : `$${effectiveShipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-white/30 font-mono text-[11px]">Tax</span><span className="text-white/60 font-mono text-[11px]">${tax.toFixed(2)}</span></div>
                {giftWrap && <div className="flex justify-between"><span className="text-white/30 font-mono text-[11px]">Gift Wrap</span><span className="text-white/60 font-mono text-[11px]">$4.99</span></div>}
                {coupon && <div className="flex justify-between"><span className="text-rt-accent/50 font-mono text-[11px]">Discount ({coupon.code})</span><span className="text-rt-accent font-mono text-[11px]">-${couponDiscount.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t border-white/[0.06] pt-2 mt-2">
                  <span className="text-white/70 text-xs font-bold">TOTAL</span>
                  <span className="text-rt-accent font-display font-bold text-base">${total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full mt-4 btn-crystal text-xs py-3 flex items-center justify-center gap-2">
                {submitting ? <><span className="spinner-crystal w-4 h-4" /> PROCESSING</> : <><Lock size={13} /> PLACE ORDER</>}
              </button>
              <div className="mt-3"><TrustBadges /></div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
