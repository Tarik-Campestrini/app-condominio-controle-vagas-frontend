import axios from "axios";

// Acessa a variável de ambiente definida no .env
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Verifica se a variável de ambiente está definida
if (!baseURL) {

  // Lança um erro se a variável não estiver definida
  throw new Error("VITE_API_BASE_URL não está definida");
}

// Cria uma instância do axios com a URL base
const api = axios.create({
  baseURL: baseURL,
});

export default api;

