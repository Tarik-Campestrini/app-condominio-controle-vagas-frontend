/* eslint-disable no-unused-vars */
import CardSkeleton from "../components/CardSkeleton";
import React, { useEffect, useState } from "react";
import EmptyState from "../components/ui/EmptyState"; // Importando
import { Car } from "lucide-react"; // Importando ícone
import api from "../service/api";
import ModalCadastro from "../components/ui/Modal/ModalCadastro";
import ModalConfirmacao from "../components/ui/Modal/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import CardVeiculo from "../components/CardVeiculo"; // Importando o novo Card

export default function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    cor: "",
    morador: "",
    ativo: true,
  });

  const [toast, setToast] = useState({ message: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Combina as chamadas de API 
  const fetchData = async () => {
    setLoading(true);
    try {
      const [veiculosRes, moradoresRes] = await Promise.all([
        api.get("/veiculos"),
        api.get("/moradores"),
      ]);
      setVeiculos(Array.isArray(veiculosRes.data) ? veiculosRes.data : []);
      setMoradores(Array.isArray(moradoresRes.data) ? moradoresRes.data : []);
    } catch (error) {
      setToast({ message: "Erro ao carregar dados.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    setFormData({
      placa: "",
      marca: "",
      modelo: "",
      cor: "",
      morador: "",
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
      ativo: veiculo.ativo,
    });
    setShowModal(true);
  };

  const handleSave = async (data) => {
    const isEditing = !!editing;
    try {
      if (isEditing) {
        await api.put(`/veiculos/${editing}`, data);
      } else {
        await api.post("/veiculos", data);
      }
      fetchData(); 
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
      fetchData(); 
      setToast({ message: "Veículo deletado com sucesso!", type: "success" });
    } catch (error) {
      setToast({ message: "Erro ao deletar veículo.", type: "error" });
    } finally {
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

  // Campos do formulário
  // Adiciona o campo "morador" como select
  // Popula as opções com os moradores carregados
  const VEICULO_FIELDS = [
    { name: "placa", placeholder: "Placa", required: true },
    { name: "marca", placeholder: "Marca", required: true },
    { name: "modelo", placeholder: "Modelo" },
    { name: "cor", placeholder: "Cor" },
    {
      name: "morador",
      placeholder: "Selecione o morador",
      type: "select",
      options: moradores.map((m) => ({
        value: m._id,
        label: `${m.nome} - Bloco ${m.bloco}, Apto ${m.apartamento}`,
      })),
      required: true,
    },
  ];

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
        {/* CABEÇALHO RESPONSIVO */}
        <div className="flex flex-col sm:relative sm:flex-row sm:justify-center items-center mb-6 gap-4 sm:h-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center">
            Gestão de Veículos
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

        {/* GRID DE CARDS RESPONSIVO */}
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {veiculos.length > 0 ? (
            veiculos.map((veiculo) => (
              <CardVeiculo
                key={veiculo._id}
                veiculo={veiculo}
                onEdit={openEditModal}
                onDelete={openConfirmDeleteModal}
              />
            ))
          ) : (
           
            <EmptyState
              icon={<Car size={24} className="text-gray-500 dark:text-gray-400" />}
              message="Nenhum veículo cadastrado"
              description="Comece cadastrando o primeiro veículo para vê-lo aqui."
            >
              <button
                onClick={openCreateModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cadastrar Veículo
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
        titulo={editing ? "Editar Veículo" : "Cadastrar Veículo"}
        campos={VEICULO_FIELDS}
        formData={formData}
        setFormData={setFormData}
      />
      <ModalConfirmacao
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        message="Deseja realmente deletar este veículo?"
      />
      <Toast toast={toast} setToast={setToast} />
    </>
  );
}