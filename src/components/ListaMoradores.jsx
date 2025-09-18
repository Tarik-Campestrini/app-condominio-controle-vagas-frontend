import React, { useEffect, useState } from "react";
import api from "../service/api";
import ConfirmModal from "./ui/Modal/ConfirmModal";
import AlertaModal from "./ui/Modal/AlertaModal";

export default function ListaMoradores() {
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMorador, setSelectedMorador] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, message: "", type: "success" });

  // Buscar moradores ao carregar
  useEffect(() => {
    carregarMoradores();
  }, []);

  const carregarMoradores = async () => {
    try {
      const response = await api.get("/moradores");
      setMoradores(response.data);
    } catch (error) {
      console.error("Erro ao buscar moradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/moradores/${id}`);
      setAlerta({ open: true, message: "Morador removido com sucesso!", type: "success" });
      carregarMoradores();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlerta({ open: true, message: "Erro ao remover morador.", type: "error" });
    }
    setConfirmOpen(false);
  };

  if (loading) return <p>Carregando moradores...</p>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Apartamento</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {moradores.map((morador) => (
            <tr key={morador._id} className="border-t">
              <td className="p-2">{morador.nome}</td>
              <td className="p-2">{morador.apartamento}</td>
              <td className="p-2 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => console.log("Editar", morador)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setSelectedMorador(morador);
                    setConfirmOpen(true);
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmação */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete(selectedMorador?._id)}
        title="Excluir Morador"
        message={`Tem certeza que deseja excluir ${selectedMorador?.nome}?`}
      />

      {/* Modal de alerta */}
      <AlertaModal
        isOpen={alerta.open}
        onClose={() => setAlerta({ ...alerta, open: false })}
        type={alerta.type}
        message={alerta.message}
      />
    </div>
  );
}
