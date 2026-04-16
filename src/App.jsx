import React, { useEffect, useState } from "react";
import { ProductProvider } from "./ProductContext";
import Layout from "./Layout";
import Showcase from "./Showcase";
import AdminPanel from "./AdminPanel";

/**
 * Simple hash-based router: #/admin → admin panel, anything else → showcase.
 * Works without react-router. Pass your logo URL to LOGO_SRC.
 */
const LOGO_SRC = "/RT.png"; // replace with your hosted URL, e.g. "https://yoursite.com/images/RT.png"

export default function App() {
  const [route, setRoute] = useState(
    typeof window !== "undefined" && window.location.hash.includes("admin") ? "admin" : "showcase"
  );

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.includes("admin") ? "admin" : "showcase");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r) => {
    window.location.hash = r === "admin" ? "/admin" : "/";
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ProductProvider>
      <Layout currentRoute={route} onNavigate={navigate} logoSrc={LOGO_SRC}>
        {route === "admin" ? <AdminPanel /> : <Showcase logoSrc={LOGO_SRC} />}
      </Layout>
    </ProductProvider>
  );
}
