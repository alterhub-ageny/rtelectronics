import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X, Zap } from "lucide-react";
import { getProducts } from "../../services/api";

export default function SearchBar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const debounceRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await getProducts({ search: val });
        setResults((data.items || data).slice(0, 5));
        setOpen(true);
      } catch {}
    }, 300);
  };

  const handleSelect = (id) => {
    setOpen(false);
    setQuery("");
    navigate(`/product/${id}`);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--nav-icon-color)]" size={12} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t("common.search")}
          className="w-full pl-8 pr-7 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-[11px] text-[var(--nav-icon-color)] placeholder:text-[var(--nav-icon-color)]/50 focus:border-rt-accent/30 focus:bg-white/[0.04] transition-all duration-300 font-mono tracking-wide"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--nav-icon-color)] hover:text-[var(--color-primary)] transition-colors"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full hologram rounded-xl overflow-hidden z-50 shadow-2xl">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.04] transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--nav-icon-bg)] border border-[var(--nav-icon-border)] overflow-hidden shrink-0 flex items-center justify-center">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Zap size={10} className="text-rt-accent/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--nav-icon-color)] text-[11px] font-medium truncate">{p.name}</p>
                <p className="text-rt-accent text-[10px] font-mono">${Number(p.price).toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
