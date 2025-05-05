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

export async function getIngresos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ingresos`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error('Error al obtener los ingresos');
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    throw error;
  }
}

export async function getIngreso(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error al obtener ingreso con id ${id}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener ingreso con id ${id}:`, error);
    throw error;
  }
}

export async function createIngreso(formData: FormData) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/ingresos`, {
      method: "POST",
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

export async function deleteIngreso(id: string) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
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
    console.error(`Error al eliminar ingreso con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}

export async function updateIngreso(id: string, formData: FormData) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
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
    console.error(`Error al actualizar ingreso con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}

export async function updateFechaEgreso(ingresoId: string, egresoId: string, nuevaFechaEgreso: string) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(ingresoId, 10)}/historial/${egresoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'csrf-token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ fechaEgreso: nuevaFechaEgreso }),
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error al actualizar fecha de egreso:", error);
    return { success: false, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function updateHistorial(id: string, nuevoHistorial: string) {
  try {
    console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);

    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}/historial`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ historial: nuevoHistorial }),
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error al actualizar historial:", error);
    return { success: false, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function getEventosByLpu(evento: string, lpu: string) {
  try {
    console.log(`Fetching eventos for ${evento} with LPU ${lpu}`);
    const response = await fetch(`${BACKEND_URL}/api/ingresos/${evento}/${lpu}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error('Error al obtener eventos por LPU');
    }

    const data = await response.json();
    console.log(`Data fetched for ${evento} with LPU ${lpu}:`, data);
    return data;
  } catch (error) {
    console.error(`Error al obtener eventos para ${evento} con LPU ${lpu}:`, error);
    throw error;
  }
}

export async function searchInternos(query: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ingresos/search?query=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    }

    return await response.json();
  } catch (error) {
    console.error("Error al buscar internos:", error);
    throw error;
  }
}