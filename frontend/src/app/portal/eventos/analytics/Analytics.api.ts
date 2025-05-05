//frontend\src\app\portal\eventos\analytics\Analytics.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface EventData {
  establecimiento?: string;
  modulo_ur?: string;
  fechaHora?: string;
  pabellon?: string;
  // otros campos que puedan existir en los datos
}

const endpoints = [
  "Sumarios",
  "Habeas",
  "Manifestaciones",
  "Manifestaciones2",
  "Agresiones",
  "Preingresos",
  "Prevenciones",
  "Huelgas",
  "Procedimientos",
  "Extramuros",
  "Elementos",
  "Atentados",
  "Impactos",
  "Egresos",
];

export async function fetchData(endpoint: string): Promise<EventData[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
      cache: "no-store",
    });
    const data: EventData[] = await response.json();
    console.log(`Datos obtenidos de ${endpoint}:`, data); // Log de datos obtenidos
    return data;
  } catch (error) {
    console.error(`Error al obtener ${endpoint}:`, error); // Log de error
    throw error;
  }
}

export async function getAllData(filters: { startDate?: Date; endDate?: Date; establecimiento?: string; modulo_ur?: string; pabellon?: string }) {
  try {
    console.log("Parámetros de búsqueda:", filters); // Log de parámetros de búsqueda
    const data = await Promise.all(endpoints.map(endpoint => fetchData(endpoint)));
    const result: { [key: string]: any } = {};
    endpoints.forEach((endpoint, index) => {
      if (Array.isArray(data[index])) {
        result[endpoint] = data[index].filter((item: EventData) => {
          const itemDate = item.fechaHora ? new Date(item.fechaHora) : null;
          const isWithinDateRange = (!filters.startDate || (itemDate && itemDate >= new Date(filters.startDate))) && (!filters.endDate || (itemDate && itemDate <= new Date(filters.endDate)));
          const matchesEstablecimiento = !filters.establecimiento || item.establecimiento === filters.establecimiento;
          const matchesModuloUr = !filters.modulo_ur || item.modulo_ur === filters.modulo_ur;
          const matchesPabellon = !filters.pabellon || item.pabellon === filters.pabellon;
          return isWithinDateRange && matchesEstablecimiento && matchesModuloUr && matchesPabellon;
        });
      } else {
        console.error(`Error: ${endpoint} no devolvió un array.`);
        result[endpoint] = [];
      }
    });

    console.log("Resultados filtrados:", result); // Log de resultados filtrados
    return result;
  } catch (error) {
    console.error("Error al obtener datos:", error); // Log de error
    throw error;
  }
}