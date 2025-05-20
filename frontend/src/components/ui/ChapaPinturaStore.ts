//frontend\src\components\ui\ChapaPinturaStore.ts
import { create } from "zustand";

interface ChapaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

interface ChapaPinturaStore {
  chapaRows: ChapaRow[];
  addChapaRow: (row: ChapaRow) => void;
  removeChapaRow: (id: number) => void;
}

export const useChapaPinturaStore = create<ChapaPinturaStore>((set) => ({
  chapaRows: [],
  addChapaRow: (row: ChapaRow) =>
    set((state) => ({
      chapaRows: [...state.chapaRows, row],
    })),
  removeChapaRow: (id: number) =>
    set((state) => ({
      chapaRows: state.chapaRows.filter((row) => row.id !== id),
    })),
}));