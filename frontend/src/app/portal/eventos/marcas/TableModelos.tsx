import React from "react";

interface Modelo {
  id: number;
  label: string;
  value: string;
  marcaId: number;
  marcaLabel: string; // Nombre de la marca asociada
}

interface TableModelosProps {
  modelos: Modelo[];
}

const TableModelos: React.FC<TableModelosProps> = ({ modelos }) => {
  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">Lista de Modelos</h3>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Modelo</th>
            <th className="px-4 py-2 border">Valor</th>
            <th className="px-4 py-2 border">Marca Asociada</th>
          </tr>
        </thead>
        <tbody>
          {modelos.map((modelo, index) => (
            <tr
              key={modelo.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2 border">{modelo.id}</td>
              <td className="px-4 py-2 border">{modelo.label}</td>
              <td className="px-4 py-2 border">{modelo.value}</td>
              <td className="px-4 py-2 border">{modelo.marcaLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableModelos;