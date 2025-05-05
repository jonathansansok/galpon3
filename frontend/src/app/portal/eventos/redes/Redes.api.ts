// frontend/src/app/portal/eventos/redes/Establecimientos.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const endpoints = [
  "Ingresos",

];

export async function fetchData(endpoint: string) {
  try {
    const data = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
      cache: "no-store",
    });
    return await data.json();
  } catch (error) {
    console.error(`Error al obtener ${endpoint}:`, error); // Log de error
    throw error;
  }
}

export async function getAllData() {
  try {
    const data = await Promise.all(endpoints.map(endpoint => fetchData(endpoint)));
    const result: { [key: string]: any } = {};
    endpoints.forEach((endpoint, index) => {
      result[endpoint] = data[index];
    });
    return result;
  } catch (error) {
    console.error("Error al obtener datos:", error); // Log de error
    throw error;
  }
}