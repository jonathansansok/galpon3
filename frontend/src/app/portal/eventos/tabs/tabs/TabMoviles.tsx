"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabMoviles.tsx
import { useState, useEffect, useRef } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getTemas } from "../../temas/Temas.api";
import { anexarMoviles } from "../../ingresos/ingresos.api";
import { Tema } from "@/types/Tema";
import { buttonVariants } from "@/components/ui/button";
import { TemaForm } from "../../temas/new/TemaForm";
import Link from "next/link";
import FileIndicatorsCell from "@/components/ui/FileIndicatorsCell";

export default function TabMoviles() {
  const [moviles, setMoviles] = useState<Tema[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedEditId, setExpandedEditId] = useState<number | null>(null);
  const [scrollBackToId, setScrollBackToId] = useState<number | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);
  const newFormRef  = useRef<HTMLDivElement>(null);
  const rowRefs     = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const lastEditedId = useRef<number | null>(null);
  const selectedCliente = useRepairStore((s) => s.selectedCliente);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectMovil = useRepairStore((s) => s.selectMovil);

  useEffect(() => {
    console.log("[linear] TabMoviles selectedCliente changed:", selectedCliente?.id);
    handleLoadData();
  }, [selectedCliente]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    console.log("[linear] TabMoviles handleLoadData");
    setLoading(true);
    try {
      const data = await getTemas();
      const list = Array.isArray(data) ? data : [];
      setMoviles(list);
      console.log("[linear] TabMoviles loaded", list.length, "moviles total");
    } catch (error) {
      console.error("[linear] TabMoviles error loading:", error);
      setMoviles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (movil: Tema) => {
    console.log("[linear] TabMoviles handleSelect:", movil.id, (movil as any).patente);
    selectMovil(movil);
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
    console.log("[linear] TabMoviles setExpandedEditId:", next);
    if (next !== null) lastEditedId.current = id;
    setExpandedEditId(next);
    if (next !== null) setShowNewForm(false);
  };

  const handleToggleNew = () => {
    const next = !showNewForm;
    console.log("[linear] TabMoviles showNewForm:", next);
    setShowNewForm(next);
    if (next) setExpandedEditId(null);
  };

  const handleEditSuccess = () => {
    console.log("[linear] TabMoviles handleEdit success, reloading");
    const id = lastEditedId.current;
    setExpandedEditId(null);
    setScrollBackToId(id);
    handleLoadData();
  };

  const handleNewSuccess = async (createdId?: number) => {
    console.log("[linear] TabMoviles handleNew success, createdId:", createdId);
    if (selectedCliente && createdId) {
      try {
        await anexarMoviles(selectedCliente.id, [createdId]);
        console.log("[linear] TabMoviles auto-linked movil", createdId, "to cliente", selectedCliente.id);
      } catch (error) {
        console.error("[linear] TabMoviles error linking movil to cliente:", error);
      }
    }
    setShowNewForm(false);
    handleLoadData();
  };

  const byCliente = selectedCliente
    ? moviles.filter((m) => (m as any).clienteId === selectedCliente.id)
    : moviles;

  const filtered = query.length >= 2
    ? byCliente.filter((m) =>
        `${(m as any).patente ?? ""} ${(m as any).marca ?? ""} ${(m as any).modelo ?? ""} ${(m as any).anio ?? ""} ${(m as any).vin ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : byCliente;

  const editingItem = expandedEditId !== null ? moviles.find((m) => m.id === expandedEditId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Móviles</h2>
        <div>
          <button
            onClick={handleToggleNew}
            className={showNewForm ? buttonVariants({ variant: "outline" }) : "bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"}
          >
            {showNewForm ? "✕ Cancelar" : "+ Agregar Móvil"}
          </button>
        </div>
      </div>

      {selectedCliente && (
        <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
          Filtrando por cliente: <strong>{selectedCliente.apellido}, {selectedCliente.nombres}</strong>
          {byCliente.length !== moviles.length && (
            <span className="ml-2 text-green-600">({byCliente.length} vehículo{byCliente.length !== 1 ? "s" : ""})</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={handleLoadData} disabled={loading} className={buttonVariants({ variant: "outline" })}>
          {loading ? "Cargando..." : "Recargar móviles"}
        </button>
      </div>

      {moviles.length > 0 && (
        <input
          type="text"
          placeholder="Buscar por patente, marca, modelo, año, VIN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      )}

      {selectedMovil && (
        <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
          Seleccionado: <strong>{(selectedMovil as any).patente} — {(selectedMovil as any).marca} {(selectedMovil as any).modelo} {(selectedMovil as any).anio}</strong>
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Patente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Marca</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Modelo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Año</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Color</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((movil) => {
                const isSelected = selectedMovil?.id === movil.id;
                const isEditing = expandedEditId === movil.id;
                return (
                  <tr
                    key={movil.id}
                    ref={(el) => { if (el) rowRefs.current.set(movil.id, el); else rowRefs.current.delete(movil.id); }}
                    onClick={() => handleSelect(movil)}
                    className={`cursor-pointer transition-all duration-700 ${
                      highlightId === movil.id ? "bg-green-200 ring-1 ring-inset ring-green-400" :
                      isEditing ? "bg-green-50" : isSelected ? "bg-green-50" : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className="px-3 py-2.5 w-20">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/portal/eventos/temas/${movil.id}`}
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
                          onClick={(e) => { e.stopPropagation(); handleToggleEdit(movil.id); }}
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
                      <FileIndicatorsCell module="temas" row={movil} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{(movil as any).patente || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{(movil as any).marca || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{(movil as any).modelo || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{(movil as any).anio || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{(movil as any).color || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{(movil as any).tipoVehic || "—"}</td>
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
            : selectedCliente
            ? "Este cliente no tiene móviles asociados."
            : "No hay resultados."}
        </p>
      )}

      {/* Formulario de edición inline */}
      {editingItem && (
        <div ref={editFormRef} className="border border-green-300 rounded-lg p-4 bg-green-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-green-800">
              ✏️ Editando: {(editingItem as any).patente} — {(editingItem as any).marca} {(editingItem as any).modelo}
            </h3>
            <button onClick={() => setExpandedEditId(null)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <TemaForm tema={editingItem} editId={editingItem.id} onSuccess={handleEditSuccess} />
        </div>
      )}

      {/* Formulario de creación inline */}
      {showNewForm && (
        <div ref={newFormRef} className="border border-dashed border-green-400 rounded-lg p-4 bg-green-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-green-800">
              + Nuevo Móvil
              {selectedCliente && (
                <span className="ml-2 text-green-600 font-normal text-sm">
                  — se vinculará a {selectedCliente.apellido}, {selectedCliente.nombres}
                </span>
              )}
            </h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <TemaForm tema={null} initialClienteId={selectedCliente?.id} onSuccess={handleNewSuccess} />
        </div>
      )}
    </div>
  );
}
