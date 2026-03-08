/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./popup.html",
    "./options.html",
    "./dashboard.html",
    "./education.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        accent: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
