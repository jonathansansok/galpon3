//frontend\src\app\portal\eventos\turnos\Turnos.api.ts
import { getCsrfToken } from '../Eventos.api';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getTurnosWithPresupuestoData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/turnos/with-presupuesto-data`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error al obtener los turnos con datos de presupuesto");
    }
    return await res.json();
  } catch (error) {
    console.error("[turnos] Error al obtener turnos con datos:", error);
    throw error;
  }
}

export async function getTurnoWithPresupuestoData(id: string) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${BACKEND_URL}/api/turnos/with-presupuesto-data/${numericId}`, {
      cache: "no-store",
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Error al obtener el turno con datos, ID ${id}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`[turnos] Error al obtener turno con datos, ID ${id}:`, error);
    throw error;
  }
}

export async function getTurnos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/turnos`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error al obtener los turnos");
    }
    return await res.json();
  } catch (error) {
    console.error("[turnos] Error al obtener turnos:", error);
    throw error;
  }
}

export async function getTurno(id: string) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${BACKEND_URL}/api/turnos/${numericId}`, {
      cache: "no-store",
      headers: { "csrf-token": csrfToken },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Error al obtener el turno con ID ${id}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`[turnos] Error al obtener turno con ID ${id}:`, error);
    throw error;
  }
}

export async function getPlazaAvailability(fechaInicio: string, fechaFin: string) {
  try {
    const csrfToken = await getCsrfToken();
    const res = await fetch(
      `${BACKEND_URL}/api/turnos/availability?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`,
      {
        cache: "no-store",
        headers: { "csrf-token": csrfToken },
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Error al consultar disponibilidad de plazas");
    }
    return await res.json();
  } catch (error) {
    console.error("[turnos] Error al consultar disponibilidad:", error);
    throw error;
  }
}

export async function createTurno(data: Record<string, any>) {
  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${BACKEND_URL}/api/turnos`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    let responseData = null;
    try {
      responseData = await res.json();
    } catch (error) {
      console.warn("[turnos] No se pudo parsear la respuesta:", error);
    }

    if (!res.ok) {
      console.error("[turnos] Error del backend:", responseData);
      return { success: false, data: null, error: responseData?.message || "Error desconocido", message: null };
    }

    return { success: true, data: responseData?.data ?? null, message: responseData?.message ?? "Turno creado exitosamente", error: null };
  } catch (error) {
    console.error("[turnos] Error al crear turno:", error);
    return { success: false, data: null, error: (error as Error)?.message || "Error desconocido", message: null };
  }
}

export async function updateTurno(id: string, data: Record<string, any>) {
  try {
    const csrfToken = await getCsrfToken();
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    const res = await fetch(`${BACKEND_URL}/api/turnos/${numericId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    let responseData = null;
    try {
      responseData = await res.json();
    } catch (error) {
      console.warn("[turnos] No se pudo parsear la respuesta:", error);
    }

    if (!res.ok) {
      console.error("[turnos] Error del backend:", responseData);
      return { success: false, data: null, error: responseData?.message || "Error desconocido", message: null };
    }

    return { success: true, data: responseData?.data ?? null, message: responseData?.message ?? "Turno actualizado exitosamente", error: null };
  } catch (error) {
    console.error(`[turnos] Error al actualizar turno con ID ${id}:`, error);
    return { success: false, data: null, error: (error as Error)?.message || "Error desconocido", message: null };
  }
}

export async function deleteTurno(id: string) {
  try {
    const csrfToken = await getCsrfToken();
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    const res = await fetch(`${BACKEND_URL}/api/turnos/${numericId}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn("[turnos] No se pudo parsear la respuesta:", error);
    }

    if (!res.ok) {
      console.error("[turnos] Error del backend:", data);
      return { success: false, data: null, error: data?.error || "Error desconocido", message: null };
    }

    return { success: true, data: data?.data ?? null, message: data?.message ?? "Turno eliminado exitosamente", error: null };
  } catch (error) {
    console.error(`[turnos] Error al eliminar turno con ID ${id}:`, error);
    return { success: false, data: null, error: (error as Error)?.message || "Error desconocido", message: null };
  }
}

export interface Reparador {
  id: number;
  uuid: string;
  nombre: string | null;
  apellido: string | null;
  privilege: string;
}

export async function getReparadores(): Promise<Reparador[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/reparadores`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
