import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Package,
  AlertTriangle,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useProducts } from "./ProductContext";

const EMPTY = { name: "", category: "", price: "", image: "", description: "" };

export default function AdminPanel() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts, authed, login, logout } = useProducts();

  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [err, setErr] = useState("");

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const submitLogin = (e) => {
    e.preventDefault();
    if (!login(creds.user, creds.pass)) setErr("ACCESS DENIED // INVALID CREDENTIALS");
    else setErr("");
  };

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submitProduct = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = { ...form, price: Number(form.price) || 0 };
    if (editingId) updateProduct(editingId, payload);
    else addProduct(payload);
    setForm(EMPTY);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      category: p.category || "",
      price: p.price ?? "",
      image: p.image || "",
      description: p.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div className="absolute -inset-1 bg-red-600/20 blur-2xl" />
          <form
            onSubmit={submitLogin}
            className="relative bg-black border border-red-600/40 p-8 md:p-10"
            style={{ boxShadow: "0 0 0 1px rgba(255,0,0,0.2), inset 0 0 40px rgba(255,0,0,0.05)" }}
          >
            <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.4em] mb-6">
              <Shield size={12} />
              / SECURE TERMINAL
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">
              ADMIN<span className="text-red-600">.</span>
            </h2>
            <p className="text-white/50 text-xs tracking-[0.2em] mb-8">AUTHORIZED PERSONNEL ONLY</p>

            <div className="space-y-5">
              <Field
                label="OPERATOR ID"
                value={creds.user}
                onChange={(v) => setCreds((c) => ({ ...c, user: v }))}
                placeholder="admin"
              />
              <Field
                label="ACCESS KEY"
                type="password"
                value={creds.pass}
                onChange={(v) => setCreds((c) => ({ ...c, pass: v }))}
                placeholder="••••••••"
              />
            </div>

            {err && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-5 flex items-center gap-2 text-red-500 text-[10px] tracking-[0.3em] font-bold"
              >
                <AlertTriangle size={12} />
                {err}
              </motion.div>
            )}

            <button
              type="submit"
              className="mt-8 w-full bg-red-600 hover:bg-red-500 text-white py-4 text-xs tracking-[0.4em] font-black flex items-center justify-center gap-2 transition"
            >
              <Lock size={14} />
              AUTHENTICATE
            </button>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <div className="text-[9px] tracking-[0.3em] text-white/30">DEMO // admin / rt2026</div>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.4em] mb-3">
            <Shield size={12} />
            / CONTROL CENTER
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            ADMIN<span className="text-red-600">.</span>
          </h1>
          <p className="text-white/50 text-xs tracking-[0.2em] mt-2">
            {products.length.toString().padStart(3, "0")} UNITS // LIVE INVENTORY
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2.5 border border-white/15 hover:border-red-600 hover:text-red-500 text-[10px] tracking-[0.3em] font-bold flex items-center gap-2 transition"
          >
            <RotateCcw size={12} />
            RESET
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-white/5 border border-white/15 hover:border-red-600 hover:bg-red-600/10 text-[10px] tracking-[0.3em] font-bold flex items-center gap-2 transition"
          >
            <LogOut size={12} />
            LOGOUT
          </button>
        </div>
      </div>

      {/* FORM */}
      <motion.section
        layout
        className="relative bg-white/[0.02] border border-white/10 p-6 md:p-8 mb-12"
        style={{ boxShadow: editingId ? "0 0 0 1px rgba(255,0,0,0.5), 0 0 40px -10px rgba(255,0,0,0.4)" : "none" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
              {editingId ? <Pencil size={14} /> : <Plus size={14} />}
            </div>
            <div>
              <div className="text-[10px] tracking-[0.4em] text-red-500">
                {editingId ? "MODIFY UNIT" : "DEPLOY NEW UNIT"}
              </div>
              <div className="text-xl font-black tracking-tight">
                {editingId ? "EDIT PRODUCT" : "ADD PRODUCT"}
              </div>
            </div>
          </div>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="text-white/50 hover:text-red-500 flex items-center gap-1 text-[10px] tracking-[0.3em] font-bold"
            >
              <X size={12} /> CANCEL
            </button>
          )}
        </div>

        <form onSubmit={submitProduct} className="grid md:grid-cols-2 gap-5">
          <Field label="NAME" value={form.name} onChange={(v) => onChange("name", v)} placeholder="NEXUS X1 HEADSET" required />
          <Field label="CATEGORY" value={form.category} onChange={(v) => onChange("category", v)} placeholder="Audio" />
          <Field label="PRICE (MAD)" type="number" value={form.price} onChange={(v) => onChange("price", v)} placeholder="2499" />
          <Field label="IMAGE URL" value={form.image} onChange={(v) => onChange("image", v)} placeholder="https://yoursite.com/images/product.jpg" icon={ImageIcon} />
          <div className="md:col-span-2">
            <label className="block text-[10px] tracking-[0.3em] text-white/50 font-bold mb-2">DESCRIPTION</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={3}
              placeholder="Spec sheet, materials, headline features..."
              className="w-full px-4 py-3 bg-black border border-white/10 focus:border-red-600 outline-none text-sm resize-none transition"
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] tracking-[0.4em] font-black flex items-center gap-2 transition"
            >
              <Save size={12} />
              {editingId ? "UPDATE UNIT" : "DEPLOY UNIT"}
            </button>
            {form.image && (
              <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-white/40">
                <div className="w-10 h-10 border border-white/10 overflow-hidden">
                  <img src={form.image} alt="" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
                </div>
                PREVIEW
              </div>
            )}
          </div>
        </form>
      </motion.section>

      {/* LIST */}
      <section>
        <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.4em] mb-5">
          <Package size={12} />
          / INVENTORY REGISTRY
        </div>

        {products.length === 0 ? (
          <div className="border border-white/10 p-16 text-center">
            <Package className="mx-auto mb-3 text-white/30" />
            <div className="text-white/50 text-xs tracking-[0.2em]">NO UNITS DEPLOYED.</div>
          </div>
        ) : (
          <div className="grid gap-3">
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className={`group relative bg-black border p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 transition ${
                  editingId === p.id ? "border-red-600" : "border-white/10 hover:border-red-600/60"
                }`}
              >
                <div className="w-full md:w-24 h-24 md:h-20 shrink-0 border border-white/10 overflow-hidden bg-white/5">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] tracking-[0.3em] text-red-500 font-bold">
                      {p.category || "UNCATEGORIZED"}
                    </span>
                    <span className="text-[9px] tracking-[0.3em] text-white/30">#{p.id.slice(-4).toUpperCase()}</span>
                  </div>
                  <h3 className="text-base font-black tracking-[0.05em] truncate">{p.name}</h3>
                  {p.description && <p className="text-xs text-white/50 mt-1 line-clamp-1">{p.description}</p>}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-right">
                    <div className="text-[9px] tracking-[0.3em] text-white/40">PRICE</div>
                    <div className="text-lg font-black text-red-500">
                      {Number(p.price || 0).toLocaleString()}
                      <span className="text-[10px] text-white/40 ml-1">MAD</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="w-9 h-9 border border-white/15 hover:border-red-600 hover:bg-red-600/10 flex items-center justify-center transition"
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => setConfirmDel(p)}
                      className="w-9 h-9 border border-white/15 hover:border-red-600 hover:bg-red-600 flex items-center justify-center transition"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {confirmDel && (
          <ConfirmModal
            title="TERMINATE UNIT?"
            body={`Unit "${confirmDel.name}" will be removed from the registry. This action cannot be undone.`}
            confirmLabel="TERMINATE"
            onCancel={() => setConfirmDel(null)}
            onConfirm={() => {
              deleteProduct(confirmDel.id);
              setConfirmDel(null);
            }}
          />
        )}
        {confirmReset && (
          <ConfirmModal
            title="RESET REGISTRY?"
            body="All changes will be reverted to the default catalog. Custom products will be lost."
            confirmLabel="RESET"
            onCancel={() => setConfirmReset(false)}
            onConfirm={() => {
              resetProducts();
              setConfirmReset(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", icon: Icon, required }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] text-white/50 font-bold mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />}
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-3 bg-black border border-white/10 focus:border-red-600 outline-none text-sm transition ${
            Icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function ConfirmModal({ title, body, confirmLabel, onCancel, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-black border border-red-600 p-8"
        style={{ boxShadow: "0 0 0 1px rgba(255,0,0,0.4), 0 0 60px -10px rgba(255,0,0,0.6)" }}
      >
        <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.4em] mb-4">
          <AlertTriangle size={12} />
          / CONFIRM
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-3">{title}</h3>
        <p className="text-sm text-white/60 leading-relaxed mb-8">{body}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-white/15 hover:border-white text-[10px] tracking-[0.4em] font-black transition"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-[10px] tracking-[0.4em] font-black transition"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
