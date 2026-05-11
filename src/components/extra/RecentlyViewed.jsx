import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { getProductsByIds } from "../../services/api";

const MAX = 6;
function getStored() {
  try { return JSON.parse(localStorage.getItem("rt-recent") || "[]"); } catch { return []; }
}
function setStored(ids) {
  localStorage.setItem("rt-recent", JSON.stringify(ids.slice(0, MAX)));
}

export function addRecent(id) {
  const ids = getStored().filter((i) => i !== id);
  ids.unshift(id);
  setStored(ids);
}

export default function RecentlyViewed() {
  const [ids, setIds] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => { setIds(getStored()); }, []);

  useEffect(() => {
    if (ids.length) getProductsByIds(ids).then(setProducts).catch(() => {});
  }, [ids]);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={18} className="text-rt-accent" />
        <h2 className="text-lg font-display font-bold text-white">Recently Viewed</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {products.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/product/${p.id}`} className="group block w-36 shrink-0">
              <div className="aspect-square rounded-xl overflow-hidden bg-rt-dark mb-2">
                <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <p className="text-white text-xs font-medium truncate group-hover:text-rt-accent transition-colors">{p.name}</p>
              <p className="text-rt-accent font-mono text-xs">${p.price?.toLocaleString()}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
