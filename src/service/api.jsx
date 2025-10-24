import axios from "axios";

// Acessa a variável de ambiente definida no .env
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Verifica se a variável de ambiente está definida
if (!baseURL) {
  // Loga um erro mais descritivo e lança o erro para parar a aplicação se a URL base for crucial
  console.error("Erro Crítico: A variável de ambiente VITE_API_BASE_URL não está definida no arquivo .env");
  throw new Error("VITE_API_BASE_URL não está definida. A aplicação não pode se comunicar com a API.");
}

// Cria uma instância do axios com a URL base
const api = axios.create({
  baseURL: baseURL,
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Adiciona o token JWT a cada requisição enviada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Busca o token salvo
    if (token) {
      // Adiciona o cabeçalho Authorization se o token existir
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Retorna a configuração (com ou sem o header)
  },
  (error) => {
    // Trata erros que podem ocorrer *antes* da requisição ser enviada
    console.error("Erro no interceptor de requisição do Axios:", error);
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA ---
// Trata respostas da API, especialmente erros 401 (Não Autorizado)
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida (status 2xx), apenas a retorna
    return response;
  },
  (error) => {
    // Se a API retornar um erro
    if (error.response && error.response.status === 401) {
      // Especificamente para erro 401 (token inválido, expirado ou ausente)
      console.warn("Erro 401 recebido (Não Autorizado). Redirecionando para login.");
      // 1. Remove o token inválido/expirado do localStorage
      localStorage.removeItem('authToken');
      // 2. Redireciona o usuário para a página de login
      //    Usar window.location força um reload completo, limpando qualquer estado
      if (window.location.pathname !== '/login') { // Evita redirecionamentos em loop se já estiver no login
           window.location.href = '/login';
      }
      // Poderia também chamar uma função global de logout aqui, se usar Context API
    }
    // Para qualquer outro erro, rejeita a promessa para que o .catch() no local da chamada possa tratá-lo
    return Promise.reject(error);
  }
);

export default api;