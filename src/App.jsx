import { useState, useEffect } from "react";
import AppRoutes from "./routes";
import { vagasIniciais, moradoresIniciais, carrosIniciais } from "./data/mockData";

function App() {
  const [vagas, setVagas] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simula o carregamento de dados
  useEffect(() => {
    const fetchDados = () => {
      setLoading(true);
      setTimeout(() => {
        setVagas(vagasIniciais);
        setMoradores(moradoresIniciais);
        setCarros(carrosIniciais);
        setLoading(false);
      }, 500);
    };
    fetchDados();
  }, []);

  // --- Funções de manipulação de estado ---
  const handleOcuparVaga = (id, ocupante, placa, modelo, cor, telefone) => setVagas(
    vagas.map((vaga) =>
      vaga.id === id ? { ...vaga, status: "ocupada", ocupante, placa, modelo, cor, telefone } : vaga
    )
  );

  const handleLiberarVaga = (id) => setVagas(
    vagas.map((vaga) =>
      vaga.id === id ? { ...vaga, status: "livre", ocupante: null, placa: null, modelo: null, cor: null, telefone: null } : vaga
    )
  );

  const handleAddMorador = (novoMorador) => setMoradores((prev) => {
    const novoId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) + 1 : 1;
    return [...prev, { id: novoId, ...novoMorador }];
  });

  const handleEditMorador = (moradorAtualizado) => setMoradores(
    moradores.map((morador) => (morador.id === moradorAtualizado.id ? moradorAtualizado : morador))
  );

  const handleRemoveMorador = (moradorId) => {
    if (window.confirm("Tem certeza que deseja remover este morador?")) {
      setMoradores(moradores.filter((morador) => morador.id !== moradorId));
    }
  };

  const handleAddCarro = (novoCarro) => setCarros((prev) => {
    const novoId = prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
    return [...prev, { id: novoId, ...novoCarro }];
  });

  const handleEditCarro = (carroAtualizado) => setCarros(
    carros.map((carro) => (carro.id === carroAtualizado.id ? carroAtualizado : carro))
  );

  const handleRemoveCarro = (carroId) => {
    if (window.confirm("Tem certeza que deseja remover este veículo?")) {
      setCarros(carros.filter((carro) => carro.id !== carroId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-gray-700 dark:text-gray-300">Carregando...</div>
      </div>
    );
  }

  return (
    <AppRoutes
      isLoggedIn={isLoggedIn}
      onLogin={() => setIsLoggedIn(true)}
      onLogout={() => setIsLoggedIn(false)}
      vagas={vagas}
      carros={carros}
      moradores={moradores}
      handleOcuparVaga={handleOcuparVaga}
      handleLiberarVaga={handleLiberarVaga}
      handleAddMorador={handleAddMorador}
      handleEditMorador={handleEditMorador}
      handleRemoveMorador={handleRemoveMorador}
      handleAddCarro={handleAddCarro}
      handleEditCarro={handleEditCarro}
      handleRemoveCarro={handleRemoveCarro}
    />
  );
}

export default App
