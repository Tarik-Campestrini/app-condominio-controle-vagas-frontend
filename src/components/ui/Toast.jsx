import React, { useEffect } from 'react';

/**
 * Componente Toast (Notificação Flutuante)
 * @param {object} toast - Contém {message: string, type: 'success' | 'error'}.
 * @param {function} setToast - Função para resetar o estado do toast.
 */
export default function Toast({ toast, setToast }) {
    
    // Configuração de estilos
    // Posição corrigida para o TOPO CENTRALIZADO
    const baseClasses = "fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-2xl transition-all duration-300 ease-in-out z-[9999] min-w-[250px]";
    
    // Mapeamento de cor e ícone baseado no tipo
    const styleMap = {
        success: {
            // APLICANDO OPACIDADE DE 70% (bg-opacity-70)
            bg: "bg-green-500 bg-opacity-40 dark:bg-green-700 dark:bg-opacity-70",
            text: "text-white",
            
        },
        error: {
            // APLICANDO OPACIDADE DE 70% (bg-opacity-70)
            bg: "bg-red-500 bg-opacity-70 dark:bg-red-700 dark:bg-opacity-70",
            text: "text-white",
            
        }
    };

    // Acessa as informações de estilo
    const currentStyle = styleMap[toast.type] || {};
    const styleClasses = `${currentStyle.bg} ${currentStyle.text}`;

    
    useEffect(() => {
        // Inicializa o timer apenas se houver uma mensagem para mostrar
        if (toast && toast.message) {
            const timer = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 3000); // Esconde após 3 segundos
            
            // Limpa o timer se o componente for desmontado ou o toast mudar
            return () => clearTimeout(timer);
        }
    }, [toast, setToast]);


    // Não renderiza se não houver mensagem ou tipo
    if (!toast || !toast.message || !toast.type) return null;


    // Classes de animação:
    const visibilityClass = toast.message ? "opacity-100 scale-100" : "opacity-0 scale-95";
    
    return (
        <div className={`${baseClasses} ${styleClasses} ${visibilityClass}`}>
            <div className="flex items-center">
                <span className="text-xl mr-3">{currentStyle.icon}</span>
                <p className="font-semibold text-sm">{toast.message}</p>
            </div>
        </div>
    );
}
