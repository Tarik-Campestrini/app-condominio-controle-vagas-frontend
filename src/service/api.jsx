import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api", // API backend local
  baseURL: "https://app-condominio-controle-vagas-backe.vercel.app/api", // API backend deployada
});

export default api;

