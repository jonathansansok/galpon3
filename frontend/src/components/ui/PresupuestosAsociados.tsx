import React from "react";
import { useRouter } from "next/navigation";

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
  
    if (presupuestos.length === 0) {
      return <p className="text-gray-500">No hay presupuestos asociados.</p>;
    }
  
    return (
      <div className="mt-4 w-full">
        <h3 className="text-lg font-bold mb-4">Presupuestos Asociados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Monto</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Observaciones</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Fecha de Creación</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map((presupuesto) => (
                <tr key={presupuesto.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{presupuesto.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{presupuesto.monto || "No disponible"}</td>
                  <td className="border border-gray-300 px-4 py-2">{presupuesto.estado || "No disponible"}</td>
                  <td className="border border-gray-300 px-4 py-2">{presupuesto.observaciones || "No disponible"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(presupuesto.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      type="button" // Evitar el envío del formulario
                      onClick={() => router.push(`/portal/eventos/presupuestos/${presupuesto.id}/edit`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300"
                    >
                      Editar
                    </button>
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