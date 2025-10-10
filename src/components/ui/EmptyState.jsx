// src/components/ui/EmptyState.jsx

import React from "react";
import { PlusCircle } from "lucide-react";

/**
 * Componente para exibir um estado vazio de forma amigável.
 * @param {object} props
 * @param {React.ReactNode} props.icon - O ícone a ser exibido (da biblioteca lucide-react).
 * @param {string} props.message - A mensagem principal (ex: "Nenhum morador encontrado").
 * @param {string} props.description - Uma descrição opcional abaixo da mensagem.
 * @param {React.ReactNode} props.children - O conteúdo a ser renderizado dentro do botão (ex: o botão "Cadastrar").
 */
export default function EmptyState({ icon, message, description, children }) {
  return (
    <div className="text-center bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 col-span-full">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 mb-4">
        {icon || <PlusCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        {message}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}