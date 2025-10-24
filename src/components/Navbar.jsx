import React from "react";
import { Sun, Moon, Home, Users, Car } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from '../assets/logo.png'; 

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(getInitialTheme);
  const location = useLocation();

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

  const menuItems = [
    { path: "/vagas", label: "Vagas", icon: <Home size={16} /> },
    { path: "/moradores", label: "Moradores", icon: <Users size={16} /> },
    { path: "/veiculos", label: "Veículos", icon: <Car size={16} /> },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

          {/* --- ÁREA : Logo  --- */}
          <div className="flex-shrink-0">
            <Link to="/vagas" className="flex items-center gap-3">
              <img
                className="h-20 w-auto" 
                src={logo}
                alt="Logo"
              />
              
            </Link>
          </div>

          {/* Navegação de Abas no Centro */}
          <nav className="hidden sm:flex sm:justify-center sm:w-full">
            <div className="flex space-x-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                      transition-colors duration-200
                      ${
                        isActive
                          ? "text-indigo-600 dark:text-white border-b-2 border-indigo-500"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Botão de Tema à Direita */}
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="theme-switch" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="theme-switch" className="sr-only peer" checked={darkMode} onChange={toggleTheme} />
              <div className="w-14 h-7 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 transition-colors duration-300"></div>
              <div className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white flex items-center justify-center peer-checked:translate-x-[28px] transition-all duration-300 ease-in-out">
                {darkMode ? <Moon size={16} className="text-blue-500" /> : <Sun size={16} className="text-orange-500" />}
              </div>
            </label>
          </div>

        </div>
      </div>
       {/* Navegação Mobile */}
       <nav className="sm:hidden bg-gray-50 dark:bg-gray-800 py-2">
            <div className="flex justify-center space-x-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
    </header>
  );
}