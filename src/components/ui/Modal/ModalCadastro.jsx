import React from "react";

/**
 * Componente ModalCadastro (Reutilizável para Moradores, Veículos, Vagas, etc.)
 * * @param {boolean} isOpen - Controla a visibilidade do modal.
 * @param {function} onClose - Função para fechar o modal.
 * @param {function} onSave - Função de callback para salvar os dados.
 * @param {string} editing - O ID do item em edição (ou null).
 * @param {object} formData - O objeto de estado com os dados do formulário.
 * @param {function} setFormData - Função para atualizar o estado do formData.
 * @param {string} modalTitle - Título principal do modal (Ex: "Cadastrar Morador").
 * @param {array} fields - Array com a definição dos campos [{ name, placeholder, type }].
 */
export default function ModalCadastro({
  isOpen,
  onClose,
  onSave,
  editing,
  formData,
  setFormData,
  modalTitle,
  fields
}) {

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // Verifica o estado do Dark Mode para aplicar o estilo inline (solução robusta)
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  // Função genérica para atualizar qualquer campo do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio, chamando a função onSave do componente pai
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(e);
  };


  return (
    // Overlay fixo
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 backdrop-blur-sm bg-black bg-opacity-50 z-50">

      {/* Container do Modal: Fundo gray-700 para contraste e Shadow */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-md">

        {/* Título: Garante que o texto seja branco no dark mode */}
        <h3 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-white">
          {editing ? `Editar ${modalTitle}` : `Cadastrar ${modalTitle}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Inputs Dinâmicos */}
          {fields.map((field) => (
            <input
              key={field.name}
              type={field.type || 'text'}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              // Estilos de Input com Dark Mode
              className="w-full p-3 border border-gray-300 rounded-lg 
                         text-gray-900 focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          ))}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">

            {/* Botão Cancelar: Usa estilo inline para garantir a cor no Dark Mode */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition text-white"
              style={{
                // Se Dark Mode está ativo, usa um cinza escuro para contraste
                backgroundColor: isDarkMode ? '#DC2626' : '#EF4444', // red-600 / red-500
                color: isDarkMode ? '#FFFFFF' : '#1F2937' // white / gray-800
              }}
            >
              Cancelar
            </button>

            {/* Botão Salvar: Usa estilo inline para garantir a cor no Dark Mode (Azul para destaque) */}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg transition text-white"
              style={{
                // Se Dark Mode está ativo, usa um azul vibrante para destaque
                backgroundColor: isDarkMode ? '#3B82F6' : '#10B981', // blue-500 / emerald-500 (light mode)
                color: '#FFFFFF'
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
