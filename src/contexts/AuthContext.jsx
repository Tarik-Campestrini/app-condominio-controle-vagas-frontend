/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../service/api'; // Importamos a instância do Axios

// Cria o Contexto
export const AuthContext = createContext(null);

// Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para saber se ainda estamos verificando o token inicial
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar se o token JWT é válido (fazendo uma chamada à API)
  // Usamos useCallback para evitar recriações desnecessárias da função
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      // Adiciona o token temporariamente aos headers do Axios SÓ para esta chamada
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Faz uma chamada a um endpoint protegido e simples (crie um se não tiver)
      // Exemplo: GET /api/auth/validate-token (backend precisa retornar 200 OK se válido)
      // Se não tiver, pode tentar buscar dados do usuário: GET /api/users/me (ajuste a rota)
      await api.get('/auth/validate-token'); // <-- AJUSTE ESTA ROTA CONFORME SEU BACKEND

      // Se a chamada acima funcionou (não deu erro 401), o token é válido
      setIsAuthenticated(true);
      console.log("Token validado com sucesso.");

    } catch (error) {
      // Se deu erro (provavelmente 401), o token é inválido ou expirado
      console.warn("Falha na validação do token:", error.response?.data?.message || error.message);
      localStorage.removeItem('authToken'); // Remove o token inválido
      setIsAuthenticated(false);
      // Garante que o header default seja limpo se a validação falhar
      delete api.defaults.headers.common['Authorization'];
    } finally {
      // Marca que a verificação inicial terminou
      setIsLoading(false);
    }
  }, []); // useCallback com array de dependências vazio

  // Executa a validação do token quando o componente monta
  useEffect(() => {
    validateToken();
  }, [validateToken]); // validateToken está na dependência por causa do useCallback

  // Função para realizar o login
  const login = (token) => {
    localStorage.setItem('authToken', token);
    // Adiciona o token aos headers padrões do Axios para futuras requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  // Função para realizar o logout
  const logout = useCallback(() => { // Usando useCallback aqui também
    localStorage.removeItem('authToken');
    // Remove o token dos headers padrões do Axios
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    // Opcional: Redirecionar para login aqui ou deixar o ProtectedRoute cuidar disso
    // window.location.href = '/login';
  }, []); // Array de dependências vazio

  // Enquanto estiver verificando o token inicial, não renderiza o resto da app
  // Isso evita "piscar" a tela de login antes de saber se o usuário já está logado
  if (isLoading) {
    // Você pode mostrar um spinner/tela de carregamento global aqui se preferir
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Verificando autenticação...</p> {/* Ou um spinner */}
        </div>
    );
  }

  // Fornece o estado de autenticação e as funções para os componentes filhos
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- IMPORTANTE: Rota no Backend ---
// Você precisa criar uma rota simples no backend (ex: GET /api/auth/validate-token)
// que use o middleware 'protect' e apenas retorne um status 200 OK.
// Exemplo (no authRoutes.js do backend):
// router.get('/validate-token', protect, (req, res) => res.status(200).json({ valid: true, userId: req.userId }));