//frontend\src\components\ui\ChapaTable.tsx
import React, { useState } from "react";
import { FaTrash, FaPlus, FaSync, FaEdit, FaCheck, FaPencilAlt } from "react-icons/fa";
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
  initialRows = [],
}: {
  onRowsChange: (rows: ChapaRow[]) => void;
  piezasDB?: Pieza[];
  partesDB?: Parte[];
  onRefreshPiezas?: () => void;
  initialRows?: ChapaRow[];
}) {
  const [rows, setRows] = useState<ChapaRow[]>(initialRows);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<ChapaRow>({
    id: 0,
    parte: "",
    piezas: "",
    accion: "",
    especificacion: "",
    horas: 0,
    costo: 0,
  });

  // Filtrar piezas DB: solo tipo chapa
  const piezasDBChapa = piezasDB.filter((p) => p.tipo === "chapa");

  // Helper: obtener piezas DB filtradas por parte
  const getPiezasForParte = (parteNombre: string) => ({
    conParte: piezasDBChapa.filter((p) => p.parte && p.parte.nombre === parteNombre),
    sinParte: piezasDBChapa.filter((p) => !p.parte && !p.parteId),
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
    const dbPieza = piezasDBChapa.find((p) => p.nombre === val);
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

  const handleEditParteChange = (rowId: number, val: string) => {
    const newRows = rows.map((row) =>
      row.id === rowId ? { ...row, parte: val, piezas: "", horas: 0, costo: 0 } : row
    );
    updateRows(newRows);
  };

  const handleEditPiezaChange = (rowId: number, val: string) => {
    const hardcoded = piezasConValores[val as PiezaKey];
    if (hardcoded) {
      updateRows(rows.map((row) =>
        row.id === rowId ? { ...row, piezas: val, horas: hardcoded.horas, costo: hardcoded.costo } : row
      ));
      return;
    }
    const dbPieza = piezasDBChapa.find((p) => p.nombre === val);
    if (dbPieza) {
      updateRows(rows.map((row) =>
        row.id === rowId ? { ...row, piezas: val, horas: dbPieza.horas || 0, costo: dbPieza.costo || 0 } : row
      ));
      return;
    }
    handleEditRow(rowId, "piezas", val);
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
              <th className="py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider w-[100px]">
                Costo
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
            {rows.map((row) => {
              const isEditing = editingRowId === row.id;
              const { conParte: editPiezasConParte, sinParte: editPiezasSinParte } = getPiezasForParte(row.parte);
              return (
              <tr key={row.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 text-sm text-gray-700">
                  {isEditing ? (
                    <select
                      value={row.parte}
                      onChange={(e) => handleEditParteChange(row.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione una parte</option>
                      {Object.keys(partesChapa).map((parte) => (
                        <option key={parte} value={parte}>{parte}</option>
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
                  ) : row.parte}
                </td>
                <td className="py-4 px-6 text-sm text-gray-700">
                  {isEditing ? (
                    <select
                      value={row.piezas}
                      onChange={(e) => handleEditPiezaChange(row.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione una pieza</option>
                      {partesChapa[row.parte as ParteKey]
                        ?.slice(1)
                        .map((pieza) => (
                          <option key={pieza} value={pieza}>{pieza}</option>
                        ))}
                      {editPiezasConParte.length > 0 && (
                        <optgroup label="Piezas del sistema">
                          {editPiezasConParte.map((p) => (
                            <option key={`db-${p.id}`} value={p.nombre}>
                              {p.nombre}{p.medida ? ` (${p.medida})` : ""}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {editPiezasSinParte.length > 0 && (
                        <optgroup label="Sin parte asignada">
                          {editPiezasSinParte.map((p) => (
                            <option key={`db-sp-${p.id}`} value={p.nombre}>
                              {p.nombre}{p.medida ? ` (${p.medida})` : ""}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  ) : row.piezas}
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
                <td className="py-4 px-2 text-sm text-gray-700 w-[100px]">
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
                  <div className="flex gap-2">
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => setEditingRowId(null)}
                        className="text-green-500 hover:text-green-700 transition duration-200"
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingRowId(row.id)}
                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                      >
                        <FaPencilAlt />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
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
                    {(() => {
                      const { conParte: newPiezasConParte, sinParte: newPiezasSinParte } = getPiezasForParte(newRow.parte);
                      return (
                        <>
                          {partesChapa[newRow.parte as ParteKey]
                            ?.slice(1)
                            .map((pieza) => (
                              <option key={pieza} value={pieza}>
                                {pieza}
                              </option>
                            ))}
                          {newPiezasConParte.length > 0 && (
                            <optgroup label="Piezas del sistema">
                              {newPiezasConParte.map((p) => (
                                <option key={`db-${p.id}`} value={p.nombre}>
                                  {p.nombre}{p.medida ? ` (${p.medida})` : ""}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {newPiezasSinParte.length > 0 && (
                            <optgroup label="Sin parte asignada">
                              {newPiezasSinParte.map((p) => (
                                <option key={`db-sp-${p.id}`} value={p.nombre}>
                                  {p.nombre}{p.medida ? ` (${p.medida})` : ""}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </>
                      );
                    })()}
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
              <td className="py-4 px-2 w-[100px]">
                <input
                  type="number"
                  value={newRow.costo}
                  onChange={(e) =>
                    setNewRow({
                      ...newRow,
                      costo: parseFloat(e.target.value) || 0,
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
