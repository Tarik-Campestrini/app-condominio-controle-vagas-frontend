import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'; 

/**
 * Componente Toast (Notificação )
 * @param {object} toast - Contém {message: string, type: 'success' | 'error'}.
 * @param {function} setToast - Função para resetar o estado do toast.
 */
export default function Toast({ toast, setToast }) {
  
  // Esconde o toast se não houver mensagem
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: '', type: '' });
      }, 5000); // Aumentei para 5 segundos
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  // Função para fechar o toast ao clicar no "X"
  const handleClose = () => {
    setToast({ message: '', type: '' });
  };

  // Não renderiza nada se não houver mensagem
  if (!toast.message) {
    return null;
  }

  // Mapeamento de estilos e ícones
  const styleMap = {
    success: {
      container: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600',
      icon: <CheckCircle2 className="text-green-600 dark:text-green-400" />,
      text: 'text-green-800 dark:text-green-200',
      closeButton: 'text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800',
    },
    error: {
      container: 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600',
      icon: <AlertTriangle className="text-red-600 dark:text-red-400" />,
      text: 'text-red-800 dark:text-red-200',
      closeButton: 'text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800',
    }
  };

  const currentStyle = styleMap[toast.type] || styleMap.success;

  return (
    // Posicionamento no canto superior direito
    <div 
      className={`fixed top-5 right-5 w-auto max-w-sm p-4 rounded-lg shadow-lg border-l-4 
                  transition-transform transform duration-300 ease-out z-50
                  ${toast.message ? 'translate-x-0' : 'translate-x-full'}
                  ${currentStyle.container}`}
    >
      <div className="flex items-center">
        {/* Ícone */}
        <div className="flex-shrink-0">
          {currentStyle.icon}
        </div>

        {/* Mensagem */}
        <div className={`ml-3 text-sm font-medium ${currentStyle.text}`}>
          {toast.message}
        </div>

        {/* Botão de Fechar */}
        <button 
          onClick={handleClose} 
          className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 transition-colors ${currentStyle.closeButton}`}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}