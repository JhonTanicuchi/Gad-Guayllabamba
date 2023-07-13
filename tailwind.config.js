/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        20: "repeat(20, minmax(0, 1fr))",
      },
      colors: {
        'card': '#021D09',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1B4D2E",
          "primary-focus": "#0C9707",
          neutral: "#535a66",
          "neutral-content": "#ebecf0",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
