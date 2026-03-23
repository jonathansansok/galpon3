//frontend\src\app\portal\eventos\trabajos-realizados\TrabajosRealizadosPage.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrabajosRealizados, deleteTrabajoRealizado } from "./TrabajosRealizados.api";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TrabajosRealizadosPage() {
  const router = useRouter();
  const [trabajos, setTrabajos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTrabajos = () => {
    setLoading(true);
    getTrabajosRealizados()
      .then(setTrabajos)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrabajos(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este trabajo realizado?")) return;
    const result = await deleteTrabajoRealizado(String(id));
    if (result.success) fetchTrabajos();
    else alert("Error al eliminar: " + result.error);
  };

  const filtered = trabajos.filter((t) =>
    [t.descripcion, t.monto, t.turnoId]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trabajos Realizados</h1>
        <button
          onClick={() => router.push("/portal/eventos/trabajos-realizados/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Nuevo
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Turno ID</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Sin registros
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{formatDate(t.fechaRealiz)}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{t.descripcion || "—"}</td>
                    <td className="px-4 py-3">{t.monto ? `$${t.monto}` : "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.turnoId || "—"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => router.push(`/portal/eventos/trabajos-realizados/${t.id}`)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => router.push(`/portal/eventos/trabajos-realizados/${t.id}/edit`)}
                        className="text-teal-600 hover:underline text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
