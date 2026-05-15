/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#07090D',
          900: '#0D1015',
          800: '#11141A',
          700: '#161A20',
        },
        ivory: {
          50: '#F7F5F2',
          100: '#F1EEE8',
          200: '#EAE6DF',
          300: '#D9D2C7',
        },
        champagne: {
          DEFAULT: '#D4C4B7',
          light: '#E5DED8',
        }
      },
      borderRadius: {
        '3xl': '20px',
        '4xl': '24px',
        '5xl': '32px',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'General Sans', 'sans-serif'],
      },
      animation: {
        'breath': 'breath 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.05)', opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
        'premium-dark': '0 30px 60px -20px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
