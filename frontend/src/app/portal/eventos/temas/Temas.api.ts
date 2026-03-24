//frontend\src\app\portal\eventos\temas\Temas.api.ts
import { getCsrfToken } from '../Eventos.api';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getPresupuestosAsociados(movilId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/presupuestos/movil?movilId=${movilId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los presupuestos asociados");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener presupuestos asociados al movilId ${movilId}:`, error);
    throw error;
  }
}

export async function getClienteAsociado(temaId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/temas/${parseInt(temaId, 10)}/cliente`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener el cliente asociado");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener cliente asociado al tema con id ${temaId}:`, error);
    throw error;
  }
}

export async function createTema(formData: FormData) {
  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${BACKEND_URL}/api/temas`, {
      method: 'POST',
      body: formData,
      headers: {
        'csrf-token': csrfToken,
      },
      credentials: 'include',
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn('[CSRF] No se pudo parsear el cuerpo de la respuesta:', error);
    }

    if (!res.ok) {
      console.error('Error del backend:', data);
      return { success: false, data: null, error: data?.error || 'Error desconocido', message: null };
    }

    return { success: true, data: data?.data ?? null, message: data?.message ?? "Operación exitosa", error: null };
  } catch (error) {
    console.error('Error en el frontend:', error);
    return { success: false, data: null, error: (error as Error)?.message || 'Error desconocido', message: null };
  }
}

export async function getTemas() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/temas`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error('Error al obtener los temas');
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener tema:", error);
    throw error;
  }
}

export async function getTema(id: string) {
  try {
    const data = await fetch(`${BACKEND_URL}/api/temas/${parseInt(id, 10)}`, {
      cache: "no-store",
    });
    return await data.json();
  } catch (error) {
    console.error(`Error al obtener tema con id ${id}:`, error);
    throw error;
  }
}

export async function deleteTema(id: string) {
  try {
    const csrfToken = await getCsrfToken();

    const res = await fetch(`${BACKEND_URL}/api/temas/${parseInt(id, 10)}`, {
      method: "DELETE",
      headers: {
        'csrf-token': csrfToken,
      },
      credentials: 'include',
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn('[CSRF] No se pudo parsear el cuerpo de la respuesta:', error);
    }

    if (!res.ok) {
      console.error('Error del backend:', data);
      return { success: false, data: null, error: data?.error || 'Error desconocido', message: null };
    }

    return { success: true, data: data?.data ?? null, message: data?.message ?? "Operación exitosa", error: null };
  } catch (error) {
    console.error(`Error al eliminar tema con id ${id}:`, error);
    return { success: false, data: null, error: (error as Error)?.message || 'Error desconocido', message: null };
  }
}

export async function updateTema(id: string, formData: FormData) {
  const numId = parseInt(id, 10);
  const url = `${BACKEND_URL}/api/temas/${numId}`;
  const formKeys = [...formData.keys()];
  const blobCount = formKeys.filter((k) => k === "files").length;
  console.info(`🟩 [Temas.api] updateTema CALLED id=${id} url=${url}`);
  console.info(`🟩 [Temas.api] formData keys=[${formKeys.join(", ")}] blobs=${blobCount}`);
  try {
    const csrfToken = await getCsrfToken();
    console.info(`🟩 [Temas.api] csrfToken obtenido: ${csrfToken ? "OK" : "VACÍO"}`);
    console.info(`🟩 [Temas.api] enviando PATCH a ${url}…`);

    const res = await fetch(url, {
      method: "PATCH",
      body: formData,
      headers: { 'csrf-token': csrfToken },
      credentials: 'include',
    });

    console.info(`🟩 [Temas.api] respuesta HTTP status=${res.status} ok=${res.ok}`);

    let data = null;
    try {
      data = await res.json();
      console.info(`🟩 [Temas.api] body parseado:`, data);
    } catch (error) {
      console.warn('🟩 [Temas.api] no se pudo parsear body:', error);
    }

    if (!res.ok) {
      console.error(`🟩 [Temas.api] ❌ backend error status=${res.status}:`, data);
      return { success: false, data: null, error: data?.message || data?.error || 'Error desconocido', message: null };
    }

    console.info(`🟩 [Temas.api] ✅ éxito, data.id=${data?.data?.id}`);
    return { success: true, data: data?.data ?? null, message: data?.message ?? "Operación exitosa", error: null };
  } catch (error) {
    console.error(`🟩 [Temas.api] ❌ EXCEPTION updateTema id=${id}:`, error);
    return { success: false, data: null, error: (error as Error)?.message || 'Error desconocido', message: null };
  }
}
