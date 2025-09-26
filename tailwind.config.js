import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // 👈 ADICIONANDO A FAMÍLIA DE FONTES POPPINS
      fontFamily: {
        // 'Poppins' será a primeira opção, seguida pela família padrão sans-serif do sistema
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [forms],
};