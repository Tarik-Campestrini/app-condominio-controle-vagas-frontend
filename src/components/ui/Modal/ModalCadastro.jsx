import React, { useState, useEffect } from "react";

export default function ModalCadastro({
  isOpen,
  onClose,
  onSave,
  titulo,
  campos,
  formData: parentFormData,
  setFormData: parentSetFormData,
  initialData = {},
}) {
  const [internalFormData, setInternalFormData] = useState(initialData);
  const isControlled = parentFormData !== undefined && parentSetFormData !== undefined;
  const formData = isControlled ? parentFormData : internalFormData;
  const setFormData = isControlled ? parentSetFormData : setInternalFormData;

  useEffect(() => {
    if (!isControlled) {
      setFormData(initialData || {});
    }
  }, [initialData, isControlled]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {titulo}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {campos.map((field) =>

            // Verifica se o tipo do campo é 'select'
            field.type === "select" ? (
              <select
                key={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              // Se não for 'select', renderiza um 'input'
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required={field.required !== false}
              />
            )
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}