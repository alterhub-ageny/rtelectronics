import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("All fields required"); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast("Access granted", "success");
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="crystal rounded-[20px] p-7">
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rt-accent/20 to-rt-accent2/10 border border-rt-accent/20 flex items-center justify-center">
                <Zap size={16} className="text-rt-accent" />
              </div>
            </Link>
            <h1 className="text-lg font-display font-bold text-white/90">ACCESS TERMINAL</h1>
            <p className="text-white/25 text-xs font-mono mt-1">Authenticate to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[11px] bg-red-500/8 border border-red-500/15 rounded-xl px-3.5 py-2.5 font-mono"
              >
                ! {error}
              </motion.p>
            )}

            <div>
              <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">EMAIL</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-crystal text-xs pl-9 py-2.5"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/30 font-mono tracking-wider mb-1.5 block">PASSWORD</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-crystal text-xs pl-9 pr-9 py-2.5"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-crystal w-full flex items-center justify-center gap-2 text-xs py-3 mt-1"
            >
              {loading ? (
                <><span className="spinner-crystal w-4 h-4" /> AUTHENTICATING</>
              ) : (
                <><LogIn size={14} /> SIGN IN <ArrowRight size={13} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/20 text-[11px] font-mono mt-5">
            No access credentials?{' '}
            <Link to="/register" className="text-rt-accent hover:text-white/70 transition-colors">
              Initialize
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
