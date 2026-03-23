"use client";
// frontend/src/app/portal/eventos/tabs/TabsPage.tsx
import { useRepairStore } from "@/lib/repairStore";
import RepairBreadcrumb from "./RepairBreadcrumb";
import TabClientes from "./tabs/TabClientes";
import TabMoviles from "./tabs/TabMoviles";
import TabPresupuestos from "./tabs/TabPresupuestos";
import TabTurnos from "./tabs/TabTurnos";
import TabIngresos from "./tabs/TabIngresos";
import TabRealizados from "./tabs/TabRealizados";

const TABS = [
  { index: 0, label: "Clientes",              prerequisite: null },
  { index: 1, label: "Móviles",               prerequisite: "cliente" },
  { index: 2, label: "Presupuestos",           prerequisite: "movil" },
  { index: 3, label: "Turnos",                 prerequisite: "presupuesto" },
  { index: 4, label: "Ingresos",               prerequisite: "turno" },
  { index: 5, label: "Trabajos Realizados",    prerequisite: "turno" },
] as const;

export default function TabsPage() {
  const activeTab = useRepairStore((s) => s.activeTab);
  const setActiveTab = useRepairStore((s) => s.setActiveTab);
  const clearAll = useRepairStore((s) => s.clearAll);
  const selectedCliente = useRepairStore((s) => s.selectedCliente);
  const selectedMovil = useRepairStore((s) => s.selectedMovil);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);
  const selectedTurno = useRepairStore((s) => s.selectedTurno);

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    if (index === 1) return !!selectedCliente;
    if (index === 2) return !!selectedMovil;
    if (index === 3) return !!selectedPresupuesto;
    if (index === 4 || index === 5) return !!selectedTurno;
    return false;
  };

  const handleTabClick = (index: number) => {
    console.log("[linear] TabsPage handleTabClick:", index);
    setActiveTab(index);
  };

  return (
    <div className="flex flex-col w-full px-4 py-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Flujo de Reparación</h1>
        <button
          onClick={clearAll}
          className="text-sm text-gray-400 hover:text-red-500 underline transition"
        >
          Limpiar contexto
        </button>
      </div>

      {/* Breadcrumb de contexto */}
      <RepairBreadcrumb />

      {/* Barra de tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => {
          const unlocked = isUnlocked(tab.index);
          const isActive = activeTab === tab.index;
          return (
            <button
              key={tab.index}
              onClick={() => handleTabClick(tab.index)}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition
                ${isActive
                  ? "text-blue-700 border-b-2 border-blue-600 -mb-px bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {/* Indicador de tab con datos */}
              {unlocked && !isActive && (
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido del tab activo */}
      <div className="min-h-[400px]">
        {activeTab === 0 && <TabClientes />}
        {activeTab === 1 && <TabMoviles />}
        {activeTab === 2 && <TabPresupuestos />}
        {activeTab === 3 && <TabTurnos />}
        {activeTab === 4 && <TabIngresos />}
        {activeTab === 5 && <TabRealizados />}
      </div>
    </div>
  );
}
