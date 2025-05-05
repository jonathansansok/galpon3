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

export async function getAtentados() {
  const data = await fetch(`${BACKEND_URL}/api/atentados`, {
    cache: "no-store",
  });
  return await data.json();
}

export async function getAtentado(id: string) {
  const data = await fetch(`${BACKEND_URL}/api/atentados/${parseInt(id, 10)}`, {
    cache: "no-store",
  });
  return await data.json();
}

export async function createAtentado(formData: FormData) {
  try {
    // Verificar token CSRF
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/atentados`, {
      method: "POST",
      body: formData,
      headers: {
        'csrf-token': csrfToken,  // Enviar el token CSRF en las cabeceras
      },
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, data };
    } else {
      console.error("Error al crear atentado:", data);
      return { success: false, error: data };
    }
  } catch (error: any) {
    console.error("Error en la solicitud:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAtentado(id: string) {
  try {
    // Verificar token CSRF
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/atentados/${parseInt(id, 10)}`, {
      method: "DELETE",
      headers: {
        'csrf-token': csrfToken,  // Enviar el token CSRF en las cabeceras
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
    console.error("Error al eliminar atentado:", error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}

export async function updateAtentado(id: string, formData: FormData) {
  try {
    // Verificar token CSRF
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/atentados/${parseInt(id, 10)}`, {
      method: "PATCH",
      body: formData,
      headers: {
        'csrf-token': csrfToken,  // Enviar el token CSRF en las cabeceras
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
      console.error('Error al actualizar atentado:', data);
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
    console.error("Error al actualizar atentado:", error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || 'Error desconocido',
      message: null,
    };
  }
}
