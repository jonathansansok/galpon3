"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabTurnos.tsx
import { useState, useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getTurnosWithPresupuestoData } from "../../turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function TabTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);
  const selectedTurno = useRepairStore((s) => s.selectedTurno);
  const selectTurno = useRepairStore((s) => s.selectTurno);

  // Auto-cargar cuando cambia el presupuesto seleccionado
  useEffect(() => {
    console.log("[linear] TabTurnos selectedPresupuesto changed:", selectedPresupuesto?.id);
    handleLoadData();
  }, [selectedPresupuesto]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    console.log("[linear] TabTurnos handleLoadData, presupuestoId:", selectedPresupuesto?.id);
    setLoading(true);
    try {
      const data = await getTurnosWithPresupuestoData();
      const list = Array.isArray(data) ? data : [];
      setTurnos(list);
      console.log("[linear] TabTurnos loaded", list.length, "turnos total");
    } catch (error) {
      console.error("[linear] TabTurnos error loading:", error);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (turno: Turno) => {
    console.log("[linear] TabTurnos handleSelect:", turno.id, turno.estado);
    selectTurno(turno);
  };

  // Filtrar por presupuesto seleccionado
  const byPresupuesto = selectedPresupuesto
    ? turnos.filter((t) => t.presupuestoId === String(selectedPresupuesto.uuid ?? selectedPresupuesto.id))
    : turnos;

  const filtered = query.length >= 2
    ? byPresupuesto.filter((t) =>
        `${t.patente ?? ""} ${t.marca ?? ""} ${t.modelo ?? ""} ${t.estado ?? ""} plaza ${t.plaza}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : byPresupuesto;

  const estadoColor: Record<string, string> = {
    Programado: "bg-blue-100 text-blue-800",
    "En curso": "bg-yellow-100 text-yellow-800",
    Finalizado: "bg-green-100 text-green-800",
    Cancelado: "bg-red-100 text-red-800",
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleString("es-AR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Turnos</h2>
        <Link href="/portal/eventos/turnos/new" className={buttonVariants()}>
          + Agregar Turno
        </Link>
      </div>

      {selectedPresupuesto && (
        <div className="text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-md border border-purple-200">
          Filtrando por presupuesto: <strong>#{selectedPresupuesto.id}{selectedPresupuesto.monto ? ` — $${selectedPresupuesto.monto}` : ""}</strong>
          <span className="ml-2 text-purple-600">({byPresupuesto.length} turno{byPresupuesto.length !== 1 ? "s" : ""})</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleLoadData}
          disabled={loading}
          className={buttonVariants({ variant: "outline" })}
        >
          {loading ? "Cargando..." : "Recargar turnos"}
        </button>
      </div>

      {turnos.length > 0 && (
        <input
          type="text"
          placeholder="Buscar por patente, marca, estado, plaza..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      )}

      {selectedTurno && (
        <div className="text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-md border border-purple-200">
          Seleccionado: <strong>Turno #{selectedTurno.id} — Plaza {selectedTurno.plaza} — {selectedTurno.estado}</strong>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Plaza</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Patente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Inicio estimado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Fin estimado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((turno) => {
                const isSelected = selectedTurno?.id === turno.id;
                return (
                  <tr
                    key={turno.id}
                    onClick={() => handleSelect(turno)}
                    className={`cursor-pointer border-t border-gray-100 transition ${
                      isSelected
                        ? "bg-purple-100 hover:bg-purple-150"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-500">{turno.id}</td>
                    <td className="px-4 py-3 font-medium">Plaza {turno.plaza}</td>
                    <td className="px-4 py-3">{turno.patente || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{formatFecha(turno.fechaHoraInicioEstimada)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatFecha(turno.fechaHoraFinEstimada)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[turno.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {turno.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/portal/eventos/turnos/${turno.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline text-xs mr-2"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/portal/eventos/turnos/${turno.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:underline text-xs"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          {loading
            ? "Cargando..."
            : selectedPresupuesto
            ? "Este presupuesto no tiene turnos asignados."
            : "Hacé clic en \"Recargar turnos\" para ver los registros."}
        </p>
      )}
    </div>
  );
}
