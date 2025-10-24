/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api'; 
// import { AuthContext } from '../../contexts/AuthContext'; // Descomente quando o context estiver pronto
import logo from '../../assets/logo.png';
import { Sun, Moon } from 'lucide-react'; 

// Função para verificar a preferência inicial do tema
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme === "dark";
  }
  // Se não houver tema salvo, verifica a preferência do sistema
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { login } = useContext(AuthContext); // Guardaremos para usar com o Context API

  
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

  // Função para alternar o tema
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError(''); // Limpa erros anteriores
    setLoading(true); // Ativa o estado de carregamento

    console.log("Enviando para login:", { email, senha: password }); // Log para depuração

    try {
      // Envia as credenciais para a API do backend
      const response = await api.post('/auth/login', { email, senha: password });
      const { token } = response.data; // Extrai o token da resposta

      if (token) {
        // --- SALVANDO O TOKEN E REDIRECIONANDO (VERSÃO SEM CONTEXT) ---
        localStorage.setItem('authToken', token); // Salva o token no localStorage
        console.log("Login bem-sucedido, token salvo!");

        // Limpa o formulário após o sucesso
        setEmail('');
        setPassword('');

        // Redireciona para a página principal (ex: /vagas)
        navigate('/vagas');
        // --- FIM DA VERSÃO SEM CONTEXT ---

        // login(token); // -> Linha a ser usada quando o AuthContext estiver pronto
      } else {
        // Caso a API retorne sucesso mas sem token (improvável, mas seguro verificar)
        setError('Falha no login. Token não recebido.');
      }
    } catch (err) {
      // Trata erros da API (ex: 401 Credenciais Inválidas)
      setError(err.response?.data?.message || 'Erro ao tentar fazer login. Verifique suas credenciais.');
      console.error("Erro de login:", err.response?.data || err.message);
    } finally {
      // Garante que o estado de carregamento seja desativado, com sucesso ou erro
      setLoading(false);
    }
  };

  return (
    // Container principal da página
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12">

      {/* Botão de Tema no canto superior direito */}
      <div className="absolute top-4 right-4 z-10">
        <label htmlFor="theme-switch-login" className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="theme-switch-login" className="sr-only peer" checked={darkMode} onChange={toggleTheme} />
          <div className="w-14 h-7 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 transition-colors duration-300"></div>
          <div className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white flex items-center justify-center peer-checked:translate-x-[28px] transition-all duration-300 ease-in-out">
            {darkMode ? <Moon size={16} className="text-blue-500" /> : <Sun size={16} className="text-orange-500" />}
          </div>
        </label>
      </div>

      {/* Card do formulário de login */}
      <div className="p-8 sm:p-10 max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Acesso ao Sistema
        </h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
              placeholder="********"
            />
          </div>

          {/* Exibição de Erro */}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm text-center pt-2">
              {error}
            </p>
          )}

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading} // Desabilita durante o carregamento
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center text-base ${loading ? 'opacity-50 cursor-not-allowed' : '' // Estilo quando desabilitado
              }`}
          >
            {loading ? ( // Mostra spinner se estiver carregando
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : ( // Mostra texto 'Entrar' se não estiver carregando
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}