import React, { useEffect, useState } from "react";
import CardVaga from "./CardVaga";
import CardSkeleton from "../components/CardSkeleton";
import api from "../service/api";
import ModalOcuparVaga from "./ui/Modal/ModalOcuparVaga";
import ModalCadastro from "./ui/Modal/ModalCadastro"; // Import do ModalCadastro
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
  const [toast, setToast] = useState({ message: "", type: "" });

  // Estados Modal Ocupar
  const [modalOcuparAberto, setModalOcuparAberto] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  
  // Estados Modal Criar
  const [modalCriarVagaAberto, setModalCriarVagaAberto] = useState(false);
  const [formDataNovaVaga, setFormDataNovaVaga] = useState({ identificador: "" });

  // Estados Modal Confirmar LIBERAÇÃO
  const [showConfirmLiberarModal, setShowConfirmLiberarModal] = useState(false);
  const [itemParaLiberar, setItemParaLiberar] = useState(null);

  // ---> NOVOS ESTADOS para Modal Confirmar DELEÇÃO
  const [showConfirmDeletarModal, setShowConfirmDeletarModal] = useState(false);
  const [itemParaDeletar, setItemParaDeletar] = useState(null);

  const fetchData = async () => {
    setLoading(true); // Garante que o loading seja reativado a cada busca
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

  // --- Funções Modal Ocupar ---
  const handleAbrirModalOcupar = (vaga) => {
    setVagaSelecionada(vaga);
    setModalOcuparAberto(true);
  };
  const handleFecharModalOcupar = () => {
    setModalOcuparAberto(false);
    setVagaSelecionada(null);
  };
  const handleSalvarOcupacao = async (dadosDoFormulario) => {
    if (!vagaSelecionada) return;
    try {
      const response = await api.put(`/vagas/${vagaSelecionada._id}/ocupar`, dadosDoFormulario);
      handleFecharModalOcupar();
      await fetchData();
      setToast({ message: `Vaga ${vagaSelecionada.identificador} ocupada com sucesso!`, type: "success" });
      const notificationInfo = response.data?.notification;
      if (notificationInfo && notificationInfo.attempted && !notificationInfo.success) {
        setTimeout(() => {
          setToast({ message: `Alerta: Falha ao enviar notificação WhatsApp. (${notificationInfo.error || 'Erro desconhecido'})`, type: "error" });
        }, 700);
      }
    } catch (error) {
      console.error("Erro ao ocupar vaga:", error);
      setToast({ message: error.response?.data?.error || "Erro ao ocupar vaga.", type: "error" });
    }
  };

  // --- Funções Modal Criar Vaga ---
  const handleAbrirModalCriarVaga = () => {
    setFormDataNovaVaga({ identificador: "" });
    setModalCriarVagaAberto(true);
  };
  const handleSalvarNovaVaga = async (data) => {
    try {
      await api.post('/vagas', data);
      setToast({ message: "Vaga criada com sucesso!", type: "success" });
      setModalCriarVagaAberto(false);
      fetchData();
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      setToast({ message: error.response?.data?.message || "Erro ao criar vaga.", type: "error" });
    }
  };

  // --- Funções Modal Liberar Vaga ---
  const handleOpenConfirmLiberarModal = (id) => {
    setItemParaLiberar(id);
    setShowConfirmLiberarModal(true);
  };
  const handleConfirmarLiberar = async () => {
    if (!itemParaLiberar) return;
    try {
      await api.put(`/vagas/${itemParaLiberar}/liberar`);
      await fetchData();
      setToast({ message: "Vaga liberada com sucesso!", type: "success" });
    } catch (error) {
      console.error("Erro ao liberar vaga:", error);
      setToast({ message: "Erro ao liberar vaga.", type: "error" });
    } finally {
      setShowConfirmLiberarModal(false);
      setItemParaLiberar(null);
    }
  };

  // ---> NOVAS Funções para DELETAR Vaga ---
  const handleOpenConfirmDeletarModal = (id) => {
    setItemParaDeletar(id);
    setShowConfirmDeletarModal(true);
  };
  const handleConfirmarDeletar = async () => {
    if (!itemParaDeletar) return;
    try {
      await api.delete(`/vagas/${itemParaDeletar}`); // Chama o endpoint DELETE
      setToast({ message: "Vaga deletada com sucesso!", type: "success" });
      fetchData(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar vaga:", error);
      // Pega a mensagem de erro específica do backend (ex: "Não pode deletar vaga ocupada")
      setToast({ message: error.response?.data?.message || "Erro ao deletar vaga.", type: "error" });
    } finally {
      setShowConfirmDeletarModal(false);
      setItemParaDeletar(null);
    }
  };
  // --- FIM DAS NOVAS FUNÇÕES ---

  const vagasFiltradas = vagas.filter((vaga) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    const textosPesquisaveis = [vaga.identificador, vaga.status, vaga.morador?.nome, vaga.visitante?.nome, vaga.veiculo?.placa];
    return textosPesquisaveis.filter((texto) => texto != null).some((texto) => texto.toLowerCase().includes(termo));
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        {/* Cabeçalho do Skeleton */}
        <div className="flex flex-col sm:relative sm:flex-row sm:justify-center items-center mb-6 gap-4 sm:h-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center">Gestão de Vagas</h1>
          <div className="w-full sm:w-auto sm:absolute sm:right-0">
            <div className="bg-gray-200 dark:bg-gray-700 h-10 w-28 rounded-lg animate-pulse"></div>
          </div>
        </div>
        {/* Barra de Busca Skeleton */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        {/* Grid de Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cabeçalho Real */}
      <div className="flex flex-col sm:relative sm:flex-row sm:justify-center items-center mb-6 gap-4 sm:h-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center">Gestão de Vagas</h1>
        <div className="w-full sm:w-auto sm:absolute sm:right-0">
          <button
            onClick={handleAbrirModalCriarVaga}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
          >
            Criar Vaga
          </button>
        </div>
      </div>

      {/* Barra de Busca Real */}
      <div className="max-w-5xl mx-auto mb-6">
        <input type="text" placeholder="Pesquisar por vaga, ocupante, placa..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full p-3 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white" />
      </div>

      {/* Grid de Cards Real */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vagas.length === 0 ? (
          <EmptyState icon={<ParkingCircle size={24} className="text-gray-500" />} message="Nenhuma vaga configurada" description="Clique em 'Criar Vaga' para adicionar a primeira." />
        ) : vagasFiltradas.length > 0 ? (
          vagasFiltradas.map((vaga) => (
            <CardVaga
              key={vaga._id}
              vaga={vaga}
              onOcupar={handleAbrirModalOcupar}
              onLiberar={handleOpenConfirmLiberarModal}
              onDelete={handleOpenConfirmDeletarModal} // ---> Passando a nova prop
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Nenhuma vaga encontrada para sua busca.</p>
        )}
      </div>

      {/* Modais */}
      {modalCriarVagaAberto && (
        <ModalCadastro
          isOpen={modalCriarVagaAberto}
          onClose={() => setModalCriarVagaAberto(false)}
          onSave={handleSalvarNovaVaga}
          titulo="Criar Nova Vaga"
          campos={[{ name: 'identificador', placeholder: 'Identificador (ex: A01)', required: true }]}
          formData={formDataNovaVaga}
          setFormData={setFormDataNovaVaga}
        />
      )}
      {modalOcuparAberto && vagaSelecionada && (
        <ModalOcuparVaga
          titulo={`Ocupar Vaga ${vagaSelecionada.identificador}`}
          onClose={handleFecharModalOcupar}
          onSave={handleSalvarOcupacao}
          moradores={moradores}
          veiculos={veiculos}
        />
      )}
      <ModalConfirmacao
        isOpen={showConfirmLiberarModal}
        onClose={() => setShowConfirmLiberarModal(false)}
        onConfirm={handleConfirmarLiberar}
        message="Tem certeza que deseja LIBERAR esta vaga?"
      />

      {/* ---> NOVO MODAL DE CONFIRMAÇÃO PARA DELETAR <--- */}
      <ModalConfirmacao
        isOpen={showConfirmDeletarModal}
        onClose={() => setShowConfirmDeletarModal(false)}
        onConfirm={handleConfirmarDeletar}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja DELETAR esta vaga? Esta ação é permanente."
      />

      <Toast toast={toast} setToast={setToast} />
    </>
  );
}