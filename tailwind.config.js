module.exports = {
  content: ["./**/*.html", "./**/*.js"], // Scan all HTML & JS files
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [require('tailwind-scrollbar-hide')],
};

