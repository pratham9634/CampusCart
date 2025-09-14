/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './page/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // blue-600
        secondary: '#2563EB', // blue-700
        accent: '#FBBF24', // amber-400
      },
    },
  },
  plugins: [],
};
