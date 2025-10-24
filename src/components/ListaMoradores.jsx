import CardSkeleton from "../components/CardSkeleton";
import React, { useEffect, useState } from "react";
import EmptyState from "../components/ui/EmptyState";
import { Users } from "lucide-react"; 
import api from "../service/api";
import ModalCadastro from "../components/ui/Modal/ModalCadastro";
import ModalConfirmacao from "../components/ui/Modal/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import CardMorador from "../components/CardMorador";


// ListaMoradores
export default function ListaMoradores() {
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    bloco: "",
    apartamento: "",
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const MORADOR_FIELDS = [
    { name: "nome", placeholder: "Nome", required: true },
    { name: "email", placeholder: "Email", type: "email", required: true },
    { name: "bloco", placeholder: "Bloco", required: true },
    { name: "apartamento", placeholder: "Apartamento", required: true },
    { name: "telefone", placeholder: "Telefone", required: true },
  ];

  // Função para buscar moradores
  const fetchMoradores = async () => {
    try {
      const res = await api.get("/moradores");
      setMoradores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erro ao buscar moradores:", error);
      setToast({ message: "Erro ao carregar lista.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoradores();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    setFormData({ nome: "", email: "", telefone: "", bloco: "", apartamento: "" });
    setShowModal(true);
  };

  // Função para abrir o modal de edição
  const openEditModal = (morador) => {
    setEditing(morador._id);
    setFormData({
      nome: morador.nome,
      email: morador.email,
      telefone: morador.telefone,
      bloco: morador.bloco,
      apartamento: morador.apartamento,
    });
    setShowModal(true);
  };

  // Função para salvar dados (criar ou editar)
  const handleSave = async (data) => {
    const isEditing = !!editing;
    try {
      if (isEditing) {
        await api.put(`/moradores/${editing}`, data);
      } else {
        await api.post("/moradores", data);
      }
      fetchMoradores();
      setShowModal(false);
      const message = isEditing ? "Morador atualizado com sucesso!" : "Morador cadastrado com sucesso!";
      setToast({ message, type: "success" });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setToast({ message: "E-mail do morador já cadastrado.", type: "error" });
    }
  };

  // Função para abrir o modal de confirmação de exclusão
  const openConfirmDeleteModal = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    const id = itemToDelete;
    setShowConfirmModal(false);
    setItemToDelete(null);
    try {
      await api.delete(`/moradores/${id}`);
      fetchMoradores();
      setToast({ message: "Morador deletado com sucesso!", type: "success" });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setToast({ message: "Erro ao deletar morador.", type: "error" });
    }
  };

  // Renderização do componente
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        {/* Cabeçalho estático enquanto carrega */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Gestão de Moradores
          </h2>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-24 rounded-lg animate-pulse"></div>
        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  
  return (
    <>
      <div className="p-4 sm:p-6">

        <div className="flex flex-col sm:relative sm:flex-row sm:justify-center items-center mb-6 gap-4 sm:h-10">


          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center">
            Gestão de Moradores
          </h2>


          <div className="w-full sm:w-auto sm:absolute sm:right-0">
            <button
              onClick={openCreateModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
            >
              Cadastrar
            </button>
          </div>
        </div>
        

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {moradores.length > 0 ? (
            moradores.map((morador) => (
              <CardMorador
                key={morador._id}
                morador={morador}
                onEdit={openEditModal}
                onDelete={openConfirmDeleteModal}
              />
            ))
          ) : (
            <EmptyState
              icon={<Users size={24} className="text-gray-500 dark:text-gray-400" />}
              message="Nenhum morador cadastrado"
              description="Comece cadastrando o primeiro morador para vê-lo aqui."
            >
              <button
                onClick={openCreateModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cadastrar Morador
              </button>
            </EmptyState>
          )}
        </div>
      </div>

      {/* MODAIS */}
      <ModalCadastro
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        titulo={editing ? "Editar Morador" : "Cadastrar Morador"}
        campos={MORADOR_FIELDS}
        formData={formData}
        setFormData={setFormData}
      />
      <ModalConfirmacao
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        message="Deseja realmente deletar este morador?"
      />
      <Toast toast={toast} setToast={setToast} />
    </>
  );
}