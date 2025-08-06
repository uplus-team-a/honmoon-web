import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        toss: ["Pretendard", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#6B46C1",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F7FAFC",
          foreground: "#1A202C",
        },
        accent: {
          DEFAULT: "#DD6B20",
          foreground: "#FFF",
        },
        destructive: {
          DEFAULT: "#E53E3E",
          foreground: "#FFF",
        },
      },
    },
  },
  plugins: [animate],
};

export default config;
