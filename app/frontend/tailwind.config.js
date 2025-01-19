/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:{
          purple:'#4D46DD',
          red:'#dd4c46',
          white:"#ffffff",
          green:"#349b7c",
          yellow:"#d7dd46",
        }
      }
    },
  },
  plugins: [],
}