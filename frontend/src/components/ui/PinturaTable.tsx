//frontend\src\components\ui\PinturaTable.tsx
import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";

interface PinturaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

const partesPintura = {
  "Pintura Completa": ["P.C.", "Color Base", "Capa Final"],
  Techo: ["T.", "Polarizado", "Impermeabilización"],
  "Lado Derecho": ["LD", "Puerta", "Retrovisor", "Manija Conductor"],
  "Lado Izquierdo": ["LI", "Puerta Izquierda", "Retrovisor Izquierdo"],
};

const piezasConValores = {
  "Color Base": { costoPorPano: 50, panos: 1},
  "Capa Final": { costoPorPano: 50, panos: 1 },
  Polarizado: { costoPorPano: 70, panos: 1 },
  Impermeabilización: { costoPorPano: 90, panos: 1 },
  Puerta: { costoPorPano: 120, panos: 1 },
  Retrovisor: { costoPorPano: 60, panos: 1 },
  "Manija Conductor": { costoPorPano: 40, panos: 1 },
  "Puerta Izquierda": { costoPorPano: 110, panos: 1 },
  "Retrovisor Izquierdo": { costoPorPano: 55, panos: 1 },
};

type ParteKey = keyof typeof partesPintura;
type PiezaKey = keyof typeof piezasConValores;

export default function PinturaTable({
  onUpdate,
}: {
  onUpdate: (costo: number, horas: number, diasPanos: number) => void;
}) {
  const [rows, setRows] = useState<PinturaRow[]>([]);
  const [newRow, setNewRow] = useState<PinturaRow>({
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

  if (!newRow.parte || !newRow.piezas) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  setRows([...rows, { ...newRow, id: Date.now() }]);
  setNewRow({
    id: 0,
    parte: "",
    piezas: "",
    especificacion: "",
    horas: 0,
    costo: 0,
  });

  // Llamar a onUpdate con los valores ingresados manualmente
  onUpdate(newRow.costo, newRow.horas, 0); // Los días ya no se calculan automáticamente
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

  const handleEditRow = (
    id: number,
    field: keyof PinturaRow, // Ahora acepta cualquier campo de PinturaRow
    value: string | number // El valor puede ser string o number
  ) => {
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

  const handleUpdateRow = (row: PinturaRow) => {
    const diasPanos = calculateDiasPanos(row.horas);
    onUpdate(row.costo, row.horas, diasPanos);
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
            <th className="py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider w-[80px]">
              Paños
            </th>
            <th className="py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider w-[80px] hidden">
              Horas
            </th>
            <th className="py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider w-[80px] hidden">
              Costo
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
            Pintar o difuminar
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
              Tipo de Pintura
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
              <td className="py-4 px-6 text-sm text-gray-700">{row.piezas}</td>
              <td className="py-4 px-2 text-sm text-gray-700 w-[80px]">
                <input
                  type="number"
                  value={row.horas / 6} // Convertir horas a paños
                  onChange={(e) => {
                    const panos = parseFloat(e.target.value) || 0;
                    const horas = panos * 6; // Cada paño equivale a 6 horas
                    const costo =
                      panos *
                      (piezasConValores[row.piezas as PiezaKey]?.costoPorPano ||
                        0);
  
                    handleEditRow(row.id, "horas", horas); // Actualiza las horas
                    handleEditRow(row.id, "costo", costo); // Actualiza el costo
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="py-4 px-2 text-sm text-gray-700 w-[80px] hidden">
                <input
                  type="number"
                  value={row.horas}
                  onChange={(e) => {
                    const horas = parseFloat(e.target.value) || 0;
                    const diasPanos = calculateDiasPanos(horas); // Calcular días
                    handleEditRow(row.id, "horas", horas); // Actualiza solo las horas
                    onUpdate(row.costo, horas, diasPanos); // Actualiza los días
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="py-4 px-2 text-sm text-gray-700 w-[80px] hidden">
                <input
                  type="number"
                  value={row.costo}
                  onChange={(e) =>
                    handleEditRow(
                      row.id,
                      "costo",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="py-4 px-6 text-sm text-gray-700">
                <select
                  onChange={(e) =>
                    handleEditRow(row.id, "especificacion", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pintar o Difuminar</option>
                  <option value="Pintar">Pintar</option>
                  <option value="Difuminar">Difuminar</option>
                </select>
              </td>
              <td className="py-4 px-6 text-sm text-gray-700">
                <select
                  onChange={(e) => {
                    const tipoPintura = e.target.value;
                    let costoBase = 100; // Bicapa
                    if (tipoPintura === "Monocapa") costoBase -= 30; // Monocapa
                    if (tipoPintura === "Tricapa") costoBase *= 1.3; // Tricapa
                    handleEditRow(row.id, "costo", costoBase);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bicapa">Bicapa</option>
                  <option value="Monocapa">Monocapa</option>
                  <option value="Tricapa">Tricapa</option>
                </select>
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateRow(row);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition duration-200"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => handleDeleteRow(row.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {/* Fila de entrada */}
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
                onChange={(e) => {
                  const pieza = e.target.value;
                  const valores = piezasConValores[pieza as PiezaKey];
  
                  if (valores) {
                    const horas = valores.panos * 6; // Cada paño equivale a 6 horas
                    const costo = valores.panos * valores.costoPorPano; // Costo total basado en los paños
  
                    setNewRow({
                      ...newRow,
                      piezas: pieza,
                      horas,
                      costo,
                    });
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una pieza</option>
                {partesPintura[newRow.parte as ParteKey]?.map((pieza) => (
                  <option key={pieza} value={pieza}>
                    {pieza} -{" "}
                    {piezasConValores[pieza as PiezaKey]?.panos || 0} paños
                  </option>
                ))}
              </select>
            </td>
            <td className="py-4 px-2 w-[80px]">
              <input
                type="number"
                value={newRow.horas / 6 || 0} // Convertir horas a paños
                onChange={(e) => {
                  const panos = parseFloat(e.target.value) || 0;
                  const horas = panos * 6;
                  const costo =
                    panos *
                    (piezasConValores[newRow.piezas as PiezaKey]?.costoPorPano ||
                      0);
  
                  setNewRow({
                    ...newRow,
                    horas,
                    costo,
                  });
                }}
                className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </td>
            <td className="py-4 px-6">
              <select
                onChange={(e) =>
                  setNewRow({ ...newRow, especificacion: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pintar o difuminar</option>
                <option value="Pintar">Pintar</option>
                <option value="Difuminar">Difuminar</option>
              </select>
            </td>
            <td className="py-4 px-6">
              <select
                onChange={(e) => {
                  const tipoPintura = e.target.value;
                  let costoBase = 100; // Bicapa
                  if (tipoPintura === "Monocapa") costoBase -= 30; // Monocapa
                  if (tipoPintura === "Tricapa") costoBase *= 1.3; // Tricapa
                  setNewRow({ ...newRow, costo: costoBase });
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bicapa">Bicapa</option>
                <option value="Monocapa">Monocapa</option>
                <option value="Tricapa">Tricapa</option>
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddRow(e);
                }}
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
