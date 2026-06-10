import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
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
        },
      },
    },
  },
  plugins: [],
};

export default config;
