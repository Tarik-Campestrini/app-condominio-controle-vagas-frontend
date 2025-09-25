import React from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Car } from "lucide-react";

export default function DefaultLayout({ children }) {
  const location = useLocation();

  const menuItems = [
    { path: "/vagas", label: "Vagas", icon: <Home size={18} /> },
    { path: "/moradores", label: "Moradores", icon: <Users size={18} /> },
    { path: "/veiculos", label: "Veículos", icon: <Car size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Menu de navegação */}
      <nav className="flex justify-center gap-6 bg-gray-100 dark:bg-gray-900 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow 
              transition-colors duration-200
              ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Conteúdo da página */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
