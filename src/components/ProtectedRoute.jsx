// src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Importa o contexto

const ProtectedRoute = () => {
  // Pega o estado de autenticação do contexto
  const { isAuthenticated } = useContext(AuthContext);
  // Pega a localização atual para redirecionar de volta após o login (opcional)
  const location = useLocation();

  // Se o usuário NÃO estiver autenticado...
  if (!isAuthenticated) {
    // Redireciona para a página de login.
    // 'replace' substitui a entrada atual no histórico (o usuário não volta para a página protegida ao clicar em "voltar")
    // 'state={{ from: location }}' guarda a página que o usuário tentou acessar,
    // para que a página de login possa redirecioná-lo de volta após o sucesso.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se o usuário ESTIVER autenticado...
  // Renderiza o componente filho da rota (ou o <Outlet /> se estiver usando layout aninhado).
  // <Outlet /> é um componente do react-router-dom que renderiza a rota filha correspondente.
  // Como seu DefaultLayout usa <Outlet />, esta é a abordagem correta.
  return <Outlet />;
};

export default ProtectedRoute;