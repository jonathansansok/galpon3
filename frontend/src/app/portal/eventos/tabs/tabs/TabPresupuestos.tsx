"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabPresupuestos.tsx
import { useState, useEffect, useRef } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { usePresupuestoStore } from "@/lib/store";
import { getPresupuestosWithMovilData } from "../../presupuestos/Presupuestos.api";
import { getPresupuestosAsociados } from "../../temas/Temas.api";
import { Presupuesto } from "@/types/Presupuesto";
import { buttonVariants } from "@/components/ui/button";
import { PresupuestoForm } from "../../presupuestos/new/PresupuestoForm";
import Link from "next/link";
import FileIndicatorsCell from "@/components/ui/FileIndicatorsCell";

export default function TabPresupuestos() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
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
  const selectPresupuesto = useRepairStore((s) => s.selectPresupuesto);
  const setIdMovil = usePresupuestoStore((s) => s.setIdMovil);
  const setPatente = usePresupuestoStore((s) => s.setPatente);
  const setMovilData = usePresupuestoStore((s) => s.setMovilData);

  useEffect(() => {
    console.log("[linear] TabPresupuestos selectedMovil changed:", selectedMovil?.id);
    handleLoadData();
  }, [selectedMovil]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    console.log("[linear] TabPresupuestos handleLoadData, movilId:", selectedMovil?.id);
    setLoading(true);
    try {
      let data: Presupuesto[];
      if (selectedMovil) {
        data = await getPresupuestosAsociados(String(selectedMovil.id));
        console.log("[linear] TabPresupuestos loaded", data.length, "presupuestos para movilId:", selectedMovil.id);
      } else {
        data = await getPresupuestosWithMovilData();
        console.log("[linear] TabPresupuestos loaded", data.length, "presupuestos (todos)");
      }
      setPresupuestos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[linear] TabPresupuestos error loading:", error);
      setPresupuestos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (presupuesto: Presupuesto) => {
    console.log("[linear] TabPresupuestos handleSelect:", presupuesto.id, presupuesto.monto);
    selectPresupuesto(presupuesto);
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
    console.log("[linear] TabPresupuestos setExpandedEditId:", next);
    if (next !== null) lastEditedId.current = id;
    setExpandedEditId(next);
    if (next !== null) setShowNewForm(false);
  };

  const handleToggleNew = () => {
    const next = !showNewForm;
    console.log("[linear] TabPresupuestos showNewForm:", next);
    if (next && selectedMovil) {
      setIdMovil(selectedMovil.id);
      setPatente((selectedMovil as any).patente ?? "");
      setMovilData(selectedMovil);
      console.log("[linear] TabPresupuestos openNew — movilId:", selectedMovil.id, "patente:", (selectedMovil as any).patente);
    }
    setShowNewForm(next);
    if (next) setExpandedEditId(null);
  };

  const handleEditSuccess = () => {
    console.log("[linear] TabPresupuestos handleEdit success, reloading");
    const id = lastEditedId.current;
    setExpandedEditId(null);
    setScrollBackToId(id);
    handleLoadData();
  };

  const handleNewSuccess = () => {
    console.log("[linear] TabPresupuestos handleNew success, reloading");
    setShowNewForm(false);
    handleLoadData();
  };

  const filtered = query.length >= 2
    ? presupuestos.filter((p) =>
        `${p.patente ?? ""} ${p.marca ?? ""} ${p.modelo ?? ""} ${p.estado ?? ""} ${p.monto ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : presupuestos;

  const estadoColor: Record<string, string> = {
    Pendiente: "bg-sky-100 text-sky-700",
    "En curso": "bg-blue-100 text-blue-800",
    Aprobado: "bg-green-100 text-green-800",
    Finalizado: "bg-gray-100 text-gray-700",
  };

  const editingItem = expandedEditId !== null ? presupuestos.find((p) => p.id === expandedEditId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Presupuestos</h2>
        <div>
          <button
            onClick={handleToggleNew}
            className={showNewForm ? buttonVariants({ variant: "outline" }) : "bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"}
          >
            {showNewForm ? "✕ Cancelar" : "+ Agregar Presupuesto"}
          </button>
        </div>
      </div>

      {selectedMovil && (
        <div className="text-sm text-teal-700 bg-teal-50 px-3 py-2 rounded-md border border-teal-200">
          Filtrando por móvil: <strong>{(selectedMovil as any).patente} — {(selectedMovil as any).marca} {(selectedMovil as any).modelo}</strong>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={handleLoadData} disabled={loading} className={buttonVariants({ variant: "outline" })}>
          {loading ? "Cargando..." : "Recargar presupuestos"}
        </button>
      </div>

      {presupuestos.length > 0 && (
        <input
          type="text"
          placeholder="Buscar por patente, marca, modelo, estado, monto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      )}

      {selectedPresupuesto && (
        <div className="text-sm text-teal-700 bg-teal-50 px-3 py-2 rounded-md border border-teal-200">
          Seleccionado: <strong>#{selectedPresupuesto.id} — ${selectedPresupuesto.monto} ({selectedPresupuesto.estado})</strong>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-3 py-3 w-20" />
                <th className="px-3 py-3 w-24 text-center" title="Archivos adjuntos">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-auto text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Patente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Marca / Modelo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const isSelected = selectedPresupuesto?.id === p.id;
                const isEditing = expandedEditId === p.id;
                return (
                  <tr
                    key={p.id}
                    ref={(el) => { if (el) rowRefs.current.set(p.id, el); else rowRefs.current.delete(p.id); }}
                    onClick={() => handleSelect(p)}
                    className={`cursor-pointer transition-all duration-700 ${
                      highlightId === p.id ? "bg-green-200 ring-1 ring-inset ring-green-400" :
                      isEditing ? "bg-teal-50" : isSelected ? "bg-teal-50" : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className="px-3 py-2.5 w-20">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/portal/eventos/presupuestos/${p.id}`}
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
                          onClick={(e) => { e.stopPropagation(); handleToggleEdit(p.id); }}
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
                    <td className="px-3 py-2.5 w-24">
                      <FileIndicatorsCell module="presupuestos" row={p} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.patente || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{[p.marca, p.modelo, p.anio].filter(Boolean).join(" ") || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{p.monto ? `$${p.monto}` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{p.observaciones || "—"}</td>
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
            : selectedMovil
            ? "Este móvil no tiene presupuestos asociados."
            : "Hacé clic en \"Recargar presupuestos\" para ver los registros."}
        </p>
      )}

      {/* Formulario de edición inline */}
      {editingItem && (
        <div ref={editFormRef} className="border border-teal-300 rounded-lg p-4 bg-teal-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-teal-800">
              ✏️ Editando Presupuesto #{editingItem.id} — {editingItem.patente} ${editingItem.monto}
            </h3>
            <button onClick={() => setExpandedEditId(null)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <PresupuestoForm presupuesto={editingItem} editId={editingItem.id} onSuccess={handleEditSuccess} />
        </div>
      )}

      {/* Formulario de creación inline */}
      {showNewForm && (
        <div ref={newFormRef} className="border border-dashed border-teal-400 rounded-lg p-4 bg-teal-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-teal-800">
              + Nuevo Presupuesto
              {selectedMovil && (
                <span className="ml-2 text-teal-600 font-normal text-sm">
                  — para {(selectedMovil as any).patente}
                </span>
              )}
            </h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <PresupuestoForm presupuesto={null} onSuccess={handleNewSuccess} />
        </div>
      )}
    </div>
  );
}
