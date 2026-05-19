import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
const COLORS = { success: "border-emerald-500/40 text-emerald-400", error: "border-red-500/40 text-red-400", warning: "border-orange-500/40 text-orange-400", info: "border-[var(--color-primary)]/40 text-[var(--color-primary)]" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || ICONS.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                layout
                className={`pointer-events-auto glass rounded-2xl p-4 border ${COLORS[t.type] || COLORS.info} flex items-start gap-3 shadow-2xl`}
              >
                <Icon size={20} className="shrink-0 mt-0.5" />
                <p className="text-white text-sm flex-1">{t.message}</p>
                <button onClick={() => removeToast(t.id)} className="text-white/30 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
