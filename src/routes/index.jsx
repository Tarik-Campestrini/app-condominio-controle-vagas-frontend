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

        <Route
          path="/"
          element={<LoginPage />}

        />

        <Route
          path="/"
          element={<MoradoresPage />}

        />
        
        <Route
          path="/vagas"
          element={
            <DefaultLayout>
              <VagasPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/veiculos"
          element={
            <DefaultLayout>
              <VeiculosPage />
            </DefaultLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
