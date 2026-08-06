/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(15, 118, 110, 0.15), 0 18px 50px rgba(2, 6, 23, 0.22)',
      },
    },
  },
  plugins: [],
};