//frontend\src\components\ui\PinturaTable.tsx
import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface PinturaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
}

// Mapa de partes y sus piezas correspondientes para Pintura
const partesPintura = {
  "Pintura Completa": ["P.C.", "Color Base", "Capa Final"],
  Techo: ["T.", "Polarizado", "Impermeabilización"],
  "Lado Derecho": ["LD", "Puerta", "Retrovisor", "Manija Conductor"],
  "Lado Izquierdo": ["LI", "Puerta Izquierda", "Retrovisor Izquierdo"],
};

type ParteKey = keyof typeof partesPintura;

export default function PinturaTable() {
  const [rows, setRows] = useState<PinturaRow[]>([]);
  const [newRow, setNewRow] = useState<PinturaRow>({
    id: 0,
    parte: "",
    piezas: "",
    especificacion: "",
  });

  const handleAddRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Evita que el formulario se envíe
    if (!newRow.parte || !newRow.piezas || !newRow.especificacion) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    setRows([...rows, { ...newRow, id: Date.now() }]);
    setNewRow({ id: 0, parte: "", piezas: "", especificacion: "" });
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pintura</h2>
      <div className="overflow-hidden rounded-lg shadow-lg bg-white">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-gray-800">
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Parte
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Piezas
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Especificación
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50">
                <td className="py-4 px-6 text-sm text-gray-700">{row.parte}</td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  {row.piezas}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  {row.especificacion}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="py-4 px-6">
                <select
                  value={newRow.parte}
                  onChange={(e) =>
                    setNewRow({ ...newRow, parte: e.target.value, piezas: "" })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una parte</option>
                  {Object.keys(partesPintura).map((parte) => (
                    <option key={parte} value={parte}>
                      {parte}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-4 px-6">
                <select
                  value={newRow.piezas}
                  onChange={(e) =>
                    setNewRow({ ...newRow, piezas: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una pieza</option>
                  {partesPintura[newRow.parte as ParteKey]
                    ?.slice(1)
                    .map((pieza) => (
                      <option key={pieza} value={pieza}>
                        {pieza}
                      </option>
                    ))}
                </select>
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={newRow.especificacion}
                  onChange={(e) =>
                    setNewRow({ ...newRow, especificacion: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Especificación"
                />
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={handleAddRow}
                  className="text-green-500 hover:text-green-700 transition duration-200"
                >
                  <FaPlus />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
