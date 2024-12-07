/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark Theme Colors
        dark: {
          bg: "#522258", // Deep Purple
          text: "#FFFFFF", // White Text
        },
        secondaryDark: {
          bg: "#8C3061", // Muted Purple
          text: "#D95F59", // Coral Text
        },
        accentDark: {
          coral: "#D95F59",
          muted: "#C63C51",
        },
        borderDark: {
          light: "#C63C51",
          heavy: "#8C3061",
        },
        placeholderDark: "#C63C51",

        // Light Theme Colors
        light: {
          bg: "#EAB2A0", // Soft Beige
          text: "#522258", // Deep Purple Text
        },
        secondaryLight: {
          bg: "#C63C51", // Muted Coral
          text: "#8C3061", // Muted Purple
        },
        accentLight: {
          coral: "#C63C51",
          muted: "#8C3061",
        },
        borderLight: {
          light: "#D95F59", // Coral Borders
          heavy: "#8C3061", // Muted Purple Borders
        },
        placeholderLight: "#8C3061", // Placeholder text in light theme
      },
    },
  },
  plugins: [],
};
