import type { Config } from "tailwindcss";

// Intelliflow warm palette.
// `slate` is redefined as a warm cocoa neutral scale so every surface, border
// and muted text in the app picks up the warm tone; `ember` is the brand
// accent (terracotta / amber) and `saffron` the secondary highlight.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#140F0C",
        slate: {
          50: "#FBF6F0",
          100: "#F4EADF",
          200: "#E6D6C4",
          300: "#D0BBA4",
          400: "#AE957D",
          500: "#86705C",
          600: "#634F40",
          700: "#4A3A2F",
          800: "#33271F",
          900: "#241B16",
          950: "#18120E",
        },
        ember: {
          50: "#FFF4EC",
          100: "#FFE5D1",
          200: "#FEC8A1",
          300: "#FBA46B",
          400: "#F7823F",
          500: "#EC6622",
          600: "#C94F14",
          700: "#A63F13",
          800: "#843417",
          900: "#6C2C16",
          950: "#3B1408",
        },
        saffron: {
          300: "#FCD581",
          400: "#F9C04A",
          500: "#F0A92A",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono: ["JetBrains Mono", "Cascadia Code", "Consolas", "monospace"],
      },
      backgroundImage: {
        "ember-glow":
          "radial-gradient(ellipse at top, rgba(236,102,34,0.18), transparent 60%)",
        "ember-gradient": "linear-gradient(135deg, #EC6622 0%, #F0A92A 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
