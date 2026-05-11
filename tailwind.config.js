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
          accent: "rgb(var(--rt-accent) / <alpha-value>)",
          accent2: "rgb(var(--rt-accent2) / <alpha-value>)",
          accent3: "rgb(var(--rt-accent3) / <alpha-value>)",
          gold: "#ffd700",
          glow: "rgb(var(--rt-glow) / <alpha-value>)",
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
          "0%, 100%": { boxShadow: "var(--rt-glow-pulse-from)" },
          "50%": { boxShadow: "var(--rt-glow-pulse-to)" },
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
          "linear-gradient(var(--rt-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--rt-grid-color) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 50%, var(--rt-radial-glow-color) 0%, transparent 70%)",
      },
      maxWidth: {
        site: "1440px",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
    },
  },
  plugins: [],
};
