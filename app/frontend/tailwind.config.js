/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'caveat':['Caveat'],
        'comic-neue':['Comic Neue'],
        'poppins':['Poppins'],

      },
      colors:{
        primary:{
          purple:'#4D46DD',
          red:'#dd4c46',
          white:"#ffffff",
          green:"#349b7c",
          yellow:"#d7dd46",
        }
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'bounce-small': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      animation: {
        'bounce-small': 'bounce-small 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}