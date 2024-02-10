/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./theme.config.tsx",
    "./pages/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 12s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(125px, -120px) scale(1.2)",
          },
          "66%": {
            transform: "translate(-90px, 70px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      dropShadow: {
        "6xl": [
          "0 0px 15px  rgb(37 38 39 / 20%)",
          "0 0px 20px rgb(37 38 39 / 30%)",
          "0 0px 28px rgb(37 38 39 / 30%)",
          "0 0px 33px rgb(37 38 39 / 40%)",
          "0 0px 80px rgb(37 38 39 / 40%)",
          "0 0px 90px rgb(37 38 39 / 50%)",
        ],
      },
    },
  },
  plugins: [],
}
