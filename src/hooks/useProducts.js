import { useState, useEffect } from "react";
import { getProducts } from "../services/api";

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts(params)
      .then((data) => { if (!cancelled) setProducts(data.items || data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);

  return { products, loading, error };
}
