import axios from "axios";

const api = axios.create({
  baseURL: "https://app-condominio-controle-vagas-backe.vercel.app/api/", // API backend
});

export default api;

