"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabClientes.tsx
import { useState, useEffect, useRef } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getIngresos } from "../../ingresos/ingresos.api";
import { Ingreso } from "@/types/Ingreso";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function TabClientes() {
  const [clientes, setClientes] = useState<Ingreso[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);
  const selectCliente = useRepairStore((s) => s.selectCliente);
  const selectedCliente = useRepairStore((s) => s.selectedCliente);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    console.log("[linear] TabClientes selectedCliente changed:", selectedCliente?.id);
  }, [selectedCliente]);

  const handleLoadData = async () => {
    console.log("[linear] TabClientes handleLoadData");
    setLoading(true);
    try {
      const data = await getIngresos();
      const list = Array.isArray(data) ? data : [];
      setClientes(list);
      hasLoadedRef.current = true;
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

  const filtered = query.length >= 2
    ? clientes.filter((c) =>
        `${c.apellido} ${c.nombres} ${c.numeroCuit ?? ""} ${c.emailCliente ?? ""} ${c.telefono ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : clientes;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <Link href="/portal/eventos/ingresos/new" className={buttonVariants()}>
          + Agregar Cliente
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleLoadData}
          disabled={loading}
          className={buttonVariants({ variant: "outline" })}
        >
          {loading ? "Cargando..." : "Cargar clientes"}
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
                return (
                  <tr
                    key={cliente.id}
                    onClick={() => handleSelect(cliente)}
                    className={`cursor-pointer border-t border-gray-100 transition ${
                      isSelected
                        ? "bg-blue-100 hover:bg-blue-150"
                        : "hover:bg-gray-50"
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
                      <Link
                        href={`/portal/eventos/ingresos/${cliente.id}/edit`}
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
          {clientes.length === 0
            ? "Hacé clic en \"Cargar clientes\" para ver los registros."
            : "No hay resultados para la búsqueda."}
        </p>
      )}
    </div>
  );
}
