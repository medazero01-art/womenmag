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
        primary: "#D3757F", // Rose Bordeaux élégant
        secondary: "#FAFAFA", // Blanc cassé premium
        background: "#FAFAFA",
        text: {
          primary: "#1A1A1A", // Noir intense
          secondary: "#4B4B4B",
          disabled: "#9CA3AF",
        },
        success: "#2E8B57",
        error: "#C0392B",
        info: "#4A6FA5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
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
