import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  adminGetStats, adminGetOrders, adminUpdateOrderStatus,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminBulkDeleteProducts,
  adminGetUsers, adminUpdateUser, adminDeleteUser,
  adminGetContacts, adminMarkContactRead, adminDeleteContact,
  adminGetSubscribers, adminGetReviews, adminDeleteReview,
  adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon,
  adminGetSalesHistory, adminGetLowStock, adminGetStockLog, adminAdjustStock,
  adminGetExpenses, adminCreateExpense, adminUpdateExpense, adminDeleteExpense,
  adminGetSuppliers, adminCreateSupplier, adminUpdateSupplier, adminDeleteSupplier,
  adminGetSettings, adminUpdateSettings,
  adminGetPages, adminUpdatePage,
  adminGetNotifications, adminCreateNotification, adminMarkNotificationRead,
  adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  getCategories, adminSeed,
} from "../services/api";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, MessageSquare, Mail,
  Plus, Edit3, Trash2, Search, X, Check, ChevronDown, ChevronUp, Star, Ban,
  Crown, User, LogOut, DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  Box, Truck, Settings, FileText, Bell, FolderTree, RefreshCw, Download,
  Filter, MoreHorizontal, Eye, EyeOff, Copy, Save, Clock, Archive, Zap,
  BarChart3, PieChart, Activity, Layers, MapPin, Phone, Globe, Sun,
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "users", label: "Users", icon: Users },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "stock", label: "Stock", icon: Box },
  { id: "expenses", label: "Expenses", icon: DollarSign },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "subscribers", label: "Subscribers", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "pages", label: "Pages", icon: FileText },
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

  const TabContent = () => {
    const tProps = { addToast };
    switch (tab) {
      case "dashboard": return <DashboardTab />;
      case "products": return <ProductsTab {...tProps} />;
      case "orders": return <OrdersTab {...tProps} />;
      case "users": return <UsersTab {...tProps} />;
      case "categories": return <CategoriesTab {...tProps} />;
      case "stock": return <StockTab {...tProps} />;
      case "expenses": return <ExpensesTab {...tProps} />;
      case "suppliers": return <SuppliersTab {...tProps} />;
      case "coupons": return <CouponsTab {...tProps} />;
      case "messages": return <MessagesTab {...tProps} />;
      case "reviews": return <ReviewsTab {...tProps} />;
      case "subscribers": return <SubscribersTab />;
      case "settings": return <SettingsTab {...tProps} />;
      case "pages": return <PagesTab {...tProps} />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-rt-darker flex">
      <aside className={`fixed lg:sticky top-0 left-0 h-full z-40 w-64 bg-rt-darker/95 backdrop-blur-xl border-r border-white/5 overflow-y-auto transition-transform ${sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <Zap size={24} className="text-rt-accent" />
            <span className="text-lg font-display font-bold"><span className="text-white">RT</span><span className="text-rt-accent"> ADMIN</span></span>
          </Link>
        </div>
        <nav className="p-2 space-y-0.5">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                tab === t.id ? "bg-rt-accent/10 border border-rt-accent/30 text-rt-accent" : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-white/5 mt-2">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      {sidebar && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebar(false)} />}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-20 bg-rt-darker/90 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <MenuIcon />
            </button>
            <h1 className="text-lg font-display font-bold text-white">{TABS.find((t) => t.id === tab)?.label || "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40 hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rt-accent/20 to-rt-accent2/20 flex items-center justify-center">
              <Crown size={14} className="text-rt-accent" />
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <TabContent />
        </div>
      </main>
    </div>
  );
}

/* ─────── SPARKLINE CHART ─────── */
function Sparkline({ data, color = "#ff2a2a", height = 40 }) {
  if (!data?.length) return null;
  const w = 120;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={w} height={height} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

/* ─────── BAR CHART ─────── */
function BarChart({ data, height = 160, color = "#ff2a2a" }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.value || d), 1);
  const w = Math.max(300, data.length * 30);
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const v = d.value || d;
        const barH = (v / max) * (height - 20);
        const x = (i / data.length) * w + 4;
        const bw = Math.max(8, w / data.length - 8);
        return (
          <g key={i}>
            <rect x={x} y={height - 10 - barH} width={bw} height={barH} fill={color} rx="2" opacity="0.8">
              <title>{d.label || ""}: ${v.toFixed(2)}</title>
            </rect>
          </g>
        );
      })}
    </svg>
  );
}

/* ─────── KPI CARD ─────── */
function KpiCard({ title, value, icon: Icon, trend, subtitle, color = "text-rt-accent", chart, onClick }) {
  return (
    <div onClick={onClick} className={`glass rounded-2xl p-5 border border-white/5 ${onClick ? "cursor-pointer" : ""} hover:border-white/10 transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center">
          {Icon && <Icon size={18} className={color} />}
        </div>
        {chart}
      </div>
      <p className="text-2xl font-display font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-white/40">{title}</p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs ${trend >= 0 ? "text-rt-accent3" : "text-red-400"}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
          {subtitle && <span className="text-white/30 ml-1">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

/* ─────── DASHBOARD TAB ─────── */
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState(7);

  const load = useCallback(async () => {
    try { const [s, h] = await Promise.all([adminGetStats(), adminGetSalesHistory(period)]); setStats(s); setHistory(h); } catch {}
  }, [period]);

  useEffect(() => { load(); }, [load]);

  if (!stats) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rt-accent border-t-transparent rounded-full animate-spin" /></div>;

  const profitMargin = stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard title="Today" value={`$${stats.todayRevenue.toFixed(2)}`} icon={BarChart3} color="text-rt-accent3" subtitle={`${stats.todayOrders} orders`} />
        <KpiCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={TrendingUp} color="text-green-400" />
        <KpiCard title="Total Expenses" value={`$${stats.totalExpenses.toFixed(2)}`} icon={TrendingDown} color="text-orange-400" />
        <KpiCard title="Net Profit" value={`$${stats.netProfit.toFixed(2)}`} icon={DollarSign} color="text-rt-accent" subtitle={`${profitMargin.toFixed(1)}% margin`} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} trend={0} subtitle="all time" />
        <KpiCard title="Pending" value={stats.pendingOrders} icon={Clock} color="text-yellow-400" />
        <KpiCard title="Low Stock" value={stats.lowStockProducts} icon={AlertTriangle} color="text-orange-400" subtitle={`${stats.outOfStockProducts} out of stock`} />
        <KpiCard title="Avg Order" value={`$${stats.averageOrderValue.toFixed(2)}`} icon={Activity} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard title="Products" value={stats.totalProducts} icon={Package} />
        <KpiCard title="Users" value={stats.totalUsers} icon={Users} />
        <KpiCard title="Reviews" value={stats.totalReviews} icon={Star} />
        <KpiCard title="Subscribers" value={stats.totalSubscribers} icon={Mail} />
      </div>
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-display font-semibold">Revenue vs Expenses</h3>
          <div className="flex gap-1">
            {[7, 30].map((d) => (
              <button key={d} onClick={() => setPeriod(d)} className={`px-3 py-1 text-xs rounded-lg transition-all ${period === d ? "bg-rt-accent text-white" : "bg-white/5 text-white/50 hover:text-white"}`}>{d}d</button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <BarChart data={history.map((h) => ({ label: h.date?.slice(5), value: h.revenue }))} color="#ff2a2a" />
            <p className="text-xs text-white/30 text-center mt-1">Revenue</p>
          </div>
          <div className="flex-1 min-w-[250px]">
            <BarChart data={history.map((h) => ({ label: h.date?.slice(5), value: h.expenses }))} color="#f97316" />
            <p className="text-xs text-white/30 text-center mt-1">Expenses</p>
          </div>
          <div className="flex-1 min-w-[250px]">
            <BarChart data={history.map((h) => ({ label: h.date?.slice(5), value: Math.max(0, h.profit) }))} color="#22c55e" />
            <p className="text-xs text-white/30 text-center mt-1">Profit</p>
          </div>
        </div>
      </div>
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="text-white font-display font-semibold mb-3">Recent Sales (${period}d)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-2 pr-4">Date</th><th className="text-right pr-4">Orders</th><th className="text-right pr-4">Revenue</th><th className="text-right pr-4">Costs</th><th className="text-right">Profit</th>
            </tr></thead>
            <tbody>
              {[...history].reverse().map((h) => (
                <tr key={h.date} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 pr-4 text-white/70">{h.date}</td>
                  <td className="py-2 pr-4 text-right text-white/70">{h.orders}</td>
                  <td className="py-2 pr-4 text-right text-green-400">${h.revenue.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-right text-orange-400">${h.expenses.toFixed(2)}</td>
                  <td className="py-2 text-right text-rt-accent font-mono">${h.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────── PRODUCTS TAB ─────── */
function ProductsTab({ addToast }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);

  const load = useCallback(async () => {
    try {
      const [res, cats] = await Promise.all([adminGetProducts({ page, limit: 15 }), getCategories()]);
      setProducts(res.items); setTotal(res.total); setCategories(cats);
    } catch {}
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await adminDeleteProduct(id); addToast("Product deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  const handleSave = async (data) => {
    try {
      if (editing?.id) { await adminUpdateProduct(editing.id, data); addToast("Product updated", "success"); }
      else { await adminCreateProduct(data); addToast("Product created", "success"); }
      setEditing(null); load();
    } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
        </div>
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all"><Plus size={16} /> Add Product</button>
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Product</th><th className="text-right px-4">Price</th><th className="text-right px-4">Stock</th><th className="text-right px-4">Rating</th><th className="text-right px-4 w-20">Actions</th>
            </tr></thead>
            <tbody>
              {products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/30">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : <Package size={16} />}
                      </div>
                      <div><p className="text-white font-medium truncate max-w-[200px]">{p.name}</p><p className="text-white/30 text-[10px]">{p.category}</p></div>
                    </div>
                  </td>
                  <td className="px-4 text-right text-rt-accent font-mono">${p.price?.toFixed(2)}</td>
                  <td className={`px-4 text-right font-mono ${p.stock <= 5 ? "text-orange-400" : p.stock === 0 ? "text-red-400" : "text-white/70"}`}>{p.stock}</td>
                  <td className="px-4 text-right text-white/70">{p.rating?.toFixed(1)}</td>
                  <td className="px-4 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent transition-all"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-white/40">
        <span>{total} products total</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:border-white/20 transition-all">Prev</button>
          <button disabled={page * 15 >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:border-white/20 transition-all">Next</button>
        </div>
      </div>
      <AnimatePresence>
        {editing !== null && <ProductForm product={editing} categories={categories} onSave={handleSave} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ProductForm({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", description: "", badge: "", originalPrice: "", features: "", images: "", specs: "", ...product });
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, price: Number(form.price), stock: Number(form.stock || 0), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, features: form.features ? form.features.split("\n").filter(Boolean) : [], images: form.images ? form.images.split("\n").filter(Boolean) : [], specs: form.specs ? JSON.parse(form.specs || "{}") : {} }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-display font-bold text-white">{product?.id ? "Edit Product" : "New Product"}</h2><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40"><X size={18} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs text-white/40 block mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
              <option value="">Select...</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select></div>
            <div><label className="text-xs text-white/40 block mb-1">Badge</label><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Featured, New, Sale..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Price ($)</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Original Price</label><input type="number" step="0.01" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
          </div>
          <div><label className="text-xs text-white/40 block mb-1">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Features (one per line)</label><textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Feature 1&#10;Feature 2" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none font-mono" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Images (one URL per line)</label><textarea rows={2} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none font-mono" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">{product?.id ? "Update" : "Create"} Product</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────── ORDERS TAB ─────── */
function OrdersTab({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    try { const res = await adminGetOrders({ page, limit: 20 }); setOrders(res.items); } catch {}
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    const tracking = status === "shipped" ? prompt("Tracking number:") : undefined;
    try { await adminUpdateOrderStatus(id, { status, ...(tracking ? { trackingNumber: tracking } : {}) }); addToast("Order updated", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  const getStatusColor = (s) => {
    const map = { confirmed: "text-blue-400", processing: "text-yellow-400", shipped: "text-purple-400", delivered: "text-green-400", cancelled: "text-red-400" };
    return map[s] || "text-white/50";
  };

  const filtered = orders.filter((o) => !statusFilter || o.status === statusFilter);
  const statuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter("")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${!statusFilter ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>All</button>
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${statusFilter === s ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>{s}</button>
        ))}
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Order</th><th className="text-left px-4">Customer</th><th className="text-right px-4">Items</th><th className="text-right px-4">Total</th><th className="text-center px-4">Status</th><th className="text-right px-4">Date</th><th className="text-right px-4 w-24">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-white/50">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 text-white/70">{o.address?.name || "—"}</td>
                  <td className="px-4 text-right text-white/70">{o.items?.length || 0}</td>
                  <td className="px-4 text-right text-rt-accent font-mono">${o.total?.toFixed(2)}</td>
                  <td className="px-4 text-center"><span className={`text-xs font-medium capitalize ${getStatusColor(o.status)}`}>{o.status}</span></td>
                  <td className="px-4 text-right text-white/40 text-xs">{o.createdAt?.slice(0, 10)}</td>
                  <td className="px-4 text-right">
                    <select onChange={(e) => { if (e.target.value) updateStatus(o.id, e.target.value); e.target.value = ""; }} value="" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-rt-accent/50">
                      <option value="" disabled>Update</option>
                      {statuses.filter((s) => s !== o.status).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between text-sm text-white/40">
        <span>{filtered.length} orders</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30">Prev</button>
          <button disabled={filtered.length < 20} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30">Next</button>
        </div>
      </div>
    </div>
  );
}

/* ─────── USERS TAB ─────── */
function UsersTab({ addToast }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try { const res = await adminGetUsers({ page }); setUsers(res.items); } catch {}
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggleBan = async (u) => {
    try { await adminUpdateUser(u.id, { banned: !u.banned }); addToast(u.banned ? "User unbanned" : "User banned", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  const toggleRole = async (u) => {
    try { await adminUpdateUser(u.id, { role: u.role === "admin" ? "user" : "admin" }); addToast("Role updated", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">User</th><th className="text-left px-4">Email</th><th className="text-center px-4">Role</th><th className="text-center px-4">Status</th><th className="text-right px-4">Joined</th><th className="text-right px-4 w-24">Actions</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${u.banned ? "opacity-50" : ""}`}>
                  <td className="py-3 px-4"><span className="text-white font-medium">{u.name}</span></td>
                  <td className="px-4 text-white/50">{u.email}</td>
                  <td className="px-4 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-rt-accent/10 text-rt-accent" : "bg-white/5 text-white/50"}`}>{u.role}</span></td>
                  <td className="px-4 text-center">{u.banned ? <span className="text-xs text-red-400">Banned</span> : <span className="text-xs text-green-400">Active</span>}</td>
                  <td className="px-4 text-right text-white/40 text-xs">{u.createdAt?.slice(0, 10)}</td>
                  <td className="px-4 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggleRole(u)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent transition-all" title="Toggle admin"><Crown size={14} /></button>
                    <button onClick={() => toggleBan(u)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all" title={u.banned ? "Unban" : "Ban"}><Ban size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between text-sm text-white/40">
        <span>{users.length} users shown</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30">Prev</button>
          <button disabled={users.length < 50} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30">Next</button>
        </div>
      </div>
    </div>
  );
}

/* ─────── CATEGORIES TAB ─────── */
function CategoriesTab({ addToast }) {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => { try { setCats(await getCategories()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (editing?.id) { await adminUpdateCategory(editing.id, data); addToast("Category updated", "success"); }
      else { await adminCreateCategory(data); addToast("Category created", "success"); }
      setEditing(null); load();
    } catch (e) { addToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try { await adminDeleteCategory(id); addToast("Category deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all"><Plus size={16} /> Add Category</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium text-sm">{c.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-xs text-white/30">{c.slug} · {c.description || "No description"}</p>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-display font-bold text-white mb-4">{editing?.id ? "Edit" : "New"} Category</h2>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); handleSave({ name: fd.get("name"), slug: fd.get("slug"), description: fd.get("description") }); }} className="space-y-3">
                <input name="name" defaultValue={editing?.name} placeholder="Name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="slug" defaultValue={editing?.slug} placeholder="Slug" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="description" defaultValue={editing?.description} placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────── STOCK TAB ─────── */
function StockTab({ addToast }) {
  const [lowStock, setLowStock] = useState([]);
  const [stockLog, setStockLog] = useState([]);
  const [adjusting, setAdjusting] = useState(null);
  const [view, setView] = useState("low");

  const load = useCallback(async () => {
    try { const [low, log] = await Promise.all([adminGetLowStock(10), adminGetStockLog()]); setLowStock(low); setStockLog(log); } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdjust = async (data) => {
    try { await adminAdjustStock(data); addToast("Stock adjusted", "success"); load(); setAdjusting(null); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setView("low")} className={`px-4 py-2 rounded-xl text-sm transition-all ${view === "low" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
          <AlertTriangle size={14} className="inline mr-1" />Low Stock ({lowStock.length})
        </button>
        <button onClick={() => setView("log")} className={`px-4 py-2 rounded-xl text-sm transition-all ${view === "log" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
          <Clock size={14} className="inline mr-1" />Stock Movement
        </button>
      </div>

      {view === "low" && (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
                <th className="text-left py-3 px-4">Product</th><th className="text-right px-4">Stock</th><th className="text-right px-4">Price</th><th className="text-right px-4 w-24">Action</th>
              </tr></thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-white">{p.name}</span></td>
                    <td className={`px-4 text-right font-mono font-bold ${p.stock === 0 ? "text-red-400" : "text-orange-400"}`}>{p.stock === 0 ? "OUT OF STOCK" : p.stock}</td>
                    <td className="px-4 text-right text-rt-accent font-mono">${p.price?.toFixed(2)}</td>
                    <td className="px-4 text-right"><button onClick={() => setAdjusting(p)} className="px-3 py-1.5 rounded-lg bg-rt-accent/10 text-rt-accent text-xs hover:bg-rt-accent/20 transition-all">Adjust</button></td>
                  </tr>
                ))}
                {!lowStock.length && <tr><td colSpan={4} className="py-8 text-center text-white/30">All products have sufficient stock</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "log" && (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
                <th className="text-left py-3 px-4">Date</th><th className="text-left px-4">Product</th><th className="text-center px-4">Type</th><th className="text-right px-4">Qty</th><th className="text-left px-4">Note</th>
              </tr></thead>
              <tbody>
                {stockLog.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white/40 text-xs">{l.createdAt?.slice(0, 16)}</td>
                    <td className="px-4 text-white">{l.productId?.slice(0, 8)}</td>
                    <td className="px-4 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${l.type === "in" || l.type === "add" ? "bg-green-500/10 text-green-400" : l.type === "out" || l.type === "remove" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}>{l.type}</span>
                    </td>
                    <td className="px-4 text-right font-mono text-white/70">{l.quantity}</td>
                    <td className="px-4 text-white/40 text-xs">{l.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {adjusting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAdjusting(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-display font-bold text-white mb-1">Adjust Stock</h2>
              <p className="text-sm text-white/50 mb-4">{adjusting.name} · Current: <span className="text-rt-accent font-mono">{adjusting.stock}</span></p>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); handleAdjust({ productId: adjusting.id, type: fd.get("type"), quantity: Number(fd.get("quantity")), note: fd.get("note") }); }} className="space-y-3">
                <div><label className="text-xs text-white/40 block mb-1">Type</label>
                  <select name="type" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
                    <option value="add">Add Stock</option>
                    <option value="remove">Remove Stock</option>
                    <option value="set">Set Exact</option>
                  </select>
                </div>
                <div><label className="text-xs text-white/40 block mb-1">Quantity</label><input name="quantity" type="number" required min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
                <div><label className="text-xs text-white/40 block mb-1">Note</label><input name="note" placeholder="Reason for adjustment" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setAdjusting(null)} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Apply</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────── EXPENSES TAB ─────── */
function ExpensesTab({ addToast }) {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => { try { setExpenses(await adminGetExpenses()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (editing?.id) { await adminUpdateExpense(editing.id, data); addToast("Expense updated", "success"); }
      else { await adminCreateExpense(data); addToast("Expense added", "success"); }
      setEditing(null); load();
    } catch (e) { addToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try { await adminDeleteExpense(id); addToast("Expense deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  const total = expenses.filter((e) => !filter || e.category === filter).reduce((s, e) => s + e.amount, 0);
  const cats = [...new Set(expenses.map((e) => e.category))];
  const categories = { "shipping": "Shipping", "supplier": "Supplier", "marketing": "Marketing", "software": "Software", "rent": "Rent", "utilities": "Utilities", "salary": "Salary", "other": "Other" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${!filter ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>All</button>
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${filter === c ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>{categories[c] || c}</button>
          ))}
        </div>
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all"><Plus size={16} /> Add Expense</button>
      </div>
      <div className="text-sm text-white/50">Total: <span className="text-rt-accent font-mono font-bold">${total.toFixed(2)}</span></div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Title</th><th className="text-left px-4">Category</th><th className="text-right px-4">Amount</th><th className="text-left px-4">Note</th><th className="text-right px-4">Date</th><th className="text-right px-4 w-20">Actions</th>
            </tr></thead>
            <tbody>
              {expenses.filter((e) => !filter || e.category === filter).map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{e.title}</td>
                  <td className="px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 capitalize">{categories[e.category] || e.category}</span></td>
                  <td className="px-4 text-right text-orange-400 font-mono">${e.amount?.toFixed(2)}</td>
                  <td className="px-4 text-white/40 text-xs truncate max-w-[150px]">{e.description || "—"}</td>
                  <td className="px-4 text-right text-white/40 text-xs">{e.date?.slice(0, 10)}</td>
                  <td className="px-4 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(e)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-display font-bold text-white mb-4">{editing?.id ? "Edit" : "Add"} Expense</h2>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); handleSave({ title: fd.get("title"), category: fd.get("category"), amount: Number(fd.get("amount")), description: fd.get("description"), date: fd.get("date"), recurring: fd.get("recurring") === "on" }); }} className="space-y-3">
                <input name="title" defaultValue={editing?.title} placeholder="Title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <select name="category" defaultValue={editing?.category || "other"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
                  {Object.entries(categories).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <input name="amount" type="number" step="0.01" defaultValue={editing?.amount} placeholder="Amount" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="description" defaultValue={editing?.description} placeholder="Description (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="date" type="date" defaultValue={editing?.date?.slice(0, 10)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <label className="flex items-center gap-2 text-sm text-white/50"><input name="recurring" type="checkbox" defaultChecked={editing?.recurring} className="accent-rt-accent" /> Recurring expense</label>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────── SUPPLIERS TAB ─────── */
function SuppliersTab({ addToast }) {
  const [suppliers, setSuppliers] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => { try { setSuppliers(await adminGetSuppliers()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (editing?.id) { await adminUpdateSupplier(editing.id, data); addToast("Supplier updated", "success"); }
      else { await adminCreateSupplier(data); addToast("Supplier added", "success"); }
      setEditing(null); load();
    } catch (e) { addToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this supplier?")) return;
    try { await adminDeleteSupplier(id); addToast("Supplier deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all"><Plus size={16} /> Add Supplier</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rt-accent/10 to-rt-accent2/10 border border-white/10 flex items-center justify-center">
                <Truck size={18} className="text-rt-accent" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">{s.name}</h3>
            {s.contact && <p className="text-xs text-white/40 mb-1"><User size={12} className="inline mr-1" />{s.contact}</p>}
            {s.email && <p className="text-xs text-white/40 mb-1"><Mail size={12} className="inline mr-1" />{s.email}</p>}
            {s.phone && <p className="text-xs text-white/40 mb-1"><Phone size={12} className="inline mr-1" />{s.phone}</p>}
            {s.address && <p className="text-xs text-white/30"><MapPin size={12} className="inline mr-1" />{s.address}</p>}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing !== null && <SimpleForm title={editing?.id ? "Edit Supplier" : "Add Supplier"} fields={["name", "contact", "email", "phone", "address", "notes"]} defaults={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─────── SIMPLE FORM MODAL ─────── */
function SimpleForm({ title, fields, defaults, onSave, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-white mb-4">{title}</h2>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); const data = {}; fields.forEach((f) => data[f] = fd.get(f)); onSave(data); }} className="space-y-3">
          {fields.map((f) => (
            <input key={f} name={f} defaultValue={defaults?.[f] || ""} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 capitalize" />
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Save</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────── COUPONS TAB ─────── */
function CouponsTab({ addToast }) {
  const [coupons, setCoupons] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => { try { setCoupons(await adminGetCoupons()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (editing?.id) { await adminUpdateCoupon(editing.id, data); addToast("Coupon updated", "success"); }
      else { await adminCreateCoupon(data); addToast("Coupon created", "success"); }
      setEditing(null); load();
    } catch (e) { addToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try { await adminDeleteCoupon(id); addToast("Coupon deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all"><Plus size={16} /> Add Coupon</button>
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Code</th><th className="text-right px-4">Discount</th><th className="text-center px-4">Type</th><th className="text-right px-4">Used</th><th className="text-right px-4">Max</th><th className="text-center px-4">Active</th><th className="text-right px-4">Expires</th><th className="text-right px-4 w-20">Actions</th>
            </tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-rt-accent font-bold">{c.code}</td>
                  <td className="px-4 text-right text-white/70">{c.type === "percent" ? `${c.discount}%` : c.type === "flat" ? `$${c.discount}` : c.discount}</td>
                  <td className="px-4 text-center"><span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 capitalize">{c.type}</span></td>
                  <td className="px-4 text-right text-white/50">{c.used}</td>
                  <td className="px-4 text-right text-white/50">{c.maxUses}</td>
                  <td className="px-4 text-center">{c.active ? <Check size={14} className="text-green-400 mx-auto" /> : <X size={14} className="text-red-400 mx-auto" />}</td>
                  <td className="px-4 text-right text-white/40 text-xs">{c.expiresAt?.slice(0, 10) || "—"}</td>
                  <td className="px-4 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-display font-bold text-white mb-4">{editing?.id ? "Edit" : "Add"} Coupon</h2>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); handleSave({ code: fd.get("code"), discount: Number(fd.get("discount")), type: fd.get("type"), minOrder: Number(fd.get("minOrder") || 0), maxUses: Number(fd.get("maxUses") || 100), active: fd.get("active") === "on", expiresAt: fd.get("expiresAt") }); }} className="space-y-3">
                <input name="code" defaultValue={editing?.code} placeholder="Code" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 uppercase" />
                <select name="type" defaultValue={editing?.type || "percent"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
                <input name="discount" type="number" step="0.01" defaultValue={editing?.discount} placeholder="Discount value" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="minOrder" type="number" step="0.01" defaultValue={editing?.minOrder || 0} placeholder="Min order ($)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="maxUses" type="number" defaultValue={editing?.maxUses || 100} placeholder="Max uses" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="expiresAt" type="date" defaultValue={editing?.expiresAt?.slice(0, 10)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <label className="flex items-center gap-2 text-sm text-white/50"><input name="active" type="checkbox" defaultChecked={editing?.active !== false} className="accent-rt-accent" /> Active</label>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────── MESSAGES TAB ─────── */
function MessagesTab({ addToast }) {
  const [messages, setMessages] = useState([]);

  const load = useCallback(async () => { try { setMessages(await adminGetContacts()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    try { await adminMarkContactRead(id); load(); } catch (e) { addToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try { await adminDeleteContact(id); addToast("Deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-3">
      {!messages.length && <div className="text-center py-12 text-white/30">No messages</div>}
      {messages.map((m) => (
        <div key={m.id} className={`glass rounded-2xl p-5 border transition-all ${m.read ? "border-white/5 opacity-70" : "border-rt-accent/20"}`} onClick={() => !m.read && markRead(m.id)}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-white font-medium text-sm">{m.name}</span>
              <span className="text-white/30 text-xs ml-2">{m.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">{m.createdAt?.slice(0, 16)}</span>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
          {m.subject && <p className="text-sm text-white/70 font-medium mb-1">{m.subject}</p>}
          <p className="text-sm text-white/50">{m.message}</p>
          {!m.read && <div className="mt-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-rt-accent/10 text-rt-accent">New</span></div>}
        </div>
      ))}
    </div>
  );
}

/* ─────── REVIEWS TAB ─────── */
function ReviewsTab({ addToast }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try { const res = await adminGetReviews({ page }); setReviews(res.items); } catch {}
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try { await adminDeleteReview(id); addToast("Review deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />)}</div>
              <span className="text-white font-medium text-sm">{r.userName}</span>
              {r.verified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Verified</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">{r.createdAt?.slice(0, 10)}</span>
              <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
          {r.title && <p className="text-sm text-white/70 font-medium mb-1">{r.title}</p>}
          <p className="text-sm text-white/50">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────── SUBSCRIBERS TAB ─────── */
function SubscribersTab() {
  const [subs, setSubs] = useState([]);

  const load = useCallback(async () => { try { setSubs(await adminGetSubscribers()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/50">{subs.length} total subscribers</div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/40 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Email</th><th className="text-right px-4">Subscribed</th>
            </tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{s.email}</td>
                  <td className="px-4 text-right text-white/40 text-xs">{s.createdAt?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────── SETTINGS TAB ─────── */
function SettingsTab({ addToast }) {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { try { setSettings(await adminGetSettings()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.target);
      const data = {};
      Object.keys(settings).forEach((k) => { data[k] = fd.get(k); });
      await adminUpdateSettings(data);
      addToast("Settings saved", "success");
    } catch (ex) { addToast(ex.message, "error"); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
      {Object.entries(settings).map(([key, val]) => (
        <div key={key}>
          <label className="text-xs text-white/40 block mb-1 capitalize">{key.replace(/_/g, " ")}</label>
          {val.type === "textarea" ? (
            <textarea name={key} defaultValue={val.value} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" />
          ) : val.type === "boolean" ? (
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input name={key} type="checkbox" defaultChecked={val.value === "true"} className="accent-rt-accent" />
              {val.value === "true" ? "Enabled" : "Disabled"}
            </label>
          ) : (
            <input name={key} defaultValue={val.value} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          )}
        </div>
      ))}
      <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all disabled:opacity-50">
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}

/* ─────── PAGES TAB ─────── */
function PagesTab({ addToast }) {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => { try { setPages(await adminGetPages()); } catch {} }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try { await adminUpdatePage(editing.id, data); addToast("Page updated", "success"); setEditing(null); load(); } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-medium text-sm">{p.title}</h3>
                <p className="text-xs text-white/30">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>{p.published ? "Published" : "Draft"}</span>
                <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent"><Edit3 size={14} /></button>
              </div>
            </div>
            <p className="text-xs text-white/40 line-clamp-2">{p.content?.slice(0, 100) || "No content"}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-display font-bold text-white mb-4">Edit: {editing.title}</h2>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); handleSave({ title: fd.get("title"), slug: fd.get("slug"), content: fd.get("content"), published: fd.get("published") === "on" }); }} className="space-y-3">
                <input name="title" defaultValue={editing.title} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input name="slug" defaultValue={editing.slug} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <textarea name="content" defaultValue={editing.content} rows={12} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-rt-accent/50 resize-none" />
                <label className="flex items-center gap-2 text-sm text-white/50"><input name="published" type="checkbox" defaultChecked={editing.published} className="accent-rt-accent" /> Published</label>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Save Page</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────── MENU ICON ─────── */
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="15" x2="17" y2="15" />
    </svg>
  );
}
