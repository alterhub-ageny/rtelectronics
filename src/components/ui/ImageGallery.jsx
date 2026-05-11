import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export default function ImageGallery({ images, productName }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!images?.length) return null;

  return (
    <>
      <div className="relative aspect-square rounded-3xl overflow-hidden glass border border-white/5 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={productName}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover cursor-crosshair"
            onClick={() => setZoomed(true)}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          onClick={() => setZoomed(true)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        >
          <Maximize2 size={16} />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? "bg-rt-accent w-6" : "bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                i === active ? "border-rt-accent" : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button onClick={() => setZoomed(false)} className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={images[active]}
              alt={productName}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
