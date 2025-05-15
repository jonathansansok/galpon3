//frontend\src\components\ui\MovilesTable.tsx
import React, { useState } from "react";
import { FaSortUp, FaSortDown, FaEdit } from "react-icons/fa";
import Image from "next/image";

interface MovilesTableProps {
  moviles: any[];
  selectedMoviles: number[];
  toggleSelection: (id: number) => void;
}

const MovilesTable: React.FC<MovilesTableProps> = ({
  moviles,
  selectedMoviles,
  toggleSelection,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const sortedMoviles = [...moviles].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key] || "";
    const bValue = b[key] || "";
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Creado el{" "}
              <span className="inline-flex">
                <FaSortUp className={`ml-1 ${sortConfig?.key === "createdAt" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}`} />
                <FaSortDown className={`ml-1 ${sortConfig?.key === "createdAt" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}`} />
              </span>
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("updatedAt")}
            >
              Actualizado el{" "}
              <span className="inline-flex">
                <FaSortUp className={`ml-1 ${sortConfig?.key === "updatedAt" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}`} />
                <FaSortDown className={`ml-1 ${sortConfig?.key === "updatedAt" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}`} />
              </span>
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("patente")}
            >
              Patente{" "}
              <span className="inline-flex">
                <FaSortUp className={`ml-1 ${sortConfig?.key === "patente" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}`} />
                <FaSortDown className={`ml-1 ${sortConfig?.key === "patente" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}`} />
              </span>
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("marca")}
            >
              Marca{" "}
              <span className="inline-flex">
                <FaSortUp className={`ml-1 ${sortConfig?.key === "marca" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}`} />
                <FaSortDown className={`ml-1 ${sortConfig?.key === "marca" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}`} />
              </span>
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("modelo")}
            >
              Modelo{" "}
              <span className="inline-flex">
                <FaSortUp className={`ml-1 ${sortConfig?.key === "modelo" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}`} />
                <FaSortDown className={`ml-1 ${sortConfig?.key === "modelo" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}`} />
              </span>
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("anio")}
            >
              Año{" "}
              <span className="inline-flex">
                <FaSortUp className={`ml-1 ${sortConfig?.key === "anio" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}`} />
                <FaSortDown className={`ml-1 ${sortConfig?.key === "anio" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}`} />
              </span>
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Imagen</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedMoviles.map((movil) => (
            <tr
              key={movil.id}
              onClick={() => toggleSelection(movil.id)}
              className={`cursor-pointer ${
                selectedMoviles.includes(movil.id) ? "bg-green-100" : "bg-white"
              } hover:bg-green-50`}
            >
              <td className="border border-gray-300 px-4 py-2">
                {new Date(movil.createdAt).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(movil.updatedAt).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{movil.patente || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{movil.marca || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{movil.modelo || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{movil.anio || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {movil.imagen ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${movil.imagen}`}
                    alt={`Imagen del móvil ${movil.patente}`}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sin imagen</span>
                  </div>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={`/portal/eventos/temas/${movil.id}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => e.stopPropagation()} // Evitar que seleccione el móvil al hacer clic en "Editar"
                >
                  <FaEdit size={18} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovilesTable;