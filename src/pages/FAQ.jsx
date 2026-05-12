import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Zap } from "lucide-react";

const faqs = [
  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking number via email. You can also check order status in your account dashboard." },
  { q: "What is the return policy?", a: "We offer 30-day returns on most physical products. Digital items (game top-ups, gift cards) are non-refundable once delivered." },
  { q: "How long does shipping take?", a: "Standard shipping: 3-7 business days. Express: 1-2 business days. Free shipping on orders over $99." },
  { q: "Are my payments secure?", a: "All transactions are encrypted using TLS 1.3. We never store your payment credentials on our servers." },
  { q: "How do game top-ups work?", a: "After purchase, the in-game currency is delivered to your account within minutes. You'll need to provide your in-game ID." },
  { q: "Do you ship internationally?", a: "Yes, we deliver to 50+ countries. Duties and taxes may apply based on your location." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 1 hour of placement. Contact support immediately for cancellation requests." },
  { q: "What warranty do you offer?", a: "All electronics come with a minimum 1-year warranty. Extended warranties available at checkout." },
  { q: "How do gift cards work?", a: "Digital gift cards are delivered via email within minutes. They can be redeemed at checkout." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, PayPal, Apple Pay, Google Pay, and cryptocurrency (BTC, ETH)." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rt-accent/20 bg-rt-accent/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rt-accent" />
          <span className="text-rt-accent text-[10px] font-mono tracking-[0.15em] uppercase">FAQ</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
          <span className="text-white/90">FREQUENTLY </span>
          <span className="text-crystal">ASKED</span>
        </h1>
        <div className="max-w-xs mx-auto mt-4">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH FAQ..."
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-white/50 text-xs font-mono placeholder:text-white/15 focus:border-rt-accent/30 transition-all"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-2">
        {filtered.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className={`w-full text-left crystal rounded-2xl p-4 transition-all duration-300 ${
                open === i ? "border-rt-accent/20" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/70 text-sm font-medium">{faq.q}</span>
                <ChevronDown
                  size={14}
                  className={`text-white/30 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                />
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-white/30 text-xs font-mono mt-3 leading-relaxed overflow-hidden"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
