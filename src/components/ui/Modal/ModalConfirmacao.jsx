import React from 'react';

/**
 * Componente de Modal de Confirmação Reutilizável
 * @param {boolean} isOpen - Controla a visibilidade do modal.
 * @param {function} onClose - Função para fechar o modal.
 * @param {function} onConfirm - Função chamada ao confirmar.
 * @param {string} title - O título do modal (ex: "Confirmar Exclusão").
 * @param {string} message - A mensagem de aviso para o usuário.
 * @param {string} confirmText - O texto do botão de confirmação (ex: "Deletar", "Liberar").
 * @param {boolean} isDanger - Se true, o botão de confirmação fica vermelho.
 */
export default function ModalConfirmacao({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmação", // Adicionado um título padrão
  message,
  confirmText = "Confirmar", // Adicionado texto padrão
  isDanger = false // Adicionada a opção de perigo
}) {
  
  // Não renderiza nada se estiver fechado
  if (!isOpen) return null;

  // Define a cor do botão de confirmação
  const confirmButtonColor = isDanger 
    ? "bg-red-600 hover:bg-red-700" // Botão vermelho (perigo)
    : "bg-blue-600 hover:bg-blue-700"; // Botão azul (padrão)

  return (
    // Overlay fixo
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 backdrop-blur-sm bg-black z-50">
      
      {/* Caixa do Modal */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-sm">
        
        {/* Título (AGORA VINDO DAS PROPS) */}
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
        
        {/* Mensagem */}
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {message}
        </p>
        
        {/* Botões */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg transition bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition text-white ${confirmButtonColor}`} // Cor dinâmica
          >
            {confirmText} 
          </button>
        </div>
      </div>
    </div>
  );
}