/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rowdies: ['Rowdies', 'sans-serif'],
      },
      colors: {
        'dark-blue': '#091057',
        'medium-blue': '#024CAA',
        'orange-accent': '#EC8305',
        'light-gray': '#DBD3D3',
      },
    },
  },
  plugins: [],
};
