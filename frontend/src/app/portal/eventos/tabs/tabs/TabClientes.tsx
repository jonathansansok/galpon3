"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabClientes.tsx
import { useState, useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getIngresos } from "../../ingresos/ingresos.api";
import { Ingreso } from "@/types/Ingreso";
import { buttonVariants } from "@/components/ui/button";
import { IngresoForm } from "../../ingresos/new/IngresoForm";
import Link from "next/link";

export default function TabClientes() {
  const [clientes, setClientes] = useState<Ingreso[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedEditId, setExpandedEditId] = useState<number | null>(null);
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

  const handleToggleEdit = (id: number) => {
    const next = expandedEditId === id ? null : id;
    console.log("[linear] TabClientes setExpandedEditId:", next);
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
    setExpandedEditId(null);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button onClick={handleToggleNew} className={buttonVariants({ variant: showNewForm ? "outline" : "default" })}>
          {showNewForm ? "✕ Cancelar" : "+ Agregar Cliente"}
        </button>
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Apellido</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nombres</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">CUIT</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Teléfono</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cliente) => {
                const isSelected = selectedCliente?.id === cliente.id;
                const isEditing = expandedEditId === cliente.id;
                return (
                  <tr
                    key={cliente.id}
                    onClick={() => handleSelect(cliente)}
                    className={`cursor-pointer border-t border-gray-100 transition ${
                      isEditing ? "bg-blue-50" : isSelected ? "bg-blue-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{cliente.apellido}</td>
                    <td className="px-4 py-3">{cliente.nombres}</td>
                    <td className="px-4 py-3 text-gray-500">{cliente.numeroCuit || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{cliente.emailCliente || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{cliente.telefono || "—"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/portal/eventos/ingresos/${cliente.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline text-xs mr-2"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleEdit(cliente.id); }}
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
          {loading ? "Cargando..." : clientes.length === 0 ? "No se encontraron clientes." : "No hay resultados."}
        </p>
      )}

      {/* Formulario de edición inline */}
      {editingItem && (
        <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-blue-800">
              ✏️ Editando: {editingItem.apellido}, {editingItem.nombres}
            </h3>
            <button onClick={() => setExpandedEditId(null)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <IngresoForm ingreso={editingItem} editId={editingItem.id} onSuccess={handleEditSuccess} />
        </div>
      )}

      {/* Formulario de creación inline */}
      {showNewForm && (
        <div className="border border-dashed border-green-400 rounded-lg p-4 bg-green-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-green-800">+ Nuevo Cliente</h3>
            <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-red-500 text-lg font-bold">✕</button>
          </div>
          <IngresoForm ingreso={null} onSuccess={handleNewSuccess} />
        </div>
      )}
    </div>
  );
}
