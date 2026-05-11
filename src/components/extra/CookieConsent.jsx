import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("rt-cookies");
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("rt-cookies", "accepted");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg"
        >
          <div className="glass rounded-2xl p-5 border border-white/10 shadow-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rt-accent/10 border border-rt-accent/20 flex items-center justify-center shrink-0">
              <Cookie size={20} className="text-rt-accent" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-1">We use cookies</p>
              <p className="text-white/40 text-xs leading-relaxed">This site uses cookies to enhance your experience. By continuing, you agree to our use of cookies.</p>
            </div>
            <button onClick={accept} className="btn-primary text-sm whitespace-nowrap px-5 py-2">Accept</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
