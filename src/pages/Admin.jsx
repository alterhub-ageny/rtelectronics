import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  adminGetStats, adminGetOrders, adminUpdateOrderStatus,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetUsers, adminUpdateUser, adminDeleteUser,
  adminGetContacts, adminMarkContactRead,
  adminGetSubscribers, adminGetReviews, adminDeleteReview,
  adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon,
  adminGetSalesHistory, adminSeed,
} from "../services/api";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, MessageSquare, Mail,
  Plus, Edit3, Trash2, Search, X, Check, ChevronDown, ChevronUp, Star, Eye, EyeOff, Ban, Crown, User, LogOut
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "users", label: "Users", icon: Users },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "subscribers", label: "Subscribers", icon: Mail },
];

export default function Admin() {
  const { user, loading, isAdmin, logout } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/login"); else if (!loading && !isAdmin) navigate("/"); }, [user, isAdmin, loading]);
  if (loading) return <div className="min-h-screen bg-rt-darker flex items-center justify-center"><div className="w-8 h-8 border-2 border-rt-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-20 z-30 h-[calc(100vh-5rem)] bg-rt-darker/95 backdrop-blur-xl border-r border-white/5 transition-all duration-300 ${sidebar ? "left-0" : "-left-64 lg:left-0"} w-64 shrink-0 overflow-y-auto`}>
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 mb-4">
              <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Admin Panel</p>
              <p className="text-white/60 text-sm truncate mt-1">{user.name}</p>
            </div>
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    tab === t.id ? "bg-rt-accent/10 text-rt-accent border border-rt-accent/20" : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                ><Icon size={18} /> {t.label}</button>
              );
            })}
            <div className="border-t border-white/5 pt-3 mt-3">
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"><Eye size={18} /> View Site</Link>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18} /> Sign Out</button>
            </div>
          </div>
        </aside>
        {sidebar && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebar(false)} />}

        {/* Main */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/60"><Package size={20} /></button>
            <h1 className="text-2xl font-display font-bold text-white capitalize">{tab}</h1>
          </div>

          {tab === "dashboard" && <AdminDashboard />}
          {tab === "products" && <AdminProducts addToast={addToast} />}
          {tab === "orders" && <AdminOrders addToast={addToast} />}
          {tab === "users" && <AdminUsers addToast={addToast} />}
          {tab === "coupons" && <AdminCoupons addToast={addToast} />}
          {tab === "messages" && <AdminMessages addToast={addToast} />}
          {tab === "reviews" && <AdminReviews addToast={addToast} />}
          {tab === "subscribers" && <AdminSubscribers />}
        </div>
      </div>
    </div>
  );
}

/* ───── Dashboard ───── */
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminGetStats().then(setStats).catch(() => {});
    adminGetSalesHistory().then(setSales).catch(() => {});
    adminGetOrders({ page: 1, limit: 5 }).then((r) => setOrders(r.items || [])).catch(() => {});
  }, []);

  const maxRev = Math.max(...sales.map((s) => s.revenue), 1);

  return (
    <div className="space-y-8">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, color: "text-rt-accent" },
            { label: "Total Orders", value: stats.totalOrders, color: "text-rt-accent3" },
            { label: "Products", value: stats.totalProducts, color: "text-purple-400" },
            { label: "Users", value: stats.totalUsers, color: "text-rt-gold" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-semibold mb-4">Sales (Last 7 Days)</h3>
          <div className="flex items-end gap-2 h-32">
            {sales.map((s) => (
              <div key={s.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-rt-accent/20 rounded-t-lg relative" style={{ height: `${(s.revenue / maxRev) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-rt-accent to-rt-accent/40 rounded-t-lg" />
                </div>
                <span className="text-[10px] text-white/30">{new Date(s.date + "T00:00:00").toLocaleDateString("en", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white text-sm font-mono">#{o.id.slice(0, 8)}</p>
                  <p className="text-white/30 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-rt-accent font-mono text-sm">${o.total?.toFixed(2)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    o.status === "delivered" ? "bg-rt-accent3/20 text-rt-accent3" :
                    o.status === "cancelled" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── Products ───── */
function AdminProducts({ addToast }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(null);

  const load = useCallback(() => {
    adminGetProducts({ page: 1, limit: 100 }).then((r) => setProducts(r.items || [])).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (form) => {
    try {
      if (form.id) {
        await adminUpdateProduct(form.id, form);
        addToast("Product updated", "success");
      } else {
        await adminCreateProduct(form);
        addToast("Product created", "success");
      }
      setEdit(null);
      load();
    } catch { addToast("Failed to save", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await adminDeleteProduct(id); addToast("Product deleted", "success"); load(); }
    catch { addToast("Delete failed", "error"); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
        </div>
        <button onClick={() => setEdit({})} className="btn-primary text-sm flex items-center gap-1"><Plus size={16} /> Add Product</button>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-right p-4">Price</th>
              <th className="text-right p-4">Stock</th>
              <th className="text-right p-4">Rating</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <span className="text-white font-medium truncate max-w-[200px]">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-white/50">{p.category}</td>
                <td className="p-4 text-rt-accent font-mono text-right">${p.price?.toLocaleString()}</td>
                <td className="p-4 text-right"><span className={p.stock > 10 ? "text-rt-accent3" : "text-orange-400"}>{p.stock}</span></td>
                <td className="p-4 text-right text-rt-gold">{p.rating}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEdit(p)} className="p-2 rounded-lg bg-rt-accent/10 text-rt-accent hover:bg-rt-accent/20 transition-all"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-white/30">No products found</div>}
      </div>

      {edit !== null && <ProductModal product={edit} onSave={handleSave} onClose={() => setEdit(null)} />}
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    id: product?.id || "", name: product?.name || "", category: product?.category || "laptops",
    price: product?.price || "", originalPrice: product?.originalPrice || "", rating: product?.rating || 5,
    description: product?.description || "", stock: product?.stock || 10,
    badge: product?.badge || "", images: product?.images?.join("\n") || "",
    features: product?.features?.join("\n") || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock),
      rating: Number(form.rating),
      images: form.images.split("\n").filter(Boolean),
      features: form.features.split("\n").filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl p-6 border border-white/10" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">{form.id ? "Edit Product" : "New Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
                {["laptops","phones","gaming-pcs","tablets","headphones","accessories","game-topup","gift-cards"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Badge</label>
              <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Best Seller" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Price ($)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Original Price ($)</label>
              <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Rating (1-5)</label>
              <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Image URLs (one per line)</label>
              <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono text-xs focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Features (one per line)</label>
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono text-xs focus:outline-none focus:border-rt-accent/50" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{form.id ? "Update Product" : "Create Product"}</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ───── Orders ───── */
function AdminOrders({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    adminGetOrders({ page, limit: 20 }).then((r) => { setOrders(r.items || []); setTotal(r.total || 0); }).catch(() => {});
  }, [page]);

  useEffect(load, [load]);

  const statuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

  const handleStatus = async (id, status) => {
    try {
      const tracking = status === "shipped" ? `RT${Date.now()}` : undefined;
      await adminUpdateOrderStatus(id, { status, trackingNumber: tracking });
      addToast(`Order ${status}`, "success");
      load();
    } catch { addToast("Failed to update", "error"); }
  };

  return (
    <div>
      <p className="text-white/30 text-sm mb-4">{total} total orders</p>
      <div className="glass rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Date</th>
              <th className="text-right p-4">Items</th>
              <th className="text-right p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="p-4"><span className="text-white font-mono text-xs">#{o.id.slice(0, 8)}</span></td>
                <td className="p-4 text-white/50 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right text-white/70">{o.items?.length}</td>
                <td className="p-4 text-right text-rt-accent font-mono">${o.total?.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    o.status === "delivered" ? "bg-rt-accent3/20 text-rt-accent3" :
                    o.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                    o.status === "shipped" ? "bg-rt-accent/20 text-rt-accent" :
                    o.status === "processing" ? "bg-blue-500/20 text-blue-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{o.status}</span>
                </td>
                <td className="p-4 text-right">
                  <select value="" onChange={(e) => { if (e.target.value) handleStatus(o.id, e.target.value); e.target.value = ""; }}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-rt-accent/50 cursor-pointer"
                  >
                    <option value="">Update</option>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 20 && (
        <div className="flex justify-center gap-3 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className={`px-4 py-2 rounded-xl text-sm ${page <= 1 ? "bg-white/5 text-white/20" : "bg-white/5 text-white hover:bg-white/10"} transition-all`}>Previous</button>
          <span className="text-white/40 text-sm self-center">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)} className={`px-4 py-2 rounded-xl text-sm ${page >= Math.ceil(total / 20) ? "bg-white/5 text-white/20" : "bg-white/5 text-white hover:bg-white/10"} transition-all`}>Next</button>
        </div>
      )}
    </div>
  );
}

/* ───── Users ───── */
function AdminUsers({ addToast }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    adminGetUsers({ page: 1, limit: 100 }).then((r) => setUsers(r.items || [])).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const filtered = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const handleRole = async (id, role) => {
    try { await adminUpdateUser(id, { role }); addToast("User role updated", "success"); load(); }
    catch { addToast("Failed", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try { await adminDeleteUser(id); addToast("User deleted", "success"); load(); }
    catch { addToast("Failed", "error"); }
  };

  return (
    <div>
      <div className="relative max-w-md mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-right p-4">Joined</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {u.avatar && <img src={u.avatar} alt="" className="w-8 h-8 rounded-lg bg-white/5" />}
                    <span className="text-white font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-white/50">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${u.role === "admin" ? "bg-rt-accent/20 text-rt-accent" : "bg-white/10 text-white/60"}`}>{u.role}</span>
                </td>
                <td className="p-4 text-right text-white/30 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select value="" onChange={(e) => { if (e.target.value) handleRole(u.id, e.target.value); e.target.value = ""; }}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="">Set Role</option>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    {u.role !== "admin" && (
                      <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-white/30">No users found</div>}
      </div>
    </div>
  );
}

/* ───── Coupons ───── */
function AdminCoupons({ addToast }) {
  const [coupons, setCoupons] = useState([]);
  const [edit, setEdit] = useState(null);

  const load = useCallback(() => {
    adminGetCoupons().then(setCoupons).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const handleSave = async (form) => {
    try {
      if (form.id) {
        await adminUpdateCoupon(form.id, form);
        addToast("Coupon updated", "success");
      } else {
        await adminCreateCoupon(form);
        addToast("Coupon created", "success");
      }
      setEdit(null);
      load();
    } catch { addToast("Failed", "error"); }
  };

  const handleToggle = async (c) => {
    try { await adminUpdateCoupon(c.id, { active: !c.active }); load(); addToast(c.active ? "Disabled" : "Enabled", "success"); }
    catch { addToast("Failed", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try { await adminDeleteCoupon(id); addToast("Deleted", "success"); load(); }
    catch { addToast("Failed", "error"); }
  };

  return (
    <div>
      <button onClick={() => setEdit({})} className="btn-primary text-sm flex items-center gap-1 mb-6"><Plus size={16} /> New Coupon</button>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className={`glass rounded-2xl p-5 border ${c.active ? "border-rt-accent/20" : "border-white/5 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-mono font-bold text-lg">{c.code}</p>
                <p className="text-white/40 text-xs">{c.type === "percent" ? `${c.discount}% OFF` : c.type === "flat" ? `$${c.discount} OFF` : "Free Shipping"}</p>
              </div>
              <button onClick={() => handleToggle(c)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white">
                {c.active ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <div className="text-xs text-white/30 space-y-1">
              <p>Min: ${c.minOrder} • Used: {c.used}/{c.maxUses}</p>
              <p>Expires: {new Date(c.expiresAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEdit(c)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 hover:text-white text-xs transition-all">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="py-2 px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {edit !== null && <CouponModal coupon={edit} onSave={handleSave} onClose={() => setEdit(null)} />}
    </div>
  );
}

function CouponModal({ coupon, onSave, onClose }) {
  const [form, setForm] = useState({
    id: coupon?.id || "", code: coupon?.code || "", discount: coupon?.discount || 10,
    type: coupon?.type || "percent", minOrder: coupon?.minOrder || 0,
    maxUses: coupon?.maxUses || 100, active: coupon?.active ?? true,
    expiresAt: coupon?.expiresAt || "2027-12-31",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-md glass rounded-3xl p-6 border border-white/10" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold text-white mb-5">{form.id ? "Edit Coupon" : "New Coupon"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Code</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
                <option value="percent">Percent</option>
                <option value="flat">Flat</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Discount</label>
              <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Min Order ($)</label>
              <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Expires</label>
              <input type="date" value={form.expiresAt?.split("T")[0]} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-rt-accent" />
            <span className="text-white text-sm">Active</span>
          </label>
          <button type="submit" className="btn-primary w-full">{form.id ? "Update" : "Create"}</button>
        </form>
      </motion.div>
    </div>
  );
}

/* ───── Messages ───── */
function AdminMessages({ addToast }) {
  const [messages, setMessages] = useState([]);

  const load = useCallback(() => {
    adminGetContacts().then(setMessages).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const handleRead = async (id) => {
    try { await adminMarkContactRead(id); setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m)); }
    catch {}
  };

  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <div className="text-center py-16 text-white/30">No messages yet</div>
      ) : (
        messages.map((m) => (
          <div key={m.id} className={`glass rounded-2xl p-5 border ${m.read ? "border-white/5" : "border-rt-accent/20"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-medium">{m.name}</p>
                <p className="text-white/30 text-xs">{m.email} • {new Date(m.createdAt).toLocaleString()}</p>
              </div>
              {!m.read && <button onClick={() => handleRead(m.id)} className="px-3 py-1.5 rounded-lg bg-rt-accent/10 text-rt-accent text-xs hover:bg-rt-accent/20 transition-all">Mark Read</button>}
            </div>
            {m.subject && <p className="text-white/60 text-sm font-medium mb-1">{m.subject}</p>}
            <p className="text-white/40 text-sm">{m.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

/* ───── Reviews ───── */
function AdminReviews({ addToast }) {
  const [reviews, setReviews] = useState([]);

  const load = useCallback(() => {
    adminGetReviews({ page: 1, limit: 100 }).then((r) => setReviews(r.items || [])).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try { await adminDeleteReview(id); addToast("Review deleted", "success"); load(); }
    catch { addToast("Failed", "error"); }
  };

  return (
    <div className="space-y-3">
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-white/30">No reviews</div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm">{r.userName}</span>
                  <span className="text-white/20 text-xs">on {r.productId}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < r.rating ? "text-rt-gold fill-rt-gold" : "text-white/20"} />)}
                </div>
                {r.title && <p className="text-white text-sm font-medium">{r.title}</p>}
                <p className="text-white/40 text-sm">{r.comment}</p>
              </div>
              <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 shrink-0"><Trash2 size={14} /></button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ───── Subscribers ───── */
function AdminSubscribers() {
  const [subs, setSubs] = useState([]);
  useEffect(() => { adminGetSubscribers().then(setSubs).catch(() => {}); }, []);

  return (
    <div>
      <p className="text-white/30 text-sm mb-4">{subs.length} subscribers</p>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/5">
          {subs.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3">
              <span className="text-white text-sm">{s.email}</span>
              <span className="text-white/20 text-xs">{new Date(s.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
        {subs.length === 0 && <div className="text-center py-12 text-white/30">No subscribers yet</div>}
      </div>
    </div>
  );
}
