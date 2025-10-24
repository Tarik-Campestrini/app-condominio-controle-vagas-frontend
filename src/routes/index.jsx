import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas
import LoginPage from '../pages/Login'; // Página de Login (pública)
import DefaultLayout from '../layouts/DefaultLayout'; // Layout para páginas internas
import VagasPage from '../pages/Vagas'; // Página de Vagas (protegida)
import MoradoresPage from '../pages/Moradores'; // Página de Moradores (protegida)
import VeiculosPage from '../pages/Veiculos'; // Página de Veículos (protegida)
// import NotFoundPage from '../pages/NotFound'; // Opcional: Página 404

// Componente de Proteção
import ProtectedRoute from '../components/ProtectedRoute'; // 👈 1. Importar

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* 👇 2. Rotas Protegidas 👇 */}
        {/* O componente ProtectedRoute verifica a autenticação */}
        <Route element={<ProtectedRoute />}>
          {/* Todas as rotas DENTRO deste usarão o DefaultLayout */}
          <Route element={<DefaultLayout />}>
            {/* Páginas específicas que exigem login E usam o layout */}
            <Route path="/vagas" element={<VagasPage />} />
            <Route path="/moradores" element={<MoradoresPage />} />
            <Route path="/veiculos" element={<VeiculosPage />} />

            {/* Rota padrão (home) redireciona para /vagas se logado */}
            <Route path="/" element={<VagasPage />} />

            {/* Adicione outras rotas protegidas aqui se necessário */}
          </Route>
        </Route>

        {/* Rota para página não encontrada (Opcional) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}