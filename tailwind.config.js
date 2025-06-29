/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
