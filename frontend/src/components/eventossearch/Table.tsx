//frontend\src\components\eventossearch\Table.tsx
import React, { ReactNode, useState } from "react";
import { FaEdit, FaEye, FaFilePdf } from "react-icons/fa";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string; render?: (item: T) => ReactNode }[];
  sortColumn: keyof T | null;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof T) => void;
  onRowClick: (id: string) => void;
  onEditClick: (id: string) => void;
  onViewClick: (id: string) => void;
  hasPDFs?: (item: T) => boolean; // Función opcional para verificar PDFs
}

const Table = <T extends { id: string | number }>({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  onEditClick,
  onViewClick,
  hasPDFs,
}: TableProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

  const handleRowClick = (id: string | number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto pt-0 pl-0 shadow-xl shadow-slate-500 ">
      <table className="min-w-full bg-white text-sm font-sans shadow-xl rounded-lg shadow-slate-200">
        <thead className="bg-teal-500 text-white rounded-t-lg">
          <tr>
            <th
              className="py-2 px-4 border-b text-left rounded-tl-lg"
              style={{ minWidth: "60px", borderRight: "1px solid #ccc" }}
            >
              Acciones
            </th>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="py-2 px-4 border-b text-left cursor-pointer"
                onClick={() => onSort(column.key)}
                style={{ minWidth: "50px", maxWidth: "200px", borderRight: "1px solid #ccc" }}
              >
                {column.label}{" "}
                {sortColumn === column.key ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <React.Fragment key={item.id}>
              <tr
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(item.id)}
              >
                <td
                  className="py-2 px-4 border-b whitespace-nowrap text-left"
                  style={{ minWidth: "60px", borderRight: "1px solid #ccc" }}
                >
                  <div className="flex justify-center items-center space-x-2">
                  {hasPDFs && hasPDFs(item) && (
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewClick(item.id.toString()); // Puedes cambiar la acción aquí
                        }}
                      >
                        <FaFilePdf size={18} />
                      </button>
                    )}
                    {/* Botón de edición */}
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(item.id.toString());
                      }}
                    >
                      <FaEdit size={18} />
                    </button>

                    {/* Botón de vista */}
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewClick(item.id.toString());
                      }}
                    >
                      <FaEye size={18} />
                    </button>

                    {/* Botón de PDF (si tiene PDFs) */}
                    
                  </div>
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className="py-2 px-4 border-b whitespace-nowrap text-left truncate"
                    style={{
                      minWidth: "50px",
                      maxWidth: "200px",
                      borderRight: "1px solid #ccc",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {column.render
                      ? column.render(item) // Renderiza columnas personalizadas
                      : item[column.key] as ReactNode}
                  </td>
                ))}
              </tr>
              {expandedRows.has(item.id) && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-2 px-4 border-b">
                    <div className="p-4 bg-gray-100 font-sans text-sm rounded-b-lg">
                      <div className="whitespace-pre-wrap break-words">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;