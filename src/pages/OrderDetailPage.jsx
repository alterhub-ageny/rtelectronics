import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle, XCircle } from "lucide-react";
import { getOrder } from "../services/api";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const STATUS_MAP = {
  confirmed: { label: "Confirmed", color: "bg-yellow-500/20 text-yellow-400", icon: Package },
  processing: { label: "Processing", color: "bg-blue-500/20 text-blue-400", icon: Package },
  shipped: { label: "Shipped", color: "bg-rt-accent/20 text-rt-accent", icon: Truck },
  delivered: { label: "Delivered", color: "bg-rt-accent3/20 text-rt-accent3", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-400", icon: XCircle },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(setOrder).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-8 bg-white/5 rounded w-48 mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-white/40">
        <Package size={48} className="mb-4 opacity-30" />
        <p className="text-xl font-display mb-4">Order not found</p>
        <Link to="/account" className="btn-crystal">Back to Account</Link>
      </div>
    );
  }

  const StatusIcon = STATUS_MAP[order.status]?.icon || Package;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Order Details" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-crystal-title flex items-center gap-3">
            <Package size={28} className="text-rt-accent" />
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-white/40 text-sm mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${STATUS_MAP[order.status]?.color || "bg-white/10 text-white/60"}`}>
          <StatusIcon size={16} /> {STATUS_MAP[order.status]?.label || order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {order.statusHistory?.map((h, i) => (
          <div key={i} className="crystal rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${i === order.statusHistory.length - 1 ? "bg-rt-accent" : "bg-white/20"}`} />
              <span className="text-white text-sm font-medium capitalize">{h.status}</span>
            </div>
            <p className="text-white/30 text-xs">{new Date(h.date).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="crystal rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-3"><MapPin size={16} className="text-rt-accent" /> Shipping Address</h3>
          {order.address ? (
            <>
              <p className="text-white/70 text-sm">{order.address.street}</p>
              <p className="text-white/70 text-sm">{order.address.city}, {order.address.zip}</p>
            </>
          ) : (
            <p className="text-white/40 text-sm">No address saved</p>
          )}
        </div>
        <div className="crystal rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-3"><CreditCard size={16} className="text-rt-accent" /> Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-white/50">Subtotal</span><span className="text-white">${order.items?.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span></div>
            {order.shipping > 0 && <div className="flex justify-between"><span className="text-white/50">Shipping</span><span className="text-white">${order.shipping?.toFixed(2)}</span></div>}
            {order.coupon && <div className="flex justify-between"><span className="text-green-400/70">Coupon ({order.coupon.code})</span><span className="text-green-400">Applied</span></div>}
            <div className="flex justify-between border-t border-white/10 pt-2 mt-2"><span className="text-white font-semibold">Total</span><span className="text-rt-accent font-display font-bold text-lg">${order.total?.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-semibold mb-4">Items</h3>
        {order.items?.map((item) => (
          <div key={item.id} className="crystal rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.id}`} className="text-white font-medium hover:text-rt-accent transition-colors line-clamp-1">{item.name}</Link>
              <p className="text-white/40 text-sm">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
            </div>
            <span className="text-white font-mono">${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
