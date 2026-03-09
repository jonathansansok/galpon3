//frontend\src\lib\types.ts
export interface AppUser {
    id: number;
    uuid?: string;
    email: string;
    nombre?: string | null;
    apellido?: string | null;
    telefono?: string | null;
    privilege?: string | null;
    comp?: string | null;
    status?: string | null;
    [key: string]: any;
  }