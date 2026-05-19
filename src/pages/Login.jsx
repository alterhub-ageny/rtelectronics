import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { t } = useTranslation();
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
    if (!form.email || !form.password) { setError(t("login.all_fields_required")); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast(t("login.access_granted"), "success");
      navigate("/");
    } catch (err) {
      setError(err.message || t("login.invalid_credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="glass-card rounded-[20px] p-7">
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-hover)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                <Zap size={16} className="text-[var(--color-primary)]" />
              </div>
            </Link>
            <h1 className="heading-md">{t("login.title")}</h1>
            <p className="text-[var(--color-text-muted)] text-xs font-mono mt-1">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[0.6875rem] bg-red-500/8 border border-red-500/15 rounded-xl px-3.5 py-2.5 font-mono"
              >! {error}</motion.p>
            )}

            <div>
              <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("login.email")}</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] opacity-50" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-9" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="text-[0.625rem] text-[var(--color-text-muted)] font-mono tracking-wider mb-1.5 block">{t("login.password")}</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] opacity-50" />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-9 pr-9" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] opacity-50 hover:opacity-100 transition-all">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center mt-1">
              {loading ? (
                <><span className="spinner w-4 h-4" /> {t("login.authenticating")}</>
              ) : (
                <><LogIn size={14} /> {t("login.sign_in")} <ArrowRight size={13} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[var(--color-text-muted)] text-[0.6875rem] font-mono mt-5">
            {t("login.no_credentials")}{' '}
            <Link to="/register" className="text-[var(--color-primary)] hover:text-[var(--color-text)] transition-colors">
              {t("login.initialize")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
