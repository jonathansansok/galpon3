//frontend\src\lib\store.ts
import { create } from "zustand";
import { Auth0User } from "@/lib/types";

interface PresupuestoState {
  idMovil: number | null;
  patente: string | null;
  movilData: any | null;
  clienteData: any | null; // Agregar clienteData
  setIdMovil: (id: number) => void;
  setPatente: (patente: string) => void;
  setMovilData: (data: any) => void;
  setClienteData: (data: any) => void; // Agregar setClienteData
}

export const usePresupuestoStore = create<PresupuestoState>((set) => ({
  idMovil: null,
  patente: null,
  movilData: null,
  clienteData: null, // Inicializar clienteData
  setIdMovil: (id) => set({ idMovil: id }),
  setPatente: (patente) => set({ patente }),
  setMovilData: (data) => set({ movilData: data }),
  setClienteData: (data) => set({ clienteData: data }), // Implementar setClienteData
}));
interface Location {
  lat: number;
  lng: number;
  apellido: string;
  nombres: string;
  lpu?: string;
  tipoDoc?: string;
  numeroDni?: string;
  cualorg?: string;
  condicion?: string;
  ubicacionMap?: string;
  imagen?: string;
}

interface UserState {
  user: Auth0User | null;
  privilege: string | null;
  comp: string | null; // Agregar propiedad comp
  locations: Location[];
  setUser: (user: Auth0User | null) => void;
  setPrivilege: (privilege: string | null) => void;
  setComp: (comp: string | null) => void; // Agregar función setComp
  setLocations: (locations: Location[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  privilege: null,
  comp: null, // Inicializa comp como null
  locations: [],
  setUser: (user) => set({ user }),
  setPrivilege: (privilege) => set({ privilege }),
  setComp: (comp) => set({ comp }), // Define la función setComp
  setLocations: (locations) => set({ locations }),
}));