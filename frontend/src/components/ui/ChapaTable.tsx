import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { useChapaPinturaStore } from "./ChapaPinturaStore";

interface ChapaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

const partesChapa = {
  "Parte Trasera": ["P.T.", "Paragolpe trasero", "Luces traseras"],
  "Parte Delantera": ["P.D.", "Paragolpe delantero", "Luces delanteras"],
};

const piezasConValores = {
  "Paragolpe trasero": { costo: 100, horas: 4 },
  "Luces traseras": { costo: 50, horas: 2 },
  "Paragolpe delantero": { costo: 120, horas: 5 },
  "Luces delanteras": { costo: 60, horas: 3 },
};

type ParteKey = keyof typeof partesChapa;
type PiezaKey = keyof typeof piezasConValores;

export default function ChapaTable({
  onUpdate,
}: {
  onUpdate: (costo: number, horas: number, diasPanos: number) => void;
}) {
  const { addChapaRow, removeChapaRow } = useChapaPinturaStore();
  const [rows, setRows] = useState<ChapaRow[]>([]);
  const [newRow, setNewRow] = useState<ChapaRow>({
    id: 0,
    parte: "",
    piezas: "",
    especificacion: "",
    horas: 0,
    costo: 0,
  });

  const calculateDiasPanos = (horas: number): number => {
    return Math.floor(horas / 4) + (horas % 4 >= 2 ? 0.5 : 0);
  };

  const handleAddRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!newRow.parte || !newRow.piezas || !newRow.especificacion) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const diasPanos = calculateDiasPanos(newRow.horas);
    const rowWithId = { ...newRow, id: Date.now() };

    setRows([...rows, rowWithId]);
    addChapaRow(rowWithId); // Agregar al estado compartido

    setNewRow({
      id: 0,
      parte: "",
      piezas: "",
      especificacion: "",
      horas: 0,
      costo: 0,
    });

    onUpdate(newRow.costo, newRow.horas, diasPanos);
  };

  const handleDeleteRow = (id: number) => {
    const rowToDelete = rows.find((row) => row.id === id);
    if (rowToDelete) {
      const diasPanos = calculateDiasPanos(rowToDelete.horas);
      onUpdate(-rowToDelete.costo, -rowToDelete.horas, -diasPanos);
    }

    setRows(rows.filter((row) => row.id !== id));
    removeChapaRow(id); // Eliminar del estado compartido
  };

  // **Nueva función: handleEditRow**
  const handleEditRow = (
    id: number,
    field: keyof ChapaRow,
    value: string | number
  ) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: value,
          }
        : row
    );
    setRows(updatedRows);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chapa</h2>
      <div className="overflow-hidden rounded-lg shadow-lg bg-white">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800">
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Parte
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Piezas
              </th>
              <th className="py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider w-[80px]">
                Horas
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Especificación
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 text-sm text-gray-700">{row.parte}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{row.piezas}</td>
                <td className="py-4 px-2 text-sm text-gray-700 w-[80px]">
                  <input
                    type="number"
                    value={row.horas}
                    onChange={(e) =>
                      handleEditRow(
                        row.id,
                        "horas",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  <input
                    type="text"
                    value={row.especificacion}
                    onChange={(e) =>
                      handleEditRow(row.id, "especificacion", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-6 text-sm text-gray-700 flex space-x-2">
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
                  {Object.keys(partesChapa).map((parte) => (
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
                    setNewRow({
                      ...newRow,
                      piezas: e.target.value,
                      horas:
                        piezasConValores[e.target.value as PiezaKey]?.horas ||
                        0,
                      costo:
                        piezasConValores[e.target.value as PiezaKey]?.costo ||
                        0,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una pieza</option>
                  {partesChapa[newRow.parte as ParteKey]?.map((pieza) => (
                    <option key={pieza} value={pieza}>
                      {pieza}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-4 px-2 w-[80px]">
                <input
                  type="number"
                  value={newRow.horas}
                  onChange={(e) =>
                    setNewRow({
                      ...newRow,
                      horas: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={newRow.especificacion}
                  onChange={(e) =>
                    setNewRow({ ...newRow, especificacion: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={(e) => handleAddRow(e)}
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