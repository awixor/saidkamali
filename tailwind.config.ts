import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF7",
        foreground: "#1C1C1C",
        accent: "#B8860B",
        "accent-dark": "#96700A",
        secondary: "#2D5016",
        card: "#FFFFFF",
        border: "#E8E4DC",
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "serif"],
        naskh: ["var(--font-noto-naskh)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
