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
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
      },
      keyframes: {
        orbit: {
            "0%": {
                transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
            },
            "100%": {
                transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
            },
        },
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
    },
  },
  plugins: [],
}
