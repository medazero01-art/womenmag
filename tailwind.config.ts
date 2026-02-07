import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D16C7C", // Rose terracotta
        secondary: "#F5EFEA", // Beige chaud
        background: "#FAFAFA", // Blanc cassé
        text: {
          primary: "#1F1F1F",
          secondary: "#6B6B6B",
          disabled: "#A8A8A8",
        },
        success: "#2E8B57",
        error: "#C0392B",
        info: "#4A6FA5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1280px",
        },
      },
    },
  },
  plugins: [],
};
export default config;
