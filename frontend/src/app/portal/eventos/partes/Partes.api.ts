//frontend\src\app\portal\eventos\partes\Partes.api.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function getCsrfTokenFromCookies(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export async function getPartes() {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/partes`, {
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener partes");
    return await res.json();
  } catch (error) {
    console.error("[partes] Error al obtener partes:", error);
    return [];
  }
}

export async function getParte(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/partes/${id}`, {
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener parte");
    return await res.json();
  } catch (error) {
    console.error("[partes] Error al obtener parte:", error);
    return null;
  }
}

export async function createParte(data: Record<string, any>) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/partes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, data: null, error: json.message || "Error al crear parte" };
    }
    return { success: true, data: json.data, message: json.message };
  } catch (error) {
    console.error("[partes] Error al crear parte:", error);
    return { success: false, data: null, error: "Error inesperado al crear parte" };
  }
}

export async function updateParte(id: string, data: Record<string, any>) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/partes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, data: null, error: json.message || "Error al actualizar parte" };
    }
    return { success: true, data: json.data, message: json.message };
  } catch (error) {
    console.error("[partes] Error al actualizar parte:", error);
    return { success: false, data: null, error: "Error inesperado al actualizar parte" };
  }
}

export async function deleteParte(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/partes/${id}`, {
      method: "DELETE",
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar parte");
    return await res.json();
  } catch (error) {
    console.error("[partes] Error al eliminar parte:", error);
    return null;
  }
}
