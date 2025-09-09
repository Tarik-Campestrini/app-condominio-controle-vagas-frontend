import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Vagas from "../pages/Vagas";
import Moradores from "../pages/Moradores";
import Veiculos from "../pages/Veiculos";
import DefaultLayout from "../layouts/DefaultLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login sem navbar */}
        <Route path="/login" element={<Login />} />

        {/* Páginas com layout padrão */}
        <Route element={<DefaultLayout />}>
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/moradores" element={<Moradores />} />
          <Route path="/veiculos" element={<Veiculos />} />
        </Route>

        {/* Redirecionar raiz para login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Página não encontrada */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
