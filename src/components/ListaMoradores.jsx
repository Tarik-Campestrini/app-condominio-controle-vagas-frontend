import React, { useEffect, useState } from "react";
import api from "../service/api";
import ModalCadastro from "../components/ui/Modal/ModalCadastro"; 
import ModalConfirmacao from "../components/ui/Modal/ModalConfirmacao";
import Toast from "../components/ui/Toast"; 

export default function ListaMoradores() {
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controle do modal de Cadastro/Edição
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    bloco: "",
    apartamento: "",
  });

  // Estado para Notificações Toast e Modais
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Define os campos para o modal de Morador (para reutilização)
  const MORADOR_FIELDS = [
    { name: "nome", placeholder: "Nome", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "telefone", placeholder: "Telefone", type: "text" },
    { name: "bloco", placeholder: "Bloco", type: "text" },
    { name: "apartamento", placeholder: "Apartamento", type: "text" },
  ];

  // Buscar moradores
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

  // Abrir modal para criar
  const openCreateModal = () => {
    setEditing(null);
    setFormData({ nome: "", email: "", telefone: "", bloco: "", apartamento: "" });
    setShowModal(true);
  };

  // Abrir modal para editar
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

  // Salvar (criar/editar) - Função chamada pelo ModalCadastro
  const handleSave = async (e) => {
    e.preventDefault();
    const isEditing = !!editing;
    try {
      if (isEditing) {
        await api.put(`/moradores/${editing}`, formData);
      } else {
        await api.post("/moradores", formData);
      }
      fetchMoradores();
      setShowModal(false);
      
      const message = isEditing ? "Morador atualizado com sucesso!" : "Morador cadastrado com sucesso!";
      setToast({ message, type: "success" });
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setToast({ message: "E-mail do morador  já cadastrado.", type: "error" });
    }
  };

  // Abrir Modal de Confirmação (substitui window.confirm)
  const openConfirmDeleteModal = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };
  
  // Confirmação de Deleção (chamada pelo ModalConfirmacao)
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

  if (loading) return <p className="text-center py-10 text-gray-900 dark:text-gray-200">Carregando...</p>;

  return (
    // Fragmento (<>) permite retornar múltiplos elementos sem uma div wrapper
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-x-auto text-gray-900 dark:text-gray-200">
        
        {/* Cabeçalho (Botão e Título) */}
        <div className="grid grid-cols-3 items-center mb-6">
          <div className="col-span-1"></div> 
          
          {/* Título Centralizado */}
          <h2 className="text-3xl font-extrabold dark:text-white flex justify-center col-span-1">Gestão de Moradores</h2>
          
          {/* Botão Cadastrar (Alinhado à direita) */}
          <div className="flex justify-end col-span-1">
              <button
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Cadastrar
        </button>
          </div>
        </div>

        {/* Tabela de Moradores */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left border-collapse shadow rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">Bloco</th>
                <th className="p-3">Apartamento</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {moradores.map((morador, index) => (
                <tr 
                  key={morador._id} 
                  className={`border-b dark:border-gray-700 
                              ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                >
                  <td className="p-3">{morador.nome}</td>
                  <td className="p-3">{morador.email}</td>
                  <td className="p-3">{morador.telefone}</td>
                  <td className="p-3">{morador.bloco}</td>
                  <td className="p-3">{morador.apartamento}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(morador)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openConfirmDeleteModal(morador._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAIS (Renderizados dentro do container principal, mas flutuam com z-50) */}
        <ModalCadastro
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editing={editing}
          formData={formData}
          setFormData={setFormData}
          modalTitle={editing ? " Morador" : " Morador"}
          fields={MORADOR_FIELDS}
        />
        
        <ModalConfirmacao
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDelete}
          message="Deseja realmente deletar este morador?"
        />
        
      </div>
      
      {/* O TOAST É RENDERIZADO FORA DO CONTAINER PRINCIPAL PARA GARANTIR O FIXED */}
      <Toast toast={toast} setToast={setToast} />
      
    </>
  );
}
