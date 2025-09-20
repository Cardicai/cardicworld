import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { cardic: { bg: "#020617", primary: "#16B5FF", gold: "#F5C451" } },
      boxShadow: { glow: "0 0 30px rgba(22,181,255,0.25)" },
    },
  },
  plugins: [],
}

export default config
