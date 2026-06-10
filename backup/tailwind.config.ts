import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          light: "#a5b4fc",
        },
        stage: {
          bg: "#0b0b14",
          panel: "#13131f",
          border: "#252538",
        },
        accent: {
          green: "#22c55e",
          amber: "#f59e0b",
          pink: "#ec4899",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.15)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "grow-bar": {
          "0%": { width: "0%" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out",
        "grow-bar": "grow-bar 0.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
