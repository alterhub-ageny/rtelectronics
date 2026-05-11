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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-rt-accent3/20 border border-rt-accent3/40 flex items-center justify-center mb-6">
          <Check size={36} className="text-rt-accent3" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-white/50 mb-8 text-center max-w-md">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  if (!items.length) { navigate("/cart"); return null; }

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <Link to="/cart" className="inline-flex items-center gap-2 text-white/40 hover:text-rt-accent transition-colors mb-8 text-sm">
        <ArrowLeft size={16} /> Back to Cart
      </Link>
      <h1 className="section-title mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-display font-bold text-white mb-5">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block">Full Name *</label>
                <input required value={form.name} onChange={update("name")} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block">Email *</label>
                <input required type="email" value={form.email} onChange={update("email")} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block">Address *</label>
                <input required value={form.address} onChange={update("address")} placeholder="123 Tech Street" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">City *</label>
                <input required value={form.city} onChange={update("city")} placeholder="New York" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">ZIP Code *</label>
                <input required value={form.zip} onChange={update("zip")} placeholder="10001" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-2">
              <Truck size={18} className="text-rt-accent" /> Shipping Method
            </h2>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((s) => (
                <label key={s.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === s.id ? "border-rt-accent/40 bg-rt-accent/5" : "border-white/10 bg-white/5 hover:border-white/20"
                }`}>
                  <input type="radio" name="shipping" value={s.id} checked={shippingMethod === s.id} onChange={() => setShippingMethod(s.id)} className="accent-rt-accent" />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{s.label}</p>
                    <p className="text-white/40 text-xs">{s.time}</p>
                  </div>
                  <span className="text-white font-mono text-sm">
                    {freeShipping && s.id === "standard" ? "FREE" : `$${s.cost}`}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-2">
              <Gift size={18} className="text-rt-accent" /> Extras
            </h2>
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input type="checkbox" checked={giftWrap} onChange={() => setGiftWrap(!giftWrap)} className="accent-rt-accent w-4 h-4" />
              <div>
                <p className="text-white text-sm">Gift Wrap <span className="text-white/40 font-normal">(+$4.99)</span></p>
                <p className="text-white/30 text-xs">Eco-friendly premium gift wrapping</p>
              </div>
            </label>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1"><FileText size={14} /> Order Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Special instructions for delivery..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all resize-none" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-rt-accent" /> Payment
            </h2>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Card Number</label>
              <div className="relative">
                <input required value={form.card} onChange={update("card")} placeholder="4242 4242 4242 4242" maxLength={19}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rt-accent/50 transition-all pl-12" />
                <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6 sticky top-28">
            {/* Coupon */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Percent size={16} className="text-rt-accent" /> Coupon Code</h3>
              <div className="flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <button type="button" onClick={handleApplyCoupon} className="px-4 py-2.5 rounded-xl bg-rt-accent/10 border border-rt-accent/20 text-rt-accent text-sm font-medium hover:bg-rt-accent/20 transition-all">Apply</button>
              </div>
              {coupon && <p className="text-rt-accent3 text-xs mt-2">Coupon applied!</p>}
              {couponErr && <p className="text-red-400 text-xs mt-2">{couponErr}</p>}
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-display font-bold text-white mb-5">Order Summary</h3>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.name}</p>
                      <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white font-mono text-sm">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between"><span className="text-white/50">Subtotal</span><span className="text-white font-mono">${totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Shipping</span><span className={freeShipping ? "text-rt-accent3 font-mono" : "text-white font-mono"}>{freeShipping ? "FREE" : `$${effectiveShipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Tax</span><span className="text-white font-mono">${tax.toFixed(2)}</span></div>
                {giftWrap && <div className="flex justify-between"><span className="text-white/50">Gift Wrap</span><span className="text-white font-mono">$4.99</span></div>}
                {coupon && <div className="flex justify-between"><span className="text-rt-accent3/70">Discount ({coupon.code})</span><span className="text-rt-accent3 font-mono">-${couponDiscount.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-rt-accent font-display font-bold text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
                  <button type="submit" disabled={submitting} className="w-full mt-6 btn-primary flex items-center justify-center gap-2 py-3.5">
                {submitting ? "Processing..." : <><Lock size={18} /> Place Order - ${total.toFixed(2)}</>}
              </button>
              <div className="mt-4"><TrustBadges /></div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
