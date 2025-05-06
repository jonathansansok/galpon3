export interface Movil {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    patente: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    tipoPintura: string;
    paisOrigen: string;
    tipoVehic: string;
    motor: string;
    chasis: string;
    combustion: string;
    vin: string;
    [key: string]: any; // Permitir indexación con una cadena
  }
  
  export interface SearchResult {
    item: Movil;
    matches: any[];
  }