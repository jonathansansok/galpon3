"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabPresupuestos.tsx
import { useState, useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { usePresupuestoStore } from "@/lib/store";
import { getPresupuestosWithMovilData } from "../../presupuestos/Presupuestos.api";
import { getPresupuestosAsociados } from "../../temas/Temas.api";
import { Presupuesto } from "@/types/Presupuesto";
import { buttonVariants } from "@/components/ui/button";
import { PresupuestoForm } from "../../presupuestos/new/PresupuestoForm";
import Link from "next/link";

export default function TabPresupuestos() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedEditId, setExpandedEditId] = useState<number | null>(null);
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

  const handleToggleEdit = (id: number) => {
    const next = expandedEditId === id ? null : id;
    console.log("[linear] TabPresupuestos setExpandedEditId:", next);
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
    setExpandedEditId(null);
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
            className={showNewForm ? buttonVariants({ variant: "outline" }) : "bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"}
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Patente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Marca / Modelo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Monto</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isSelected = selectedPresupuesto?.id === p.id;
                const isEditing = expandedEditId === p.id;
                return (
                  <tr
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className={`cursor-pointer border-t border-gray-100 transition ${
                      isEditing ? "bg-teal-50" : isSelected ? "bg-teal-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-500">{p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.patente || "—"}</td>
                    <td className="px-4 py-3">{[p.marca, p.modelo, p.anio].filter(Boolean).join(" ") || "—"}</td>
                    <td className="px-4 py-3">{p.monto ? `$${p.monto}` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{p.observaciones || "—"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/portal/eventos/presupuestos/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline text-xs mr-2"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleEdit(p.id); }}
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
            : selectedMovil
            ? "Este móvil no tiene presupuestos asociados."
            : "Hacé clic en \"Recargar presupuestos\" para ver los registros."}
        </p>
      )}

      {/* Formulario de edición inline */}
      {editingItem && (
        <div className="border border-teal-300 rounded-lg p-4 bg-teal-50">
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
        <div className="border border-dashed border-teal-400 rounded-lg p-4 bg-teal-50">
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
