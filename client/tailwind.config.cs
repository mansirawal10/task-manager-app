/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        danger: "#dc2626",
        success: "#16a34a",
      },
      backdropBlur: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        soft: "0 4px 8px rgba(0,0,0,0.1)",
        strong: "0 6px 12px rgba(0,0,0,0.2)",
      },
      transitionTimingFunction: {
        smooth: "ease-in-out",
      },
    },
  },
  plugins: [],
};