/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Subtle blue background for chat area
        'chat-bg': '#f6fafd',
      },
      boxShadow: {
        // Soft shadow for bubbles/cards
        chat: '0 2px 16px 0 rgba(20, 50, 100, 0.07)',
      },
    },
  },
  plugins: [],
};
