import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getProducts } from "../../services/api";

export default function SearchBar() {
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
        setResults(data.slice(0, 6));
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
    <div ref={ref} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search laptops, phones, game top-ups..."
          className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30
                     focus:outline-none focus:border-rt-accent/50 focus:bg-white/10 transition-all duration-300"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass rounded-2xl overflow-hidden z-50 border border-white/10">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors text-left"
            >
              <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{p.name}</p>
                <p className="text-rt-accent text-sm font-mono">${p.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
