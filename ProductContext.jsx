import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "rt_electronics_products_v1";
const AUTH_KEY = "rt_electronics_auth_v1";

const SEED = [
  {
    id: "p-001",
    name: "NEXUS X1 HEADSET",
    category: "Audio",
    price: 2499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Planar-magnetic driver, active noise cancellation, machined aluminum shell.",
  },
  {
    id: "p-002",
    name: "ORBIT MECHANICAL KB",
    category: "Peripherals",
    price: 1899,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    description: "Hot-swappable switches, PBT double-shot keycaps, per-key RGB.",
  },
  {
    id: "p-003",
    name: "VOLT PRO SMARTPHONE",
    category: "Mobile",
    price: 8990,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    description: "6.7\" OLED 120Hz, titanium frame, 50MP periscope, IP68.",
  },
  {
    id: "p-004",
    name: "HALO DRONE EDGE",
    category: "Drones",
    price: 6499,
    image: "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&q=80",
    description: "8K camera, 45-min flight, obstacle avoidance on all axes.",
  },
  {
    id: "p-005",
    name: "APEX GAMING MOUSE",
    category: "Peripherals",
    price: 799,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
    description: "32000 DPI optical sensor, 58g shell, 70-hour battery.",
  },
  {
    id: "p-006",
    name: "PULSE 4K MONITOR",
    category: "Displays",
    price: 5999,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "32\" 4K QD-OLED, 240Hz, 0.03ms response, HDR True Black 400.",
  },
];

const Ctx = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setProducts(raw ? JSON.parse(raw) : SEED);
      setAuthed(localStorage.getItem(AUTH_KEY) === "1");
    } catch {
      setProducts(SEED);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  const addProduct = (p) =>
    setProducts((prev) => [{ ...p, id: `p-${Date.now()}` }, ...prev]);
  const updateProduct = (id, p) =>
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((x) => x.id !== id));
  const resetProducts = () => setProducts(SEED);

  const login = (user, pass) => {
    if (user === "admin" && pass === "rt2026") {
      localStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  return (
    <Ctx.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, resetProducts, authed, login, logout }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useProducts = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProducts must be used within ProductProvider");
  return c;
};
