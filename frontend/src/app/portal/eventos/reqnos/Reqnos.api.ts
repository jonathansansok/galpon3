//frontend\src\app\portal\eventos\reqnos\Reqnos.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function getCsrfTokenFromCookies() {
  console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);
  const csrfCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf-token='));
  if (!csrfCookie) {
    console.error("[CSRF] No se encontró el token CSRF en las cookies.");
    return null;
  }
  const token = csrfCookie.split('=')[1];
  console.log("[CSRF] Token CSRF leído de las cookies:", token);
  return token;
}

export async function getReqnos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reqnos`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error('Error al obtener los reqnos');
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener reqnos:", error);
    throw error;
  }
}

export async function getReqno(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reqnos/${parseInt(id, 10)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error al obtener reqno con id ${id}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener reqno con id ${id}:`, error);
    throw error;
  }
}

export async function createReqno(reqnoData: any) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/reqnos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'csrf-token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(reqnoData),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn('[CSRF] No se pudo parsear el cuerpo de la respuesta:', error);
    }

    if (!res.ok) {
      console.error('Error del backend:', data);
      return {
        success: false,
        data: null,
        error: data?.error || 'Error desconocido',
        message: null,
      };
    }

    console.log('[DEBUG] response:', data);

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error('Error en el frontend:', error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}

export async function deleteReqno(id: string) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/reqnos/${parseInt(id, 10)}`, {
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
      return {
        success: false,
        data: null,
        error: data?.error || 'Error desconocido',
        message: null,
      };
    }

    console.log('[DEBUG] response:', data);

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error(`Error al eliminar reqno con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}

export async function updateReqno(id: string, newReqno: any) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/reqnos/${parseInt(id, 10)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'csrf-token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(newReqno),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn('[CSRF] No se pudo parsear el cuerpo de la respuesta:', error);
    }

    if (!res.ok) {
      console.error('Error del backend:', data);
      return {
        success: false,
        data: null,
        error: data?.error || 'Error desconocido',
        message: null,
      };
    }

    console.log('[DEBUG] response:', data);

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error(`Error al actualizar reqno con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}