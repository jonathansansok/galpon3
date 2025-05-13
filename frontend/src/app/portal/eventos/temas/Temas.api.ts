//frontend\src\app\portal\eventos\temas\Temas.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// frontend\src\app\portal\eventos\temas\Temas.api.ts
// frontend\src\app\portal\eventos\temas\Temas.api.ts
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
// frontend/src/app/portal/eventos/temas/Temas.api.ts
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
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrf-token='))?.split('=')[1];

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

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
    console.error("Error al obtener tema:", error); // Log de error
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
    console.error(`Error al obtener tema con id ${id}:`, error); // Log de error
    throw error;
  }
}

export async function deleteTema(id: string) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrf-token='))?.split('=')[1];

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

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
    console.error(`Error al eliminar tema con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}

export async function updateTema(id: string, formData: FormData) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrf-token='))?.split('=')[1];

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/temas/${parseInt(id, 10)}`, {
      method: "PATCH",
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
    console.error(`Error al actualizar tema con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}
