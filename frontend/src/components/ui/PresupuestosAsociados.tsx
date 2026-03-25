import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface Presupuesto {
  id: number;
  monto: string;
  estado: string;
  observaciones: string;
  createdAt: string;
  imagen?: string | null;
  imagenDer?: string | null;
  imagenIz?: string | null;
  imagenDact?: string | null;
  imagenSen1?: string | null;
  imagenSen2?: string | null;
  imagenSen3?: string | null;
  imagenSen4?: string | null;
  imagenSen5?: string | null;
  imagenSen6?: string | null;
  pdf1?: string | null;
  pdf2?: string | null;
  pdf3?: string | null;
  pdf4?: string | null;
  pdf5?: string | null;
  pdf6?: string | null;
  pdf7?: string | null;
  pdf8?: string | null;
  pdf9?: string | null;
  pdf10?: string | null;
}

interface PresupuestosAsociadosProps {
  presupuestos: Presupuesto[];
}

const PresupuestosAsociados: React.FC<PresupuestosAsociadosProps> = ({ presupuestos }) => {
  const [sortedPresupuestos, setSortedPresupuestos] = useState(presupuestos);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Presupuesto; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: keyof Presupuesto) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sortedData = [...sortedPresupuestos].sort((a, b) => {
      const av = String(a[key] ?? "");
      const bv = String(b[key] ?? "");
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
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
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("id")}>
                ID {sortConfig?.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("monto")}>
                Monto {sortConfig?.key === "monto" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("estado")}>
                Estado {sortConfig?.key === "estado" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("observaciones")}>
                Observaciones {sortConfig?.key === "observaciones" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th className="px-4 py-2 text-left">Archivos</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>
                Fecha de Creación {sortConfig?.key === "createdAt" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPresupuestos.map((presupuesto) => {
              const imgCount = [
                presupuesto.imagen, presupuesto.imagenDer, presupuesto.imagenIz,
                presupuesto.imagenDact, presupuesto.imagenSen1, presupuesto.imagenSen2,
                presupuesto.imagenSen3, presupuesto.imagenSen4, presupuesto.imagenSen5,
                presupuesto.imagenSen6,
              ].filter(Boolean).length;

              const pdfCount = [
                presupuesto.pdf1, presupuesto.pdf2, presupuesto.pdf3, presupuesto.pdf4,
                presupuesto.pdf5, presupuesto.pdf6, presupuesto.pdf7, presupuesto.pdf8,
                presupuesto.pdf9, presupuesto.pdf10,
              ].filter(Boolean).length;

              return (
                <tr key={presupuesto.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <a href={`/portal/eventos/presupuestos/${presupuesto.id}/edit`} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </a>
                    <span>{presupuesto.id}</span>
                  </td>
                  <td className="p-0">
                    <a href={`/portal/eventos/presupuestos/${presupuesto.id}/edit`} className="block px-4 py-2" style={{ color: "inherit", textDecoration: "none" }}>
                      {presupuesto.monto || "No disponible"}
                    </a>
                  </td>
                  <td className="p-0">
                    <a href={`/portal/eventos/presupuestos/${presupuesto.id}/edit`} className="block px-4 py-2" style={{ color: "inherit", textDecoration: "none" }}>
                      {presupuesto.estado || "No disponible"}
                    </a>
                  </td>
                  <td className="p-0">
                    <a href={`/portal/eventos/presupuestos/${presupuesto.id}/edit`} className="block px-4 py-2" style={{ color: "inherit", textDecoration: "none" }}>
                      {presupuesto.observaciones || "No disponible"}
                    </a>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {imgCount > 0 && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-1">
                        📷 {imgCount}
                      </span>
                    )}
                    {pdfCount > 0 && (
                      <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                        PDF {pdfCount}
                      </span>
                    )}
                    {imgCount === 0 && pdfCount === 0 && (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-0">
                    <a href={`/portal/eventos/presupuestos/${presupuesto.id}/edit`} className="block px-4 py-2" style={{ color: "inherit", textDecoration: "none" }}>
                      {new Date(presupuesto.createdAt).toLocaleString()}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresupuestosAsociados;
