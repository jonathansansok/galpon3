"use client";
// frontend/src/app/portal/eventos/ingresosok/IngresosOkPage.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function IngresosOkPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 w-full">
      <h1 className="text-4xl font-bold">Ingresos al Taller</h1>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 flex flex-col gap-3 max-w-lg">
        <div className="flex items-center gap-2 text-amber-700 font-semibold text-lg">
          <span>⚙️</span>
          <span>Sección en construcción</span>
        </div>
        <p className="text-amber-600 text-sm leading-relaxed">
          El módulo de ingresos al taller está en desarrollo. Próximamente podrás registrar
          la recepción de vehículos con fecha y hora de ingreso, estado del vehículo, y datos del responsable.
        </p>
        <p className="text-amber-600 text-sm">
          Mientras tanto, podés gestionar todo el flujo de reparación desde la vista integral:
        </p>
        <Link href="/portal/eventos/tabs" className={buttonVariants()}>
          Ir al Flujo de Reparación
        </Link>
      </div>
    </div>
  );
}
