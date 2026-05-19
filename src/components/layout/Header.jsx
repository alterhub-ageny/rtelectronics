import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart, Menu, X, User, Package, Heart, LogOut,
  Sun, Moon, Laptop, Smartphone, Gamepad2, Tablet, Headphones,
  Mouse, Gem, Gift, Watch, ChevronRight, Sparkles, Globe,
  Zap
} from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import SearchBar from "../ui/SearchBar";

const NAV_ICONS = {
  laptop: Laptop, smartphone: Smartphone, "gamepad-2": Gamepad2, tablet: Tablet,
  headphones: Headphones, keyboard: Mouse, dices: Gem, gift: Gift, watch: Watch,
};
const NAV_LABELS = {
  "Headphones & Audio": "Audio", "Gaming PCs": "Gaming PCs", "Game Top-Ups": "Top-Ups",
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const { categories } = useCategories();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const LANGUAGES = { en: "EN", fr: "FR", ar: "AR" };
  const cycleLang = () => {
    const order = ["en", "fr", "ar"];
    const next = order[(order.indexOf(i18n.language) + 1) % order.length];
    i18n.changeLanguage(next);
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <header className={`theme-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'scrolled' : ''}`}>
      {/* Accent line */}
      <div className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-60' : 'opacity-0'}`} />

      <div className="max-w-site mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <Zap size={16} className="text-white" />
              </div>
              <div className="absolute -inset-1 bg-[var(--color-primary)]/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                RT
              </span>
              <p className="text-[8px] text-[var(--color-text-muted)] tracking-[0.2em] uppercase font-mono -mt-0.5">
                ELECTRONICS
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => {
              const Icon = NAV_ICONS[cat.icon] || Package;
              const label = NAV_LABELS[cat.name] || cat.name;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group relative px-3 py-2 text-[0.8125rem] font-medium text-[var(--nav-link)] hover:text-[var(--color-text)] transition-all duration-300"
                >
                  <span className="flex items-center gap-1.5">
                    <Icon size={12} className="group-hover:text-[var(--color-primary)] transition-colors" />
                    {label}
                  </span>
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search - desktop */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Search toggle - mobile */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="nav-btn md:hidden">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>

            {/* Language */}
            <button onClick={cycleLang} className="nav-btn" title={LANGUAGES[i18n.language]}>
              <Globe size={12} />
              <span className="text-[9px] font-mono font-semibold">{LANGUAGES[i18n.language]}</span>
            </button>

            {/* Theme */}
            <button onClick={toggleTheme} className="nav-btn" title={theme === "dark" ? t("header.light_mode") : t("header.dark_mode")}>
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            {/* User */}
            {user ? (
              <div ref={userRef} className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 nav-btn px-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-subtle)] border border-[var(--color-primary)]/20 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={12} className="text-[var(--color-primary)]" />
                    )}
                  </div>
                  <span className="text-[0.8125rem] text-[var(--color-text)] hidden sm:block max-w-[80px] truncate font-medium">
                    {user.name}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-48 glass-card overflow-hidden p-1"
                    >
                      {[
                        { icon: User, label: t("header.my_account"), href: "/account" },
                        { icon: Package, label: t("header.my_orders"), href: "/account?tab=orders" },
                        { icon: Heart, label: t("header.wishlist"), href: "/wishlist" },
                      ].map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.8125rem] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-primary-subtle)] transition-all"
                        >
                          <item.icon size={14} className="text-[var(--color-primary)]/60" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="h-[1px] bg-[var(--color-border)] mx-3 my-1" />
                      <button onClick={() => { logout(); setUserMenu(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.8125rem] text-[var(--color-error)]/70 hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/5 transition-all"
                      >
                        <LogOut size={14} /> {t("header.sign_out")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm hidden sm:flex">
                <User size={13} /> {t("header.sign_in")}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="nav-btn relative">
              <ShoppingCart size={14} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[7px] font-bold flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="nav-btn lg:hidden">
              {mobileMenu ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--nav-border)]"
          >
            <div className="px-4 py-3">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden mobile-nav overflow-hidden"
          >
            {!user && (
              <div className="px-4 pt-4 pb-2">
                <Link to="/login" onClick={() => setMobileMenu(false)}
                  className="btn btn-primary w-full"
                >
                  {t("header.sign_in_register")}
                </Link>
              </div>
            )}
            <nav className="px-4 pb-6 pt-2 grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = NAV_ICONS[cat.icon] || Package;
                return (
                  <Link key={cat.id} to={`/products?category=${cat.slug}`} onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--nav-border)] text-[var(--nav-link)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary-subtle)] transition-all text-[0.8125rem] font-medium"
                  >
                    <Icon size={14} className="shrink-0" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
