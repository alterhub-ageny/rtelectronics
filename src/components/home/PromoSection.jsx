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
      <Carousel items={promotions} />
    </section>
  );
}
