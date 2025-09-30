import React, { useState } from 'react';
import CardVaga from './CardVaga';
import ModalCadastro from './ui/Modal/ModalCadastro'; 

// --- MOCK DE DADOS (Simulando a resposta da API) ---
const mockVagas = [
    { id: 'A-01', nome: 'Vaga A-01', status: 'Livre', tipo: 'veiculo' },
    { id: 'A-02', nome: 'Vaga A-02', status: 'Ocupada', tipo: 'veiculo', ocupante: 'Apartamento 101', placa: 'ABC-1234', modelo: 'Ford Focus', cor: 'Azul', tel: '55 11 99999-9999' },
    { id: 'B-01', nome: 'Vaga B-01', status: 'Livre', tipo: 'moto' },
    { id: 'B-02', nome: 'Vaga B-02', status: 'Livre', tipo: 'veiculo' },
    { id: 'B-03', nome: 'Vaga B-03', status: 'Ocupada', ocupante: 'Visitante', tipo: 'veiculo', placa: 'DEF-5678', modelo: 'VW Gol', cor: 'Prata', tel: 'N/A' },
    { id: 'C-01', nome: 'Vaga C-01', status: 'Livre', tipo: 'veiculo' },
];

const OcupacaoVagaFields = [
    { name: 'ocupante', placeholder: 'Apartamento ou Nome do Visitante', type: 'text' },
    { name: 'placa', placeholder: 'Placa do Veículo (ABC-1234)', type: 'text' },
    { name: 'modelo', placeholder: 'Modelo do Veículo', type: 'text' },
    { name: 'cor', placeholder: 'Cor do Veículo', type: 'text' },
    { name: 'telefone', placeholder: 'Telefone (Opcional)', type: 'tel', required: false },
];
// ----------------------------------------------------

export default function ListaVagas() {
    const [vagas, setVagas] = useState(mockVagas);
    const [searchTerm, setSearchTerm] = useState('');
   

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState(null);
    const [formData, setFormData] = useState({});
    const [formFields, setFormFields] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    const handleVagasUpdate = (vagaId, newVehicleData = null) => {
        // Lógica de mock para atualização
        if (modalContext.type === 'OcupacaoVaga' && newVehicleData) {
            setVagas(vagas.map(v => v.id === vagaId ? { 
                ...v, 
                status: 'Ocupada', 
                ocupante: newVehicleData.ocupante,
                placa: newVehicleData.placa,
                modelo: newVehicleData.modelo,
                cor: newVehicleData.cor,
                tel: newVehicleData.telefone 
            } : v));
        } else if (modalContext.type === 'LiberacaoVaga') {
            setVagas(vagas.map(v => v.id === vagaId ? { 
                ...v, 
                status: 'Livre', 
                ocupante: undefined, placa: undefined, modelo: undefined, cor: undefined, tel: undefined 
            } : v));
        }
        setIsModalOpen(false); 
    };

    const handleOcuparVaga = (vagaId) => {
        setFormData({}); 
        setFormFields(OcupacaoVagaFields);
        setModalTitle(`Ocupar Vaga ${vagaId}`);
        
        setModalContext({ type: 'OcupacaoVaga', vagaId: vagaId, onSuccess: handleVagasUpdate });
        setIsModalOpen(true); 
    };

    const handleLiberarVaga = (vagaId) => {
        setFormData({}); 
        setFormFields([]); 
        setModalTitle(`Liberar Vaga ${vagaId}`);

        setModalContext({ type: 'LiberacaoVaga', vagaId: vagaId, onSuccess: handleVagasUpdate });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (modalContext?.type === 'OcupacaoVaga') {
            modalContext.onSuccess(modalContext.vagaId, formData);
        } else if (modalContext?.type === 'LiberacaoVaga') {
            modalContext.onSuccess(modalContext.vagaId);
        }
    };

    const filteredVagas = vagas.filter(vaga =>
        vaga.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vaga.ocupante && vaga.ocupante.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vaga.placa && vaga.placa.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>            

            {/* Barra de Pesquisa*/}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar por vaga, ocupante ou placa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B47D4] focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Grid de Cards de Vagas (Responsivo e com espaçamento) */}
            <div 
                className="grid gap-5" 
                style={{ 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' 
                }}
            >
                {filteredVagas.map((vaga) => (
                    <CardVaga
                        key={vaga.id}
                        vaga={vaga}
                        onOcupar={handleOcuparVaga}
                        onLiberar={handleLiberarVaga}
                    />
                ))}
            </div>
            
            {/* Modal de Cadastro/Confirmação Genérico */}
            {isModalOpen && modalContext && (
                <ModalCadastro 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave}
                    formData={formData}
                    setFormData={setFormData}
                    modalTitle={modalTitle}
                    fields={formFields} 
                    context={modalContext} 
                />
            )}
        </>
    );
}