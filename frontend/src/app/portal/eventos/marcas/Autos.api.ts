//frontend\src\components\ui\marca\Autos.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Obtener todas las marcas de autos

// Obtener todas las marcas de autos
export async function getAutos() {
  try {
    console.log("Fetching autos from:", `${BACKEND_URL}/api/autos`);
    const res = await fetch(`${BACKEND_URL}/api/autos`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener las marcas de autos");
    }

    const data = await res.json();
    console.log("Autos fetched:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener las marcas de autos:", error);
    throw error;
  }
}
// Crear una nueva marca de auto

// Crear una nueva marca de auto
export async function createAuto(data: { value: string; label: string }) {
  try {
    console.log("Creating auto with data:", data);
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/autos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error al crear la marca:", errorData);
      throw new Error(errorData?.error || "Error desconocido al crear la marca");
    }

    const responseData = await res.json();
    console.log("Auto creado con éxito:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error al crear la marca de auto:", error);
    throw error;
  }
}
// Actualizar una marca de auto existente
export async function updateAuto(id: string, data: { value: string; label: string }) {
  try {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/autos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Error desconocido al actualizar la marca");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al actualizar la marca de auto con id ${id}:`, error);
    throw error;
  }
}

// Eliminar una marca de auto
export async function deleteAuto(id: string) {
  try {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/autos/${id}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Error desconocido al eliminar la marca");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al eliminar la marca de auto con id ${id}:`, error);
    throw error;
  }
}