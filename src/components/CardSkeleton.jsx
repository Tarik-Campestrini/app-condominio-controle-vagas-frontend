import React from "react";

export default function CardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">
      {/* Usamos a classe animate-pulse do Tailwind para a animação */}
      <div className="animate-pulse">
        {/* Skeleton do Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Skeleton do Ícone */}
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div>
              {/* Skeleton do Título */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              {/* Skeleton do Subtítulo */}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Skeleton das Informações */}
        <div className="space-y-2 pl-1 mt-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
        </div>
      </div>

      {/* Skeleton dos Botões */}
      <div className="flex gap-2 mt-4">
        <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    </div>
  );
}