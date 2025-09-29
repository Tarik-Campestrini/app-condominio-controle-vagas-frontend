import React from "react";

/**
 * Componente ModalCadastro (Reutilizável para Moradores, Veículos, Vagas, etc.)
 * @param {boolean} isOpen - Controla a visibilidade do modal.
 * @param {function} onClose - Função para fechar o modal.
 * @param {function} onSave - Função de callback para salvar os dados.
 * @param {string} editing - O ID do item em edição (ou null).
 * @param {object} formData - O objeto de estado com os dados do formulário.
 * @param {function} setFormData - Função para atualizar o estado do formData.
 * @param {string} modalTitle - Título principal do modal (Ex: "Cadastrar Morador").
 * @param {array} fields - Array com a definição dos campos [{ name, placeholder, type, options }].
 */
export default function ModalCadastro({
  isOpen,
  onClose,
  onSave,
  editing,
  formData,
  setFormData,
  modalTitle,
  fields,
}) {
  if (!isOpen) return null;

  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(e);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 backdrop-blur-sm bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-white">
          {editing ? `Editar ${modalTitle}` : `Cadastrar ${modalTitle}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) =>
            field.type === "select" ? (
              <select
                key={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg 
                           text-gray-900 focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required={field.required !== false}
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg 
                           text-gray-900 focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required={field.required !== false}
              />
            )
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition text-white"
              style={{
                backgroundColor: isDarkMode ? "#DC2626" : "#EF4444", // red
                color: isDarkMode ? "#FFFFFF" : "#1F2937",
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg transition text-white"
              style={{
                backgroundColor: isDarkMode ? "#3B82F6" : "#10B981", // blue dark / green light
                color: "#FFFFFF",
              }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
