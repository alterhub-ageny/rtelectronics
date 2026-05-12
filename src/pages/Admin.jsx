import { Component, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error("ErrorBoundary caught:", e, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <p className="text-red-400 text-sm max-w-md text-center">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all">Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
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

/* ─────── COLOR MAPS FOR FUTURISTIC CODING ─────── */
const CATEGORY_COLORS = {
  rent:       { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/25", glow: "shadow-blue-500/20", dot: "bg-blue-400" },
  software:   { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/25", glow: "shadow-violet-500/20", dot: "bg-violet-400" },
  marketing:  { bg: "bg-pink-500/15", text: "text-pink-300", border: "border-pink-500/25", glow: "shadow-pink-500/20", dot: "bg-pink-400" },
  supplier:   { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/25", glow: "shadow-amber-500/20", dot: "bg-amber-400" },
  salary:     { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/25", glow: "shadow-emerald-500/20", dot: "bg-emerald-400" },
  shipping:   { bg: "bg-cyan-500/15", text: "text-cyan-300", border: "border-cyan-500/25", glow: "shadow-cyan-500/20", dot: "bg-cyan-400" },
  utilities:  { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/25", glow: "shadow-rose-500/20", dot: "bg-rose-400" },
  other:      { bg: "bg-gray-500/15", text: "text-gray-300", border: "border-gray-500/25", glow: "shadow-gray-500/20", dot: "bg-gray-400" },
};

const STATUS_COLORS = {
  pending:    { bg: "bg-yellow-500/15", text: "text-yellow-300", border: "border-yellow-500/25", dot: "bg-yellow-400" },
  confirmed:  { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/25", dot: "bg-blue-400" },
  processing: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/25", dot: "bg-violet-400" },
  shipped:    { bg: "bg-cyan-500/15", text: "text-cyan-300", border: "border-cyan-500/25", dot: "bg-cyan-400" },
  delivered:  { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  cancelled:  { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/25", dot: "bg-red-400" },
};

const STOCK_COLORS = {
  out:    { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/25", dot: "bg-red-400", label: "Out of Stock" },
  low:    { bg: "bg-orange-500/15", text: "text-orange-300", border: "border-orange-500/25", dot: "bg-orange-400", label: "Low Stock" },
  normal: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/25", dot: "bg-emerald-400", label: "In Stock" },
  high:   { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/25", dot: "bg-blue-400", label: "Overstock" },
};

const EXPENSE_CATEGORY_LABELS = {
  shipping: "Shipping", supplier: "Supplier Payment", marketing: "Marketing",
  software: "Software", rent: "Office Rent", utilities: "Utilities", salary: "Salaries", other: "Other",
};

function StockBadge({ stock, threshold = 5 }) {
  const s = stock === 0 ? "out" : stock <= threshold ? "low" : stock > 100 ? "high" : "normal";
  const c = STOCK_COLORS[s];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text} ${c.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

function CategoryBadge({ category }) {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium capitalize ${c.bg} ${c.text} ${c.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {EXPENSE_CATEGORY_LABELS[category] || category}
    </span>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: "bg-white/5", text: "text-white/50", border: "border-white/10", dot: "bg-white/30" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium capitalize ${c.bg} ${c.text} ${c.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

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
    <div className="min-h-screen bg-rt-darker flex relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>
      <aside className={`fixed lg:sticky top-0 left-0 h-full z-40 w-64 bg-rt-darker/95 backdrop-blur-xl border-r border-white/5 overflow-y-auto transition-transform ${sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap size={24} className="text-rt-accent relative z-10" />
              <div className="absolute inset-0 bg-rt-accent/20 blur-xl rounded-full scale-150 group-hover:scale-175 transition-transform" />
            </div>
            <span className="text-lg font-display font-bold"><span className="text-white">RT</span><span className="text-rt-accent"> ADMIN</span></span>
          </Link>
        </div>
        <nav className="p-2 space-y-0.5">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebar(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 relative overflow-hidden group ${
                tab === t.id ? "text-rt-accent" : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab === t.id && <div className="absolute inset-0 bg-rt-accent/10 border border-rt-accent/30 rounded-xl" />}
              <span className="relative z-10 flex items-center gap-3">
                <t.icon size={16} />
                {t.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-white/5 mt-2">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      {sidebar && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebar(false)} />}
      <main className="flex-1 min-h-screen overflow-x-hidden relative">
        <header className="sticky top-0 z-20 bg-rt-darker/90 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <MenuIcon />
            </button>
            <h1 className="text-lg font-display font-bold text-white">{TABS.find((t) => t.id === tab)?.label || "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40 hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rt-accent/20 to-rt-accent2/20 flex items-center justify-center relative">
              <Crown size={14} className="text-rt-accent relative z-10" />
              <div className="absolute inset-0 bg-rt-accent/10 blur-md rounded-lg animate-pulse" />
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <ErrorBoundary key={tab}>
            <TabContent />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

/* ─────── SAFE NUMBER FORMAT ─────── */
const sf = (n, d = 2) => { try { return Number(n).toFixed(d); } catch { return "0.00"; } };

/* ─────── SPARKLINE ─────── */
function Sparkline({ data, color = "#ff2a2a", height = 40 }) {
  if (!data?.length) return null;
  const w = 120;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={w} height={height} className="shrink-0">
      <defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
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
            <rect x={x} y={height - 10 - barH} width={bw} height={barH} fill={color} rx="3" opacity="0.85" className="hover:opacity-100 transition-opacity">
              <title>{d.label || ""}: ${v.toFixed(2)}</title>
            </rect>
            <rect x={x} y={height - 10 - barH} width={bw} height={barH} fill={`${color}40`} rx="3" className="animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          </g>
        );
      })}
    </svg>
  );
}

/* ─────── KPI CARD ─────── */
function KpiCard({ title, value, icon: Icon, trend, subtitle, color = "text-rt-accent", chart, onClick }) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} onClick={onClick} className={`glass rounded-2xl p-5 border border-white/5 ${onClick ? "cursor-pointer" : ""} hover:border-white/15 transition-all relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center group-hover:border-rt-accent/30 transition-all">
          {Icon && <Icon size={18} className={`${color} group-hover:scale-110 transition-transform`} />}
        </div>
        {chart}
      </div>
      <p className="text-2xl font-display font-bold text-white mb-0.5 relative">{value}</p>
      <p className="text-xs text-white/40 relative">{title}</p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs relative ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
          {subtitle && <span className="text-white/30 ml-1">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
}

/* ─────── DASHBOARD TAB ─────── */
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState(7);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const [s, h] = await Promise.all([adminGetStats(), adminGetSalesHistory(period)]); setStats(s); setHistory(h || []); } catch (e) { setError(e.message); }
    setLoading(false);
  }, [period]);

  useEffect(() => { load(); }, [load]);

  if (loading && !stats) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-rt-accent/30 border-t-rt-accent rounded-full animate-spin" />
        <div className="absolute inset-0 bg-rt-accent/10 blur-xl rounded-full animate-pulse" />
      </div>
      <p className="text-white/30 text-sm animate-pulse">Loading dashboard...</p>
    </div>
  );

  if (error && !stats) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <p className="text-red-400 text-sm">{error}</p>
      <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all"><RefreshCw size={14} /> Retry</button>
    </div>
  );

  const profitMargin = stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard title="Today" value={`$${sf(stats.todayRevenue)}`} icon={BarChart3} color="text-emerald-400" subtitle={`${stats.todayOrders} orders`} />
        <KpiCard title="Total Revenue" value={`$${sf(stats.totalRevenue)}`} icon={TrendingUp} color="text-green-400" />
        <KpiCard title="Total Expenses" value={`$${sf(stats.totalExpenses)}`} icon={TrendingDown} color="text-orange-400" />
        <KpiCard title="Net Profit" value={`$${sf(stats.netProfit)}`} icon={DollarSign} color={stats.netProfit >= 0 ? "text-emerald-400" : "text-red-400"} subtitle={`${sf(profitMargin, 1)}% margin`} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} trend={0} subtitle="all time" />
        <KpiCard title="Pending" value={stats.pendingOrders} icon={Clock} color="text-yellow-400" />
        <KpiCard title="Low Stock" value={stats.lowStockProducts} icon={AlertTriangle} color="text-orange-400" subtitle={`${stats.outOfStockProducts} out of stock`} />
        <KpiCard title="Avg Order" value={`$${sf(stats.averageOrderValue)}`} icon={Activity} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard title="Products" value={stats.totalProducts} icon={Package} />
        <KpiCard title="Users" value={stats.totalUsers} icon={Users} />
        <KpiCard title="Reviews" value={stats.totalReviews} icon={Star} />
        <KpiCard title="Subscribers" value={stats.totalSubscribers} icon={Mail} />
      </div>
      <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-rt-accent/50 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-display font-semibold">Revenue vs Expenses</h3>
          <div className="flex gap-1">
            {[7, 30].map((d) => (
              <button key={d} onClick={() => setPeriod(d)} className={`px-3 py-1 text-xs rounded-lg transition-all ${period === d ? "bg-rt-accent text-white shadow-lg shadow-rt-accent/25" : "bg-white/5 text-white/50 hover:text-white"}`}>{d}d</button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <BarChart data={history.map((h) => ({ label: h.date?.slice(5), value: h.revenue }))} color="#22c55e" />
            <p className="text-xs text-emerald-400/50 text-center mt-1">Revenue</p>
          </div>
          <div className="flex-1 min-w-[250px]">
            <BarChart data={history.map((h) => ({ label: h.date?.slice(5), value: h.expenses }))} color="#f97316" />
            <p className="text-xs text-orange-400/50 text-center mt-1">Expenses</p>
          </div>
          <div className="flex-1 min-w-[250px]">
            <BarChart data={history.map((h) => ({ label: h.date?.slice(5), value: Math.max(0, h.profit) }))} color="#a855f7" />
            <p className="text-xs text-violet-400/50 text-center mt-1">Profit</p>
          </div>
        </div>
      </div>
      <div className="glass rounded-2xl p-5 border border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-rt-accent/50 to-transparent" />
        <h3 className="text-white font-display font-semibold mb-3">Recent Sales ({period}d)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5">
              <th className="text-left py-2 pr-4">Date</th><th className="text-right pr-4">Orders</th><th className="text-right pr-4">Revenue</th><th className="text-right pr-4">Costs</th><th className="text-right">Profit</th>
            </tr></thead>
            <tbody>
              {[...history].reverse().map((h) => (
                <tr key={h.date} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 pr-4 text-white/70 font-mono text-xs">{h.date}</td>
                  <td className="py-2 pr-4 text-right text-white/70">{h.orders}</td>
                  <td className="py-2 pr-4 text-right text-emerald-400 font-mono">${sf(h.revenue)}</td>
                  <td className="py-2 pr-4 text-right text-orange-400 font-mono">${sf(h.expenses)}</td>
                  <td className={`py-2 text-right font-mono ${h.profit >= 0 ? "text-rt-accent" : "text-red-400"}`}>${sf(h.profit)}</td>
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
    try { const [res, cats] = await Promise.all([adminGetProducts({ page, limit: 15 }), getCategories()]); setProducts(res.items); setTotal(res.total); setCategories(cats); } catch {}
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => { if (!confirm("Delete this product?")) return; try { await adminDeleteProduct(id); addToast("Product deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  const handleSave = async (data) => {
    try {
      if (editing?.id) { await adminUpdateProduct(editing.id, data); addToast("Product updated", "success"); }
      else { await adminCreateProduct(data); addToast("Product created", "success"); }
      setEditing(null); load();
    } catch (e) { addToast(e.message, "error"); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 transition-all" />
        </div>
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20"><Plus size={16} /> Add Product</button>
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Product</th><th className="text-right px-4">Price</th><th className="text-right px-4">Stock</th><th className="text-right px-4">Rating</th><th className="text-right px-4 w-20">Actions</th>
            </tr></thead>
            <tbody>
              {products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/30 overflow-hidden">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : <Package size={16} />}
                      </div>
                      <div><p className="text-white font-medium truncate max-w-[200px]">{p.name}</p><p className="text-white/25 text-[10px]">{p.category}</p></div>
                    </div>
                  </td>
                  <td className="px-4 text-right text-rt-accent font-mono">${p.price?.toFixed(2)}</td>
                  <td className="px-4 text-right"><StockBadge stock={p.stock} /></td>
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
      <AnimatePresence>{editing !== null && <ProductForm product={editing} categories={categories} onSave={handleSave} onClose={() => setEditing(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function ProductForm({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", description: "", badge: "", originalPrice: "", features: "", images: "", specs: "", ...product });
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, price: Number(form.price), stock: Number(form.stock || 0), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, features: form.features ? form.features.split("\n").filter(Boolean) : [], images: form.images ? form.images.split("\n").filter(Boolean) : [], specs: form.specs ? JSON.parse(form.specs || "{}") : {} }); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-display font-bold text-white">{product?.id ? "Edit Product" : "New Product"}</h2><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40"><X size={18} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs text-white/40 block mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
              <option value="">Select...</option>{categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select></div>
            <div><label className="text-xs text-white/40 block mb-1">Badge</label><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Featured, New, Sale..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Price ($)</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Original Price</label><input type="number" step="0.01" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
          </div>
          <div><label className="text-xs text-white/40 block mb-1">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Features (one per line)</label><textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Feature 1&#10;Feature 2" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none font-mono" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Images (one URL per line)</label><textarea rows={2} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none font-mono" /></div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button><button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20">{product?.id ? "Update" : "Create"} Product</button></div>
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

  const load = useCallback(async () => { try { const res = await adminGetOrders({ page, limit: 20 }); setOrders(res.items); } catch {} }, [page]);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    const tracking = status === "shipped" ? prompt("Tracking number:") : undefined;
    try { await adminUpdateOrderStatus(id, { status, ...(tracking ? { trackingNumber: tracking } : {}) }); addToast("Order updated", "success"); load(); } catch (e) { addToast(e.message, "error"); }
  };

  const filtered = orders.filter((o) => !statusFilter || o.status === statusFilter);
  const statuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter("")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${!statusFilter ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30 shadow-lg shadow-rt-accent/10" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>All</button>
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${statusFilter === s ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30 shadow-lg shadow-rt-accent/10" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>{s}</button>
        ))}
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Order</th><th className="text-left px-4">Customer</th><th className="text-right px-4">Items</th><th className="text-right px-4">Total</th><th className="text-center px-4">Status</th><th className="text-right px-4">Date</th><th className="text-right px-4 w-24">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-white/50">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 text-white/70">{o.address?.name || "—"}</td>
                  <td className="px-4 text-right text-white/70">{o.items?.length || 0}</td>
                  <td className="px-4 text-right text-rt-accent font-mono">${o.total?.toFixed(2)}</td>
                  <td className="px-4 text-center"><StatusBadge status={o.status} /></td>
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
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:border-white/20">Prev</button>
          <button disabled={filtered.length < 20} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:border-white/20">Next</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────── USERS TAB ─────── */
function UsersTab({ addToast }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const load = useCallback(async () => { try { const res = await adminGetUsers({ page }); setUsers(res.items); } catch {} }, [page]);
  useEffect(() => { load(); }, [load]);
  const toggleBan = async (u) => { try { await adminUpdateUser(u.id, { banned: !u.banned }); addToast(u.banned ? "User unbanned" : "User banned", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  const toggleRole = async (u) => { try { await adminUpdateUser(u.id, { role: u.role === "admin" ? "user" : "admin" }); addToast("Role updated", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">User</th><th className="text-left px-4">Email</th><th className="text-center px-4">Role</th><th className="text-center px-4">Status</th><th className="text-right px-4">Joined</th><th className="text-right px-4 w-24">Actions</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${u.banned ? "opacity-50" : ""}`}>
                  <td className="py-3 px-4"><span className="text-white font-medium">{u.name}</span></td>
                  <td className="px-4 text-white/50">{u.email}</td>
                  <td className="px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${u.role === "admin" ? "bg-rt-accent/15 text-rt-accent border border-rt-accent/25" : "bg-white/5 text-white/50 border border-white/10"}`}>
                      <Crown size={10} />{u.role}
                    </span>
                  </td>
                  <td className="px-4 text-center">{u.banned ? <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/25">Banned</span> : <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">Active</span>}</td>
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
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:border-white/20">Prev</button>
          <button disabled={users.length < 50} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:border-white/20">Next</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────── CATEGORIES TAB ─────── */
function CategoriesTab({ addToast }) {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filterFeatured, setFilterFeatured] = useState("all");
  const load = useCallback(async () => { try { setCats(await getCategories()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (data) => { try { if (editing?.id) { await adminUpdateCategory(editing.id, data); addToast("Category updated", "success"); } else { await adminCreateCategory(data); addToast("Category created", "success"); } setEditing(null); load(); } catch (e) { addToast(e.message, "error"); } };
  const handleDelete = async (id) => { if (!confirm("Delete this category?")) return; try { await adminDeleteCategory(id); addToast("Category deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  const filtered = cats.filter((c) => filterFeatured === "all" || (filterFeatured === "featured" && c.featured) || (filterFeatured === "standard" && !c.featured));
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterFeatured("all")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterFeatured === "all" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>All ({cats.length})</button>
          <button onClick={() => setFilterFeatured("featured")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterFeatured === "featured" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>Featured</button>
          <button onClick={() => setFilterFeatured("standard")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filterFeatured === "standard" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>Standard</button>
        </div>
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20"><Plus size={16} /> Add Category</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <motion.div key={c.id} whileHover={{ y: -2, scale: 1.01 }} className={`glass rounded-2xl p-5 border transition-all group hover:border-white/20 relative overflow-hidden ${c.featured ? "border-rt-accent/20" : "border-white/5"}`}>
            {c.featured && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rt-accent/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rt-accent/10 to-rt-accent2/10 border border-white/10 flex items-center justify-center">
                  {c.icon ? <span className="text-rt-accent text-lg font-display font-bold">{c.icon.charAt(0)}</span> : <FolderTree size={20} className="text-rt-accent" />}
                </div>
                <div><h3 className="text-white font-medium">{c.name}</h3><p className="text-xs text-white/30 font-mono">/{c.slug}</p></div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rt-accent"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-white/50 mb-3 line-clamp-2">{c.description || "No description"}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40"><Package size={12} className="inline mr-1" />{c.productCount || 0} products</span>
              {c.featured ? <span className="px-2 py-0.5 rounded-full bg-rt-accent/10 text-rt-accent flex items-center gap-1 border border-rt-accent/20"><Star size={10} /> Featured</span> : <span className="text-white/20">Standard</span>}
            </div>
            <div className="mt-2 text-[10px] text-white/20">Order: {c.order || 0}</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing !== null && <CategoryForm editing={editing} onSave={handleSave} onClose={() => setEditing(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function CategoryForm({ editing, onSave, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-lg glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-white mb-4">{editing?.id ? "Edit" : "New"} Category</h2>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); onSave({ name: fd.get("name"), slug: fd.get("slug"), description: fd.get("description"), icon: fd.get("icon"), order: Number(fd.get("order") || 0), featured: fd.get("featured") === "on" }); }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-xs text-white/40 block mb-1">Name</label><input name="name" defaultValue={editing?.name} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Slug</label><input name="slug" defaultValue={editing?.slug} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Icon</label><input name="icon" defaultValue={editing?.icon || ""} placeholder="Monitor, Smartphone..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div className="col-span-2"><label className="text-xs text-white/40 block mb-1">Description</label><textarea name="description" rows={2} defaultValue={editing?.description || ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Sort Order</label><input name="order" type="number" defaultValue={editing?.order || 0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
            <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-sm text-white/50"><input name="featured" type="checkbox" defaultChecked={editing?.featured || false} className="accent-rt-accent" /> Featured</label></div>
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button><button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20">Save</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────── STOCK TAB ─────── */
function StockTab({ addToast }) {
  const [lowStock, setLowStock] = useState([]);
  const [stockLog, setStockLog] = useState([]);
  const [adjusting, setAdjusting] = useState(null);
  const [view, setView] = useState("low");
  const load = useCallback(async () => { try { const [low, log] = await Promise.all([adminGetLowStock(10), adminGetStockLog()]); setLowStock(low); setStockLog(log); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  const handleAdjust = async (data) => { try { await adminAdjustStock(data); addToast("Stock adjusted", "success"); load(); setAdjusting(null); } catch (e) { addToast(e.message, "error"); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setView("low")} className={`px-4 py-2 rounded-xl text-sm transition-all ${view === "low" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30 shadow-lg shadow-rt-accent/10" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}><AlertTriangle size={14} className="inline mr-1" />Low Stock ({lowStock.length})</button>
        <button onClick={() => setView("log")} className={`px-4 py-2 rounded-xl text-sm transition-all ${view === "log" ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30 shadow-lg shadow-rt-accent/10" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}><Clock size={14} className="inline mr-1" />Stock Movement</button>
      </div>
      {view === "low" && (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5"><th className="text-left py-3 px-4">Product</th><th className="text-right px-4">Status</th><th className="text-right px-4">Stock</th><th className="text-right px-4">Price</th><th className="text-right px-4 w-24">Action</th></tr></thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-white">{p.name}</span></td>
                    <td className="px-4 text-right"><StockBadge stock={p.stock} /></td>
                    <td className={`px-4 text-right font-mono font-bold ${p.stock === 0 ? "text-red-400" : "text-orange-400"}`}>{p.stock}</td>
                    <td className="px-4 text-right text-rt-accent font-mono">${p.price?.toFixed(2)}</td>
                    <td className="px-4 text-right"><button onClick={() => setAdjusting(p)} className="px-3 py-1.5 rounded-lg bg-rt-accent/10 text-rt-accent text-xs hover:bg-rt-accent/20 transition-all border border-rt-accent/20">Adjust</button></td>
                  </tr>
                ))}
                {!lowStock.length && <tr><td colSpan={5} className="py-8 text-center text-white/30">All products have sufficient stock</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {view === "log" && (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5"><th className="text-left py-3 px-4">Date</th><th className="text-left px-4">Product</th><th className="text-center px-4">Type</th><th className="text-right px-4">Qty</th><th className="text-left px-4">Note</th></tr></thead>
              <tbody>
                {stockLog.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white/40 text-xs">{l.createdAt?.slice(0, 16)}</td>
                    <td className="px-4 text-white">{l.productId?.slice(0, 8)}</td>
                    <td className="px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${l.type === "in" || l.type === "add" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" : l.type === "out" || l.type === "remove" ? "bg-red-500/15 text-red-300 border-red-500/25" : "bg-blue-500/15 text-blue-300 border-blue-500/25"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${l.type === "in" || l.type === "add" ? "bg-emerald-400" : l.type === "out" || l.type === "remove" ? "bg-red-400" : "bg-blue-400"}`} />
                        {l.type}
                      </span>
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
      <AnimatePresence>{adjusting && <AdjustStockForm product={adjusting} onSave={handleAdjust} onClose={() => setAdjusting(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function AdjustStockForm({ product, onSave, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-white mb-1">Adjust Stock</h2>
        <p className="text-sm text-white/50 mb-4">{product.name} · Current: <span className="text-rt-accent font-mono">{product.stock}</span></p>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); onSave({ productId: product.id, type: fd.get("type"), quantity: Number(fd.get("quantity")), note: fd.get("note") }); }} className="space-y-3">
          <div><label className="text-xs text-white/40 block mb-1">Type</label><select name="type" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50"><option value="add">Add Stock</option><option value="remove">Remove Stock</option><option value="set">Set Exact</option></select></div>
          <div><label className="text-xs text-white/40 block mb-1">Quantity</label><input name="quantity" type="number" required min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Note</label><input name="note" placeholder="Reason for adjustment" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" /></div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button><button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20">Apply</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────── EXPENSES TAB ─────── */
function ExpensesTab({ addToast }) {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");
  const load = useCallback(async () => { try { setExpenses(await adminGetExpenses()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (data) => { try { if (editing?.id) { await adminUpdateExpense(editing.id, data); addToast("Expense updated", "success"); } else { await adminCreateExpense(data); addToast("Expense added", "success"); } setEditing(null); load(); } catch (e) { addToast(e.message, "error"); } };
  const handleDelete = async (id) => { if (!confirm("Delete this expense?")) return; try { await adminDeleteExpense(id); addToast("Expense deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  const filtered = expenses.filter((e) => !filter || e.category === filter);
  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const cats = [...new Set(expenses.map((e) => e.category))];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${!filter ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30 shadow-lg shadow-rt-accent/10" : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>All</button>
          {cats.map((c) => {
            const col = CATEGORY_COLORS[c] || CATEGORY_COLORS.other;
            return (
              <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${filter === c ? `${col.bg} ${col.text} ${col.border} border` : "bg-white/5 text-white/50 border border-white/10 hover:text-white"}`}>
                {EXPENSE_CATEGORY_LABELS[c] || c}
              </button>
            );
          })}
        </div>
        <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20"><Plus size={16} /> Add Expense</button>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-white/50">Filtered Total:</span>
        <span className="text-rt-accent font-mono font-bold text-lg">${total.toFixed(2)}</span>
        {filter && <button onClick={() => setFilter("")} className="text-xs text-white/30 hover:text-white/60"><X size={12} className="inline" /> Clear</button>}
      </div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Title</th><th className="text-left px-4">Category</th><th className="text-right px-4">Amount</th><th className="text-left px-4">Note</th><th className="text-right px-4">Date</th><th className="text-right px-4 w-20">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{e.title}</td>
                  <td className="px-4"><CategoryBadge category={e.category} /></td>
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
      <AnimatePresence>{editing !== null && <ExpenseForm editing={editing} onSave={handleSave} onClose={() => setEditing(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function ExpenseForm({ editing, onSave, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-white mb-4">{editing?.id ? "Edit" : "Add"} Expense</h2>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); onSave({ title: fd.get("title"), category: fd.get("category"), amount: Number(fd.get("amount")), description: fd.get("description"), date: fd.get("date"), recurring: fd.get("recurring") === "on" }); }} className="space-y-3">
          <input name="title" defaultValue={editing?.title} placeholder="Title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <select name="category" defaultValue={editing?.category || "other"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
            {Object.entries(EXPENSE_CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input name="amount" type="number" step="0.01" defaultValue={editing?.amount} placeholder="Amount" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <input name="description" defaultValue={editing?.description} placeholder="Description (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <input name="date" type="date" defaultValue={editing?.date?.slice(0, 10)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <label className="flex items-center gap-2 text-sm text-white/50"><input name="recurring" type="checkbox" defaultChecked={editing?.recurring} className="accent-rt-accent" /> Recurring expense</label>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button><button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20">Save</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────── SUPPLIERS TAB ─────── */
function SuppliersTab({ addToast }) {
  const [suppliers, setSuppliers] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = useCallback(async () => { try { setSuppliers(await adminGetSuppliers()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (data) => { try { if (editing?.id) { await adminUpdateSupplier(editing.id, data); addToast("Supplier updated", "success"); } else { await adminCreateSupplier(data); addToast("Supplier added", "success"); } setEditing(null); load(); } catch (e) { addToast(e.message, "error"); } };
  const handleDelete = async (id) => { if (!confirm("Delete this supplier?")) return; try { await adminDeleteSupplier(id); addToast("Supplier deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex justify-end"><button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20"><Plus size={16} /> Add Supplier</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <motion.div key={s.id} whileHover={{ y: -2, scale: 1.01 }} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all group relative overflow-hidden">
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
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing !== null && <SimpleForm title={editing?.id ? "Edit Supplier" : "Add Supplier"} fields={["name", "contact", "email", "phone", "address", "notes"]} defaults={editing} onSave={handleSave} onClose={() => setEditing(null)} />}</AnimatePresence>
    </motion.div>
  );
}

/* ─────── SIMPLE FORM MODAL ─────── */
function SimpleForm({ title, fields, defaults, onSave, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-white mb-4">{title}</h2>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); const data = {}; fields.forEach((f) => data[f] = fd.get(f)); onSave(data); }} className="space-y-3">
          {fields.map((f) => <input key={f} name={f} defaultValue={defaults?.[f] || ""} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 capitalize" />)}
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button><button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20">Save</button></div>
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
  const handleSave = async (data) => { try { if (editing?.id) { await adminUpdateCoupon(editing.id, data); addToast("Coupon updated", "success"); } else { await adminCreateCoupon(data); addToast("Coupon created", "success"); } setEditing(null); load(); } catch (e) { addToast(e.message, "error"); } };
  const handleDelete = async (id) => { if (!confirm("Delete this coupon?")) return; try { await adminDeleteCoupon(id); addToast("Coupon deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex justify-end"><button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20"><Plus size={16} /> Add Coupon</button></div>
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5">
              <th className="text-left py-3 px-4">Code</th><th className="text-right px-4">Discount</th><th className="text-center px-4">Type</th><th className="text-right px-4">Used</th><th className="text-right px-4">Max</th><th className="text-center px-4">Active</th><th className="text-right px-4">Expires</th><th className="text-right px-4 w-20">Actions</th>
            </tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-rt-accent font-bold">{c.code}</td>
                  <td className="px-4 text-right text-white/70">{c.type === "percent" ? `${c.discount}%` : c.type === "flat" ? `$${c.discount}` : c.discount}</td>
                  <td className="px-4 text-center"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 text-white/50 border border-white/10 capitalize">{c.type}</span></td>
                  <td className="px-4 text-right text-white/50">{c.used}/{c.maxUses}</td>
                  <td className="px-4 text-right text-white/50">{c.maxUses}</td>
                  <td className="px-4 text-center">{c.active ? <Check size={14} className="text-emerald-400 mx-auto" /> : <X size={14} className="text-red-400 mx-auto" />}</td>
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
      <AnimatePresence>{editing !== null && <CouponForm editing={editing} onSave={handleSave} onClose={() => setEditing(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function CouponForm({ editing, onSave, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-display font-bold text-white mb-4">{editing?.id ? "Edit" : "Add"} Coupon</h2>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); onSave({ code: fd.get("code"), discount: Number(fd.get("discount")), type: fd.get("type"), minOrder: Number(fd.get("minOrder") || 0), maxUses: Number(fd.get("maxUses") || 100), active: fd.get("active") === "on", expiresAt: fd.get("expiresAt") }); }} className="space-y-3">
          <input name="code" defaultValue={editing?.code} placeholder="Code" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 uppercase" />
          <select name="type" defaultValue={editing?.type || "percent"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50">
            <option value="percent">Percentage (%)</option><option value="flat">Flat Amount ($)</option><option value="free_shipping">Free Shipping</option>
          </select>
          <input name="discount" type="number" step="0.01" defaultValue={editing?.discount} placeholder="Discount value" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <input name="minOrder" type="number" step="0.01" defaultValue={editing?.minOrder || 0} placeholder="Min order ($)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <input name="maxUses" type="number" defaultValue={editing?.maxUses || 100} placeholder="Max uses" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <input name="expiresAt" type="date" defaultValue={editing?.expiresAt?.slice(0, 10)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
          <label className="flex items-center gap-2 text-sm text-white/50"><input name="active" type="checkbox" defaultChecked={editing?.active !== false} className="accent-rt-accent" /> Active</label>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button><button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20">Save</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────── MESSAGES TAB ─────── */
function MessagesTab({ addToast }) {
  const [messages, setMessages] = useState([]);
  const load = useCallback(async () => { try { setMessages(await adminGetContacts()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  const markRead = async (id) => { try { await adminMarkContactRead(id); load(); } catch (e) { addToast(e.message, "error"); } };
  const handleDelete = async (id) => { if (!confirm("Delete this message?")) return; try { await adminDeleteContact(id); addToast("Deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {!messages.length && <div className="text-center py-12 text-white/30">No messages</div>}
      {messages.map((m) => (
        <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`glass rounded-2xl p-5 border transition-all relative overflow-hidden ${m.read ? "border-white/5 opacity-70" : "border-rt-accent/20"}`} onClick={() => !m.read && markRead(m.id)}>
          {!m.read && <div className="absolute top-0 left-0 w-1 h-full bg-rt-accent" />}
          <div className="flex items-start justify-between mb-2">
            <div><span className="text-white font-medium text-sm">{m.name}</span><span className="text-white/30 text-xs ml-2">{m.email}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">{m.createdAt?.slice(0, 16)}</span>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
          {m.subject && <p className="text-sm text-white/70 font-medium mb-1">{m.subject}</p>}
          <p className="text-sm text-white/50">{m.message}</p>
          {!m.read && <div className="mt-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-rt-accent/10 text-rt-accent border border-rt-accent/20">New</span></div>}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────── REVIEWS TAB ─────── */
function ReviewsTab({ addToast }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const load = useCallback(async () => { try { const res = await adminGetReviews({ page, limit: 20 }); setReviews(res.items || res); } catch {} }, [page]);
  useEffect(() => { load(); }, [load]);
  const handleDelete = async (id) => { if (!confirm("Delete this review?")) return; try { await adminDeleteReview(id); addToast("Review deleted", "success"); load(); } catch (e) { addToast(e.message, "error"); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {!reviews.length && <div className="text-center py-12 text-white/30">No reviews</div>}
      {reviews.map((r) => (
        <div key={r.id} className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 flex items-center justify-center"><Star size={14} className="text-yellow-400" /></div>
              <div><span className="text-white font-medium text-sm">{r.userName || "Anonymous"}</span><span className="text-white/30 text-xs ml-2">{r.createdAt?.slice(0, 10)}</span></div>
            </div>
            <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
          <div className="flex items-center gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-white/10"} />)}</div>
          {r.title && <p className="text-sm text-white/70 font-medium mb-1">{r.title}</p>}
          <p className="text-sm text-white/50">{r.comment}</p>
        </div>
      ))}
    </motion.div>
  );
}

/* ─────── SUBSCRIBERS TAB ─────── */
function SubscribersTab() {
  const [subs, setSubs] = useState([]);
  const load = useCallback(async () => { try { setSubs(await adminGetSubscribers()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-white/30 text-xs uppercase border-b border-white/5"><th className="text-left py-3 px-4">Email</th><th className="text-right px-4">Subscribed</th></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{s.email}</td>
                  <td className="px-4 text-right text-white/40 text-xs">{s.createdAt?.slice(0, 10)}</td>
                </tr>
              ))}
              {!subs.length && <tr><td colSpan={2} className="py-8 text-center text-white/30">No subscribers yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-white/30">{subs.length} total subscribers</p>
    </motion.div>
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
    const fd = new FormData(e.target);
    const data = {};
    for (const key of fd.keys()) { data[key] = fd.get(key); }
    try { await adminUpdateSettings(data); addToast("Settings saved", "success"); load(); } catch (err) { addToast(err.message, "error"); }
    setSaving(false);
  };
  const groups = [
    { title: "Store Info", keys: ["store_name", "store_email", "store_phone", "store_address", "currency"] },
    { title: "Pricing", keys: ["tax_rate", "shipping_rate", "free_shipping_min", "order_prefix"] },
    { title: "Stock", keys: ["low_stock_threshold"] },
    { title: "Social", keys: ["facebook_url", "twitter_url", "instagram_url"] },
    { title: "Content", keys: ["about_text"] },
    { title: "Site", keys: ["announcement", "announcement_active", "maintenance_mode"] },
  ];
  const labels = {
    store_name: "Store Name", store_email: "Store Email", store_phone: "Store Phone",
    store_address: "Store Address", currency: "Currency", tax_rate: "Tax Rate",
    shipping_rate: "Shipping Rate", free_shipping_min: "Free Shipping Min",
    order_prefix: "Order Prefix", low_stock_threshold: "Low Stock Threshold",
    facebook_url: "Facebook URL", twitter_url: "Twitter URL", instagram_url: "Instagram URL",
    about_text: "About Text", announcement: "Announcement", announcement_active: "Show Announcement",
    maintenance_mode: "Maintenance Mode",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <form onSubmit={handleSave} className="space-y-6">
        {groups.map((g) => (
          <div key={g.title} className="glass rounded-2xl p-5 border border-white/5">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-rt-accent/30 to-transparent" />
            <h3 className="text-white font-display font-semibold mb-4 text-sm uppercase tracking-wider text-rt-accent">{g.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {g.keys.map((k) => {
                const val = settings[k];
                const isBool = val?.type === "boolean";
                const isTextarea = val?.type === "textarea";
                return (
                  <div key={k} className={isTextarea ? "md:col-span-2" : ""}>
                    <label className="text-xs text-white/40 block mb-1">{labels[k] || k}</label>
                    {isBool ? (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input name={k} type="checkbox" defaultChecked={val?.value === "true"} className="w-4 h-4 rounded accent-rt-accent" />
                        <span className="text-sm text-white/50">{val?.value === "true" ? "Enabled" : "Disabled"}</span>
                      </label>
                    ) : isTextarea ? (
                      <textarea name={k} rows={3} defaultValue={val?.value || ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50 resize-none" />
                    ) : (
                      <input name={k} defaultValue={val?.value || ""} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20 disabled:opacity-50">{saving ? "Saving..." : <><Save size={16} /> Save All Settings</>}</button>
      </form>
    </motion.div>
  );
}

/* ─────── PAGES TAB ─────── */
function PagesTab({ addToast }) {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = useCallback(async () => { try { setPages(await adminGetPages()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (data) => {
    try { await adminUpdatePage(editing.id, data); addToast("Page saved", "success"); setEditing(null); load(); } catch (e) { addToast(e.message, "error"); }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -2 }} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all cursor-pointer" onClick={() => setEditing(p)}>
            <div className="flex items-center gap-3 mb-2">
              <FileText size={18} className="text-rt-accent" />
              <div><h3 className="text-white font-medium">{p.title}</h3><p className="text-xs text-white/30 font-mono">/{p.slug}</p></div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {p.published ? <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">Published</span> : <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">Draft</span>}
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing && <PageForm page={editing} onSave={handleSave} onClose={() => setEditing(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function PageForm({ page, onSave, onClose }) {
  const [content, setContent] = useState(page.content || "");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-3xl max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-display font-bold text-white">Edit: {page.title}</h2><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40"><X size={18} /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ title: page.title, slug: page.slug, content, published: new FormData(e.target).get("published") === "on" }); }} className="space-y-4">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="w-full bg-rt-darker/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-rt-accent/50 resize-none" placeholder="HTML content..." />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-white/50"><input name="published" type="checkbox" defaultChecked={page.published} className="accent-rt-accent" /> Published</label>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl bg-rt-accent text-white text-sm font-medium hover:bg-rt-accent2 transition-all shadow-lg shadow-rt-accent/20"><Save size={14} className="inline mr-1" /> Save Page</button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function MenuIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5h14M3 10h14M3 15h14" /></svg>; }
