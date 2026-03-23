"use client";
// frontend/src/app/portal/eventos/realizados/RealizadosPage.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function RealizadosPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 w-full">
      <h1 className="text-4xl font-bold">Trabajos Realizados</h1>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 flex flex-col gap-3 max-w-lg">
        <div className="flex items-center gap-2 text-amber-700 font-semibold text-lg">
          <span>⚙️</span>
          <span>Sección en construcción</span>
        </div>
        <p className="text-amber-600 text-sm leading-relaxed">
          El módulo de trabajos realizados está en desarrollo. Próximamente podrás ver
          el historial completo de reparaciones finalizadas, con detalle de piezas, horas trabajadas y técnico responsable.
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
