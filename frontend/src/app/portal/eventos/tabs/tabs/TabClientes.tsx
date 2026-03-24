"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabClientes.tsx
import { useState, useEffect, useRef } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getIngresos } from "../../ingresos/ingresos.api";
import { Ingreso } from "@/types/Ingreso";
import { buttonVariants } from "@/components/ui/button";
import { IngresoForm } from "../../ingresos/new/IngresoForm";
import Link from "next/link";
import FileIndicatorsCell from "@/components/ui/FileIndicatorsCell";

export default function TabClientes() {
  const [clientes, setClientes] = useState<Ingreso[]>([]);
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
  const selectCliente = useRepairStore((s) => s.selectCliente);
  const selectedCliente = useRepairStore((s) => s.selectedCliente);

  useEffect(() => {
    handleLoadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    console.log("[linear] TabClientes handleLoadData");
    setLoading(true);
    try {
      const data = await getIngresos();
      const list = Array.isArray(data) ? data : [];
      setClientes(list);
      console.log("[linear] TabClientes loaded", list.length, "clientes");
    } catch (error) {
      console.error("[linear] TabClientes error loading:", error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (cliente: Ingreso) => {
    console.log("[linear] TabClientes handleSelect:", cliente.id, cliente.apellido);
    selectCliente(cliente);
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
    console.log("[linear] TabClientes setExpandedEditId:", next);
    if (next !== null) lastEditedId.current = id;
    setExpandedEditId(next);
    if (next !== null) setShowNewForm(false);
  };

  const handleToggleNew = () => {
    const next = !showNewForm;
    console.log("[linear] TabClientes showNewForm:", next);
    setShowNewForm(next);
    if (next) setExpandedEditId(null);
  };

  const handleEditSuccess = () => {
    console.log("[linear] TabClientes handleEdit success, reloading");
    const id = lastEditedId.current;
    setExpandedEditId(null);
    setScrollBackToId(id);
    handleLoadData();
  };

  const handleNewSuccess = () => {
    console.log("[linear] TabClientes handleNew success, reloading");
    setShowNewForm(false);
    handleLoadData();
  };

  const filtered = query.length >= 2
    ? clientes.filter((c) =>
        `${c.apellido} ${c.nombres} ${c.numeroCuit ?? ""} ${c.emailCliente ?? ""} ${c.telefono ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : clientes;

  const editingItem = expandedEditId !== null ? clientes.find((c) => c.id === expandedEditId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <div>
          <button
            onClick={handleToggleNew}
            className={showNewForm ? buttonVariants({ variant: "outline" }) : "bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"}
          >
            {showNewForm ? "✕ Cancelar" : "+ Agregar Cliente"}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleLoadData} disabled={loading} className={buttonVariants({ variant: "outline" })}>
          {loading ? "Cargando..." : "Recargar clientes"}
        </button>
      </div>

      {clientes.length > 0 && (
        <input
          type="text"
          placeholder="Buscar por apellido, nombre, CUIT, email, teléfono..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}

      {selectedCliente && (
        <div className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
          Seleccionado: <strong>{selectedCliente.apellido}, {selectedCliente.nombres}</strong>
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Apellido</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Nombres</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">CUIT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Teléfono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cliente) => {
                const isSelected = selectedCliente?.id === cliente.id;
                const isEditing = expandedEditId === cliente.id;
                return (
                  <tr
                    key={cliente.id}
                    ref={(el) => { if (el) rowRefs.current.set(cliente.id, el); else rowRefs.current.delete(cliente.id); }}
                    onClick={() => handleSelect(cliente)}
                    className={`cursor-pointer transition-all duration-700 ${
                      highlightId === cliente.id ? "bg-green-200 ring-1 ring-inset ring-green-400" :
                      isEditing ? "bg-blue-50" : isSelected ? "bg-blue-50" : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className="px-3 py-2.5 w-20">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/portal/eventos/ingresos/${cliente.id}`}
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
                          onClick={(e) => { e.stopPropagation(); handleToggleEdit(cliente.id); }}
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
                      <FileIndicatorsCell module="ingresos" row={cliente} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{cliente.apellido}</td>
                    <td className="px-4 py-3 text-gray-700">{cliente.nombres}</td>
                    <td className="px-4 py-3 text-gray-500">{cliente.numeroCuit || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{cliente.emailCliente || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{cliente.telefono || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          {loading ? "Cargando..." : clientes.length === 0 ? "No se encontraron clientes." : "No hay resultados."}
        </p>
      )}

      {/* Formulario de edición inline */}
      {editingItem && (
        <div ref={editFormRef} className="border border-blue-300 rounded-lg p-4 bg-blue-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-blue-800">
              ✏️ Editando: {editingItem.apellido}, {editingItem.nombres}
            </h3>
            <button onClick={() => setExpandedEditId(null)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <IngresoForm ingreso={editingItem} editId={editingItem.id} onSuccess={handleEditSuccess} hideMultimedia />
        </div>
      )}

      {/* Formulario de creación inline */}
      {showNewForm && (
        <div ref={newFormRef} className="border border-dashed border-green-400 rounded-lg p-4 bg-green-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-green-800">+ Nuevo Cliente</h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <IngresoForm ingreso={null} onSuccess={handleNewSuccess} hideMultimedia />
        </div>
      )}
    </div>
  );
}
