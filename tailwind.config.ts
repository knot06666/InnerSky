import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skyMist: "#e8f2f7",
        skyPale: "#cfe5f2",
        warmWhite: "#fffaf2",
        softGray: "#697782",
        ink: "#26313a",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(64, 88, 105, 0.16)",
      },
      keyframes: {
        floatCloud: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(12px, -10px, 0)" },
        },
      },
      animation: {
        floatCloud: "floatCloud 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
