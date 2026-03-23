"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabMoviles.tsx
import { useState, useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getTemas } from "../../temas/Temas.api";
import { anexarMoviles } from "../../ingresos/ingresos.api";
import { Tema } from "@/types/Tema";
import { buttonVariants } from "@/components/ui/button";
import { TemaForm } from "../../temas/new/TemaForm";
import Link from "next/link";

export default function TabMoviles() {
  const [moviles, setMoviles] = useState<Tema[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedEditId, setExpandedEditId] = useState<number | null>(null);
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

  const handleToggleEdit = (id: number) => {
    const next = expandedEditId === id ? null : id;
    console.log("[linear] TabMoviles setExpandedEditId:", next);
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
    setExpandedEditId(null);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Móviles</h2>
        <button onClick={handleToggleNew} className={buttonVariants({ variant: showNewForm ? "outline" : "default" })}>
          {showNewForm ? "✕ Cancelar" : "+ Agregar Móvil"}
        </button>
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Patente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Marca</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Modelo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Año</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Color</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movil) => {
                const isSelected = selectedMovil?.id === movil.id;
                const isEditing = expandedEditId === movil.id;
                return (
                  <tr
                    key={movil.id}
                    onClick={() => handleSelect(movil)}
                    className={`cursor-pointer border-t border-gray-100 transition ${
                      isEditing ? "bg-green-50" : isSelected ? "bg-green-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{(movil as any).patente || "—"}</td>
                    <td className="px-4 py-3">{(movil as any).marca || "—"}</td>
                    <td className="px-4 py-3">{(movil as any).modelo || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{(movil as any).anio || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{(movil as any).color || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{(movil as any).tipoVehic || "—"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/portal/eventos/temas/${movil.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline text-xs mr-2"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleEdit(movil.id); }}
                        className={`text-xs underline ${isEditing ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        {isEditing ? "Cerrar" : "Editar"}
                      </button>
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
            : selectedCliente
            ? "Este cliente no tiene móviles asociados."
            : "No hay resultados."}
        </p>
      )}

      {/* Formulario de edición inline */}
      {editingItem && (
        <div className="border border-green-300 rounded-lg p-4 bg-green-50">
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
        <div className="border border-dashed border-green-400 rounded-lg p-4 bg-green-50">
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
