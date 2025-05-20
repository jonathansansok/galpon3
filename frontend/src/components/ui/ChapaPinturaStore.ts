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
  pinturaOptions: { parte: string; piezas: string }[]; // Opciones para PinturaTable
  addChapaRow: (row: ChapaRow) => void;
  removeChapaRow: (id: number) => void;
  updatePinturaOptions: (parte: string, piezas: string) => void;
}

export const useChapaPinturaStore = create<ChapaPinturaStore>((set) => ({
  chapaRows: [],
  pinturaOptions: [],
  addChapaRow: (row: ChapaRow) =>
    set((state) => ({
      chapaRows: [...state.chapaRows, row],
      pinturaOptions: [
        ...state.pinturaOptions,
        { parte: row.parte, piezas: row.piezas },
      ],
    })),
  removeChapaRow: (id: number) =>
    set((state) => ({
      chapaRows: state.chapaRows.filter((row) => row.id !== id),
      pinturaOptions: state.pinturaOptions.filter(
        (option) => !state.chapaRows.find((row) => row.id === id)
      ),
    })),
  updatePinturaOptions: (parte, piezas) =>
    set((state) => ({
      pinturaOptions: [...state.pinturaOptions, { parte, piezas }],
    })),
}));