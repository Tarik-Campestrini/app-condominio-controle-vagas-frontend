import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    // Fundo da página
    <div className="min-h-screen bg-gray-50 font-sans dark:bg-gray-950">
      <Navbar />

      {/* A navegação foi movida para dentro da Navbar, então a removemos daqui */}

      {/* Área de conteúdo principal com o "cartão" branco flutuante */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <Outlet />
        </div>
      </main>
    </div>
  );
}