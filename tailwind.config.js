/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.{jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // RT ELECTRONICS — Tech-Noir palette
        black: {
          DEFAULT: "#000000",
          pure: "#000000",
          soft: "#0a0a0a",
          ink: "#111111"
        },
        white: {
          DEFAULT: "#FFFFFF",
          pure: "#FFFFFF",
          dim: "#E5E5E5"
        },
        red: {
          DEFAULT: "#FF0000",
          500: "#FF1A1A",
          600: "#FF0000",
          700: "#CC0000",
          800: "#990000",
          900: "#660000"
        },
        brand: {
          bg: "#000000",
          fg: "#FFFFFF",
          accent: "#FF0000"
        }
      },
      fontFamily: {
        mono: [
          '"Space Mono"',
          '"IBM Plex Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace"
        ],
        display: ['"Space Mono"', '"IBM Plex Mono"', "monospace"]
      },
      letterSpacing: {
        widest: "0.3em",
        ultra: "0.4em"
      },
      boxShadow: {
        "red-glow": "0 0 0 1px rgba(255,0,0,0.4), 0 0 40px -10px rgba(255,0,0,0.5)",
        "red-hard": "0 0 0 2px #FF0000",
        "red-inset": "inset 0 0 20px rgba(255,0,0,0.08)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,0,0,0.6)" },
          "50%": { boxShadow: "0 0 0 10px rgba(255,0,0,0)" }
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "1" },
          "50%": { opacity: "0.6" },
          "55%": { opacity: "1" }
        }
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "pulse-red": "pulse-red 2s infinite",
        flicker: "flicker 4s infinite"
      }
    }
  },
  plugins: []
};
