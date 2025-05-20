// src/constants/constants.ts

export const partes = {
    "Parte Trasera": ["P.T.", "Paragolpe trasero", "Luces traseras"],
    "Parte Delantera": ["P.D.", "Paragolpe delantero", "Luces delanteras"],
    "Lado Derecho": ["LD", "Puerta", "Retrovisor", "Manija Conductor"],
    "Lado Izquierdo": ["LI", "Puerta Izquierda", "Retrovisor Izquierdo"],
    Techo: ["T.", "Polarizado", "Impermeabilización"],
    "Tren Delantero": ["T.D.", "Amortiguadores", "Rótulas", "Bujes"],
  };
  
  export const piezasConValores = {
    "Paragolpe trasero": { costo: 100, horas: 4, costoPorPano: 50, panos: 1 },
    "Luces traseras": { costo: 50, horas: 2, costoPorPano: 30, panos: 1 },
    "Paragolpe delantero": { costo: 120, horas: 5, costoPorPano: 60, panos: 1 },
    "Luces delanteras": { costo: 60, horas: 3, costoPorPano: 40, panos: 1 },
    Puerta: { costo: 200, horas: 6, costoPorPano: 120, panos: 1 },
    Retrovisor: { costo: 80, horas: 3, costoPorPano: 60, panos: 1 },
    "Manija Conductor": { costo: 40, horas: 1, costoPorPano: 40, panos: 1 },
    "Puerta Izquierda": { costo: 190, horas: 6, costoPorPano: 110, panos: 1 },
    "Retrovisor Izquierdo": { costo: 75, horas: 3, costoPorPano: 55, panos: 1 },
    Polarizado: { costo: 50, horas: 2, costoPorPano: 50, panos: 1 },
    Impermeabilización: { costo: 70, horas: 3, costoPorPano: 70, panos: 1 },
    Amortiguadores: { costo: 150, horas: 4, costoPorPano: 0, panos: 0 },
    Rótulas: { costo: 90, horas: 2, costoPorPano: 0, panos: 0 },
    Bujes: { costo: 60, horas: 1, costoPorPano: 0, panos: 0 },
    Capó: { costo: 150, horas: 5, costoPorPano: 0, panos: 0 },
    Filtro: { costo: 30, horas: 1, costoPorPano: 0, panos: 0 },
    Radiador: { costo: 120, horas: 4, costoPorPano: 0, panos: 0 },
  };