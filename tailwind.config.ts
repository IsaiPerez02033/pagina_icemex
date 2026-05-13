import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "accent-cyan": "var(--accent-cyan)",
        "accent-orange": "var(--accent-orange)",
        "accent-red": "var(--accent-red)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "grid-lines": "var(--grid-lines)",
        metal: "var(--metal)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
