"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabTurnos.tsx
import { useState, useEffect, useRef } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getTurnosWithPresupuestoData } from "../../turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import { buttonVariants } from "@/components/ui/button";
import { TurnoForm } from "../../turnos/new/TurnoForm";
import Link from "next/link";

export default function TabTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedEditId, setExpandedEditId] = useState<number | null>(null);
  const [scrollBackToId, setScrollBackToId] = useState<number | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const editFormRef  = useRef<HTMLDivElement>(null);
  const newFormRef   = useRef<HTMLDivElement>(null);
  const rowRefs      = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const lastEditedId = useRef<number | null>(null);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);
  const selectedTurno = useRepairStore((s) => s.selectedTurno);
  const selectTurno = useRepairStore((s) => s.selectTurno);

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

  useEffect(() => {
    if (expandedEditId !== null)
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expandedEditId]);

  useEffect(() => {
    if (showNewForm)
      newFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showNewForm]);

  useEffect(() => {
    if (scrollBackToId !== null && !loading) {
      rowRefs.current.get(scrollBackToId)?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightId(scrollBackToId);
      setScrollBackToId(null);
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, [scrollBackToId, loading]);

  const handleToggleEdit = (id: number) => {
    const next = expandedEditId === id ? null : id;
    console.log("[linear] TabTurnos setExpandedEditId:", next);
    if (next !== null) lastEditedId.current = id;
    setExpandedEditId(next);
    if (next !== null) setShowNewForm(false);
  };

  const handleToggleNew = () => {
    const next = !showNewForm;
    console.log("[linear] TabTurnos showNewForm:", next, "presupuestoId:", selectedPresupuesto?.uuid ?? selectedPresupuesto?.id);
    setShowNewForm(next);
    if (next) setExpandedEditId(null);
  };

  const handleEditSuccess = () => {
    console.log("[linear] TabTurnos handleEdit success, reloading");
    const id = lastEditedId.current;
    setExpandedEditId(null);
    setScrollBackToId(id);
    handleLoadData();
  };

  const handleNewSuccess = () => {
    console.log("[linear] TabTurnos handleNew success, reloading");
    setShowNewForm(false);
    handleLoadData();
  };

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
    "En curso": "bg-violet-100 text-violet-800",
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

  const turnoPreset = selectedPresupuesto
    ? { presupuestoId: selectedPresupuesto.uuid ?? String(selectedPresupuesto.id) }
    : null;

  const editingItem = expandedEditId !== null ? turnos.find((t) => t.id === expandedEditId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Turnos</h2>
        <div>
          <button
            onClick={handleToggleNew}
            className={showNewForm ? buttonVariants({ variant: "outline" }) : "bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"}
          >
            {showNewForm ? "✕ Cancelar" : "+ Agregar Turno"}
          </button>
        </div>
      </div>

      {selectedPresupuesto && (
        <div className="text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-md border border-purple-200">
          Filtrando por presupuesto: <strong>#{selectedPresupuesto.id}{selectedPresupuesto.monto ? ` — $${selectedPresupuesto.monto}` : ""}</strong>
          <span className="ml-2 text-purple-600">({byPresupuesto.length} turno{byPresupuesto.length !== 1 ? "s" : ""})</span>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={handleLoadData} disabled={loading} className={buttonVariants({ variant: "outline" })}>
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
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-3 py-3 w-20" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Plaza</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Patente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Inicio estimado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Fin estimado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Reparador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((turno) => {
                const isSelected = selectedTurno?.id === turno.id;
                const isEditing = expandedEditId === turno.id;
                return (
                  <tr
                    key={turno.id}
                    ref={(el) => { if (el) rowRefs.current.set(turno.id, el); else rowRefs.current.delete(turno.id); }}
                    onClick={() => handleSelect(turno)}
                    className={`cursor-pointer transition-all duration-700 ${
                      highlightId === turno.id ? "bg-green-200 ring-1 ring-inset ring-green-400" :
                      isEditing ? "bg-purple-50" : isSelected ? "bg-purple-50" : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className="px-3 py-2.5 w-20">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/portal/eventos/turnos/${turno.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Ver detalle"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </Link>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleEdit(turno.id); }}
                          title={isEditing ? "Cerrar" : "Editar"}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                            isEditing ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {isEditing ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.643-.643Z" />
                              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{turno.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">Plaza {turno.plaza}</td>
                    <td className="px-4 py-3 text-gray-700">{turno.patente || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatFecha(turno.fechaHoraInicioEstimada)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatFecha(turno.fechaHoraFinEstimada)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[turno.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {turno.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {turno.reparadoresTexto || <span className="text-gray-300">—</span>}
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

      {/* Formulario de edición inline */}
      {editingItem && (
        <div ref={editFormRef} className="border border-purple-300 rounded-lg p-4 bg-purple-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-purple-800">
              ✏️ Editando Turno #{editingItem.id} — Plaza {editingItem.plaza} — {editingItem.estado}
            </h3>
            <button onClick={() => setExpandedEditId(null)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <TurnoForm turno={editingItem} editId={editingItem.id} onSuccess={handleEditSuccess} />
        </div>
      )}

      {/* Formulario de creación inline */}
      {showNewForm && (
        <div ref={newFormRef} className="border border-dashed border-purple-400 rounded-lg p-4 bg-purple-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-purple-800">
              + Nuevo Turno
              {selectedPresupuesto && (
                <span className="ml-2 text-purple-600 font-normal text-sm">
                  — Presupuesto #{selectedPresupuesto.id}
                </span>
              )}
            </h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <TurnoForm turno={turnoPreset} onSuccess={handleNewSuccess} preselectedPresupuesto={selectedPresupuesto ?? undefined} movilId={selectedMovil?.id} />
        </div>
      )}
    </div>
  );
}
