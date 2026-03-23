"use client";
// frontend/src/app/portal/eventos/tabs/RepairBreadcrumb.tsx
import { useRepairStore } from "@/lib/repairStore";

export default function RepairBreadcrumb() {
  const selectedCliente = useRepairStore((s) => s.selectedCliente);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);
  const selectedTurno = useRepairStore((s) => s.selectedTurno);
  const selectCliente = useRepairStore((s) => s.selectCliente);
  const selectMovil = useRepairStore((s) => s.selectMovil);
  const selectPresupuesto = useRepairStore((s) => s.selectPresupuesto);
  const setActiveTab = useRepairStore((s) => s.setActiveTab);
  const clearAll = useRepairStore((s) => s.clearAll);

  const hasAny = selectedCliente || selectedMovil || selectedPresupuesto || selectedTurno;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      <span className="text-blue-600 font-semibold mr-1">Contexto:</span>

      {selectedCliente && (
        <>
          <button
            onClick={() => setActiveTab(0)}
            className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-md transition"
          >
            <span className="font-medium">Cliente:</span>
            <span>{selectedCliente.apellido}, {selectedCliente.nombres}</span>
          </button>
          <button
            onClick={() => { selectCliente(null); setActiveTab(0); }}
            className="text-blue-400 hover:text-red-500 font-bold px-1"
            title="Limpiar todo el contexto"
          >
            ×
          </button>
        </>
      )}

      {selectedMovil && (
        <>
          <span className="text-gray-400">›</span>
          <button
            onClick={() => setActiveTab(1)}
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-md transition"
          >
            <span className="font-medium">Móvil:</span>
            <span>
              {(selectedMovil as any).patente}
              {(selectedMovil as any).marca ? ` — ${(selectedMovil as any).marca}` : ""}
              {(selectedMovil as any).modelo ? ` ${(selectedMovil as any).modelo}` : ""}
            </span>
          </button>
          <button
            onClick={() => { selectMovil(null); setActiveTab(1); }}
            className="text-green-400 hover:text-red-500 font-bold px-1"
            title="Limpiar móvil y contexto"
          >
            ×
          </button>
        </>
      )}

      {selectedPresupuesto && (
        <>
          <span className="text-gray-400">›</span>
          <button
            onClick={() => setActiveTab(2)}
            className="flex items-center gap-1 bg-sky-100 hover:bg-sky-200 text-sky-800 px-2 py-1 rounded-md transition"
          >
            <span className="font-medium">Presupuesto:</span>
            <span>#{selectedPresupuesto.id}{selectedPresupuesto.monto ? ` — $${selectedPresupuesto.monto}` : ""}</span>
          </button>
          <button
            onClick={() => { selectPresupuesto(null); setActiveTab(2); }}
            className="text-sky-400 hover:text-red-500 font-bold px-1"
            title="Limpiar presupuesto y contexto"
          >
            ×
          </button>
        </>
      )}

      {selectedTurno && (
        <>
          <span className="text-gray-400">›</span>
          <button
            onClick={() => setActiveTab(3)}
            className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded-md transition"
          >
            <span className="font-medium">Turno:</span>
            <span>#{selectedTurno.id} — {selectedTurno.estado}</span>
          </button>
          <button
            onClick={() => {
              useRepairStore.setState({ selectedTurno: null });
              setActiveTab(3);
            }}
            className="text-purple-400 hover:text-red-500 font-bold px-1"
            title="Limpiar turno"
          >
            ×
          </button>
        </>
      )}

      <button
        onClick={clearAll}
        className="ml-auto flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition"
      >
        <span className="text-base leading-none">×</span>
        Limpiar todo
      </button>
    </div>
  );
}
