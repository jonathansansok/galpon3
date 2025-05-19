import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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
  "Lado Derecho": ["LD", "Puerta", "Retrovisor", "Manija Conductor"],
  "Lado Izquierdo": ["LI", "Puerta Izquierda", "Retrovisor Izquierdo"],
  Techo: ["T.", "Polarizado", "Impermeabilización"],
  "Tren Delantero": ["T.D.", "Amortiguadores", "Rótulas", "Bujes"],
};

const piezasConValores = {
  "Paragolpe trasero": { costo: 100, horas: 4 },
  "Luces traseras": { costo: 50, horas: 2 },
  "Paragolpe delantero": { costo: 120, horas: 5 },
  "Luces delanteras": { costo: 60, horas: 3 },
  Puerta: { costo: 200, horas: 6 },
  Retrovisor: { costo: 80, horas: 3 },
  "Manija Conductor": { costo: 40, horas: 1 },
  "Puerta Izquierda": { costo: 190, horas: 6 },
  "Retrovisor Izquierdo": { costo: 75, horas: 3 },
  Polarizado: { costo: 50, horas: 2 },
  Impermeabilización: { costo: 70, horas: 3 },
  Amortiguadores: { costo: 150, horas: 4 },
  Rótulas: { costo: 90, horas: 2 },
  Bujes: { costo: 60, horas: 1 },
  Capó: { costo: 150, horas: 5 },
  Filtro: { costo: 30, horas: 1 },
  Radiador: { costo: 120, horas: 4 },
};

type ParteKey = keyof typeof partesChapa;
type PiezaKey = keyof typeof piezasConValores;

export default function ChapaTable({
  onUpdate,
}: {
  onUpdate: (costo: number, horas: number, diasPanos: number) => void;
}) {
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

    const piezaValores = piezasConValores[newRow.piezas as PiezaKey];
    if (!piezaValores) {
      alert("La pieza seleccionada no tiene valores predefinidos.");
      return;
    }

    const diasPanos = calculateDiasPanos(piezaValores.horas);

    setRows([
      ...rows,
      {
        ...newRow,
        id: Date.now(),
        horas: piezaValores.horas,
        costo: piezaValores.costo,
      },
    ]);
    setNewRow({ id: 0, parte: "", piezas: "", especificacion: "", horas: 0, costo: 0 });

    // Acumular los valores de costo, horas y días/paños
    onUpdate(piezaValores.costo, piezaValores.horas, diasPanos);
  };

  const handleDeleteRow = (id: number) => {
    const rowToDelete = rows.find((row) => row.id === id);
    if (rowToDelete) {
      const diasPanos = calculateDiasPanos(rowToDelete.horas);

      // Restar los valores de costo, horas y días/paños al eliminar una fila
      onUpdate(-rowToDelete.costo, -rowToDelete.horas, -diasPanos);
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleEditRow = (id: number, field: "horas" | "costo", value: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
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
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Horas
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Costo
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
              <tr key={row.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 text-sm text-gray-700">{row.parte}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{row.piezas}</td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  <input
                    type="number"
                    value={row.horas}
                    onChange={(e) =>
                      handleEditRow(row.id, "horas", parseFloat(e.target.value) || 0)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  <input
                    type="number"
                    value={row.costo}
                    onChange={(e) =>
                      handleEditRow(row.id, "costo", parseFloat(e.target.value) || 0)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">{row.especificacion}</td>
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
                    setNewRow({ ...newRow, piezas: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una pieza</option>
                  {partesChapa[newRow.parte as ParteKey]?.slice(1).map((pieza) => (
                    <option key={pieza} value={pieza}>
                      {pieza}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-4 px-6 text-sm text-gray-700">
                {newRow.piezas &&
                  piezasConValores[newRow.piezas as PiezaKey]?.horas}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700">
                {newRow.piezas &&
                  piezasConValores[newRow.piezas as PiezaKey]?.costo}
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