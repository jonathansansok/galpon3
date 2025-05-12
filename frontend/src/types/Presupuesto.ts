// frontend/src/types/Presupuesto.ts
export interface Presupuesto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  movilId: number;
  clienteId: number;
  datosMovil: Record<string, any>; // Representa el campo JSON para los datos del móvil
  datosCliente: Record<string, any>; // Representa el campo JSON para los datos del cliente
  monto: number;
  estado: string; // Por defecto "Pendiente"
  observaciones?: string;

  // Relaciones
  movil?: any; // Relación con el modelo Temas (puedes definir un tipo específico si lo tienes)
  cliente?: any; // Relación con el modelo Ingresos (puedes definir un tipo específico si lo tienes)

  // Campos de archivos multimedia
  imagen?: string;
  imagenDer?: string;
  imagenIz?: string;
  imagenDact?: string;
  imagenSen1?: string;
  imagenSen2?: string;
  imagenSen3?: string;
  imagenSen4?: string;
  imagenSen5?: string;
  imagenSen6?: string;
  pdf1?: string;
  pdf2?: string;
  pdf3?: string;
  pdf4?: string;
  pdf5?: string;
  pdf6?: string;
  pdf7?: string;
  pdf8?: string;
  pdf9?: string;
  pdf10?: string;
  word1?: string;

  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Presupuesto;
  matches: any[];
}