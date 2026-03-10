//frontend\src\components\ui\PinturaTable.tsx
import React, { useState } from "react";
import { FaTrash, FaPlus, FaSync, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { Pieza } from "@/types/Pieza";
import { Parte } from "@/types/Parte";

export interface PinturaRow {
  id: number;
  parte: string;
  piezas: string;
  pintarDifuminar: string;
  tipoPintura: string;
  especificacion: string;
  horas: number;
  costo: number;
}

const partesPintura = {
  "Pintura Completa": ["P.C.", "Color Base", "Capa Final"],
  Techo: ["T.", "Polarizado", "Impermeabilizacion"],
  "Lado Derecho": ["LD", "Puerta", "Retrovisor", "Manija Conductor"],
  "Lado Izquierdo": ["LI", "Puerta Izquierda", "Retrovisor Izquierdo"],
};

const piezasConValores = {
  "Color Base": { costoPorPano: 50, panos: 1 },
  "Capa Final": { costoPorPano: 50, panos: 1 },
  Polarizado: { costoPorPano: 70, panos: 1 },
  Impermeabilizacion: { costoPorPano: 90, panos: 1 },
  Puerta: { costoPorPano: 120, panos: 1 },
  Retrovisor: { costoPorPano: 60, panos: 1 },
  "Manija Conductor": { costoPorPano: 40, panos: 1 },
  "Puerta Izquierda": { costoPorPano: 110, panos: 1 },
  "Retrovisor Izquierdo": { costoPorPano: 55, panos: 1 },
};

type ParteKey = keyof typeof partesPintura;
type PiezaKey = keyof typeof piezasConValores;

const TIPO_PINTURA_FACTOR: Record<string, number> = {
  Bicapa: 1.0,
  Monocapa: 0.7,
  Tricapa: 1.3,
};

function calcularCostoPintura(costoPorPano: number, panos: number, tipoPintura: string): number {
  const factor = TIPO_PINTURA_FACTOR[tipoPintura] || 1.0;
  return panos * costoPorPano * factor;
}

export default function PinturaTable({
  onRowsChange,
  piezasDB = [],
  partesDB = [],
  onRefreshPiezas,
}: {
  onRowsChange: (rows: PinturaRow[]) => void;
  piezasDB?: Pieza[];
  partesDB?: Parte[];
  onRefreshPiezas?: () => void;
}) {
  const [rows, setRows] = useState<PinturaRow[]>([]);
  const [newRow, setNewRow] = useState<PinturaRow>({
    id: 0,
    parte: "",
    piezas: "",
    pintarDifuminar: "",
    tipoPintura: "Bicapa",
    especificacion: "",
    horas: 0,
    costo: 0,
  });

  // Filtrar piezas DB: solo tipo pintura y que coincidan con la parte seleccionada
  const piezasDBFiltradas = piezasDB.filter((p) => {
    if (p.tipo !== "pintura") return false;
    if (!newRow.parte) return false;
    if (!p.parte) return true;
    return p.parte.nombre === newRow.parte;
  });

  // Partes DB que no estan en las hardcoded
  const partesDBExtra = partesDB.filter(
    (p) => !Object.keys(partesPintura).includes(p.nombre)
  );

  // Obtener costoPorPano de una pieza (hardcoded o DB)
  const getCostoPorPano = (piezaNombre: string): number => {
    const hardcoded = piezasConValores[piezaNombre as PiezaKey];
    if (hardcoded) return hardcoded.costoPorPano;
    const dbPieza = piezasDBFiltradas.find((p) => p.nombre === piezaNombre);
    if (dbPieza) return dbPieza.costoPorPano || 0;
    return 0;
  };

  const updateRows = (newRows: PinturaRow[]) => {
    setRows(newRows);
    onRowsChange(newRows);
  };

  const handleAddRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!newRow.parte || !newRow.piezas) {
      alert("Por favor, complete Parte y Pieza.");
      return;
    }

    const addedRows = [...rows, { ...newRow, id: Date.now() }];
    updateRows(addedRows);
    setNewRow({
      id: 0,
      parte: "",
      piezas: "",
      pintarDifuminar: "",
      tipoPintura: "Bicapa",
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
    field: keyof PinturaRow,
    value: string | number
  ) => {
    const newRows = rows.map((row) => {
      if (row.id !== id) return row;
      const updated = { ...row, [field]: value };

      // Recalcular costo si cambian panos o tipo de pintura
      if (field === "horas" || field === "tipoPintura") {
        const panos = field === "horas" ? (value as number) / 6 : updated.horas / 6;
        const costoPorPano = getCostoPorPano(updated.piezas);
        updated.costo = calcularCostoPintura(costoPorPano, panos, updated.tipoPintura);
      }

      return updated;
    });
    updateRows(newRows);
  };

  const handlePiezaChange = (pieza: string) => {
    // Primero buscar en hardcoded
    const hardcoded = piezasConValores[pieza as PiezaKey];
    if (hardcoded) {
      const horas = hardcoded.panos * 6;
      const costo = calcularCostoPintura(hardcoded.costoPorPano, hardcoded.panos, newRow.tipoPintura);
      setNewRow({ ...newRow, piezas: pieza, horas, costo });
      return;
    }
    // Buscar en piezas DB
    const dbPieza = piezasDBFiltradas.find((p) => p.nombre === pieza);
    if (dbPieza) {
      const panos = dbPieza.panos || 0;
      const costoPorPano = dbPieza.costoPorPano || 0;
      const horas = panos * 6;
      const costo = calcularCostoPintura(costoPorPano, panos, newRow.tipoPintura);
      setNewRow({ ...newRow, piezas: pieza, horas, costo });
      return;
    }
    // Sin valores
    setNewRow({ ...newRow, piezas: pieza, horas: 0, costo: 0 });
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
                Panos
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Pintar o difuminar
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Tipo de Pintura
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
              <tr key={row.id} className="hover:bg-blue-50">
                <td className="py-4 px-6 text-sm text-gray-700">{row.parte}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{row.piezas}</td>
                <td className="py-4 px-2 text-sm text-gray-700 w-[80px]">
                  <input
                    type="number"
                    value={row.horas / 6}
                    onChange={(e) => {
                      const panos = parseFloat(e.target.value) || 0;
                      const horas = panos * 6;
                      handleEditRow(row.id, "horas", horas);
                    }}
                    className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  <select
                    value={row.pintarDifuminar}
                    onChange={(e) =>
                      handleEditRow(row.id, "pintarDifuminar", e.target.value)
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
                    value={row.tipoPintura}
                    onChange={(e) =>
                      handleEditRow(row.id, "tipoPintura", e.target.value)
                    }
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
            {/* Fila de entrada */}
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
                  {Object.keys(partesPintura).map((parte) => (
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
                    {partesPintura[newRow.parte as ParteKey]
                      ?.slice(1)
                      .map((pieza) => (
                        <option key={pieza} value={pieza}>
                          {pieza} -{" "}
                          {piezasConValores[pieza as PiezaKey]?.panos || 0} panos
                        </option>
                      ))}
                    {piezasDBFiltradas.length > 0 && (
                      <optgroup label="Piezas del sistema">
                        {piezasDBFiltradas.map((p) => (
                          <option key={`db-${p.id}`} value={p.nombre}>
                            {p.nombre}{p.panos ? ` - ${p.panos} panos` : ""}{p.medida ? ` (${p.medida})` : ""}
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
                  value={newRow.horas / 6 || 0}
                  onChange={(e) => {
                    const panos = parseFloat(e.target.value) || 0;
                    const horas = panos * 6;
                    const costoPorPano = getCostoPorPano(newRow.piezas);
                    const costo = calcularCostoPintura(costoPorPano, panos, newRow.tipoPintura);

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
                  value={newRow.pintarDifuminar}
                  onChange={(e) =>
                    setNewRow({ ...newRow, pintarDifuminar: e.target.value })
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
                  value={newRow.tipoPintura}
                  onChange={(e) => {
                    const tipoPintura = e.target.value;
                    const panos = newRow.horas / 6;
                    const costoPorPano = getCostoPorPano(newRow.piezas);
                    const costo = calcularCostoPintura(costoPorPano, panos, tipoPintura);
                    setNewRow({ ...newRow, tipoPintura, costo });
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
                  placeholder="Especificacion"
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
