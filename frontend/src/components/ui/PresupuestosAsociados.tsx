import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa"; // Importar el ícono de edición

interface Presupuesto {
  id: number;
  monto: string;
  estado: string;
  observaciones: string;
  createdAt: string;
}

interface PresupuestosAsociadosProps {
  presupuestos: Presupuesto[];
}

const PresupuestosAsociados: React.FC<PresupuestosAsociadosProps> = ({ presupuestos }) => {
  const router = useRouter();
  const [sortedPresupuestos, setSortedPresupuestos] = useState(presupuestos);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Presupuesto; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: keyof Presupuesto) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...sortedPresupuestos].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedPresupuestos(sortedData);
    setSortConfig({ key, direction });
  };

  if (presupuestos.length === 0) {
    return <p className="text-gray-500">No hay presupuestos asociados.</p>;
  }

  return (
    <div className="mt-4 w-full">
      <h3 className="text-lg font-bold mb-4">Presupuestos Asociados</h3>
      <div className="overflow-x-auto p-4 rounded-lg shadow-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-200">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID {sortConfig?.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("monto")}
              >
                Monto {sortConfig?.key === "monto" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("estado")}
              >
                Estado {sortConfig?.key === "estado" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("observaciones")}
              >
                Observaciones {sortConfig?.key === "observaciones" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Fecha de Creación {sortConfig?.key === "createdAt" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPresupuestos.map((presupuesto) => (
              <tr key={presupuesto.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center space-x-2">
                  {/* Ícono de edición */}
                  <button
                    type="button"
                    onClick={() => router.push(`/portal/eventos/presupuestos/${presupuesto.id}/edit`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <span>{presupuesto.id}</span>
                </td>
                <td className="px-4 py-2">{presupuesto.monto || "No disponible"}</td>
                <td className="px-4 py-2">{presupuesto.estado || "No disponible"}</td>
                <td className="px-4 py-2">{presupuesto.observaciones || "No disponible"}</td>
                <td className="px-4 py-2">
                  {new Date(presupuesto.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresupuestosAsociados;