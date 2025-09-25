import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="relative border-b bg-white dark:bg-gray-900 shadow-md">
      {/* Nome centralizado */}
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 text-center py-3">
        Controle de Vagas
      </h1>

      {/* Botão Dark Mode no canto direito */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute right-3 top-3 p-2 rounded-md bg-gray-200 dark:bg-gray-700 left-3 bottom-6 top-3 p-2 rounded-md bg-gray-200 dark:bg-gray-700"
      >
        {darkMode ?  <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
}
