//frontend\src\components\ui\ChapaTable.tsx
import React, { useState } from "react";
import { FaTrash, FaPlus, FaSync, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { Pieza } from "@/types/Pieza";
import { Parte } from "@/types/Parte";

export interface ChapaRow {
  id: number;
  parte: string;
  piezas: string;
  accion: string;
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
  onRowsChange,
  piezasDB = [],
  partesDB = [],
  onRefreshPiezas,
}: {
  onRowsChange: (rows: ChapaRow[]) => void;
  piezasDB?: Pieza[];
  partesDB?: Parte[];
  onRefreshPiezas?: () => void;
}) {
  const [rows, setRows] = useState<ChapaRow[]>([]);
  const [newRow, setNewRow] = useState<ChapaRow>({
    id: 0,
    parte: "",
    piezas: "",
    accion: "",
    especificacion: "",
    horas: 0,
    costo: 0,
  });

  // Filtrar piezas DB: solo tipo chapa y que coincidan con la parte seleccionada
  const piezasDBFiltradas = piezasDB.filter((p) => {
    if (p.tipo !== "chapa") return false;
    if (!newRow.parte) return false;
    if (!p.parte) return true;
    return p.parte.nombre === newRow.parte;
  });

  // Partes DB que no estan en las hardcoded
  const partesDBExtra = partesDB.filter(
    (p) => !Object.keys(partesChapa).includes(p.nombre)
  );

  const updateRows = (newRows: ChapaRow[]) => {
    setRows(newRows);
    onRowsChange(newRows);
  };

  const handleAddRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!newRow.parte || !newRow.piezas || !newRow.accion) {
      alert("Por favor, complete Parte, Pieza y Acción.");
      return;
    }

    const addedRows = [...rows, { ...newRow, id: Date.now() }];
    updateRows(addedRows);
    setNewRow({
      id: 0,
      parte: "",
      piezas: "",
      accion: "",
      especificacion: "",
      horas: 0,
      costo: 0,
    });
  };

  const handleDeleteRow = (id: number) => {
    updateRows(rows.filter((row) => row.id !== id));
  };

  const handleEditRow = (
    id: number,
    field: keyof ChapaRow,
    value: number | string
  ) => {
    const newRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    updateRows(newRows);
  };

  const handlePiezaChange = (val: string) => {
    // Primero buscar en hardcoded
    const hardcoded = piezasConValores[val as PiezaKey];
    if (hardcoded) {
      setNewRow({
        ...newRow,
        piezas: val,
        horas: hardcoded.horas,
        costo: hardcoded.costo,
      });
      return;
    }
    // Buscar en piezas DB
    const dbPieza = piezasDBFiltradas.find((p) => p.nombre === val);
    if (dbPieza) {
      setNewRow({
        ...newRow,
        piezas: val,
        horas: dbPieza.horas || 0,
        costo: dbPieza.costo || 0,
      });
      return;
    }
    // Sin valores
    setNewRow({ ...newRow, piezas: val, horas: 0, costo: 0 });
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
                Accion
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Especificacion
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
                <td className="py-4 px-6 text-sm text-gray-700">
                  {row.piezas}
                </td>
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
                    value={row.accion}
                    onChange={(e) =>
                      handleEditRow(row.id, "accion", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione una accion</option>
                    <option value="Sustituir">Sustituir</option>
                    <option value="Reparar">Reparar</option>
                    <option value="Verificar">Verificar</option>
                    <option value="Desmontar y Montar">
                      Desmontar y Montar
                    </option>
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
                    placeholder="Especificacion"
                  />
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
                    setNewRow({ ...newRow, parte: e.target.value, piezas: "", horas: 0, costo: 0 })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una parte</option>
                  {Object.keys(partesChapa).map((parte) => (
                    <option key={parte} value={parte}>
                      {parte}
                    </option>
                  ))}
                  {partesDBExtra.length > 0 && (
                    <optgroup label="Partes del sistema">
                      {partesDBExtra.map((p) => (
                        <option key={`db-parte-${p.id}`} value={p.nombre}>
                          {p.nombre}{p.abreviatura ? ` (${p.abreviatura})` : ""}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-1">
                  <select
                    value={newRow.piezas}
                    onChange={(e) => handlePiezaChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione una pieza</option>
                    {partesChapa[newRow.parte as ParteKey]
                      ?.slice(1)
                      .map((pieza) => (
                        <option key={pieza} value={pieza}>
                          {pieza}
                        </option>
                      ))}
                    {piezasDBFiltradas.length > 0 && (
                      <optgroup label="Piezas del sistema">
                        {piezasDBFiltradas.map((p) => (
                          <option key={`db-${p.id}`} value={p.nombre}>
                            {p.nombre}{p.medida ? ` (${p.medida})` : ""}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onRefreshPiezas?.(); }}
                    className="text-green-500 hover:text-green-700 p-1"
                    title="Actualizar piezas"
                  >
                    <FaSync size={14} />
                  </button>
                  <Link
                    href="/portal/eventos/piezas/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 p-1"
                    title="Crear nueva pieza"
                  >
                    <FaEdit size={14} />
                  </Link>
                </div>
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
                  value={newRow.accion}
                  onChange={(e) =>
                    setNewRow({ ...newRow, accion: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una accion</option>
                  <option value="Sustituir">Sustituir</option>
                  <option value="Reparar">Reparar</option>
                  <option value="Verificar">Verificar</option>
                  <option value="Desmontar y Montar">Desmontar y Montar</option>
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
                  placeholder="Especificacion"
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
