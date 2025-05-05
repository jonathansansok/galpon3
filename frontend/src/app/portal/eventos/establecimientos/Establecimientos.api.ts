//frontend\src\app\portal\eventos\establecimientos\Establecimientos.api.ts
import { useUserStore } from "@/lib/store"; // Importar el estado global
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  "Reqexts",
];

export async function fetchData(endpoint: string) {
  try {
    const comp = useUserStore.getState().comp; // Obtener el valor de comp desde Zustand
    console.log("Valor de comp en fetchData:", comp);

    const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Error al obtener ${endpoint}: ${response.statusText}`);
      return []; // Devuelve un array vacío en caso de error
    }

    const data = await response.json();

    // Si comp está definido, filtrar los datos; de lo contrario, devolver todos los datos
    const filteredData = comp
      ? data.filter((item: any) => item.establecimiento === comp)
      : data;

    console.log(`Datos filtrados para ${endpoint}:`, filteredData);

    return filteredData;
  } catch (error) {
    console.error(`Error al obtener ${endpoint}:`, error); // Log de error
    return []; // Devuelve un array vacío en caso de error
  }
}

export async function getAllData() {
  const result: { [key: string]: any } = {};
  for (const endpoint of endpoints) {
    try {
      result[endpoint] = await fetchData(endpoint); // Ejecutar solicitudes de forma secuencial
    } catch (error) {
      console.error(`Error al obtener ${endpoint}:`, error);
      result[endpoint] = []; // Manejar errores devolviendo un array vacío
    }
  }
  return result;
}