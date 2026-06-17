/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0f4ff',100:'#e0e9ff',500:'#667eea',600:'#5a6fd6',700:'#4c5ec2',900:'#2d3a8c' },
        secondary: { 500:'#764ba2',600:'#6a3f96' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
