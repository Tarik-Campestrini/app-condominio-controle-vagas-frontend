import React from 'react'; 
import { useState, useContext, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../service/api'; 
import { AuthContext } from '../../contexts/AuthContext'; 
import logoLight from '../../assets/logo-light.png'; 
import logoDark from '../../assets/logo-dark.png'; 
import { Sun, Moon } from 'lucide-react';

// --- LÓGICA DO TEMA REFINADA ---
// Função síncrona para determinar o estado inicial do tema
const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme !== null) {
    return savedTheme === "dark";
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false; // Fallback para modo claro
};
// --- FIM DA LÓGICA DO TEMA ---

export default function LoginPage() {
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks de navegação e contexto
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Estado do tema, inicializado pela função síncrona
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Efeito para aplicar classe e salvar tema quando o estado 'darkMode' muda
  useEffect(() => {
    // console.log("Aplicando tema:", darkMode ? "dark" : "light"); // Log para depuração
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Função para alternar o tema manualmente
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log("Enviando para login:", { email, senha: password });

    try {
      const response = await api.post('/auth/login', { email, senha: password });
      const { token } = response.data;

      if (token) {
        console.log("Login API OK, chamando context.login()...");
        login(token); // Chama a função do Contexto

        console.log("Redirecionando após login...");
        const from = location.state?.from?.pathname || "/vagas"; // Redirecionamento inteligente
        navigate(from, { replace: true });

      } else {
        setError('Falha no login. Token não recebido.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao tentar fazer login.');
      console.error("Erro de login:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Renderização do componente
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12">

      {/* Botão de Tema */}
      <div className="absolute top-4 right-4 z-10">
        <label htmlFor="theme-switch-login" className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="theme-switch-login" className="sr-only peer" checked={!!darkMode} onChange={toggleTheme} />
          <div className="w-14 h-7 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 transition-colors duration-300"></div>
          <div className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white flex items-center justify-center peer-checked:translate-x-[28px] transition-all duration-300 ease-in-out">
            {darkMode ? <Moon size={16} className="text-blue-500" /> : <Sun size={16} className="text-orange-500" />}
          </div>
        </label>
      </div>

      {/* Card do formulário */}
      <div className="p-8 sm:p-10 max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

        {/* Logo Dinâmica */}
        <div className="flex justify-center mb-6">
          <img
            src={darkMode ? logoDark :  logoLight} // Escolhe a logo baseada no tema
            alt="Logo"
            className="h-12 w-auto" // Ajuste a altura conforme necessário
          />
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
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center text-base ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}