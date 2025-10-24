/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

// Componentes Input e Select definidos fora para performance
const InputField = (props) => <input {...props} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />;
const SelectField = (props) => <select {...props} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />;

export default function ModalOcuparVaga({ onClose, onSave, titulo, moradores, veiculos }) {
  const [tipoOcupante, setTipoOcupante] = useState("morador");
  const [formData, setFormData] = useState({});

  // Guarda a lista de veículos APENAS do morador selecionado
  const [veiculosDoMorador, setVeiculosDoMorador] = useState([]);

  // Estado para a opção de notificação selecionada ('none', 'specific', 'all')

  const [notificationOption, setNotificationOption] = useState("none"); //'none' como default
  
  // Estado para o ID do destinatário específico (quando aplicável)

  const [notificationRecipientId, setNotificationRecipientId] = useState("");

  // Limpa o formulário e reseta estados
  const limpaForm = () => {
    setFormData({});
    setVeiculosDoMorador([]); // Limpa a lista de veículos
    setNotificationOption("none"); // Reseta para 'none'
    setNotificationRecipientId(""); // Reseta o destinatário
  };

  // Handler para mudar entre Morador e Visitante
  const handleTipoChange = (e) => {
    setTipoOcupante(e.target.value);
    limpaForm();
  };

  // Handler para quando o morador OCUPANTE é selecionado
  const handleMoradorChange = (e) => {
    const moradorId = e.target.value;
    let veiculoSelecionadoId = null; // ID do veículo a ser pré-selecionado

    if (moradorId) {
      // Filtra os veículos que pertencem ao morador selecionado
      const veiculosFiltrados = veiculos.filter(v => v.morador?._id === moradorId);
      setVeiculosDoMorador(veiculosFiltrados);

      // Se houver APENAS UM veículo, pré-seleciona ele
      if (veiculosFiltrados.length === 1) {
        veiculoSelecionadoId = veiculosFiltrados[0]._id;
      }
    } else {
      // Se nenhum morador for selecionado, limpa a lista de veículos
      setVeiculosDoMorador([]);
    }

    // Atualiza o formData com o morador e o veículo (se pré-selecionado)
    // Preserva a data de saída se já tiver sido digitada
    setFormData(prev => ({
        ...prev, // Mantém outros campos como dataSaida
        morador: moradorId,
        veiculo: veiculoSelecionadoId // Pode ser null ou o ID do único veículo
    }));
  };

  // Handler genérico para atualizar campos do formulário (incluindo o select de veículo)
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler para o select do destinatário ESPECÍFICO da notificação
  const handleRecipientChange = (e) => {
      setNotificationRecipientId(e.target.value);
  }

  // Handler para submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    let dadosParaSalvar = {};

    if (tipoOcupante === 'morador') {

      // Validação!!! Garante que um veículo foi selecionado se houver opções
      if (veiculosDoMorador.length > 0 && !formData.veiculo) {
         alert("Por favor, selecione o veículo do morador."); // toast para alerta da mensagem
         return;
      }
      dadosParaSalvar = {
        morador: formData.morador,
        veiculo: formData.veiculo, // ID do veículo selecionado
        dataSaida: formData.dataSaida || null,
        notificationOption: notificationOption,

        // Envia o ID do destinatário apenas se a opção for 'specific'
        notificationRecipientId: notificationOption === 'specific' ? notificationRecipientId : null,
      };
    } else { // Caso seja visitante
      dadosParaSalvar = {
        visitante: {
          nome: formData.nome,
          telefone: formData.telefone,
          veiculo: {
            placa: formData.placa,
            modelo: formData.modelo,
            cor: formData.cor,
          }
        }
      };
    }
    // Chama a função onSave passada pelo componente pai --ListaVagas--
    onSave(dadosParaSalvar);
  };

  // Renderização do componente
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{titulo}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Tipo Ocupante */}
          <SelectField value={tipoOcupante} onChange={handleTipoChange}>
            <option value="morador">Ocupante é um Morador</option>
            <option value="visitante">Ocupante é um Visitante</option>
          </SelectField>

          {/* Campos para Morador */}
          {tipoOcupante === 'morador' && (
            <>
              {/* Select Morador Ocupante */}
              <SelectField name="morador" value={formData.morador || ''} onChange={handleMoradorChange} required>
                <option value="">Selecione o morador (ocupante)</option>
                {moradores.map(morador => (
                  <option key={morador._id} value={morador._id}>{morador.nome} - {morador.bloco}/{morador.apartamento}</option>
                ))}
              </SelectField>

              {/* Lógica Condicional para Veículo */}
              {formData.morador && ( // Só mostra se um morador foi selecionado
                <div>
                  <label htmlFor="veiculo" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Veículo:</label>
                  {veiculosDoMorador.length === 0 ? (
                    <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                      Nenhum veículo cadastrado para este morador.
                    </p>
                  ) : (
                    <SelectField
                      id="veiculo"
                      name="veiculo"
                      value={formData.veiculo || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Selecione o veículo --</option>
                      {veiculosDoMorador.map(v => (
                        <option key={v._id} value={v._id}>
                          {v.placa} - {v.modelo} ({v.cor})
                        </option>
                      ))}
                    </SelectField>
                  )}
                </div>
              )}

              {/* Input Data Saída */}
              <div>
                 <label htmlFor="dataSaida" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Previsão de Saída (Opcional):</label>
                 <InputField id="dataSaida" name="dataSaida" type="datetime-local" value={formData.dataSaida || ''} onChange={handleChange} />
              </div>

              {/* Select Opção de Notificação */}
              <div className="pt-2">
                <label htmlFor="notificationOption" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Notificação WhatsApp:</label>
                <SelectField
                  id="notificationOption"
                  name="notificationOption"
                  value={notificationOption}
                  onChange={(e) => { setNotificationOption(e.target.value); setNotificationRecipientId(''); }}
                >
                  <option value="none">Não enviar notificação</option>
                  <option value="specific">Enviar para outro morador</option>
                  <option value="all">Enviar para todos os moradores</option>
                </SelectField>
              </div>

              {/* Select Destinatário Específico (condicional) */}
              {notificationOption === 'specific' && (
                <div className="pt-2">
                  <label htmlFor="notificationRecipient" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Selecione o destinatário:</label>
                  <SelectField
                    id="notificationRecipient"
                    name="notificationRecipient"
                    value={notificationRecipientId}
                    onChange={handleRecipientChange}
                    required
                  >
                    <option value="">-- Escolha o morador a ser notificado --</option>
                    {moradores
                      // .filter(m => m._id !== formData.morador) // Opcional: Exclui o morador ocupante da lista
                      .map(morador => (
                      <option key={morador._id} value={morador._id}>{morador.nome} - {morador.bloco}/{morador.apartamento}</option>
                    ))}
                  </SelectField>
                </div>
              )}
            </>
          )}

          {/* Campos para Visitante */}
          {tipoOcupante === 'visitante' && (
            <>
              <InputField name="nome" placeholder="Nome do Visitante" value={formData.nome || ''} onChange={handleChange} required />
              <InputField name="placa" placeholder="Placa do Veículo (ABC-1234)" value={formData.placa || ''} onChange={handleChange} required />
              <InputField name="modelo" placeholder="Modelo do Veículo" value={formData.modelo || ''} onChange={handleChange} />
              <InputField name="cor" placeholder="Cor do Veículo" value={formData.cor || ''} onChange={handleChange} />
              <InputField name="telefone" placeholder="Telefone (Opcional)" value={formData.telefone || ''} onChange={handleChange} />
            </>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}