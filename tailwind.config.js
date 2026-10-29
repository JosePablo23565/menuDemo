/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#1C3F32',
            dark: '#142E25',
            light: '#285443',
          },
          yellow: {
            DEFAULT: '#FDE047',
            light: '#FEF08A',
            badge: '#FEE575',
            cream: '#E9F1AC',
          },
          dark: '#18181B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
