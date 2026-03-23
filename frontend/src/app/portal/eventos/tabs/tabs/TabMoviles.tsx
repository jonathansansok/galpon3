"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabMoviles.tsx
import { useState, useEffect, useRef } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getTemas } from "../../temas/Temas.api";
import { Tema } from "@/types/Tema";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function TabMoviles() {
  const [moviles, setMoviles] = useState<Tema[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);
  const selectedCliente = useRepairStore((s) => s.selectedCliente);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectMovil = useRepairStore((s) => s.selectMovil);

  // Auto-cargar cuando hay cliente seleccionado
  useEffect(() => {
    console.log("[linear] TabMoviles selectedCliente changed:", selectedCliente?.id);
    if (selectedCliente && !hasLoadedRef.current) {
      handleLoadData();
    }
  }, [selectedCliente]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    console.log("[linear] TabMoviles handleLoadData");
    setLoading(true);
    try {
      const data = await getTemas();
      const list = Array.isArray(data) ? data : [];
      setMoviles(list);
      hasLoadedRef.current = true;
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

  // Filtrar por cliente seleccionado y por búsqueda de texto
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Móviles</h2>
        <Link href="/portal/eventos/temas/new" className={buttonVariants()}>
          + Agregar Móvil
        </Link>
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
        <button
          onClick={handleLoadData}
          disabled={loading}
          className={buttonVariants({ variant: "outline" })}
        >
          {loading ? "Cargando..." : "Cargar móviles"}
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
                return (
                  <tr
                    key={movil.id}
                    onClick={() => handleSelect(movil)}
                    className={`cursor-pointer border-t border-gray-100 transition ${
                      isSelected
                        ? "bg-green-100 hover:bg-green-150"
                        : "hover:bg-gray-50"
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
                      <Link
                        href={`/portal/eventos/temas/${movil.id}/edit`}
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
          {moviles.length === 0
            ? "Hacé clic en \"Cargar móviles\" para ver los registros."
            : selectedCliente
            ? "Este cliente no tiene móviles asociados."
            : "No hay resultados para la búsqueda."}
        </p>
      )}
    </div>
  );
}
