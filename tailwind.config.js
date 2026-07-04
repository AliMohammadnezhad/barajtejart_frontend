/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy — primary brand color
        primary: {
          50: "#eef4fb",
          100: "#d9e6f6",
          200: "#b3cdec",
          300: "#7fa9dd",
          400: "#4a80c9",
          500: "#2b62ad",
          600: "#1f4c8c",
          700: "#1a3d70",
          800: "#16305a",
          900: "#0f2140",
          950: "#0a1730",
        },
        // Warm amber — accent / CTA color
        accent: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 40px -12px rgba(10, 23, 48, 0.15)",
      },
    },
  },
  plugins: [],
};
