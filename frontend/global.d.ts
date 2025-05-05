// global.d.ts
export {};

declare global {
  interface Window {
    __csrfLoaded?: boolean; // Agregar la propiedad __csrfLoaded al objeto window
  }
}