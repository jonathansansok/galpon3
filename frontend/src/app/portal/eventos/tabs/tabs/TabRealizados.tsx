"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabRealizados.tsx
import { useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import Link from "next/link";

export default function TabRealizados() {
  const selectedCliente = useRepairStore((s) => s.selectedCliente);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);
  const selectedTurno = useRepairStore((s) => s.selectedTurno);

  useEffect(() => {
    console.log("[linear] TabRealizados rendered — turnoId:", selectedTurno?.id, "presupuestoId:", selectedPresupuesto?.id);
  }, [selectedTurno, selectedPresupuesto]);

  const isComplete = selectedTurno?.estado === "Finalizado" || selectedPresupuesto?.estado === "Finalizado";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Trabajos Realizados</h2>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-amber-700 font-semibold text-base">
          <span>⚙️</span>
          <span>Módulo en construcción</span>
        </div>
        <p className="text-amber-600 text-sm">
          El registro de trabajos realizados estará disponible próximamente.
          Por ahora podés ver los trabajos finalizados desde la sección{" "}
          <Link href="/portal/eventos/realizados" className="underline font-medium">
            Trabajos realizados
          </Link>.
        </p>
      </div>

      {/* Estado de la reparación actual */}
      {isComplete && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3">
          <span className="text-green-600 text-2xl">✅</span>
          <div>
            <p className="text-green-700 font-semibold">Reparación finalizada</p>
            <p className="text-green-600 text-sm">El turno o presupuesto seleccionado está marcado como Finalizado.</p>
          </div>
        </div>
      )}

      {/* Contexto actual seleccionado */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-gray-700">Contexto de la reparación</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Cliente</span>
            {selectedCliente ? (
              <span className="text-gray-800 font-medium">{selectedCliente.apellido}, {selectedCliente.nombres}</span>
            ) : (
              <span className="text-gray-400 italic">No seleccionado</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Móvil</span>
            {selectedMovil ? (
              <span className="text-gray-800 font-medium">
                {(selectedMovil as any).patente} — {(selectedMovil as any).marca} {(selectedMovil as any).modelo}
              </span>
            ) : (
              <span className="text-gray-400 italic">No seleccionado</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Presupuesto</span>
            {selectedPresupuesto ? (
              <span className="text-gray-800 font-medium">
                #{selectedPresupuesto.id} — ${selectedPresupuesto.monto} ({selectedPresupuesto.estado})
              </span>
            ) : (
              <span className="text-gray-400 italic">No seleccionado</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Turno</span>
            {selectedTurno ? (
              <span className="text-gray-800 font-medium">
                Turno #{selectedTurno.id} — Plaza {selectedTurno.plaza} — {selectedTurno.estado}
              </span>
            ) : (
              <span className="text-gray-400 italic">No seleccionado</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
