import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

// Função para verificar a preferência inicial do tema (continua a mesma)
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="relative border-b bg-white dark:bg-gray-900 shadow-md">
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 text-center py-3">
        Controle de Vagas
      </h1>

      {/* --- NOVO COMPONENTE TOGGLE SWITCH --- */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <label htmlFor="theme-switch" className="relative inline-flex items-center cursor-pointer">
          {/* Input invisível que controla o estado */}
          <input
            type="checkbox"
            id="theme-switch"
            className="sr-only peer"
            checked={darkMode}
            onChange={toggleTheme}
          />
          
          {/* O fundo do switch (a "trilha") */}
          <div
            className="w-14 h-7 rounded-full
                       bg-gradient-to-r from-amber-400 to-orange-500
                       peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600
                       transition-colors duration-300"
          ></div>

          {/* O círculo que desliza (o "thumb") */}
          <div
            className="absolute top-[2px] left-[2px] 
                       w-6 h-6 rounded-full 
                       bg-white
                       flex items-center justify-center
                       peer-checked:translate-x-[28px]
                       transition-all duration-300 ease-in-out"
          >
            {/* Ícone dentro do círculo */}
            {darkMode ? (
              <Moon size={16} className="text-blue-500" />
            ) : (
              <Sun size={16} className="text-orange-500" />
            )}
          </div>
        </label>
      </div>
    </header>
  );
}