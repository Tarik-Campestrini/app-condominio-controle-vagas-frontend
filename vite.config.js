import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Alterado para o plugin padrão

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // REMOVEMOS O PLUGIN tailwindcss() DAQUI
  ],

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "https://app-condominio-controle-vagas-backend.vercel.app/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});