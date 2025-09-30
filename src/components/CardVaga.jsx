import React from 'react';

// IMPORTANTE: Substitua por seus ícones reais (SVG, Heroicons, etc.)
const VehicleIcon = () => <span className="text-xl mr-2 text-gray-600 dark:text-gray-400">🚗</span>;
const ParkingIcon = () => <span className="text-xl mr-2 text-gray-600 dark:text-gray-400">🅿️</span>;
const UnlockIcon = () => <span className="mr-1">🔓</span>; 
const OccupyIcon = () => <span className="mr-1">🔒</span>;

export default function CardVaga({ vaga, onOcupar, onLiberar }) {
    const isLivre = vaga.status === 'Livre'; 
    const isMoto = vaga.tipo === 'moto';

    // Classes condicionais para a borda (Verde para Livre, Vermelho para Ocupada)
    const borderColorClass = isLivre ? 'border-green-500' : 'border-red-500';

    return (
        // Borda Condicional, Sombra e Suporte a Dark Mode no fundo do card
        <div className={`p-5 rounded-xl border-2 shadow-sm ${borderColorClass} bg-white dark:bg-gray-800`}>
            
            {/* Linha do Ícone, Título e Status */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    {isMoto ? <ParkingIcon /> : <VehicleIcon />}
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{vaga.nome}</h3>
                </div>
                {/* Texto do status com cor condicional */}
                <span className={`text-sm font-bold ${isLivre ? 'text-green-600' : 'text-red-600'}`}>
                    {vaga.status}
                </span>
            </div>

            {/* Detalhes da vaga Ocupada */}
            {!isLivre && (
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-3 pb-3">
                    <p>Ocupante: 
                        <span className={`font-bold ml-1 ${vaga.ocupante === 'Visitante' ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            {vaga.ocupante}
                        </span>
                    </p>
                    <p>Placa: <strong className="font-bold">{vaga.placa}</strong></p>
                    <p>Modelo: {vaga.modelo}</p>
                    <p>Cor: {vaga.cor}</p>
                    <p>Tel: {vaga.tel || 'N/A'}</p>
                </div>
            )}

            {/* Botões de Ação */}
            {isLivre ? (
                // Botão "Ocupar Vaga" (ROXO)
                <button
                    onClick={() => onOcupar(vaga.id)}
                    className="w-full mt-4 py-2 flex items-center justify-center 
                               bg-[#5B47D4] text-white font-semibold rounded-lg 
                               hover:bg-[#483aab] transition duration-150"
                >
                    <OccupyIcon /> Ocupar Vaga
                </button>
            ) : (
                // Botão "Liberar Vaga" (CINZA - Contraste ajustado para Dark Mode)
                <button
                    onClick={() => onLiberar(vaga.id)}
                    className="w-full mt-4 py-2 flex items-center justify-center 
                               bg-gray-300 text-gray-900 
                               dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg 
                               hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-150"
                >
                    <UnlockIcon /> Liberar Vaga
                </button>
            )}
        </div>
    );
}