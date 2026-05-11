import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and cryptocurrency (BTC, ETH, USDT)." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Free shipping on orders over $499." },
  { q: "What is your return policy?", a: "You have 30 days from delivery to return any item in original condition. We provide a prepaid return label and process refunds within 5 business days." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also view order status in your Account dashboard." },
  { q: "Do you offer warranty on products?", a: "All products come with a minimum 1-year manufacturer warranty. RT-branded products include a 2-year extended warranty with 24/7 support." },
  { q: "Can I change or cancel my order?", a: "You can cancel within 1 hour of placing the order. After that, please contact support to check if modification is possible." },
  { q: "How do gift cards work?", a: "Digital gift cards are delivered instantly via email. They never expire and can be used on any product in our store." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries. International shipping costs are calculated at checkout. Customs fees may apply." },
  { q: "What are game top-ups and how do they work?", a: "Game top-ups are digital credits for games like Valorant, FC 25, PUBG Mobile, and Genshin Impact. They're delivered instantly via code to your email." },
  { q: "Is my payment information secure?", a: "Absolutely. We use 256-bit SSL encryption and are PCI-DSS compliant. Your payment data is never stored on our servers." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <span className="text-rt-accent text-sm font-mono tracking-widest uppercase">FAQ</span>
        <h1 className="section-title mt-2">Frequently Asked Questions</h1>
        <p className="text-white/40 mt-2">Everything you need to know about RT ELECTRONICS</p>
      </div>

      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-rt-accent/50 transition-all" />
      </div>

      <div className="space-y-3">
        {filtered.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass rounded-2xl border border-white/5 overflow-hidden"
          >
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-medium pr-4">{faq.q}</span>
              <ChevronDown size={18} className={`text-rt-accent shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/40">
          <p className="text-lg">No results found</p>
          <p className="text-sm mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
}
