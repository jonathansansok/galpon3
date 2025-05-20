import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { partes, piezasConValores } from "../../constants/constants";

interface PinturaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

type ParteKey = keyof typeof partes;
type PiezaKey = keyof typeof piezasConValores;

export default function PinturaTable({
  onUpdate,
  chapaRows, // Recibe las filas de ChapaTable
}: {
  onUpdate: (costo: number, horas: number, diasPanos: number) => void;
  chapaRows: PinturaRow[]; // Sincronización con ChapaTable
}) {
  const [rows, setRows] = useState<PinturaRow[]>([]);

  // Sincronizar las filas de ChapaTable con PinturaTable
  useEffect(() => {
    const updatedRows = chapaRows.map((chapaRow) => ({
      ...chapaRow,
      costo: piezasConValores[chapaRow.piezas as PiezaKey]?.costoPorPano || 0,
      horas: piezasConValores[chapaRow.piezas as PiezaKey]?.panos * 6 || 0, // Cada paño equivale a 6 horas
    }));
    setRows(updatedRows);
  }, [chapaRows]);

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleEditRow = (
    id: number,
    field: keyof PinturaRow,
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
              <th className="py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider w-[80px]">
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
              <tr key={row.id} className="hover:bg-blue-50">
                <td className="py-4 px-6 text-sm text-gray-700">{row.parte}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{row.piezas}</td>
                <td className="py-4 px-2 text-sm text-gray-700 w-[80px]">
                  {row.horas / 6} {/* Mostrar paños */}
                </td>
                <td className="py-4 px-2 text-sm text-gray-700 w-[80px]">
                  {row.costo}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}