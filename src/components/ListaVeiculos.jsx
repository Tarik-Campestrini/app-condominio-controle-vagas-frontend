import React, { useEffect, useState } from "react";
import api from "../service/api";
import ModalCadastro from "./ui/Modal/ModalCadastro"; 
import ModalConfirmacao from "./ui/Modal/ModalConfirmacao";
import Toast from "./ui/Toast"; 

export default function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    placa: "",
    cor: "",
    moradorId: "",
    vaga: "",
    ativo: true,
  });

  const [toast, setToast] = useState({ message: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Campos para o modal de Veículo
  const VEICULO_FIELDS = [
    { name: "marca", placeholder: "Marca", type: "text" },
    { name: "modelo", placeholder: "Modelo", type: "text" },
    { name: "placa", placeholder: "Placa", type: "text" },
    { name: "cor", placeholder: "Cor", type: "text" },
    { name: "moradorId", placeholder: "Morador", type: "select", options: moradores.map(m => ({ value: m._id, label: m.nome })) },
    { name: "vaga", placeholder: "Vaga", type: "text" },
    { name: "ativo", placeholder: "Ativo", type: "checkbox" },
  ];

  // Buscar veículos
  const fetchVeiculos = async () => {
    try {
      const res = await api.get("/veiculos");
      setVeiculos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      setToast({ message: "Erro ao carregar lista.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Buscar moradores para dropdown
  const fetchMoradores = async () => {
    try {
      const res = await api.get("/moradores");
      setMoradores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erro ao buscar moradores:", error);
    }
  };

  useEffect(() => {
    fetchMoradores();
    fetchVeiculos();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    setFormData({ marca: "", modelo: "", placa: "", cor: "", moradorId: "", vaga: "", ativo: true });
    setShowModal(true);
  };

  const openEditModal = (v) => {
    setEditing(v._id);
    setFormData({ 
      marca: v.marca,
      modelo: v.modelo,
      placa: v.placa,
      cor: v.cor,
      moradorId: v.morador?._id || "",
      vaga: v.vaga,
      ativo: v.ativo,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isEditing = !!editing;
    try {
      if (isEditing) {
        await api.put(`/veiculos/${editing}`, formData);
      } else {
        await api.post("/veiculos", formData);
      }
      fetchVeiculos();
      setShowModal(false);
      setToast({ message: isEditing ? "Veículo atualizado!" : "Veículo cadastrado!", type: "success" });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setToast({ message: "Erro ao salvar veículo.", type: "error" });
    }
  };

  const openConfirmDeleteModal = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    const id = itemToDelete;
    setShowConfirmModal(false);
    setItemToDelete(null); 
    try {
      await api.delete(`/veiculos/${id}`);
      fetchVeiculos();
      setToast({ message: "Veículo deletado!", type: "success" });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setToast({ message: "Erro ao deletar veículo.", type: "error" });
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-900 dark:text-gray-200">Carregando...</p>;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-x-auto text-gray-900 dark:text-gray-200">
        <div className="grid grid-cols-3 items-center mb-6">
          <div className="col-span-1"></div> 
          <h2 className="text-3xl font-extrabold dark:text-white flex justify-center col-span-1">Gestão de Veículos</h2>
          <div className="flex justify-end col-span-1">
            <button
              onClick={openCreateModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cadastrar
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left border-collapse shadow rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Marca</th>
                <th className="p-3">Modelo</th>
                <th className="p-3">Placa</th>
                <th className="p-3">Cor</th>
                <th className="p-3">Morador</th>
                <th className="p-3">Vaga</th>
                <th className="p-3">Ativo</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((v, index) => (
                <tr 
                  key={v._id} 
                  className={`border-b dark:border-gray-700 
                              ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                >
                  <td className="p-3">{v.marca}</td>
                  <td className="p-3">{v.modelo}</td>
                  <td className="p-3">{v.placa}</td>
                  <td className="p-3">{v.cor}</td>
                  <td className="p-3">{v.morador?.nome || "-"}</td>
                  <td className="p-3">{v.vaga}</td>
                  <td className="p-3">{v.ativo ? "Sim" : "Não"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(v)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openConfirmDeleteModal(v._id)}
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

        <ModalCadastro
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editing={editing}
          formData={formData}
          setFormData={setFormData}
          modalTitle={editing ? "Veículo" : "Veículo"}
          fields={VEICULO_FIELDS}
        />
        
        <ModalConfirmacao
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDelete}
          message="Deseja realmente deletar este veículo?"
        />
      </div>
      
      <Toast toast={toast} setToast={setToast} />
    </>
  );
}
