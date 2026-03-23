// frontend/src/lib/repairStore.ts
import { create } from "zustand";
import { Ingreso } from "@/types/Ingreso";
import { Tema } from "@/types/Tema";
import { Presupuesto } from "@/types/Presupuesto";
import { Turno } from "@/types/Turno";

interface RepairState {
  activeTab: number;
  selectedCliente: Ingreso | null;
  selectedMovil: Tema | null;
  selectedPresupuesto: Presupuesto | null;
  selectedTurno: Turno | null;
  setActiveTab: (tab: number) => void;
  selectCliente: (cliente: Ingreso | null) => void;
  selectMovil: (movil: Tema | null) => void;
  selectPresupuesto: (presupuesto: Presupuesto | null) => void;
  selectTurno: (turno: Turno | null) => void;
  jumpToIngreso: (presupuesto: Presupuesto, turno: Turno) => void;
  clearAll: () => void;
}

export const useRepairStore = create<RepairState>((set) => ({
  activeTab: 0,
  selectedCliente: null,
  selectedMovil: null,
  selectedPresupuesto: null,
  selectedTurno: null,

  setActiveTab: (tab) => {
    console.log("[linear] setActiveTab:", tab);
    set({ activeTab: tab });
  },

  selectCliente: (cliente) => {
    console.log("[linear] selectCliente:", cliente?.id, cliente?.apellido, cliente?.nombres);
    set({
      selectedCliente: cliente,
      selectedMovil: null,
      selectedPresupuesto: null,
      selectedTurno: null,
      activeTab: 1,
    });
  },

  selectMovil: (movil) => {
    console.log("[linear] selectMovil:", movil?.id, (movil as any)?.patente);
    set({
      selectedMovil: movil,
      selectedPresupuesto: null,
      selectedTurno: null,
      activeTab: 2,
    });
  },

  selectPresupuesto: (presupuesto) => {
    console.log("[linear] selectPresupuesto:", presupuesto?.id, presupuesto?.monto);
    set({
      selectedPresupuesto: presupuesto,
      selectedTurno: null,
      activeTab: 3,
    });
  },

  selectTurno: (turno) => {
    console.log("[linear] selectTurno:", turno?.id, turno?.estado);
    set({ selectedTurno: turno, activeTab: 4 });
  },

  jumpToIngreso: (presupuesto, turno) => {
    console.log("[linear] jumpToIngreso turnoId:", turno.id, "presupuestoId:", presupuesto.uuid ?? presupuesto.id);
    set({
      selectedPresupuesto: presupuesto,
      selectedTurno: turno,
      activeTab: 4,
    });
  },

  clearAll: () => {
    console.log("[linear] clearAll");
    set({
      selectedCliente: null,
      selectedMovil: null,
      selectedPresupuesto: null,
      selectedTurno: null,
      activeTab: 0,
    });
  },
}));
