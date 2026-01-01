import { platformSelect } from "nativewind/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        btnHighlight: "var(--color-btn-highlight)",
        surface: "var(--color-surface)",
        "surface-mint": "var(--color-surface-mint)",
        primary: "var(--color-primary)",
        "text-main": "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        system: platformSelect({
          ios: "Georgia",
          android: "sans-serif",
          default: "ui-sans-serif",
        }),
        inter: ["Inter"],
        "inter-bold": ["Inter-Bold"],
      },
    },
  },
  plugins: [],
};
