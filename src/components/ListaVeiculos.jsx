/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../service/api";
import ModalCadastro from "../components/ui/Modal/ModalCadastro";
import ModalConfirmacao from "../components/ui/Modal/ModalConfirmacao";
import Toast from "../components/ui/Toast";

export default function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [moradores, setMoradores] = useState([]); // para popular select de morador
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    cor: "",
    morador: "",
    vaga: "",
    ativo: true,
  });

  const [toast, setToast] = useState({ message: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const VEICULO_FIELDS = [
  { name: "placa", placeholder: "Placa" },
  { name: "marca", placeholder: "Marca" },
  { name: "modelo", placeholder: "Modelo" },
  { name: "cor", placeholder: "Cor" },
  {
    name: "morador",
    placeholder: "Selecione o morador",
    type: "select",
    options: moradores.map((m) => ({
      value: m._id,
      label: `${m.nome}`
    }))
  }
];

  const fetchVeiculos = async () => {
    try {
      const res = await api.get("/veiculos");
      setVeiculos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setToast({ message: "Erro ao carregar veículos.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchMoradores = async () => {
    try {
      const res = await api.get("/moradores");
      setMoradores(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar moradores:", error);
    }
  };

  useEffect(() => {
    fetchVeiculos();
    fetchMoradores();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    setFormData({
      placa: "",
      marca: "",
      modelo: "",
      cor: "",
      morador: "",
      vaga: "",
      ativo: true,
    });
    setShowModal(true);
  };

  const openEditModal = (veiculo) => {
    setEditing(veiculo._id);
    setFormData({
      placa: veiculo.placa,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      cor: veiculo.cor,
      morador: veiculo.morador?._id || "",
      vaga: veiculo.vaga,
      ativo: veiculo.ativo,
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
      setToast({
        message: isEditing
          ? "Veículo atualizado com sucesso!"
          : "Veículo cadastrado com sucesso!",
        type: "success",
      });
    } catch (error) {
      setToast({ message: "Erro ao salvar veículo.", type: "error" });
    }
  };

  const openConfirmDeleteModal = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/veiculos/${itemToDelete}`);
      fetchVeiculos();
      setToast({ message: "Veículo deletado com sucesso!", type: "success" });
    } catch (error) {
      setToast({ message: "Erro ao deletar veículo.", type: "error" });
    } finally {
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-900 dark:text-gray-200">
        Carregando...
      </p>
    );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-x-auto text-gray-900 dark:text-gray-200">
        <div className="grid grid-cols-3 items-center mb-6">
          <div></div>
          <h2 className="text-3xl font-extrabold dark:text-white text-center">
            Gestão de Veículos
          </h2>
          <div className="flex justify-end">
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
                <th className="p-3">Placa</th>
                <th className="p-3">Marca</th>
                <th className="p-3">Modelo</th>
                <th className="p-3">Cor</th>
                <th className="p-3">Morador</th>
                <th className="p-3">Vaga</th>
                <th className="p-3">Ativo</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((v, i) => (
                <tr
                  key={v._id}
                  className={`border-b dark:border-gray-700 ${
                    i % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <td className="p-3">{v.placa}</td>
                  <td className="p-3">{v.marca}</td>
                  <td className="p-3">{v.modelo}</td>
                  <td className="p-3">{v.cor}</td>
                  <td className="p-3">{v.morador?.nome}</td>
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
