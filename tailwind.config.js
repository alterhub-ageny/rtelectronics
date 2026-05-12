/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rt: {
          darker: "#020208",
          dark: "#060612",
          card: "#0a0a1a",
          accent: "rgb(var(--rt-accent) / <alpha-value>)",
          accent2: "rgb(var(--rt-accent2) / <alpha-value>)",
          accent3: "rgb(var(--rt-accent3) / <alpha-value>)",
          gold: "#ffd700",
          glow: "rgb(var(--rt-glow) / <alpha-value>)",
          cyan: "#00F0FF",
          magenta: "#FF00FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Syncopate'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        cyber: ["'Share Tech Mono'", "monospace"],
        grotesk: ["'Space Grotesk'", "sans-serif"],
      },
      animation: {
        "crystal-drift": "crystal-drift 8s ease-in-out infinite",
        "neural-pulse": "neural-pulse 4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "liquid-shimmer": "liquid-shimmer 6s linear infinite",
        "depth-breathe": "depth-breathe 5s ease-in-out infinite",
        "chroma-shift": "chroma-shift 10s linear infinite",
        "ripple-spread": "ripple-spread 0.8s ease-out forwards",
        "thread-weave": "thread-weave 12s linear infinite",
        "lattice-morph": "lattice-morph 15s ease-in-out infinite alternate",
        "crystal-rotate": "crystal-rotate 20s linear infinite",
        "facet-shimmer": "facet-shimmer 4s ease-in-out infinite",
        "glow-propagate": "glow-propagate 0.6s ease-out forwards",
        "drift-slow": "drift-slow 20s ease-in-out infinite",
        "spectral-rotate": "spectral-rotate 8s linear infinite",
        "phase-shift": "phase-shift 6s ease-in-out infinite",
        "prism-refract": "prism-refract 3s ease-in-out infinite alternate",
        "float-lift": "float-lift 6s ease-in-out infinite",
        "terminal-blink": "terminal-blink 1s step-end infinite",
      },
      keyframes: {
        "crystal-drift": {
          "0%, 100%": { backgroundPosition: "0% 50%", filter: "hue-rotate(0deg) brightness(1)" },
          "33%": { backgroundPosition: "100% 0%", filter: "hue-rotate(30deg) brightness(1.05)" },
          "66%": { backgroundPosition: "50% 100%", filter: "hue-rotate(-15deg) brightness(0.95)" },
        },
        "neural-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        "liquid-shimmer": {
          "0%": { backgroundPosition: "-200% 50%", transform: "rotate(0deg)" },
          "100%": { backgroundPosition: "200% 50%", transform: "rotate(3deg)" },
        },
        "depth-breathe": {
          "0%, 100%": { transform: "perspective(1000px) translateZ(0) scale(1)" },
          "50%": { transform: "perspective(1000px) translateZ(50px) scale(1.01)" },
        },
        "chroma-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "ripple-spread": {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--rt-accent) / 0.4), 0 0 0 0 rgb(var(--rt-accent) / 0.1)" },
          "100%": { boxShadow: "0 0 0 20px transparent, 0 0 0 40px transparent" },
        },
        "thread-weave": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        "lattice-morph": {
          "0%": { borderRadius: "24px 8px 32px 12px", transform: "scale(1) rotate(0deg)" },
          "25%": { borderRadius: "12px 28px 8px 32px", transform: "scale(1.01) rotate(0.5deg)" },
          "50%": { borderRadius: "32px 12px 24px 8px", transform: "scale(0.99) rotate(-0.3deg)" },
          "75%": { borderRadius: "8px 32px 12px 28px", transform: "scale(1.01) rotate(0.2deg)" },
          "100%": { borderRadius: "24px 8px 32px 12px", transform: "scale(1) rotate(0deg)" },
        },
        "crystal-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "facet-shimmer": {
          "0%, 100%": { clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)", opacity: "0.3" },
          "50%": { clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)", opacity: "0.6" },
        },
        "glow-propagate": {
          "0%": { filter: "brightness(1) drop-shadow(0 0 0px transparent)" },
          "50%": { filter: "brightness(1.3) drop-shadow(0 0 20px rgb(var(--rt-accent) / 0.4))" },
          "100%": { filter: "brightness(1) drop-shadow(0 0 5px rgb(var(--rt-accent) / 0.1))" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "25%": { transform: "translate(10px, -15px)" },
          "50%": { transform: "translate(-5px, 10px)" },
          "75%": { transform: "translate(15px, 5px)" },
        },
        "spectral-rotate": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "phase-shift": {
          "0%, 100%": { opacity: "0.7", clipPath: "inset(0 0 0 0)" },
          "25%": { opacity: "0.9", clipPath: "inset(5% 0 0 0)" },
          "50%": { opacity: "0.6", clipPath: "inset(0 5% 0 0)" },
          "75%": { opacity: "0.8", clipPath: "inset(0 0 5% 0)" },
        },
        "prism-refract": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        "float-lift": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(0.5deg)" },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backgroundImage: {
        "crystal-gradient": "linear-gradient(135deg, rgb(var(--rt-accent) / 0.12), rgba(255,0,255,0.08), rgb(var(--rt-accent3) / 0.06), rgba(255,215,0,0.04))",
        "neural-grid": "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        "prism-gradient": "linear-gradient(135deg, rgba(0,240,255,0.08), rgba(255,0,255,0.05), rgba(255,215,0,0.03), rgba(0,240,255,0.08))",
        "depth-shadow": "radial-gradient(ellipse at 50% 0%, rgb(var(--rt-accent) / 0.06) 0%, transparent 70%)",
      },
      backgroundSize: {
        grid: "50px 50px",
        "200": "200% 100%",
        "300": "300% 100%",
      },
      boxShadow: {
        crystal: "0 0 40px rgb(var(--rt-accent) / 0.1), 0 0 80px rgb(var(--rt-accent) / 0.05), inset 0 0 40px rgb(var(--rt-accent) / 0.03)",
        "crystal-strong": "0 0 60px rgb(var(--rt-accent) / 0.2), 0 0 120px rgb(var(--rt-accent) / 0.08), inset 0 0 60px rgb(var(--rt-accent) / 0.05)",
        "depth": "0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
        "neural": "0 0 30px rgb(var(--rt-accent) / 0.15), 0 0 60px rgba(255,0,255,0.05)",
      },
      transitionTimingFunction: {
        "bounce-gentle": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "liquid": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      },
    },
  },
  plugins: [],
};
