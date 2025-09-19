/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ee4422',
        secondary: '#4f9cff',
        accent: '#7ad0ff',
        success: '#2fbf71',
        warning: '#ffb020',
        danger: '#ff5a6f',
      },
      fontFamily: {
        'child': ['Comic Neue', 'cursive', 'system-ui'],
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}