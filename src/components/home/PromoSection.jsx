import { useState, useEffect } from "react";
import { getPromotions } from "../../services/api";
import Carousel from "../ui/Carousel";

export default function PromoSection() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    getPromotions().then(setPromotions).catch(() => {});
  }, []);

  if (!promotions.length) return null;

  return (
    <section className="max-w-site mx-auto px-4 sm:px-6 py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/2 via-transparent to-[var(--color-primary)]/2 rounded-[24px]" />
        <Carousel items={promotions} />
      </div>
    </section>
  );
}
