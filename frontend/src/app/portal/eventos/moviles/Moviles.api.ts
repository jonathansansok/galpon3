//frontend\src\app\portal\eventos\moviles\Moviles.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function getCsrfTokenFromCookies() {
  console.log("[CSRF] Verificando cookies disponibles en el navegador:", document.cookie);
  const csrfCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf-token="));
  if (!csrfCookie) {
    console.error("[CSRF] No se encontró el token CSRF en las cookies.");
    return null;
  }
  const token = csrfCookie.split("=")[1];
  console.log("[CSRF] Token CSRF leído de las cookies:", token);
  return token;
}

export async function createMovil(formData: FormData) {
  console.log("[CREATE MOVIL] Iniciando creación de móvil...");
  console.log("[CREATE MOVIL] FormData enviado:", Array.from(formData.entries()));

  try {
    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/moviles`, {
      method: "POST",
      body: formData,
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    console.log("[CREATE MOVIL] Respuesta del servidor:", res);

    let data = null;
    try {
      data = await res.json();
      console.log("[CREATE MOVIL] Datos parseados del servidor:", data);
    } catch (error) {
      console.warn("[CREATE MOVIL] No se pudo parsear el cuerpo de la respuesta:", error);
    }

    if (!res.ok) {
      console.error("[CREATE MOVIL] Error del backend:", data);
      return {
        success: false,
        data: null,
        error: data?.error || "Error desconocido",
        message: null,
      };
    }

    console.log("[CREATE MOVIL] Operación exitosa:", data);

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error("[CREATE MOVIL] Error en el frontend:", error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || "Error desconocido",
      message: null,
    };
  }
}

export async function getMoviles() {
  console.log("[GET MOVILES] Iniciando obtención de móviles...");

  try {
    const res = await fetch(`${BACKEND_URL}/api/moviles`, {
      cache: "no-store",
    });

    console.log("[GET MOVILES] Respuesta del servidor:", res);

    if (!res.ok) {
      throw new Error("[GET MOVILES] Error al obtener los móviles");
    }

    const data = await res.json();
    console.log("[GET MOVILES] Datos obtenidos:", data);

    return data;
  } catch (error) {
    console.error("[GET MOVILES] Error al obtener móviles:", error);
    throw error;
  }
}

export async function getMovil(id: string) {
  console.log(`[GET MOVIL] Iniciando obtención del móvil con id ${id}...`);

  try {
    const res = await fetch(`${BACKEND_URL}/api/moviles/${parseInt(id, 10)}`, {
      cache: "no-store",
    });

    console.log("[GET MOVIL] Respuesta del servidor:", res);

    if (!res.ok) {
      throw new Error(`[GET MOVIL] Error al obtener el móvil con id ${id}`);
    }

    const data = await res.json();
    console.log(`[GET MOVIL] Datos obtenidos para el móvil con id ${id}:`, data);

    return data;
  } catch (error) {
    console.error(`[GET MOVIL] Error al obtener móvil con id ${id}:`, error);
    throw error;
  }
}

export async function deleteMovil(id: string) {
  console.log(`[DELETE MOVIL] Iniciando eliminación del móvil con id ${id}...`);

  try {
    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/moviles/${parseInt(id, 10)}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    console.log("[DELETE MOVIL] Respuesta del servidor:", res);

    let data = null;
    try {
      data = await res.json();
      console.log("[DELETE MOVIL] Datos parseados del servidor:", data);
    } catch (error) {
      console.warn("[DELETE MOVIL] No se pudo parsear el cuerpo de la respuesta:", error);
    }

    if (!res.ok) {
      console.error("[DELETE MOVIL] Error del backend:", data);
      return {
        success: false,
        data: null,
        error: data?.error || "Error desconocido",
        message: null,
      };
    }

    console.log("[DELETE MOVIL] Operación exitosa:", data);

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error(`[DELETE MOVIL] Error al eliminar móvil con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || "Error desconocido",
      message: null,
    };
  }
}

export async function updateMovil(id: string, formData: FormData) {
  console.log(`[UPDATE MOVIL] Iniciando actualización del móvil con id ${id}...`);
  console.log("[UPDATE MOVIL] FormData enviado:", Array.from(formData.entries()));

  try {
    const csrfToken = getCsrfTokenFromCookies();

    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    console.log("[CSRF] Token CSRF enviado en el encabezado:", csrfToken);

    const res = await fetch(`${BACKEND_URL}/api/moviles/${parseInt(id, 10)}`, {
      method: "PATCH",
      body: formData,
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    console.log("[UPDATE MOVIL] Respuesta del servidor:", res);

    let data = null;
    try {
      data = await res.json();
      console.log("[UPDATE MOVIL] Datos parseados del servidor:", data);
    } catch (error) {
      console.warn("[UPDATE MOVIL] No se pudo parsear el cuerpo de la respuesta:", error);
    }

    if (!res.ok) {
      console.error("[UPDATE MOVIL] Error del backend:", data);
      return {
        success: false,
        data: null,
        error: data?.error || "Error desconocido",
        message: null,
      };
    }

    console.log("[UPDATE MOVIL] Operación exitosa:", data);

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error(`[UPDATE MOVIL] Error al actualizar móvil con id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || "Error desconocido",
      message: null,
    };
  }
}