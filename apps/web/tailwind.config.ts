import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { bg:"#0f0f10", panel:"#151518", accent:"#D62828", accent2:"#C7A746", border:"#2a2a2e" },
      boxShadow: { card: "0 10px 30px rgba(0,0,0,.45)" }
    }
  },
  plugins: []
};
export default config;
