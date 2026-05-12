import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, Edit3, Plus, Trash2, Mail, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { updateProfile, addAddress, deleteAddress, getOrders } from "../services/api";
import AvatarPicker from "../components/ui/AvatarPicker";

export default function Account() {
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
      addToast("Profile updated", "success");
      setEditing(false);
    } catch { addToast("Update failed", "error"); }
  };

  const handleAddAddr = async () => {
    if (!newAddr.street || !newAddr.city) { addToast("Fill required fields", "warning"); return; }
    try {
      await addAddress(newAddr);
      await refreshUser();
      setShowAddr(false);
      setNewAddr({ label: "", street: "", city: "", zip: "", phone: "" });
      addToast("Address added", "success");
    } catch { addToast("Failed to add address", "error"); }
  };

  const handleDelAddr = async (id) => {
    try { await deleteAddress(id); await refreshUser(); addToast("Address removed", "success"); }
    catch { addToast("Failed to remove", "error"); }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rt-accent/20 to-rt-accent2/10 border border-rt-accent/20 flex items-center justify-center overflow-hidden">
          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={22} className="text-rt-accent" />}
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-white/90">{user.name}</h1>
          <p className="text-white/30 text-xs font-mono flex items-center gap-1"><Mail size={10} /> {user.email}</p>
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all font-disco ${
                tab === t.id ? "bg-rt-accent/10 border border-rt-accent/30 text-rt-accent" : "border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/20"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "profile" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
          <div className="crystal rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-display font-bold text-white/80 tracking-wider">PROFILE DATA</h2>
              <button onClick={() => setEditing(!editing)} className="text-rt-accent text-[10px] font-mono flex items-center gap-1 hover:text-white/60 transition-colors">
                <Edit3 size={11} /> {editing ? "CANCEL" : "EDIT"}
              </button>
            </div>
            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rt-accent/20 to-rt-accent2/10 border border-rt-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} /> : <User size={24} className="text-rt-accent" />}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium">Avatar</p>
                    <p className="text-white/20 text-[10px] font-mono">Select style below</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.04]">
                  <AvatarPicker current={avatarUrl} onSelect={setAvatarUrl} />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">NAME</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input-crystal text-xs py-2.5" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">IMAGE URL</label>
                  <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className="input-crystal text-xs py-2.5" />
                </div>
                <button onClick={handleUpdate} className="btn-crystal text-xs py-3 px-6">SAVE CHANGES</button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: "NAME", value: user.name },
                  { label: "EMAIL", value: user.email },
                  { label: "ROLE", value: user.role },
                  { label: "JOINED", value: new Date(user.createdAt).toLocaleDateString() },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
                    <span className="text-[10px] text-white/30 font-mono tracking-wider">{item.label}</span>
                    <span className="text-white/60 text-xs font-mono">{item.value}</span>
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
              <Package size={36} className="mx-auto mb-3 text-white/20" />
              <p className="text-white/40 text-sm font-display">NO ORDERS</p>
              <Link to="/products" className="btn-crystal text-xs inline-flex items-center gap-2 mt-4 px-5 py-2.5">
                <Zap size={13} /> SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-w-xl">
              {orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="block crystal rounded-2xl p-4 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-white/20">#{order.id?.slice(0, 8)}</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      order.status === "cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      order.status === "shipped" ? "bg-rt-accent/10 text-rt-accent border border-rt-accent/20" :
                      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-xs">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</p>
                      <p className="text-white/20 text-[10px] font-mono">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-rt-accent font-display font-bold text-sm">${Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {tab === "wishlist" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Heart size={36} className="mx-auto mb-3 text-rt-accent/30" />
          <p className="text-white/40 text-xs font-mono mb-4">View your saved items</p>
          <Link to="/wishlist" className="btn-crystal text-xs inline-flex items-center gap-2 px-5 py-2.5">
            <Zap size={13} /> WISHLIST
          </Link>
        </motion.div>
      )}

      {tab === "addresses" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-3">
          {user.addresses?.map((addr) => (
            <div key={addr.id} className="crystal rounded-2xl p-4 flex items-start justify-between">
              <div>
                <p className="text-white/70 text-xs font-medium mb-0.5">{addr.label || "ADDRESS"}</p>
                <p className="text-white/30 text-[11px] font-mono">{addr.street}</p>
                <p className="text-white/30 text-[11px] font-mono">{addr.city}, {addr.zip}</p>
                {addr.phone && <p className="text-white/20 text-[11px] font-mono">{addr.phone}</p>}
              </div>
              <button onClick={() => handleDelAddr(addr.id)} className="p-1.5 rounded-lg bg-red-500/8 text-red-400/60 hover:text-red-400 hover:bg-red-500/12 transition-all shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {showAddr ? (
            <div className="crystal rounded-2xl p-5 space-y-3">
              <input placeholder="Label (Home/Work)" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} className="input-crystal text-xs py-2.5" />
              <input placeholder="Street *" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} className="input-crystal text-xs py-2.5" />
              <div className="flex gap-3">
                <input placeholder="City *" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="flex-1 input-crystal text-xs py-2.5" />
                <input placeholder="ZIP" value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} className="w-24 input-crystal text-xs py-2.5" />
              </div>
              <input placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} className="input-crystal text-xs py-2.5" />
              <div className="flex gap-3 pt-1">
                <button onClick={handleAddAddr} className="btn-crystal text-xs flex-1 py-2.5">SAVE</button>
                <button onClick={() => setShowAddr(false)} className="btn-ghost text-xs flex-1 py-2.5">CANCEL</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddr(true)} className="w-full py-3.5 rounded-2xl border border-dashed border-white/10 text-white/30 hover:border-rt-accent/30 hover:text-rt-accent transition-all flex items-center justify-center gap-2 text-xs font-mono">
              <Plus size={14} /> ADD ADDRESS
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
