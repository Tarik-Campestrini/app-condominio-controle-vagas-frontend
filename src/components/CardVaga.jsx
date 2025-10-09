// src/components/CardVaga.jsx

import React from "react";
import { Car, ParkingCircle } from "lucide-react"; // Importando os ícones

export default function CardVaga({ vaga, onOcupar, onLiberar }) {
  const statusNormalizado = vaga.status?.toLowerCase();
  const isOcupada = statusNormalizado === "ocupada";

  // Define as classes de estilo com base no status
  const styles = {
    borda: isOcupada ? "border-red-400" : "border-green-400",
    textoStatus: isOcupada ? "text-red-500" : "text-green-500",
    bgIcone: isOcupada ? "bg-red-100" : "bg-green-100",
    icone: isOcupada ? "text-red-500" : "text-green-500",
    botaoLiberar: "w-full mt-4 bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2",
    botaoOcupar: "w-full mt-4 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2",
  };

  return (
    // Container principal do card com flexbox para layout interno
    <div
      className={`flex flex-col justify-between rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 border-2 ${styles.borda} h-full`}
    >
      <div> {/* Wrapper para o conteúdo superior, para o botão ficar no rodapé */}
        <div className="flex justify-between items-start mb-3">
          {/* Ícone e Título */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${styles.bgIcone}`}>
              {isOcupada && vaga.visitante ? (
                <ParkingCircle size={24} className={styles.icone} />
              ) : (
                <Car size={24} className={styles.icone} />
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Vaga {vaga.identificador}
            </h2>
          </div>
          {/* Selo de Status */}
          <span className={`text-xs font-bold ${styles.textoStatus}`}>
            {isOcupada ? "Ocupada" : "Livre"}
          </span>
        </div>

        {/* Detalhes do ocupante (só aparece se estiver ocupada) */}
        {isOcupada && (
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 pl-1">
            <p>
              <span className="font-semibold">Ocupante:</span>{" "}
              {vaga.morador?.nome || vaga.visitante?.nome || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Placa:</span>{" "}
              {vaga.veiculo?.placa || vaga.visitante?.placa || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Modelo:</span>{" "}
              {vaga.veiculo?.modelo || vaga.visitante?.modelo || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Cor:</span>{" "}
              {vaga.veiculo?.cor || vaga.visitante?.cor || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Tel:</span>{" "}
              {vaga.morador?.telefone || vaga.visitante?.telefone || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      {isOcupada ? (
        <button onClick={() => onLiberar(vaga._id)} className={styles.botaoLiberar}>
          <ParkingCircle size={16} /> Liberar Vaga
        </button>
      ) : (
        <button onClick={() => onOcupar(vaga)} className={styles.botaoOcupar}>
          <ParkingCircle size={16} /> Ocupar Vaga
        </button>
      )}
    </div>
  );
}