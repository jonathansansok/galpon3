// frontend/src/components/mapsTable/mapsTable.tsx

import React, { useState } from "react";
import { Ingreso } from "@/types/Ingreso"; // Importa la interfaz Ingreso
import TableRow from "./TableRow"; // Importa el componente TableRow

interface MapsTableProps {
  searchResults: Ingreso[];
  onRowClick: (id: string) => void;
  handleAddClick: (id: string) => void;
  handleRemoveClick: (id: string) => void;
}

const MapsTable = ({
  searchResults,
  onRowClick,
  handleAddClick,
  handleRemoveClick,
}: MapsTableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (id: string) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
    onRowClick(id);
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof Ingreso];
    const bValue = b[sortColumn as keyof Ingreso];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white text-sm mb-5">
        <thead className="bg-teal-300">
          <tr>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
            <th className="py-2 px-4 border-b text-left">Rostro</th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("apellido")}
              style={{ maxWidth: "4cm" }}
            >
              Apellido{" "}
              {sortColumn === "apellido"
                ? sortDirection === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("nombres")}
              style={{ maxWidth: "4cm" }}
            >
              Nombres{" "}
              {sortColumn === "nombres"
                ? sortDirection === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("lpu")}
              style={{ maxWidth: "4cm" }}
            >
              LPU{" "}
              {sortColumn === "lpu"
                ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("tipoDoc")}
              style={{ maxWidth: "4cm" }}
            >
              Tipo Doc{" "}
              {sortColumn === "tipoDoc"
                ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("numeroDni")}
              style={{ maxWidth: "4cm" }}
            >
              Número DNI{" "}
              {sortColumn === "numeroDni"
                ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("cualorg")}
              style={{ maxWidth: "4cm" }}
            >
              G. Do.{" "}
              {sortColumn === "cualorg"
                ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("ubicacionMap")}
              style={{ maxWidth: "4cm" }}
            >
              Ubicación en el Mapa{" "}
              {sortColumn === "ubicacionMap"
                ? sortDirection === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th
              className="py-2 px-4 border-b text-left cursor-pointer"
              onClick={() => handleSort("condicion")}
              style={{ maxWidth: "4cm" }}
            >
              Condición{" "}
              {sortColumn === "condicion"
                ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              onRowClick={onRowClick}
              handleAddClick={handleAddClick}
              handleRemoveClick={handleRemoveClick} // Pasar esta línea
              expanded={expandedRows.includes(item.id.toString())}
              handleRowClick={handleRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapsTable;