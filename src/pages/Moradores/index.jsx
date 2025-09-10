import { Plus, Trash2, Edit } from "lucide-react";

const Moradores = () => {
  const moradores = [
    { id: 1, nome: "João Silva", apto: "101", tel: "55 11 99999-9999" },
    { id: 2, nome: "Maria Souza", apto: "203", tel: "55 11 88888-8888" },
    { id: 3, nome: "Carlos Oliveira", apto: "302", tel: "55 11 77777-7777" },
  ];

  return (
    <div className="w-[500px] mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Moradores</h2>
    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
      <Plus size={16} /> Novo Morador
    </button>
  </div>

  <p className="text-gray-600 dark:text-gray-300 mb-4">
    Aqui você poderá cadastrar e gerenciar os moradores.
  </p>

  <div className="space-y-3">
    {moradores.map((morador) => (
      <div
        key={morador.id}
        className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
      >
        <div>
          <p className="font-semibold">{morador.nome}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Apto: {morador.apto} | Tel: {morador.tel}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
            <Edit size={18} />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


  );
};

export default Moradores;
