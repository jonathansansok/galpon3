//frontend\src\lib\store.ts
import { create } from "zustand";
import { Auth0User } from "@/lib/types";

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