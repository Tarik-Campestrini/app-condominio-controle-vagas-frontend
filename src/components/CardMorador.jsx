// src/components/CardMorador.jsx

import React from "react";
import { User, Edit, Trash2 } from "lucide-react";

export default function CardMorador({ morador, onEdit, onDelete }) {
  return (
    <div className="flex flex-col justify-between rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">
      {/* Seção de Informações Principais */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-gray-700">
              <User size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {morador.nome}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bloco {morador.bloco} / Apto {morador.apartamento}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 pl-1">
          <p>
            <span className="font-semibold">Email:</span> {morador.email}
          </p>
          <p>
            <span className="font-semibold">Telefone:</span> {morador.telefone}
          </p>
        </div>
      </div>

      {/* Seção de Botões de Ação */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(morador)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition flex items-center justify-center gap-2 text-sm"
        >
          <Edit size={14} /> Editar
        </button>
        <button
          onClick={() => onDelete(morador._id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition flex items-center justify-center gap-2 text-sm"
        >
          <Trash2 size={14} /> Deletar
        </button>
      </div>
    </div>
  );
}