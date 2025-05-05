//frontend\src\components\ui\historialegreso\HistorialEgresosTable.tsx
import React from "react";
import { formatDate, humanizeFieldName, isFieldValid } from "./FomattersHistorial";

interface HistorialEgresosTableProps {
  columns: string[];
  historial: any[];
}

const HistorialEgresosTable: React.FC<HistorialEgresosTableProps> = ({
  columns,
  historial,
}) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((column) => (
            <th
              key={column}
              className="border border-gray-300 px-4 py-2 text-left"
            >
              {humanizeFieldName(column)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {historial.map((egreso, index) => (
          <tr key={index} className="bg-white hover:bg-gray-100">
            {columns.map((column) => (
              <td key={column} className="border border-gray-300 px-4 py-2">
                {column === "fechaNacimiento"
                  ? formatDate(egreso.datos[column])
                  : column === "fechaHoraIng"
                  ? formatDate(egreso.datos[column])
                  : column === "fechaEgreso"
                  ? formatDate(egreso[column])
                  : column === "historial"
                  ? egreso.historial
                    ? egreso.historial
                        .split(/(?=\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})/)
                        .join("\n")
                    : "Sin datos"
                  : column in egreso.datos
                  ? egreso.datos[column]
                  : ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistorialEgresosTable;