module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:      "#F07878",
          "primary-dark":  "#C95050",
          "primary-light": "#FDEAEA",
          dark:         "#1A1A1A",
          gray:         "#6B7280",
          border:       "#E5E7EB",
          bg:           "#F9FAFB",
          white:        "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
