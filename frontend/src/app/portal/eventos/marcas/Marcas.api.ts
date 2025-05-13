export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Obtener todas las marcas
export async function getMarcas() {
  try {
    console.log("Fetching marcas from:", `${BACKEND_URL}/api/marcas`);
    const res = await fetch(`${BACKEND_URL}/api/marcas`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener las marcas");
    }

    const data = await res.json();
    console.log("Marcas fetched:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener las marcas:", error);
    throw error;
  }
}

// Crear una nueva marca
export async function createMarca(data: { value: string; label: string }) {
  try {
    console.log("Creating marca with data:", data);
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/marcas`, {
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
    console.log("Marca creada con éxito:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error al crear la marca:", error);
    throw error;
  }
}

// Actualizar una marca existente
export async function updateMarca(id: string, data: { value: string; label: string }) {
  try {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/marcas/${id}`, {
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
    console.error(`Error al actualizar la marca con id ${id}:`, error);
    throw error;
  }
}

// Eliminar una marca
export async function deleteMarca(id: string) {
  try {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/marcas/${id}`, {
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
    console.error(`Error al eliminar la marca con id ${id}:`, error);
    throw error;
  }
}