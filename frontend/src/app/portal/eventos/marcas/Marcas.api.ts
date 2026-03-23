//frontend\src\app\portal\eventos\marcas\Marcas.api.ts
import { getCsrfToken } from '../Eventos.api';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function deleteModelo(id: number) {
  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${BACKEND_URL}/api/modelos/${id}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Error desconocido al eliminar el modelo");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al eliminar el modelo con id ${id}:`, error);
    throw error;
  }
}

export async function updateModelo(id: number, data: { label: string; value: string; marcaId: number }) {
  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${BACKEND_URL}/api/modelos/${id}`, {
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
      throw new Error(errorData?.error || "Error desconocido al actualizar el modelo");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al actualizar el modelo con id ${id}:`, error);
    throw error;
  }
}

export async function getModelos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/modelos`);
    if (!res.ok) {
      throw new Error("Error al obtener los modelos");
    }
    return await res.json();
  } catch (error) {
    console.error("Error al obtener los modelos:", error);
    throw error;
  }
}

export async function createModelo(data: { label: string; value: string; marcaId: number }) {
  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${BACKEND_URL}/api/modelos`, {
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
      throw new Error(errorData?.error || "Error desconocido al crear el modelo");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al crear el modelo:", error);
    throw error;
  }
}

export async function getMarcas() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/marcas`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener las marcas");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener las marcas:", error);
    throw error;
  }
}

export async function createMarca(data: { value: string; label: string }) {
  try {
    const csrfToken = await getCsrfToken();

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
      throw new Error(errorData?.error || "Error desconocido al crear la marca");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al crear la marca:", error);
    throw error;
  }
}

export async function updateMarca(id: string, data: { value: string; label: string }) {
  try {
    const csrfToken = await getCsrfToken();

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

export async function deleteMarca(id: string) {
  try {
    const csrfToken = await getCsrfToken();

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
