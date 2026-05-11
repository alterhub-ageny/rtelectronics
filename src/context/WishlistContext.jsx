import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/api";

const WishlistContext = createContext();

function getLocalWishlist() {
  try { return JSON.parse(localStorage.getItem("rt-wishlist") || "[]"); } catch { return []; }
}

function setLocalWishlist(ids) {
  localStorage.setItem("rt-wishlist", JSON.stringify(ids));
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(user ? [] : getLocalWishlist());

  useEffect(() => {
    if (user) {
      getWishlist().then(setIds).catch(() => setIds([]));
    }
  }, [user]);

  const toggle = useCallback(async (productId) => {
    if (user) {
      try {
        if (ids.includes(productId)) {
          const res = await removeFromWishlist(productId);
          setIds(res);
        } else {
          const res = await addToWishlist(productId);
          setIds(res);
        }
      } catch {}
    } else {
      setIds((prev) => {
        const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
        setLocalWishlist(next);
        return next;
      });
    }
  }, [user, ids]);

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
