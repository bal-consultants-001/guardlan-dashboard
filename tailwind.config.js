/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust if you're not using /src
  ],
  theme: {
    extend: {
      colors: {
        balblue1: '#2860bf', // or your desired hex
      },
    },
  },
  plugins: [],
}
