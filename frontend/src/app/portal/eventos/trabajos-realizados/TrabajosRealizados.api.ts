//frontend\src\app\portal\eventos\trabajos-realizados\TrabajosRealizados.api.ts
import { getCsrfToken } from '../Eventos.api';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getTrabajosRealizados() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/trabajos-realizados`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener los trabajos realizados");
    return await res.json();
  } catch (error) {
    console.error("[trabajos] Error al obtener trabajos realizados:", error);
    throw error;
  }
}

export async function getTrabajoRealizado(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/trabajos-realizados/${parseInt(id, 10)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Error al obtener trabajo realizado con ID ${id}`);
    return await res.json();
  } catch (error) {
    console.error(`[trabajos] Error al obtener trabajo realizado ${id}:`, error);
    throw error;
  }
}

export async function getTrabajosByTurnoId(turnoId: string) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/trabajos-realizados/by-turno?turnoId=${encodeURIComponent(turnoId)}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Error al obtener trabajos por turno");
    return await res.json();
  } catch (error) {
    console.error("[trabajos] Error al obtener trabajos por turno:", error);
    throw error;
  }
}

export async function createTrabajoRealizado(data: Record<string, any>) {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${BACKEND_URL}/api/trabajos-realizados`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", "csrf-token": csrfToken },
      credentials: "include",
    });
    const responseData = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, data: null, error: responseData?.message || "Error desconocido" };
    }
    return { success: true, data: responseData, error: null };
  } catch (error) {
    console.error("[trabajos] Error al crear trabajo realizado:", error);
    return { success: false, data: null, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function updateTrabajoRealizado(id: string, data: Record<string, any>) {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${BACKEND_URL}/api/trabajos-realizados/${parseInt(id, 10)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", "csrf-token": csrfToken },
      credentials: "include",
    });
    const responseData = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, data: null, error: responseData?.message || "Error desconocido" };
    }
    return { success: true, data: responseData, error: null };
  } catch (error) {
    console.error(`[trabajos] Error al actualizar trabajo realizado ${id}:`, error);
    return { success: false, data: null, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function deleteTrabajoRealizado(id: string) {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${BACKEND_URL}/api/trabajos-realizados/${parseInt(id, 10)}`, {
      method: "DELETE",
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, error: data?.error || "Error desconocido" };
    }
    return { success: true, data };
  } catch (error) {
    console.error(`[trabajos] Error al eliminar trabajo realizado ${id}:`, error);
    return { success: false, error: (error as Error)?.message || "Error desconocido" };
  }
}
