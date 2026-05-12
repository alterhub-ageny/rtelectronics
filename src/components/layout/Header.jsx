import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Menu, X, User, Package, Heart, LogOut, Sun,
  Laptop, Smartphone, Gamepad2, Tablet, Headphones, Mouse, Gem, Gift, Watch
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
  "Headphones & Audio": "Audio", "Gaming PCs": "Gaming", "Game Top-Ups": "Top-Ups",
};

export default function Header() {
  const { categories } = useCategories();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#020208]/70 backdrop-blur-2xl border-b border-white/[0.03] shadow-2xl shadow-black/50"
          : "bg-transparent"
      }`}
    >
      {scrolled && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rt-accent/15 to-transparent animate-liquid-shimmer" />
      )}

      <div className="max-w-site mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl crystal flex items-center justify-center">
                <span className="text-rt-accent text-sm font-display font-bold relative z-10">⟁</span>
              </div>
              <div className="absolute inset-0 bg-rt-accent/10 blur-xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-700 opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-sm font-display font-bold tracking-[0.2em]">
              <span className="text-white/70 group-hover:text-white transition-colors">RT</span>
              <span className="text-rt-accent/40">⏺</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto mx-1 scrollbar-none">
            {categories.map((cat, i) => {
              const Icon = NAV_ICONS[cat.icon] || Package;
              const label = NAV_LABELS[cat.name] || cat.name;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="relative group/nav flex items-center gap-1 px-2 py-1 text-[10px] text-white/30 hover:text-rt-accent rounded-lg transition-all duration-500 whitespace-nowrap font-grotesk"
                >
                  <Icon size={9} className="transition-all duration-500 group-hover/nav:scale-125 group-hover/nav:rotate-12" />
                  <span className="relative tracking-wider uppercase">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-rt-accent/40 transition-all duration-500 group-hover/nav:w-full" />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden md:block w-28 lg:w-40">
              <SearchBar />
            </div>

            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-rt-accent/20 hover:bg-white/[0.03] transition-all duration-500"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={12} className="text-white/40" />
                    )}
                  </div>
                  <span className="text-white/40 text-[10px] hidden sm:block max-w-[70px] truncate font-grotesk">
                    {user.name}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-44 crystal rounded-2xl overflow-hidden shadow-2xl border-white/[0.04]"
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
                          className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white hover:bg-white/[0.02] transition-all text-[11px] font-grotesk"
                        >
                          <item.icon size={13} className="text-rt-accent/60" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent mx-3" />
                      <button
                        onClick={() => { logout(); setUserMenu(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all font-grotesk"
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.04] text-white/30 hover:text-rt-accent hover:border-rt-accent/20 text-[10px] font-medium transition-all duration-500 font-grotesk"
              >
                <User size={12} /> Sign In
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-rt-accent/20 hover:bg-white/[0.03] transition-all duration-500 group"
              title={theme === "red" ? "Switch to cyan" : "Switch to red"}
            >
              <Sun size={14} className="text-white/30 group-hover:text-rt-accent transition-colors" />
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-rt-accent/20 hover:bg-white/[0.03] transition-all duration-500 group"
            >
              <ShoppingCart size={14} className="text-white/30 group-hover:text-rt-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rt-accent text-[#020208] text-[7px] font-bold flex items-center justify-center shadow-lg shadow-rt-accent/20">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-rt-accent/20 transition-all"
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
            className="lg:hidden border-t border-white/[0.02] bg-[#020208]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-3">
              <SearchBar />
            </div>
            {!user && (
              <div className="px-4 pb-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full py-2.5 rounded-xl border border-rt-accent/10 text-rt-accent text-center font-semibold text-[11px] hover:bg-rt-accent/5 transition-all font-grotesk"
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
                  className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] text-white/40 hover:text-rt-accent hover:border-rt-accent/15 transition-all text-center text-[11px] font-grotesk"
                >
                  {cat.name}
                </Link>
              ))}
              {["About", "Contact", "FAQ"].map((page) => (
                <Link
                  key={page}
                  to={`/${page.toLowerCase()}`}
                  onClick={() => setMobileMenu(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] text-white/40 hover:text-rt-accent hover:border-rt-accent/15 transition-all text-center text-[11px] font-grotesk"
                >
                  {page}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
