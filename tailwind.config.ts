import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f4f1ea",
        ink: "#1c1b19",
        muted: "#6b6560",
        line: "#d9d3c7",
        accent: "#0f5c56",
        "accent-hover": "#0c4a45",
        warning: "#8a3b12",
        danger: "#8b1e1e",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        article: "42rem",
        site: "72rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
