// ListaVagas.jsx

import React, { useEffect, useState } from "react";
import CardVaga from "./CardVaga";
import CardSkeleton from "../components/CardSkeleton";
import api from "../service/api";
import ModalOcuparVaga from "./ui/Modal/ModalOcuparVaga"; // Importando o modal correto
import ModalConfirmacao from "./ui/Modal/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import EmptyState from "../components/ui/EmptyState";
import { ParkingCircle } from "lucide-react";

export default function ListarVagas() {
  const [vagas, setVagas] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalOcuparAberto, setModalOcuparAberto] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemParaLiberar, setItemParaLiberar] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const fetchData = async () => {
    try {
      const [vagasRes, moradoresRes, veiculosRes] = await Promise.all([
        api.get("/vagas"),
        api.get("/moradores"),
        api.get("/veiculos"),
      ]);
      setVagas(Array.isArray(vagasRes.data) ? vagasRes.data : []);
      setMoradores(Array.isArray(moradoresRes.data) ? moradoresRes.data : []);
      setVeiculos(Array.isArray(veiculosRes.data) ? veiculosRes.data : []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setToast({ message: "Erro ao carregar dados do sistema.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAbrirModalOcupar = (vaga) => {
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
      await fetchData();
      setToast({ message: `Vaga ${vagaSelecionada.identificador} ocupada com sucesso!`, type: "success" });
    } catch (error) {
      console.error("Erro ao ocupar vaga:", error);
      setToast({ message: "Erro ao ocupar vaga.", type: "error" });
    }
  };

  const handleOpenConfirmModal = (id) => {
    setItemParaLiberar(id);
    setShowConfirmModal(true);
  };

  const handleConfirmarLiberacao = async () => {
    if (!itemParaLiberar) return;
    try {
      await api.put(`/vagas/${itemParaLiberar}/liberar`);
      await fetchData();
      setToast({ message: "Vaga liberada com sucesso!", type: "success" });
    } catch (error) {
      console.error("Erro ao liberar vaga:", error);
      setToast({ message: "Erro ao liberar vaga.", type: "error" });
    } finally {
      setShowConfirmModal(false);
      setItemParaLiberar(null);
    }
  };

  const vagasFiltradas = vagas.filter((vaga) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    const textosPesquisaveis = [vaga.identificador, vaga.status, vaga.morador?.nome, vaga.visitante?.nome, vaga.veiculo?.placa];
    return textosPesquisaveis.filter((texto) => texto != null).some((texto) => texto.toLowerCase().includes(termo));
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Vagas</h1>
        <div className="max-w-5xl mx-auto mb-6">
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Vagas</h1>
      <div className="max-w-5xl mx-auto mb-6">
        <input type="text" placeholder="Pesquisar por vaga, ocupante, placa..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full p-3 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vagas.length === 0 ? <EmptyState icon={<ParkingCircle size={24} className="text-gray-500" />} message="Nenhuma vaga configurada" description="Não há vagas cadastradas no sistema no momento." /> : vagasFiltradas.length > 0 ? vagasFiltradas.map((vaga) => <CardVaga key={vaga._id} vaga={vaga} onOcupar={handleAbrirModalOcupar} onLiberar={handleOpenConfirmModal} />) : <p className="text-center text-gray-500 col-span-full">Nenhuma vaga encontrada para sua busca.</p>}
      </div>
      {modalOcuparAberto && vagaSelecionada && <ModalOcuparVaga titulo={`Ocupar Vaga ${vagaSelecionada.identificador}`} onClose={handleFecharModal} onSave={handleSalvarOcupacao} moradores={moradores} veiculos={veiculos} />}
      <ModalConfirmacao isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleConfirmarLiberacao} message="Tem certeza que deseja liberar esta vaga?" />
      <Toast toast={toast} setToast={setToast} />
    </>
  );
}