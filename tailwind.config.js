/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        round: ['Varela Round', 'sans-serif'],
      },
      colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#ffe66d',
        surface: '#ffffff',
        background: '#f7f9fc',
      },
      boxShadow: {
        'comic': '4px 4px 0px 0px rgba(0,0,0,0.15)',
      }
    }
  },
  plugins: [],
}
