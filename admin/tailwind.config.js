/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#FBF7F0',
          100: '#F3E8D7',
          200: '#E4CCAE',
          300: '#D2AC82',
          400: '#BE8C5B',
          500: '#A66A32',
          600: '#895123',
          700: '#75451F',
          800: '#542E13',
          900: '#3A1E0B',
          950: '#231105',
        },
        sacred: {
          gold: '#E7C65A',
          cream: '#FFF5D0',
          sage: '#D8E8A0',
          parchment: '#F3D9A0',
          teal: '#168FA8',
          dark: '#1C0F06'
        }
      },
      fontFamily: {
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
