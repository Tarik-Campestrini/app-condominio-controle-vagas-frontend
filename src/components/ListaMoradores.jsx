import React, { useEffect, useState } from "react";
import api from "../service/api";

export default function ListaMoradores() {
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controle do modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    bloco: "",
    apartamento: "",
  });

  // Buscar moradores
  const fetchMoradores = async () => {
  try {
    const res = await api.get("/moradores");
    console.log("Resposta da API:", res.data); // 👀
    setMoradores(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error("Erro ao buscar moradores:", error);
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
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      bloco: "",
      apartamento: "",
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const openEditModal = (morador) => {
    setEditing(morador._id);
    setFormData(morador);
    setShowModal(true);
  };

  // Salvar (criar/editar)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/moradores/${editing}`, formData);
      } else {
        await api.post("/moradores", formData);
      }
      fetchMoradores();
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // Deletar
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar?")) return;
    try {
      await api.delete(`/moradores/${id}`);
      fetchMoradores();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  if (loading) return <p className="text-center py-10">Carregando...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestão de Moradores</h2>
        <button
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Cadastrar
        </button>
      </div>

      <div className="w-full lg:w-1/2 mx-auto overflow-x-auto">
  <table className="w-full text-left border-collapse shadow rounded-lg">
    <thead>
      <tr className="bg-blue-600 text-white">
        <th className="p-2">Nome</th>
        <th className="p-2">Email</th>
        <th className="p-2">Telefone</th>
        <th className="p-2">Bloco</th>
        <th className="p-2">Apartamento</th>
        <th className="p-2">Ações</th>
      </tr>
    </thead>
    <tbody>
      {moradores.map((morador) => (
        <tr key={morador._id} className="border-b dark:border-gray-700">
          <td className="p-2">{morador.nome}</td>
          <td className="p-2">{morador.email}</td>
          <td className="p-2">{morador.telefone}</td>
          <td className="p-2">{morador.bloco}</td>
          <td className="p-2">{morador.apartamento}</td>
          <td className="p-2 flex gap-2">
            <button
              onClick={() => openEditModal(morador)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(morador._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Deletar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editing ? "Editar Morador" : "Cadastrar Morador"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Bloco"
                value={formData.bloco}
                onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Apartamento"
                value={formData.apartamento}
                onChange={(e) => setFormData({ ...formData, apartamento: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
