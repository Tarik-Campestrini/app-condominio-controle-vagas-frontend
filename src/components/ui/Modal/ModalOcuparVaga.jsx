import React, { useState } from "react";

const InputField = (props) => <input {...props} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />;
const SelectField = (props) => <select {...props} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />;

export default function ModalOcuparVaga({ onClose, onSave, titulo, moradores, veiculos }) {
  const [tipoOcupante, setTipoOcupante] = useState("morador");
  const [formData, setFormData] = useState({});
  const [veiculoDoMorador, setVeiculoDoMorador] = useState(null);

  const limpaForm = () => {
    setFormData({});
    setVeiculoDoMorador(null);
  };

  const handleTipoChange = (e) => {
    setTipoOcupante(e.target.value);
    limpaForm();
  };
  
  const handleMoradorChange = (e) => {
    const moradorId = e.target.value;
    const veiculo = veiculos.find(v => v.morador?._id === moradorId);
    setVeiculoDoMorador(veiculo);
    setFormData({ morador: moradorId, veiculo: veiculo?._id || null, dataSaida: '' });
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  let dadosParaSalvar = {};
  
  if (tipoOcupante === 'morador') {
    dadosParaSalvar = {
      morador: formData.morador,
      veiculo: formData.veiculo,
      dataSaida: formData.dataSaida || null,
    };
  } else {
    // --- CORREÇÃO FINAL AQUI ---
    // Monta o objeto 'visitante' com o sub-objeto 'veiculo' dentro dele
    dadosParaSalvar = {
      visitante: {
        nome: formData.nome,
        telefone: formData.telefone,
        veiculo: { // Cria o objeto aninhado que o backend espera
          placa: formData.placa,
          modelo: formData.modelo,
          cor: formData.cor,
        }
      }
    };
  }

  onSave(dadosParaSalvar);
};
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{titulo}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField value={tipoOcupante} onChange={handleTipoChange}>
            <option value="morador">Ocupante é um Morador</option>
            <option value="visitante">Ocupante é um Visitante</option>
          </SelectField>

          {tipoOcupante === 'morador' && (
            <>
              <SelectField name="morador" value={formData.morador || ''} onChange={handleMoradorChange} required>
                <option value="">Selecione o morador</option>
                {moradores.map(morador => (
                  <option key={morador._id} value={morador._id}>{morador.nome} - {morador.bloco}/{morador.apartamento}</option>
                ))}
              </SelectField>
              
              {veiculoDoMorador && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                  <p><strong>Veículo:</strong> {veiculoDoMorador.placa} - {veiculoDoMorador.modelo} ({veiculoDoMorador.cor})</p>
                </div>
              )}
              
              <InputField name="dataSaida" type="datetime-local" value={formData.dataSaida || ''} onChange={handleChange} />
            </>
          )}

          {tipoOcupante === 'visitante' && (
            <>
              {/* --- CORREÇÃO NOS NOMES DOS INPUTS --- */}
              <InputField name="nome" placeholder="Nome do Visitante" value={formData.nome || ''} onChange={handleChange} required />
              <InputField name="placa" placeholder="Placa do Veículo (ABC-1234)" value={formData.placa || ''} onChange={handleChange} required />
              <InputField name="modelo" placeholder="Modelo do Veículo" value={formData.modelo || ''} onChange={handleChange} />
              <InputField name="cor" placeholder="Cor do Veículo" value={formData.cor || ''} onChange={handleChange} />
              <InputField name="telefone" placeholder="Telefone (Opcional)" value={formData.telefone || ''} onChange={handleChange} />
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}