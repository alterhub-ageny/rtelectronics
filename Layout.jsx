import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Instagram, Twitter, Facebook, Zap, ArrowUpRight } from "lucide-react";

export default function Layout({ children, currentRoute = "showcase", onNavigate = () => {}, logoSrc = "/RT.png" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { key: "showcase", label: "SHOWCASE" },
    { key: "about", label: "ABOUT" },
    { key: "contact", label: "CONTACT" },
    { key: "admin", label: "ADMIN", icon: Shield },
  ];

  const handleNav = (key) => {
    setOpen(false);
    if (key === "admin" || key === "showcase") onNavigate(key);
    else {
      const el = document.getElementById(key);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-red-600 selection:text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 10%, rgba(255,0,0,0.35), transparent 40%), radial-gradient(circle at 80% 90%, rgba(255,0,0,0.25), transparent 45%)",
        }}
      />

      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 border-b ${
          scrolled ? "bg-black/85 border-red-600/40" : "bg-black/60 border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <button onClick={() => onNavigate("showcase")} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full overflow-hidden ring-1 ring-red-600/50 group-hover:ring-red-500 transition">
              <img
                src={logoSrc}
                alt="RT Electronics"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-transparent to-red-600/40 group-hover:to-red-600/70 transition" />
            </div>
            <div className="leading-none text-left">
              <div className="text-[11px] tracking-[0.35em] text-red-500">RT</div>
              <div className="text-sm md:text-base font-black tracking-[0.25em] text-white">ELECTRONICS</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => {
              const active = currentRoute === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => handleNav(n.key)}
                  className={`relative px-4 py-2 text-xs tracking-[0.3em] font-bold transition-colors ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {n.icon && <n.icon size={14} />}
                    {n.label}
                  </span>
                  {active && (
                    <motion.span layoutId="nav-underline" className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-red-600" />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => handleNav("contact")}
              className="ml-3 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs tracking-[0.3em] font-black flex items-center gap-2 transition group"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              CONNECT
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </button>
          </nav>

          <button onClick={() => setOpen((v) => !v)} className="md:hidden p-2 text-white" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-black border-b border-red-600/30"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {navItems.map((n) => (
                  <button
                    key={n.key}
                    onClick={() => handleNav(n.key)}
                    className="text-left px-3 py-3 text-sm tracking-[0.3em] font-bold text-white/80 hover:text-red-500 hover:bg-white/5 flex items-center gap-3 transition"
                  >
                    {n.icon && <n.icon size={14} />}
                    {n.label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10">{children}</main>

      <footer id="contact" className="relative z-10 border-t border-red-600/30 bg-black mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-red-600/60">
                  <img src={logoSrc} alt="RT" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.35em] text-red-500">RT</div>
                  <div className="text-lg font-black tracking-[0.25em]">ELECTRONICS</div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                Engineered hardware for those who refuse the default. Curated electronics, uncompromising standards, zero filler.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-white/15 hover:border-red-600 hover:bg-red-600/10 flex items-center justify-center transition">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-red-500 text-[11px] tracking-[0.3em] mb-4">NAVIGATE</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><button onClick={() => onNavigate("showcase")} className="hover:text-red-500">Showcase</button></li>
                <li><a href="#about" className="hover:text-red-500">About</a></li>
                <li><a href="#contact" className="hover:text-red-500">Contact</a></li>
                <li><button onClick={() => onNavigate("admin")} className="hover:text-red-500">Admin</button></li>
              </ul>
            </div>
            <div>
              <div className="text-red-500 text-[11px] tracking-[0.3em] mb-4">SIGNAL</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>contact@rt-electronics.com</li>
                <li>+212 000 000 000</li>
                <li>Salé, Morocco</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-[11px] tracking-[0.3em] text-white/40 flex items-center gap-2">
              <Zap size={12} className="text-red-600" />
              © {new Date().getFullYear()} RT ELECTRONICS — ALL SYSTEMS OPERATIONAL
            </div>
            <div className="text-[10px] tracking-[0.4em] text-white/30">v1.0.0 // TECH-NOIR EDITION</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
