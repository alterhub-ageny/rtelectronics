import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Zap, User, Package, Heart, LogOut, ChevronDown } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../ui/SearchBar";

export default function Header() {
  const { categories } = useCategories();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const handler = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("mousedown", handler); };
  }, []);

  const navLinks = [
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-rt-darker/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Zap size={32} className="text-rt-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute inset-0 bg-rt-accent blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="text-2xl font-display font-bold tracking-wider">
              <span className="text-white">RT</span>
              <span className="text-rt-accent"> ELECTRONICS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`}
                className="px-3 py-2 text-sm text-white/60 hover:text-rt-accent rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                {cat.name}
              </Link>
            ))}
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href}
                className="px-3 py-2 text-sm text-white/60 hover:text-rt-accent rounded-lg hover:bg-white/5 transition-all duration-300 hidden xl:block"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block w-48 lg:w-64 xl:w-80">
              <SearchBar />
            </div>

            {user ? (
              <div ref={userRef} className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-rt-accent/40 hover:bg-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rt-accent/20 to-rt-accent2/20 flex items-center justify-center overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={14} className="text-rt-accent" />}
                  </div>
                  <span className="text-white text-sm hidden sm:block max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-white/50 transition-transform ${userMenu ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                    >
                      {[
                        { icon: User, label: "My Account", href: "/account" },
                        { icon: Package, label: "My Orders", href: "/account?tab=orders" },
                        { icon: Heart, label: "Wishlist", href: "/wishlist" },
                      ].map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
                        >
                          <item.icon size={16} className="text-rt-accent" /> {item.label}
                        </Link>
                      ))}
                      <button onClick={() => { logout(); setUserMenu(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all text-sm border-t border-white/5"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-rt-accent/10 border border-rt-accent/20 text-rt-accent text-sm font-medium hover:bg-rt-accent/20 transition-all">
                <User size={16} /> Sign In
              </Link>
            )}

            <button onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-rt-accent/40 hover:bg-white/10 transition-all duration-300 group"
            >
              <ShoppingCart size={20} className="text-white/70 group-hover:text-rt-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rt-accent text-rt-darker text-xs font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-rt-accent/40 transition-all"
            >
              {mobileMenu ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-rt-darker/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4"><SearchBar /></div>
            {!user && (
              <div className="px-4 pb-3">
                <Link to="/login" onClick={() => setMobileMenu(false)}
                  className="block w-full py-3 rounded-xl bg-rt-accent/10 text-rt-accent text-center font-semibold text-sm border border-rt-accent/20 hover:bg-rt-accent/20 transition-all"
                >Sign In / Register</Link>
              </div>
            )}
            <nav className="px-4 pb-6 grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/products?category=${cat.slug}`} onClick={() => setMobileMenu(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:text-rt-accent hover:bg-white/10 transition-all text-center text-sm"
                >{cat.name}</Link>
              ))}
              <Link to="/about" onClick={() => setMobileMenu(false)} className="px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:text-rt-accent transition-all text-center text-sm">About</Link>
              <Link to="/contact" onClick={() => setMobileMenu(false)} className="px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:text-rt-accent transition-all text-center text-sm">Contact</Link>
              <Link to="/faq" onClick={() => setMobileMenu(false)} className="px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:text-rt-accent transition-all text-center text-sm">FAQ</Link>
              {user && (
                <>
                  <Link to="/account" onClick={() => setMobileMenu(false)} className="px-4 py-3 rounded-xl bg-rt-accent/10 text-rt-accent transition-all text-center text-sm font-semibold">My Account</Link>
                  <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="px-4 py-3 rounded-xl bg-rt-accent/10 text-rt-accent transition-all text-center text-sm font-semibold">Wishlist</Link>
                </>
              )}
              <Link to="/cart" onClick={() => setMobileMenu(false)}
                className="px-4 py-3 rounded-xl bg-rt-accent/10 text-rt-accent hover:bg-rt-accent/20 transition-all text-center text-sm font-semibold col-span-2"
              >View Cart {totalItems > 0 ? `(${totalItems})` : ""}</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
