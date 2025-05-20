import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { partes, piezasConValores } from "../../constants/constants";

interface ChapaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

type ParteKey = keyof typeof partes;
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

    const diasPanos = calculateDiasPanos(newRow.horas);

    setRows([...rows, { ...newRow, id: Date.now() }]);
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
  };

  const handleEditRow = (
    id: number,
    field: keyof ChapaRow,
    value: string | number
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
                Acción
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
                  <select
                    value={row.especificacion}
                    onChange={(e) =>
                      handleEditRow(row.id, "especificacion", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione una acción</option>
                    <option value="Sustituir">Sustituir</option>
                    <option value="Reparar">Reparar</option>
                    <option value="Verificar">Verificar</option>
                    <option value="Desmontar y Montar">Desmontar y Montar</option>
                  </select>
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  {row.especificacion}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditRow(row.id, "horas", row.horas);
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
                  {Object.keys(partes).map((parte) => (
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
                      setNewRow({
                        ...newRow,
                        piezas: pieza,
                        horas: valores.horas || 0,
                        costo: valores.costo || 0,
                      });
                    }
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una pieza</option>
                  {partes[newRow.parte as ParteKey]?.map((pieza) => (
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
                <select
                  value={newRow.especificacion}
                  onChange={(e) =>
                    setNewRow({ ...newRow, especificacion: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una acción</option>
                  <option value="Sustituir">Sustituir</option>
                  <option value="Reparar">Reparar</option>
                  <option value="Verificar">Verificar</option>
                  <option value="Desmontar y Montar">Desmontar y Montar</option>
                </select>
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