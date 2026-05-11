import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
        className="text-8xl md:text-9xl font-display font-bold text-gradient mb-4"
      >
        404
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-white/60 mb-2"
      >
        Page Not Found
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-white/40 mb-8 max-w-md"
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4">
        <Link to="/" className="btn-primary flex items-center gap-2"><Home size={18} /> Go Home</Link>
        <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2"><ArrowLeft size={18} /> Go Back</button>
      </motion.div>
    </div>
  );
}
