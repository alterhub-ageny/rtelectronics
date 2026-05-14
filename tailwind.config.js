/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: { DEFAULT: "#07070D", 50: "#1C1C2A", 100: "#161624", 200: "#12121E", 300: "#0E0E18", 400: "#0A0A12", 500: "#07070D", 600: "#05050A", 700: "#030306" },
        crimson: { DEFAULT: "#E11D48", 50: "#FEE2E8", 100: "#FCA5B5", 200: "#F8718A", 300: "#EF445E", 400: "#E11D48", 500: "#BE123C", 600: "#9F1239", 700: "#881337" },
        cyan: { DEFAULT: "#00E5FF", 50: "#E0FCFF", 100: "#B3F5FF", 200: "#80EEFF", 300: "#4DE6FF", 400: "#00E5FF", 500: "#00B8D4", 600: "#0091A6" },
        gold: { DEFAULT: "#D4A843", 50: "#FDF5E6", 100: "#FCE8C8", 200: "#F5D79E", 300: "#EBC66E", 400: "#D4A843", 500: "#B8923A" },
        slate: { DEFAULT: "#475569", 50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 400: "#94A3B8", 500: "#64748B", 600: "#475569", 700: "#334155", 800: "#1E293B", 900: "#0F172A" },
        midnight: { DEFAULT: "#020617", 50: "#1E293B", 100: "#0F172A", 200: "#0A0F1E", 300: "#060B17", 400: "#030712", 500: "#020617", 600: "#010409", 700: "#000000" },
        "cyber-red": { DEFAULT: "#EF4444", 50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#FCA5A5", 400: "#F87171", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C" },
        "neon-cyan": { DEFAULT: "#22D3EE", 50: "#ECFEFF", 100: "#CFFAFE", 200: "#A5F3FC", 300: "#67E8F9", 400: "#22D3EE", 500: "#06B6D4", 600: "#0891B2" },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        inter: ["Inter", "system-ui", "sans-serif"],
        heading: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Space Grotesk'", "system-ui", "sans-serif"],
        orbitron: ["'Orbitron'", "sans-serif"],
      },
      animation: {
        "shimmer": "shimmer 4s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glass-shine": "glass-shine 6s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        "glow-pulse": { "0%, 100%": { opacity: "0.4" }, "50%": { opacity: "0.8" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        "glass-shine": { "0%": { transform: "translateX(-100%) skewX(-15deg)" }, "100%": { transform: "translateX(200%) skewX(-15deg)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      boxShadow: {
        "red-glow": "0 0 30px rgba(225,29,72,0.12), 0 4px 20px rgba(0,0,0,0.3)",
        "cyan-glow": "0 0 30px rgba(0,229,255,0.1), 0 4px 20px rgba(0,0,0,0.3)",
        "glass": "0 8px 32px rgba(0,0,0,0.3)",
      },
      // Dynamic accent (changes with theme: red in dark, indigo in soft)
      rt: {
        darker: "#020208", dark: "#07070D", card: "#0D0D1A",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent-dim) / <alpha-value>)",
        accent3: "#22c55e", gold: "#ffd700",
        glow: "rgb(var(--accent) / <alpha-value>)",
        cyan: "#00E5FF", magenta: "rgb(var(--accent) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
