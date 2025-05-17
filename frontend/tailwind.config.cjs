// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F5F7FA',
          surface: '#FFFFFF',
          sidebar: '#1E293B',
          text: {
            primary: '#1E293B',
            secondary: '#64748B'
          },
          border: '#E0E0E0'
        },
        dark: {
          background: '#121212',
          surface: '#1E1E1E',
          sidebar: '#111827',
          text: {
            primary: '#E0E0E0',
            secondary: '#A0A0A0'
          },
          border: '#333333'
        }
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark']
    }
  },
  plugins: [],
}