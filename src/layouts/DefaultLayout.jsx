import React, { useState, useEffect } from "react";
import { Moon, Sun, Users, Car, Home } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const getButtonClass = (isActive, baseColor) =>
    `flex items-center justify-center px-4 py-2 rounded-lg text-white transition-all duration-300 ${
      isActive
        ? `bg-${baseColor}-700 shadow-lg`
        : `bg-${baseColor}-600 hover:bg-${baseColor}-500 hover:shadow-md`
    }`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Navbar simplificada */}
      <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow-md transition-colors duration-500">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-500">
          Controle de Vagas
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:scale-105"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Conteúdo centralizado */}
      <main className="p-6 flex flex-col items-center transition-colors duration-500">
        <div className="w-full max-w-md">

          {/* Botões de navegação entre páginas */}
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-2">
            <NavLink
              to="/vagas"
              className={({ isActive }) => getButtonClass(isActive, "blue")}
            >
              <Home className="mr-2" size={18} /> Vagas
            </NavLink>
            <NavLink
              to="/moradores"
              className={({ isActive }) => getButtonClass(isActive, "blue")}
            >
              <Users className="mr-2" size={18} /> Moradores
            </NavLink>
            <NavLink
              to="/veiculos"
              className={({ isActive }) => getButtonClass(isActive, "blue")}
            >
              <Car className="mr-2" size={18} /> Veículos
            </NavLink>
          </div>

          {/* Conteúdo da página */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
