import React, { useEffect, useState } from "react";
import CardVaga from "./CardVaga";
import api from "../service/api";
import ModalCadastro from "./ui/Modal/ModalCadastro"; // Verifique se o caminho para seu modal está correto

export default function ListarVagas() {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOcuparAberto, setModalOcuparAberto] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  const buscarVagas = async () => {
    try {
      const response = await api.get("/vagas");
      // 👇 A LINHA ESSENCIAL QUE ESTAVA FALTANDO 👇
      setVagas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
      // 👇 GARANTE QUE O ESTADO SEJA UM ARRAY VAZIO EM CASO DE ERRO 👇
      setVagas([]);
    }
  };

  useEffect(() => {
    buscarVagas();
  }, []);

  const handleAbrirModalOcupar = (vaga) => {
  
  console.log("Botão 'Ocupar Vaga' clicado! Tentando abrir o modal para a vaga:", vaga);

  setVagaSelecionada(vaga);
  setModalOcuparAberto(true);
};

  const handleFecharModal = () => {
    setModalOcuparAberto(false);
    setVagaSelecionada(null);
  };

  const handleSalvarOcupacao = async (dadosDoFormulario) => {
    if (!vagaSelecionada) return;
    try {
      await api.put(`/vagas/${vagaSelecionada._id}/ocupar`, dadosDoFormulario);
      handleFecharModal();
      await buscarVagas();
    } catch (error) {
      console.error("Erro ao ocupar vaga:", error);
    }
  };

  const liberarVaga = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja liberar esta vaga?");
    if (!confirmar) return;
    try {
      await api.put(`/vagas/${id}/liberar`);
      await buscarVagas();
    } catch (error) {
      console.error("Erro ao liberar vaga:", error);
    }
  };

  const vagasFiltradas = vagas.filter((vaga) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    const textosPesquisaveis = [
      vaga.identificador,
      vaga.status,
      vaga.morador?.nome,
      vaga.visitante?.nome,
      vaga.veiculo?.placa,
    ];
    return textosPesquisaveis
      .filter(texto => texto != null)
      .some(texto => texto.toLowerCase().includes(termo));
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Vagas
      </h1>

      <div className="max-w-5xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Pesquisar por vaga, ocupante, placa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-3 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vagasFiltradas.length > 0 ? (
          vagasFiltradas.map((vaga) => (
            <CardVaga
              key={vaga._id}
              vaga={vaga}
              onOcupar={handleAbrirModalOcupar}
              onLiberar={liberarVaga}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            Nenhuma vaga encontrada.
          </p>
        )}
      </div>

      {modalOcuparAberto && vagaSelecionada && (
        <ModalCadastro
          titulo={`Ocupar Vaga ${vagaSelecionada.identificador}`}
          onClose={handleFecharModal}
          onSave={handleSalvarOcupacao}
          camposDoFormulario={[
             { nome: 'ocupante', label: 'Apartamento ou Nome do Visitante', tipo: 'text' },
             { nome: 'placa', label: 'Placa do Veículo (ABC-1234)', tipo: 'text' },
             { nome: 'modelo', label: 'Modelo do Veículo', tipo: 'text' },
             { nome: 'cor', label: 'Cor do Veículo', tipo: 'text' },
             { nome: 'telefone', label: 'Telefone (Opcional)', tipo: 'text' },
          ]}
        />
      )}
    </>
  );
}