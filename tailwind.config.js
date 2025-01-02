/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#E9672B',
        'accent': 'rgba(0, 166, 153, 1)',
        'grey': 'rgba(64, 61, 57, 0.8)',
        
      },
    },
  },
  plugins: [
    
  ],
};
