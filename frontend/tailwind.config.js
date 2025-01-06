/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#22577A", // Dark Blue
        secondary: "#38A3A5", // Teal
        accent: "#57CC99", // Medium Green
        light: "#80ED99", // Light Green
        pale: "#C7F9CC", // Pale Green
      },
      backgroundImage: {
        "light-gradient": "linear-gradient(to bottom, #C7F9CC, #80ED99)",
        "vibrant-gradient":
          "linear-gradient(to bottom, #57CC99, #22577A)",
        "dark-gradient": "linear-gradient(to bottom, #22577A, #38A3A5)",
        "dark-green-gradient": "linear-gradient(to right, #22577A, #57CC99)",
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        mukta: ['Mukta', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
    },
  },
  plugins: [],
};
