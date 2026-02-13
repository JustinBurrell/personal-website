/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF9',
          100: '#F5F0EB',
          200: '#EDE7E0',
          300: '#DDD6CE',
          400: '#9C9590',
          500: '#6B6560',
          600: '#4A4540',
          700: '#332F2B',
          800: '#1A1714',
        },
        cinnabar: {
          50: '#FEF2F1',
          100: '#FDE3E0',
          200: '#FBC9C4',
          300: '#F7A199',
          400: '#E06B5E',
          500: '#C53D2F',
          600: '#A83225',
          700: '#8C291E',
          800: '#74231A',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
