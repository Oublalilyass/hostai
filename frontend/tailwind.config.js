/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb-inspired palette
        rausch: '#FF385C',       // Airbnb red-pink (primary)
        babu: '#00A699',         // Airbnb teal (secondary)
        ariel: '#FC642D',        // Airbnb orange
        hof: '#484848',          // Dark text
        foggy: '#767676',        // Gray text
        beach: '#F7F7F7',        // Light bg
        sand: '#EBEBEB',         // Border color
      },
      fontFamily: {
        sans: ['Circular', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.12)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.2)',
        'modal': '0 8px 40px rgba(0,0,0,0.24)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
