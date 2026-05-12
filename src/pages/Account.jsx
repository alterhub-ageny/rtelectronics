import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, Edit3, Plus, Trash2, Mail, Calendar, Image } from "lucide-react";
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
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rt-accent/20 to-rt-accent2/20 border border-white/10 flex items-center justify-center overflow-hidden">
          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={28} className="text-rt-accent" />}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">{user.name}</h1>
          <p className="text-white/40 text-sm flex items-center gap-1"><Mail size={12} /> {user.email}</p>
        </div>
        <button onClick={logout} className="ml-auto p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
          <LogOut size={18} />
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "bg-rt-accent/10 border border-rt-accent/30 text-rt-accent" : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 border border-white/5 max-w-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-white">Personal Info</h2>
            <button onClick={() => setEditing(!editing)} className="text-rt-accent text-sm flex items-center gap-1 hover:text-white transition-colors">
              <Edit3 size={14} /> {editing ? "Cancel" : "Edit"}
            </button>
          </div>
          {editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rt-accent/20 to-rt-accent2/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} /> : <User size={28} className="text-rt-accent" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Choose an avatar</p>
                  <p className="text-xs text-white/30">Pick a style and gender below</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-4 border border-white/5">
                <AvatarPicker current={avatarUrl} onSelect={setAvatarUrl} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rt-accent/50" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Or paste an image URL</label>
                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
              </div>
              <button onClick={handleUpdate} className="btn-primary">Save Changes</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-white/50">Name</span><span className="text-white">{user.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Email</span><span className="text-white">{user.email}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Role</span><span className="text-white capitalize">{user.role}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Joined</span><span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span></div>
            </div>
          )}
        </motion.div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {orders.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No orders yet</p>
              <Link to="/products" className="btn-primary inline-block mt-4">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="block glass rounded-2xl p-5 border border-white/5 hover:border-rt-accent/20 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-white/30">#{order.id.slice(0, 8)}</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === "delivered" ? "bg-rt-accent3/20 text-rt-accent3" :
                      order.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                      order.status === "shipped" ? "bg-rt-accent/20 text-rt-accent" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
                      <p className="text-white/30 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-rt-accent font-display font-bold text-lg">${order.total?.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Wishlist (link) */}
      {tab === "wishlist" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Heart size={48} className="mx-auto mb-4 text-rt-accent/50" />
          <p className="text-white/60 mb-4">View your wishlist</p>
          <Link to="/wishlist" className="btn-primary">Go to Wishlist</Link>
        </motion.div>
      )}

      {/* Addresses */}
      {tab === "addresses" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
          {user.addresses?.map((addr) => (
            <div key={addr.id} className="glass rounded-2xl p-5 border border-white/5 mb-3 flex items-start justify-between">
              <div>
                <p className="text-white font-medium mb-1">{addr.label || "Address"}</p>
                <p className="text-white/40 text-sm">{addr.street}</p>
                <p className="text-white/40 text-sm">{addr.city}, {addr.zip}</p>
                {addr.phone && <p className="text-white/40 text-sm">{addr.phone}</p>}
              </div>
              <button onClick={() => handleDelAddr(addr.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {showAddr ? (
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
              <input placeholder="Label (Home/Work)" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
              <input placeholder="Street *" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
              <div className="flex gap-3">
                <input placeholder="City *" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
                <input placeholder="ZIP" value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
              </div>
              <input placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rt-accent/50" />
              <div className="flex gap-3">
                <button onClick={handleAddAddr} className="btn-primary flex-1">Save</button>
                <button onClick={() => setShowAddr(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddr(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-white/40 hover:border-rt-accent/30 hover:text-rt-accent transition-all flex items-center justify-center gap-2">
              <Plus size={18} /> Add Address
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
