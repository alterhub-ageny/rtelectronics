import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Search, Filter, ArrowDownRight, Zap, ShoppingBag, Sparkles } from "lucide-react";
import { useProducts } from "./ProductContext";

export default function Showcase({ logoSrc = "/RT.png" }) {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = cat === "ALL" || p.category === cat;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, cat, query]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-red-600/20">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-red-600/50 bg-red-600/10 text-red-500 text-[10px] tracking-[0.4em] font-bold mb-8"
              >
                <span className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
                SYSTEM ONLINE // 2026
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[48px] md:text-[88px] leading-[0.95] font-black tracking-tight"
                style={{ fontFamily: '"Space Mono", "IBM Plex Mono", monospace' }}
              >
                HARDWARE
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent" style={{ WebkitTextStroke: "2px #fff" }}>
                    ENGINEERED
                  </span>
                </span>
                <br />
                <span className="text-red-600">FOR IMPACT.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mt-8 max-w-xl text-white/70 leading-relaxed text-sm md:text-base"
              >
                RT ELECTRONICS curates high-performance gear for operators, creators, and purists.
                No filler. No compromise. Just hardware that does what the spec sheet promised.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#catalog"
                  className="group px-7 py-4 bg-red-600 hover:bg-red-500 text-white text-xs tracking-[0.3em] font-black flex items-center gap-3 transition"
                  style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
                >
                  <ShoppingBag size={14} />
                  BROWSE CATALOG
                  <ArrowDownRight size={14} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition" />
                </a>
                <a href="#about" className="px-7 py-4 border border-white/20 hover:border-red-600 hover:text-red-500 text-xs tracking-[0.3em] font-black transition">
                  ABOUT THE BRAND
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-14 grid grid-cols-3 gap-4 max-w-md"
              >
                {[
                  { k: "ITEMS", v: products.length.toString().padStart(3, "0") },
                  { k: "CATEGORIES", v: (categories.length - 1).toString().padStart(2, "0") },
                  { k: "UPTIME", v: "99.9%" },
                ].map((s) => (
                  <div key={s.k} className="border-l-2 border-red-600 pl-3">
                    <div className="text-2xl md:text-3xl font-black">{s.v}</div>
                    <div className="text-[9px] tracking-[0.3em] text-white/50 mt-1">{s.k}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-5 flex justify-center md:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-40" />
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-black ring-2 ring-red-600/40 overflow-hidden">
                  <img
                    src={logoSrc}
                    alt="RT Electronics logo"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-transparent" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                  className="absolute -inset-6 border border-dashed border-red-600/40 rounded-full pointer-events-none"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                  className="absolute -inset-12 border border-white/5 rounded-full pointer-events-none"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-b border-red-600/20 bg-red-600 overflow-hidden">
        <div className="flex gap-12 py-3 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 text-black font-black text-xs tracking-[0.4em]">
              <span>RT ELECTRONICS</span>
              <Zap size={14} />
              <span>PRECISION HARDWARE</span>
              <Zap size={14} />
              <span>EST. 2026</span>
              <Zap size={14} />
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* CATALOG */}
      <section id="catalog" className="relative max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.4em] mb-3">
              <Cpu size={12} />
              / 01 — CATALOG
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              THE <span className="text-red-600">LINEUP</span>
            </h2>
            <p className="text-white/60 text-sm mt-3 max-w-lg">
              Every unit vetted. Every spec earned. Filter the signal from the noise.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH..."
                className="pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 focus:border-red-600 focus:bg-black outline-none text-xs tracking-[0.2em] w-48"
              />
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter size={14} className="text-red-500 shrink-0 mr-1" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 text-[10px] tracking-[0.3em] font-bold shrink-0 border transition ${
                cat === c
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-white/15 text-white/60 hover:border-red-600 hover:text-red-500"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="border border-white/10 p-16 text-center">
            <Sparkles className="mx-auto mb-3 text-red-600" />
            <div className="text-white/70 text-sm tracking-[0.2em]">NO RESULTS IN THIS FREQUENCY.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="relative border-t border-red-600/20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.4em] mb-3">
              <Cpu size={12} />
              / 02 — DOCTRINE
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              WE DON'T SELL GADGETS.
              <br />
              <span className="text-red-600">WE SHIP STANDARDS.</span>
            </h3>
          </div>
          <div className="md:col-span-7 space-y-6 text-white/70 leading-relaxed text-sm md:text-base">
            <p>
              RT ELECTRONICS exists for one reason: to eliminate the gap between what a piece of
              hardware claims to do and what it actually does in your hands. Every product in this
              catalog was picked apart, stress-tested, and approved by people who refuse to ship
              anything they wouldn't use themselves.
            </p>
            <p>
              Whether it's a mechanical keyboard that should outlive your desk, or a drone that
              should hold its line in a headwind — the bar is the same. Precision. Durability.
              Zero theatrics.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { v: "100%", k: "TESTED" },
                { v: "24H", k: "SHIPPING" },
                { v: "2YR", k: "WARRANTY" },
              ].map((s) => (
                <div key={s.k} className="border border-red-600/30 p-4 hover:border-red-600 hover:bg-red-600/5 transition">
                  <div className="text-2xl font-black text-red-500">{s.v}</div>
                  <div className="text-[9px] tracking-[0.3em] text-white/50 mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.4) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-black border border-white/10 overflow-hidden transition-all duration-500 hover:border-red-600"
      style={{
        boxShadow: hovered ? "0 0 0 1px rgba(255,0,0,0.4), 0 0 40px -10px rgba(255,0,0,0.5), inset 0 0 20px rgba(255,0,0,0.08)" : "none",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition" />

      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/5 to-black">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Cpu size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition duration-500 mix-blend-overlay" />

        <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur border border-red-600/50 text-red-500 text-[9px] tracking-[0.3em] font-bold">
          {product.category || "ITEM"}
        </div>

        <div className="absolute top-3 right-3 w-2 h-2 bg-red-600 animate-pulse" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="text-[9px] tracking-[0.3em] text-white/50 font-mono">
            #{product.id.slice(-4).toUpperCase()}
          </div>
          <div className="text-right">
            <div className="text-[9px] tracking-[0.3em] text-white/50">MAD</div>
            <div className="text-xl font-black text-white">
              {Number(product.price || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-black tracking-[0.08em] leading-tight group-hover:text-red-500 transition">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-2 text-xs text-white/55 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] text-white/40">IN STOCK</span>
          <button className="flex items-center gap-1 text-[10px] tracking-[0.3em] font-black text-white group-hover:text-red-500 transition">
            VIEW <ArrowDownRight size={12} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
