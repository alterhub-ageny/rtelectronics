/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rt: {
          dark: "#0a0a1a",
          darker: "#060612",
          card: "#111128",
          accent: "#ff2a2a",
          accent2: "#cc0000",
          accent3: "#ff6b6b",
          gold: "#ffd700",
          glow: "rgba(255, 42, 42, 0.3)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "grid-flow": "grid-flow 20s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 42, 42, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 42, 42, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "grid-flow": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255, 42, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 42, 42, 0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 50%, rgba(255, 42, 42, 0.1) 0%, transparent 70%)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
    },
  },
  plugins: [],
};
