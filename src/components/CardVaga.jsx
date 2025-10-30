import React from "react";
// 1. Importe o ícone Trash2
import { Car, ParkingCircle, Clock, Trash2 } from "lucide-react";

// 2. Receba a nova prop 'onDelete'
export default function CardVaga({ vaga, onOcupar, onLiberar, onDelete }) {
  const statusNormalizado = vaga.status?.toLowerCase();
  const isOcupada = statusNormalizado === "ocupada";

  const styles = {
    borda: isOcupada ? "border-red-400" : "border-green-400",
    textoStatus: isOcupada ? "text-red-500" : "text-green-500",
    bgIcone: isOcupada ? "bg-red-100" : "bg-green-100",
    icone: isOcupada ? "text-red-500" : "text-green-500",
    botaoLiberar: "w-full mt-4 bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2",
    botaoOcupar: "w-full mt-4 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2",
  };

  return (
    // 3. Adicione 'relative' ao container principal
    <div
      className={`relative flex flex-col justify-between rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 border-2 ${styles.borda} h-full`}
    >
      {/* 4. Adicione o botão de deletar */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Impede cliques indesejados
          onDelete(vaga._id);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 transition-colors z-10" // z-10 para ficar acima
        aria-label="Deletar vaga"
      >
        <Trash2 size={16} />
      </button>

      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {/* ... Ícone e Título da Vaga ... */}
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
          {/* 5. Adicione margem à direita do status para não sobrepor o botão */}
          <span className={`text-xs font-bold mr-6 ${styles.textoStatus}`}>
            {isOcupada ? "Ocupada" : "Livre"}
          </span>
        </div>

        {isOcupada && (
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 pl-1">
            {/* ... Detalhes da vaga (Ocupante, Placa, etc.) ... */}
            <p>
              <span className="font-semibold">Ocupante:</span>{" "}
              {vaga.morador?.nome || vaga.visitante?.nome || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Placa:</span>{" "}
              {vaga.veiculo?.placa || vaga.visitante?.veiculo?.placa || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Modelo:</span>{" "}
              {vaga.veiculo?.modelo || vaga.visitante?.veiculo?.modelo || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Cor:</span>{" "}
              {vaga.veiculo?.cor || vaga.visitante?.veiculo?.cor || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Tel:</span>{" "}
              {vaga.morador?.telefone || vaga.visitante?.telefone || "N/A"}
            </p>
            {vaga.dataSaida && (
              <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold pt-2">
                <Clock size={14} />
                <span>
                  Saída: {new Date(vaga.dataSaida).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Botões de Ação Principais */}
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