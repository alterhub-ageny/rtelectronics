import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart, Menu, X, User, Package, Heart, LogOut,
  Sun, Moon, Laptop, Smartphone, Gamepad2, Tablet, Headphones,
  Mouse, Gem, Gift, Watch,   ChevronRight, Sparkles, Globe,
  ArrowRight
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
          <Link to="/" className="flex items-center group shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="140 420 1160 800" className="h-14 w-auto" style={{ color: 'var(--color-text)' }}>
              <defs>
                <clipPath id="005303af25"><rect x="0" width="1136" y="0" height="190"/></clipPath>
                <clipPath id="3fc24d695c"><path d="M 1.359375 0.742188 L 237 0.742188 L 237 505.984375 L 1.359375 505.984375 Z M 1.359375 0.742188 " clip-rule="nonzero"/></clipPath>
                <clipPath id="bbfc2614fc"><path d="M 270 1 L 462.367188 1 L 462.367188 493 L 270 493 Z M 270 1 " clip-rule="nonzero"/></clipPath>
                <clipPath id="9726292723"><rect x="0" width="463" y="0" height="507"/></clipPath>
              </defs>
              <g transform="matrix(1, 0, 0, 1, 182, 993)">
                <g clip-path="url(#005303af25)">
                  <g fill="currentColor" fill-opacity="1">
                    <g transform="translate(0.788186, 149.560157)"><path d="M 14.21875 0 L 14.21875 -108.21875 L 91.515625 -108.21875 L 91.515625 -91.828125 L 32.46875 -91.828125 L 32.46875 -62.453125 L 85.328125 -62.453125 L 85.328125 -46.21875 L 32.46875 -46.21875 L 32.46875 -16.390625 L 93.375 -16.390625 L 93.375 0 Z M 14.21875 0 "/></g>
                    <g transform="translate(102.201329, 149.560157)"><path d="M 14.21875 0 L 14.21875 -108.21875 L 32.46875 -108.21875 L 32.46875 -16.546875 L 79.3125 -16.546875 L 79.3125 0 Z M 14.21875 0 "/></g>
                    <g transform="translate(184.754097, 149.560157)"><path d="M 14.21875 0 L 14.21875 -108.21875 L 91.515625 -108.21875 L 91.515625 -91.828125 L 32.46875 -91.828125 L 32.46875 -62.453125 L 85.328125 -62.453125 L 85.328125 -46.21875 L 32.46875 -46.21875 L 32.46875 -16.390625 L 93.375 -16.390625 L 93.375 0 Z M 14.21875 0 "/></g>
                    <g transform="translate(286.167239, 149.560157)"><path d="M 92.609375 -79.15625 C 88.691406 -83.476562 84.050781 -86.875 78.6875 -89.34375 C 73.332031 -91.820312 67.921875 -93.0625 62.453125 -93.0625 C 55.335938 -93.0625 48.816406 -91.359375 42.890625 -87.953125 C 36.972656 -84.554688 32.3125 -79.894531 28.90625 -73.96875 C 25.507812 -68.039062 23.8125 -61.523438 23.8125 -54.421875 C 23.8125 -47.410156 25.535156 -40.941406 28.984375 -35.015625 C 32.441406 -29.085938 37.101562 -24.394531 42.96875 -20.9375 C 48.84375 -17.488281 55.335938 -15.765625 62.453125 -15.765625 C 67.816406 -15.765625 73.148438 -16.921875 78.453125 -19.234375 C 83.765625 -21.554688 88.484375 -24.726562 92.609375 -28.75 L 103.421875 -16.703125 C 97.859375 -11.128906 91.363281 -6.71875 83.9375 -3.46875 C 76.519531 -0.226562 69.050781 1.390625 61.53125 1.390625 C 51.125 1.390625 41.613281 -1.082031 33 -6.03125 C 24.394531 -10.976562 17.617188 -17.675781 12.671875 -26.125 C 7.722656 -34.570312 5.25 -43.953125 5.25 -54.265625 C 5.25 -64.460938 7.75 -73.785156 12.75 -82.234375 C 17.75 -90.691406 24.601562 -97.34375 33.3125 -102.1875 C 42.019531 -107.03125 51.628906 -109.453125 62.140625 -109.453125 C 69.773438 -109.453125 77.222656 -107.929688 84.484375 -104.890625 C 91.753906 -101.847656 98.015625 -97.703125 103.265625 -92.453125 Z M 92.609375 -79.15625 "/></g>
                    <g transform="translate(393.918697, 149.560157)"><path d="M 1.390625 -91.828125 L 1.390625 -108.21875 L 88.125 -108.21875 L 88.125 -91.828125 L 53.796875 -91.828125 L 53.796875 0 L 35.5625 0 L 35.5625 -91.828125 Z M 1.390625 -91.828125 "/></g>
                    <g transform="translate(483.428161, 149.560157)"><path d="M 103.578125 0 L 82.859375 0 L 63.078125 -32.78125 C 62.046875 -32.675781 60.394531 -32.625 58.125 -32.625 L 32.46875 -32.625 L 32.46875 0 L 14.21875 0 L 14.21875 -108.21875 L 58.125 -108.21875 C 71.9375 -108.21875 82.65625 -104.992188 90.28125 -98.546875 C 97.90625 -92.109375 101.71875 -83.015625 101.71875 -71.265625 C 101.71875 -62.609375 99.785156 -55.289062 95.921875 -49.3125 C 92.054688 -43.332031 86.519531 -38.953125 79.3125 -36.171875 Z M 32.46875 -49 L 58.125 -49 C 66.570312 -49 73.0625 -50.828125 77.59375 -54.484375 C 82.132812 -58.148438 84.40625 -63.585938 84.40625 -70.796875 C 84.40625 -77.804688 82.132812 -83.0625 77.59375 -86.5625 C 73.0625 -90.070312 66.570312 -91.828125 58.125 -91.828125 L 32.46875 -91.828125 Z M 32.46875 -49 "/></g>
                    <g transform="translate(595.199018, 149.560157)"><path d="M 62.609375 -109.453125 C 73.222656 -109.453125 82.910156 -107.03125 91.671875 -102.1875 C 100.429688 -97.34375 107.335938 -90.691406 112.390625 -82.234375 C 117.441406 -73.785156 119.96875 -64.460938 119.96875 -54.265625 C 119.96875 -43.953125 117.441406 -34.570312 112.390625 -26.125 C 107.335938 -17.675781 100.429688 -10.976562 91.671875 -6.03125 C 82.910156 -1.082031 73.222656 1.390625 62.609375 1.390625 C 51.992188 1.390625 42.304688 -1.082031 33.546875 -6.03125 C 24.785156 -10.976562 17.878906 -17.675781 12.828125 -26.125 C 7.773438 -34.570312 5.25 -43.953125 5.25 -54.265625 C 5.25 -64.460938 7.773438 -73.785156 12.828125 -82.234375 C 17.878906 -90.691406 24.785156 -97.34375 33.546875 -102.1875 C 42.304688 -107.03125 51.992188 -109.453125 62.609375 -109.453125 Z M 62.765625 -92.90625 C 55.753906 -92.90625 49.257812 -91.175781 43.28125 -87.71875 C 37.300781 -84.269531 32.5625 -79.609375 29.0625 -73.734375 C 25.5625 -67.859375 23.8125 -61.367188 23.8125 -54.265625 C 23.8125 -47.148438 25.585938 -40.601562 29.140625 -34.625 C 32.691406 -28.644531 37.429688 -23.90625 43.359375 -20.40625 C 49.285156 -16.90625 55.753906 -15.15625 62.765625 -15.15625 C 69.773438 -15.15625 76.21875 -16.90625 82.09375 -20.40625 C 87.96875 -23.90625 92.628906 -28.644531 96.078125 -34.625 C 99.535156 -40.601562 101.265625 -47.148438 101.265625 -54.265625 C 101.265625 -61.367188 99.535156 -67.859375 96.078125 -73.734375 C 92.628906 -79.609375 87.96875 -84.269531 82.09375 -87.71875 C 76.21875 -91.175781 69.773438 -92.90625 62.765625 -92.90625 Z M 62.765625 -92.90625 "/></g>
                    <g transform="translate(720.419546, 149.560157)"><path d="M 90.125 -29.984375 L 90.125 -108.21875 L 108.0625 -108.21875 L 108.0625 0 L 90.125 0 L 32.46875 -77.921875 L 32.46875 0 L 14.21875 0 L 14.21875 -108.21875 L 32.15625 -108.21875 Z M 90.125 -29.984375 "/></g>
                    <g transform="translate(842.857351, 149.560157)"><path d="M 14.21875 0 L 14.21875 -108.21875 L 32.46875 -108.21875 L 32.46875 0 Z M 14.21875 0 "/></g>
                    <g transform="translate(889.544509, 149.560157)"><path d="M 92.609375 -79.15625 C 88.691406 -83.476562 84.050781 -86.875 78.6875 -89.34375 C 73.332031 -91.820312 67.921875 -93.0625 62.453125 -93.0625 C 55.335938 -93.0625 48.816406 -91.359375 42.890625 -87.953125 C 36.972656 -84.554688 32.3125 -79.894531 28.90625 -73.96875 C 25.507812 -68.039062 23.8125 -61.523438 23.8125 -54.421875 C 23.8125 -47.410156 25.535156 -40.941406 28.984375 -35.015625 C 32.441406 -29.085938 37.101562 -24.394531 42.96875 -20.9375 C 48.84375 -17.488281 55.335938 -15.765625 62.453125 -15.765625 C 67.816406 -15.765625 73.148438 -16.921875 78.453125 -19.234375 C 83.765625 -21.554688 88.484375 -24.726562 92.609375 -28.75 L 103.421875 -16.703125 C 97.859375 -11.128906 91.363281 -6.71875 83.9375 -3.46875 C 76.519531 -0.226562 69.050781 1.390625 61.53125 1.390625 C 51.125 1.390625 41.613281 -1.082031 33 -6.03125 C 24.394531 -10.976562 17.617188 -17.675781 12.671875 -26.125 C 7.722656 -34.570312 5.25 -43.953125 5.25 -54.265625 C 5.25 -64.460938 7.75 -73.785156 12.75 -82.234375 C 17.75 -90.691406 24.601562 -97.34375 33.3125 -102.1875 C 42.019531 -107.03125 51.628906 -109.453125 62.140625 -109.453125 C 69.773438 -109.453125 77.222656 -107.929688 84.484375 -104.890625 C 91.753906 -101.847656 98.015625 -97.703125 103.265625 -92.453125 Z M 92.609375 -79.15625 "/></g>
                    <g transform="translate(997.295996, 149.560157)"><path d="M 80.078125 -82.40625 C 74.515625 -85.800781 68.945312 -88.320312 63.375 -89.96875 C 57.8125 -91.625 52.816406 -92.453125 48.390625 -92.453125 C 43.023438 -92.453125 38.742188 -91.445312 35.546875 -89.4375 C 32.359375 -87.425781 30.765625 -84.566406 30.765625 -80.859375 C 30.765625 -77.554688 31.796875 -74.820312 33.859375 -72.65625 C 35.921875 -70.488281 38.492188 -68.785156 41.578125 -67.546875 C 44.671875 -66.316406 49.003906 -64.828125 54.578125 -63.078125 C 61.890625 -60.804688 67.835938 -58.613281 72.421875 -56.5 C 77.015625 -54.382812 80.929688 -51.238281 84.171875 -47.0625 C 87.421875 -42.894531 89.046875 -37.410156 89.046875 -30.609375 C 89.046875 -24.222656 87.316406 -18.628906 83.859375 -13.828125 C 80.410156 -9.035156 75.59375 -5.351562 69.40625 -2.78125 C 63.226562 -0.207031 56.171875 1.078125 48.234375 1.078125 C 39.890625 1.078125 31.847656 -0.460938 24.109375 -3.546875 C 16.378906 -6.640625 9.679688 -10.867188 4.015625 -16.234375 L 11.90625 -32 C 17.363281 -26.945312 23.363281 -23.003906 29.90625 -20.171875 C 36.457031 -17.335938 42.671875 -15.921875 48.546875 -15.921875 C 54.828125 -15.921875 59.769531 -17.128906 63.375 -19.546875 C 66.988281 -21.972656 68.796875 -25.300781 68.796875 -29.53125 C 68.796875 -32.925781 67.738281 -35.707031 65.625 -37.875 C 63.507812 -40.039062 60.851562 -41.765625 57.65625 -43.046875 C 54.46875 -44.335938 50.140625 -45.804688 44.671875 -47.453125 C 37.253906 -49.617188 31.300781 -51.734375 26.8125 -53.796875 C 22.332031 -55.859375 18.46875 -58.953125 15.21875 -63.078125 C 11.976562 -67.203125 10.359375 -72.613281 10.359375 -79.3125 C 10.359375 -85.382812 12.003906 -90.710938 15.296875 -95.296875 C 18.597656 -99.890625 23.238281 -103.445312 29.21875 -105.96875 C 35.195312 -108.5 42.050781 -109.765625 49.78125 -109.765625 C 56.582031 -109.765625 63.28125 -108.734375 69.875 -106.671875 C 76.46875 -104.609375 82.394531 -101.875 87.65625 -98.46875 Z M 80.078125 -82.40625 "/></g>
                    <g transform="translate(1093.464129, 149.560157)"></g>
                  </g>
                </g>
              </g>
              <g transform="matrix(1, 0, 0, 1, 492, 454)">
                <g clip-path="url(#9726292723)">
                  <g clip-path="url(#3fc24d695c)">
                    <path fill="#ff3131" d="M 1.363281 253.367188 C 1.363281 328.292969 33.929688 395.609375 85.679688 441.933594 L 127.328125 394.507812 C 95.789062 366.101562 73.824219 327.273438 66.851562 283.449219 L 109.136719 283.449219 L 176.675781 349.550781 L 176.675781 494.226562 C 195.832031 500.402344 215.988281 504.355469 236.839844 505.785156 L 236.839844 324.183594 L 195.289062 283.449219 L 176.675781 265.207031 L 164.371094 253.140625 L 176.675781 240.839844 L 194.230469 223.285156 L 236.839844 180.671875 L 236.839844 0.949219 C 215.988281 2.378906 195.832031 6.332031 176.675781 12.507812 C 74.957031 45.300781 1.363281 140.734375 1.363281 253.367188 Z M 176.675781 155.75 L 109.140625 223.285156 L 66.851562 223.285156 C 77.046875 159.195312 119.308594 105.800781 176.675781 80.042969 Z M 176.675781 155.75 " fill-opacity="1" fill-rule="nonzero"/>
                  </g>
                  <g clip-path="url(#bbfc2614fc)">
                    <path fill="currentColor" d="M 417.28125 63.832031 C 409.820312 57.246094 401.964844 51.09375 393.761719 45.417969 C 375.335938 32.664062 355.128906 22.296875 333.597656 14.757812 C 327.8125 12.730469 321.925781 10.910156 315.953125 9.300781 C 301.382812 5.375 286.289062 2.714844 270.800781 1.453125 L 270.800781 131.402344 L 315.953125 131.402344 L 315.953125 75.507812 C 321.984375 77.738281 327.871094 80.269531 333.597656 83.085938 L 333.597656 492.480469 C 355.128906 484.9375 375.335938 474.574219 393.761719 461.816406 L 393.761719 129.585938 C 402.789062 140.039062 410.691406 151.484375 417.28125 163.738281 L 417.28125 223.539062 L 462.4375 223.539062 L 462.4375 116.203125 C 449.824219 96.730469 434.609375 79.113281 417.28125 63.832031 Z M 417.28125 63.832031 " fill-opacity="1" fill-rule="nonzero"/>
                  </g>
                </g>
              </g>
            </svg>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.slice(0, 5).map((cat) => {
              const Icon = NAV_ICONS[cat.icon] || Package;
              const label = NAV_LABELS[cat.name] || cat.name;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group relative px-3 py-2 text-[0.8125rem] font-medium text-[var(--nav-link)] hover:text-[var(--color-text)] transition-all duration-300 whitespace-nowrap"
                >
                  <span className="flex items-center gap-1.5">
                    <Icon size={12} className="group-hover:text-[var(--color-primary)] transition-colors" />
                    {label}
                  </span>
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              );
            })}
            {categories.length > 5 && (
              <div className="group relative">
                <button className="flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium text-[var(--nav-link)] hover:text-[var(--color-text)] transition-all duration-300">
                  <span className="flex items-center gap-1.5">
                    <Package size={12} />
                    More
                    <ChevronRight size={10} className="group-hover:rotate-90 transition-transform duration-200" />
                  </span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-[240px] glass-card overflow-hidden p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                  <div className="flex flex-col gap-0.5">
                    {categories.slice(5).map((cat) => {
                      const Icon = NAV_ICONS[cat.icon] || Package;
                      const label = NAV_LABELS[cat.name] || cat.name;
                      return (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.8125rem] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-primary-subtle)] transition-all"
                        >
                          <Icon size={14} className="text-[var(--color-primary)]/60 shrink-0" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-[var(--card-border)]">
                    <Link to="/products"
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-[0.75rem] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-all"
                    >
                      {t("view_all")} <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
