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
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      colors: {
        neutral: {
          light: "#F8F8F8",
          default: "#F6F6F6",
          dark: "#8E8EA5",
        },
        primary: {
          light: "#DDFFBA",
          default: "#BCF483",
          dark: "#AEED6F",
        },
        secondary: {
          light: "#10102A",
          default: "#0B0B1C",
          dark: "#070719",
        },
        danger: "#EF4444",
        success: "#10B981",
      },
    },
  },
  plugins: [],
};
