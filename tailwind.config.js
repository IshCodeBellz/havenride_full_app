/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#4DB6AC",
          500: "#26A69A",
          700: "#00796B",
        },
        neutral: {
          100: "#F5F5F5",
          600: "#757575",
          700: "#616161",
          900: "#263238",
        },
      },
    },
  },
  plugins: [],
};
