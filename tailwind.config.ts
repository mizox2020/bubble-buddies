import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#FF6B9D",
          "pink-light": "#FF85B1",
          "pink-soft": "#FFD4E5",
          blue: "#45B7D1",
          "blue-light": "#4ECDC4",
          "blue-soft": "#D4F1F9",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #FF6B9D 0%, #45B7D1 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, #FFD4E5 0%, #D4F1F9 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
