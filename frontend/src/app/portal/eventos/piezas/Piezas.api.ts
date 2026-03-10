//frontend\src\app\portal\eventos\piezas\Piezas.api.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function getCsrfTokenFromCookies(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export async function getPiezas() {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/piezas`, {
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener piezas");
    return await res.json();
  } catch (error) {
    console.error("[piezas] Error al obtener piezas:", error);
    return [];
  }
}

export async function getPieza(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/piezas/${id}`, {
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener pieza");
    return await res.json();
  } catch (error) {
    console.error("[piezas] Error al obtener pieza:", error);
    return null;
  }
}

export async function createPieza(data: Record<string, any>) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/piezas`, {
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
      return { success: false, data: null, error: json.message || "Error al crear pieza" };
    }
    return { success: true, data: json.data, message: json.message };
  } catch (error) {
    console.error("[piezas] Error al crear pieza:", error);
    return { success: false, data: null, error: "Error inesperado al crear pieza" };
  }
}

export async function updatePieza(id: string, data: Record<string, any>) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/piezas/${id}`, {
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
      return { success: false, data: null, error: json.message || "Error al actualizar pieza" };
    }
    return { success: true, data: json.data, message: json.message };
  } catch (error) {
    console.error("[piezas] Error al actualizar pieza:", error);
    return { success: false, data: null, error: "Error inesperado al actualizar pieza" };
  }
}

export async function deletePieza(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    const res = await fetch(`${BACKEND_URL}/api/piezas/${id}`, {
      method: "DELETE",
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar pieza");
    return await res.json();
  } catch (error) {
    console.error("[piezas] Error al eliminar pieza:", error);
    return null;
  }
}
