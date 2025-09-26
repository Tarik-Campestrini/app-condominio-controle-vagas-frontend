import React from "react";

/**
 * Componente ModalConfirmacao genérico para exclusão de itens.
 * @param {boolean} isOpen - Controla a visibilidade do modal.
 * @param {function} onClose - Função para fechar o modal.
 * @param {function} onConfirm - Função executada após a confirmação.
 * @param {string} message - Mensagem exibida no corpo do modal.
 */

// Verifica o estado do Dark Mode para aplicar o estilo inline (solução robusta)
const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

export default function ModalConfirmacao({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    // Overlay fixo
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 backdrop-blur-sm bg-black bg-opacity-70 z-50">

      {/* Caixa do Modal */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300">

        {/* Título */}
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirmar Exclusão</h3>

        {/* Mensagem */}
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg transition text-white"
            style={{
              // Se Dark Mode está ativo, usa um azul vibrante para destaque
              backgroundColor: isDarkMode ? '#3B82F6' : '#10B981', // blue-500 / emerald-500 (light mode)
              color: '#FFFFFF'
            }}
          >
            Cancelar
          </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-lg transition text-white"
          style={{
            // Se Dark Mode está ativo, usa um vermelho vibrante para destaque
            backgroundColor: isDarkMode ? '#DC2626' : '#EF4444', // red-600 / red-500
            color: '#FFFFFF'
          }}
        >
          Deletar
        </button>
      </div>
    </div>
    </div >
  );
}
