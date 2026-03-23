"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabIngresos.tsx
import { useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import Link from "next/link";

export default function TabIngresos() {
  const selectedCliente = useRepairStore((s) => s.selectedCliente);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);
  const selectedTurno = useRepairStore((s) => s.selectedTurno);

  useEffect(() => {
    console.log("[linear] TabIngresos rendered — turnoId:", selectedTurno?.id, "presupuestoId:", selectedPresupuesto?.id);
  }, [selectedTurno, selectedPresupuesto]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Ingresos al Taller</h2>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-amber-700 font-semibold text-base">
          <span>⚙️</span>
          <span>Módulo en construcción</span>
        </div>
        <p className="text-amber-600 text-sm">
          El registro de ingresos al taller estará disponible próximamente.
          Por ahora podés gestionar los ingresos desde la sección{" "}
          <Link href="/portal/eventos/ingresosok" className="underline font-medium">
            Ingresos
          </Link>.
        </p>
      </div>

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
                {(selectedMovil as any).patente} — {(selectedMovil as any).marca} {(selectedMovil as any).modelo} {(selectedMovil as any).anio}
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
