import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#22C55E", 600: "#16A34A", 700: "#15803D", deep: "#052E16" },
        ink: { DEFAULT: "#050805", 2: "#071007", 3: "#030603" },
        fg: "#F0FDF4",
        muted: "#86A789",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: { glow: "0 0 0 1px rgba(34,197,94,.35), 0 0 40px -8px rgba(34,197,94,.4)" },
    },
  },
  plugins: [],
};
export default config;
