import { useState } from "react";

export default function ModalCadastro({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    bloco: "",
    apartamento: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Cadastrar Morador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="text"
            name="bloco"
            placeholder="Bloco"
            value={form.bloco}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="text"
            name="apartamento"
            placeholder="Apartamento"
            value={form.apartamento}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            required
          />

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
