import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { User, Package, Heart, MapPin, LogOut, Edit3, Plus, Trash2, Mail, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { updateProfile, addAddress, deleteAddress, getOrders } from "../services/api";
import AvatarPicker from "../components/ui/AvatarPicker";

export default function Account() {
  const { t } = useTranslation();
  const { user, logout, refreshUser } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newAddr, setNewAddr] = useState({ label: "", street: "", city: "", zip: "", phone: "" });
  const [showAddr, setShowAddr] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setName(user.name);
    setAvatarUrl(user.avatar || "");
    getOrders().then(setOrders).catch(() => {});
  }, [user]);

  if (!user) return null;

  const handleUpdate = async () => {
    try {
      await updateProfile({ name, avatar: avatarUrl || undefined });
      await refreshUser();
      addToast(t("account.profile_updated"), "success");
      setEditing(false);
    } catch { addToast(t("account.update_failed"), "error"); }
  };

  const handleAddAddr = async () => {
    if (!newAddr.street || !newAddr.city) { addToast(t("account.fill_required"), "warning"); return; }
    try {
      await addAddress(newAddr);
      await refreshUser();
      setShowAddr(false);
      setNewAddr({ label: "", street: "", city: "", zip: "", phone: "" });
      addToast(t("account.address_added"), "success");
    } catch { addToast(t("account.address_add_failed"), "error"); }
  };

  const handleDelAddr = async (id) => {
    try { await deleteAddress(id); await refreshUser(); addToast(t("account.address_removed"), "success"); }
    catch { addToast(t("account.remove_failed"), "error"); }
  };

  const tabs = [
    { id: "profile", label: t("account.profile"), icon: User },
    { id: "orders", label: t("account.orders"), icon: Package },
    { id: "wishlist", label: t("account.wishlist"), icon: Heart },
    { id: "addresses", label: t("account.addresses"), icon: MapPin },
  ];

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-hover)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center overflow-hidden">
          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={22} className="text-[var(--color-primary)]" />}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">{user.name}</h1>
          <p className="text-[var(--color-text-muted)] text-xs font-mono flex items-center gap-1"><Mail size={10} /> {user.email}</p>
        </div>
        <button onClick={logout} className="ml-auto p-2.5 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400/70 hover:text-red-400 hover:bg-red-500/12 transition-all">
          <LogOut size={15} />
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                tab === t.id ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)]" : "border border-[var(--card-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)]/30"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "profile" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-[var(--color-text)] tracking-wider">{t("account.profile_data")}</h2>
              <button onClick={() => setEditing(!editing)} className="text-[var(--color-primary)] text-[0.625rem] font-mono flex items-center gap-1 hover:text-[var(--color-text-muted)] transition-colors">
                <Edit3 size={11} /> {editing ? t("account.cancel") : t("account.edit")}
              </button>
            </div>
            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-hover)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} /> : <User size={24} className="text-[var(--color-primary)]" />}
                  </div>
                  <div>
                    <p className="text-[var(--color-text)] text-xs font-medium">{t("account.avatar")}</p>
                    <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono">{t("account.avatar_hint")}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 bg-[var(--card-bg)] border border-[var(--card-border)]">
                  <AvatarPicker current={avatarUrl} onSelect={setAvatarUrl} />
                </div>
                <div>
                  <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("account.name")}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
                </div>
                <div>
                  <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("account.image_url")}</label>
                  <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className="input" />
                </div>
                <button onClick={handleUpdate} className="btn btn-primary">{t("account.save_changes")}</button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: t("account.name"), value: user.name },
                  { label: t("account.email"), value: user.email },
                  { label: t("account.role"), value: user.role },
                  { label: t("account.joined"), value: new Date(user.createdAt).toLocaleDateString() },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-[var(--card-border)]">
                    <span className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider">{item.label}</span>
                    <span className="text-[var(--color-text)] text-xs font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {tab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={36} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
              <p className="text-[var(--color-text-muted)] text-sm">{t("account.no_orders")}</p>
              <Link to="/products" className="btn btn-primary mt-4">
                <Zap size={13} /> {t("account.shop_now")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-w-xl">
              {orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="block glass-card p-4 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.625rem] font-mono text-[var(--color-text-muted)]">#{order.id?.slice(0, 8)}</span>
                    <span className={`px-2.5 py-0.5 text-[0.5625rem] font-bold rounded-full uppercase tracking-wider border ${
                      order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      order.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      order.status === "shipped" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[var(--color-text)] text-xs">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</p>
                      <p className="text-[var(--color-text-muted)] text-[0.625rem] font-mono">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="price text-sm">MAD {Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {tab === "wishlist" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Heart size={36} className="mx-auto mb-3 text-[var(--color-primary)]/30" />
          <p className="text-[var(--color-text-muted)] text-xs font-mono mb-4">{t("account.wishlist_hint")}</p>
          <Link to="/wishlist" className="btn btn-primary">
            <Zap size={13} /> {t("account.wishlist_btn")}
          </Link>
        </motion.div>
      )}

      {tab === "addresses" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-3">
          {user.addresses?.map((addr) => (
            <div key={addr.id} className="glass-card p-4 flex items-start justify-between">
              <div>
                <p className="text-[var(--color-text)] text-xs font-medium mb-0.5">{addr.label || t("account.address_title")}</p>
                <p className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono">{addr.street}</p>
                <p className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono">{addr.city}, {addr.zip}</p>
                {addr.phone && <p className="text-[var(--color-text-muted)] text-[0.6875rem] font-mono">{addr.phone}</p>}
              </div>
              <button onClick={() => handleDelAddr(addr.id)} className="p-1.5 rounded-lg bg-red-500/8 text-red-400/60 hover:text-red-400 hover:bg-red-500/12 transition-all shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {showAddr ? (
            <div className="glass-card p-5 space-y-3">
              <input placeholder={t("account.label_placeholder")} value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} className="input" />
              <input placeholder={t("account.street_placeholder")} value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} className="input" />
              <div className="flex gap-3">
                <input placeholder={t("account.city_placeholder")} value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="flex-1 input" />
                <input placeholder={t("account.zip_placeholder")} value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} className="w-24 input" />
              </div>
              <input placeholder={t("account.phone_placeholder")} value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} className="input" />
              <div className="flex gap-3 pt-1">
                <button onClick={handleAddAddr} className="btn btn-primary flex-1">{t("account.save")}</button>
                <button onClick={() => setShowAddr(false)} className="btn btn-outline flex-1">{t("account.cancel")}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddr(true)} className="w-full py-3.5 rounded-2xl border border-dashed border-[var(--card-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2 text-xs font-mono">
              <Plus size={14} /> {t("account.add_address")}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
