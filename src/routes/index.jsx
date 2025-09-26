import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import MoradoresPage from "../pages/Moradores";
import VagasPage from "../pages/Vagas";
import VeiculosPage from "../pages/Veiculos";
import LoginPage from "../pages/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de login fora do layout */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas protegidas dentro do layout */}
        <Route element={<DefaultLayout />}>
          <Route path="/moradores" element={<MoradoresPage />} />
          <Route path="/vagas" element={<VagasPage />} />
          <Route path="/veiculos" element={<VeiculosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
