import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { useChapaPinturaStore } from "./ChapaPinturaStore";

interface PinturaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

const partesPintura = {
  "Parte Trasera": ["P.T.", "Paragolpe trasero", "Luces traseras"],
  "Parte Delantera": ["P.D.", "Paragolpe delantero", "Luces delanteras"],
};

const piezasConValores = {
  "Paragolpe trasero": { costoPorPano: 80, panos: 2 },
  "Luces traseras": { costoPorPano: 40, panos: 1 },
  "Paragolpe delantero": { costoPorPano: 100, panos: 2 },
  "Luces delanteras": { costoPorPano: 50, panos: 1 },
};

type PiezaKey = keyof typeof piezasConValores;

export default function PinturaTable({
  onUpdate,
}: {
  onUpdate: (costo: number, horas: number, diasPanos: number) => void;
}) {
  const { chapaRows } = useChapaPinturaStore();
  const [rows, setRows] = useState<PinturaRow[]>([]);

  useEffect(() => {
    const updatedRows = chapaRows.map((chapaRow) => {
      const pieza = chapaRow.piezas as PiezaKey;
      const valores = piezasConValores[pieza];

      return {
        ...chapaRow,
        costo: valores ? valores.costoPorPano : 0,
        horas: valores ? valores.panos * 6 : 0,
      };
    });
    setRows(updatedRows);
  }, [chapaRows]);

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
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50">
                <td className="py-4 px-6 text-sm text-gray-700">{row.parte}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{row.piezas}</td>
                <td className="py-4 px-2 text-sm text-gray-700 w-[80px]">
                  {row.horas / 6} {/* Mostrar paños */}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700 flex space-x-2">
                  <button
                    onClick={() => console.log("Editar")}
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => console.log("Eliminar")}
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