import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STYLES = [
  { id: "avataaars", label: "Cartoon" },
  { id: "adventurer", label: "Adventure" },
  { id: "lorelei", label: "Fantasy" },
  { id: "open-peeps", label: "Casual" },
  { id: "bottts", label: "Robots" },
  { id: "fun-emoji", label: "Emoji" },
  { id: "notionists", label: "Minimal" },
  { id: "personas", label: "Realistic" },
];

const SEEDS = ["Alex", "Sam", "Jordan", "Riley", "Casey", "Avery", "Quinn", "Morgan", "Skyler", "Reese", "Drew", "Parker"];

export default function AvatarPicker({ current, onSelect }) {
  const [style, setStyle] = useState("avataaars");
  const [seedGrid, setSeedGrid] = useState(SEEDS);

  const buildUrl = (s) => `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(s)}&backgroundColor=transparent`;

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {STYLES.map((s) => (
          <button key={s.id} onClick={() => setStyle(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              style === s.id ? "bg-rt-accent text-white shadow-lg shadow-rt-accent/20" : "bg-white/5 text-white/50 hover:text-white border border-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2">
        {seedGrid.map((seed) => {
          const url = buildUrl(seed);
          const selected = url === current;
          return (
            <motion.button key={seed} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(url)}
              className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                selected ? "border-rt-accent ring-2 ring-rt-accent/30" : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={url} alt={seed} className="w-full h-full object-cover bg-white/5" />
              {selected && (
                <div className="absolute inset-0 bg-rt-accent/10 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-rt-accent flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="flex gap-2">
        {["neutral", "female", "male"].map((g) => (
          <button key={g} onClick={() => setSeedGrid(SEEDS.map((s) => `${s}-${g}`))}
            className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${
              seedGrid[0]?.endsWith(`-${g}`) || (g === "neutral" && !seedGrid[0]?.includes("-"))
                ? "bg-rt-accent/20 text-rt-accent border border-rt-accent/30"
                : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
            }`}
          >
            {g}
          </button>
        ))}
        <button onClick={() => setSeedGrid(SEEDS.map((s) => `${s}-${Math.random().toString(36).slice(2, 6)}`))}
          className="px-3 py-1 rounded-lg text-xs bg-white/5 text-white/50 border border-white/10 hover:text-white transition-all ml-auto"
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}
