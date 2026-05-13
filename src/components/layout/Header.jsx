import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Menu, X, User, Package, Heart, LogOut,
  Sun, Moon, Laptop, Smartphone, Gamepad2, Tablet, Headphones,
  Mouse, Gem, Gift, Watch, ChevronRight, Sparkles
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
const CATEGORY_EMOJIS = {
  laptop: "💻", smartphone: "📱", "gamepad-2": "🎮", tablet: "📟",
  watch: "⌚", headphones: "🎧", keyboard: "⌨️", dices: "🎲", gift: "🎁",
};

export default function Header() {
  const { categories } = useCategories();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const navigate = useNavigate();
  const userRef = useRef();
  const megaTimeout = useRef();

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

  const handleMegaEnter = (id) => {
    clearTimeout(megaTimeout.current);
    setActiveMega(id);
  };
  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 150);
  };

  return (
    <header
      className="dark-section fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/30 transition-all duration-700"
    >
      {scrolled && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rt-accent/15 via-cyan-500/5 to-transparent" />
      )}

      <div className="max-w-site mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rt-accent/10 to-cyan-500/5 border border-rt-accent/10 flex items-center justify-center">
                <span className="text-sm font-display font-bold text-white/90">RT</span>
              </div>
              <div className="absolute -inset-1 bg-rt-accent/10 blur-lg rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <span className="text-xs font-display font-bold tracking-[0.25em] text-white/70 group-hover:text-white transition-colors">
                ELECTRONICS
              </span>
              <p className="text-[7px] text-white/15 tracking-[0.2em] uppercase font-mono -mt-0.5">
                Future of Tech
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 mx-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = NAV_ICONS[cat.icon] || Package;
              const label = NAV_LABELS[cat.name] || cat.name;
              const isActive = activeMega === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative group-mega"
                  onMouseEnter={() => handleMegaEnter(cat.id)}
                  onMouseLeave={handleMegaLeave}
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className={`relative flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-lg transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "text-white bg-white/[0.03]"
                        : "text-white/35 hover:text-white/70"
                    }`}
                  >
                    <Icon size={10} className={`transition-all duration-300 ${isActive ? "text-rt-accent" : ""}`} />
                    <span className="relative tracking-wider uppercase font-medium">
                      {label}
                      <span className={`absolute -bottom-0.5 left-0 h-[1px] bg-gradient-to-r from-rt-accent/60 to-cyan-500/30 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                    </span>
                  </Link>

                  <div className="mega-menu pointer-events-none group-mega:hover:pointer-events-auto">
                    <div className="flex items-start gap-4 min-w-[240px]">
                      <div className="text-3xl opacity-50">
                        {CATEGORY_EMOJIS[cat.icon] || "📦"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/90 font-semibold mb-0.5">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-white/25 font-mono mb-2">{cat.description}</p>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="inline-flex items-center gap-1 text-rt-accent/70 font-mono">
                            <Sparkles size={9} /> {cat.productCount} products
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="flex items-center gap-0.5 text-white/30 hover:text-rt-accent transition-colors">
                            Browse <ChevronRight size={9} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rt-accent/20 to-transparent" />
                    <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#12121E] border-l border-t border-white/[0.06] rotate-45" />
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden md:block w-28 lg:w-40">
              <SearchBar />
            </div>

            <button onClick={toggleTheme} className="theme-toggle" title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={12} className="text-white/40" />
                    )}
                  </div>
                  <span className="text-white/50 text-xs hidden sm:block max-w-[70px] truncate">
                    {user.name}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-44 card-glass-solid overflow-hidden shadow-glass"
                    >
                      {[
                        { icon: User, label: "My Account", href: "/account" },
                        { icon: Package, label: "My Orders", href: "/account?tab=orders" },
                        { icon: Heart, label: "Wishlist", href: "/wishlist" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white hover:bg-white/[0.02] transition-all text-[11px]"
                        >
                          <item.icon size={13} className="text-rt-accent/60" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="divider mx-3" />
                      <button
                        onClick={() => { logout(); setUserMenu(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-xs font-medium transition-all duration-300"
              >
                <User size={12} /> Sign In
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-rt-accent/20 hover:bg-rt-accent/[0.02] transition-all duration-300 group"
            >
              <ShoppingCart size={14} className="text-white/30 group-hover:text-rt-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-rt-accent to-rt-accent/80 text-white text-[7px] font-bold flex items-center justify-center shadow-lg shadow-rt-accent/30">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
            >
              {mobileMenu ? <X size={14} className="text-white/40" /> : <Menu size={14} className="text-white/40" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/[0.02] bg-[#07070D]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-3">
              <SearchBar />
            </div>
            {!user && (
              <div className="px-4 pb-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full py-2.5 rounded-lg border border-white/10 text-white/50 text-center font-semibold text-[11px] hover:bg-white/[0.02] transition-all"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
            <nav className="px-4 pb-6 grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.03] text-white/35 hover:text-white hover:border-white/10 transition-all text-[11px]"
                >
                  <span className="text-lg">{CATEGORY_EMOJIS[cat.icon] || "📦"}</span>
                  <span>{cat.name}</span>
                  <span className="ml-auto text-[9px] text-white/15 font-mono">{cat.productCount}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
