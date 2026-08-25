/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support dark mode swapping
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6ff',
          100: '#eaedff',
          200: '#d5daff',
          300: '#b0bbff',
          400: '#8291ff',
          500: '#4f5eff', // Vibrant indigo-blue brand color
          600: '#3841e6',
          700: '#2c31cc',
          800: '#2528a8',
          900: '#232687',
          950: '#141552',
        },
        slate: {
          850: '#1b2234',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(79, 94, 255, 0.15)',
        'glow-lg': '0 0 35px rgba(79, 94, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
