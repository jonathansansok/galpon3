//frontend\src\app\portal\eventos\presupuestos\Presupuestos.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function getPresupuestosWithMovilData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/presupuestos/with-movil-data`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los presupuestos con datos de móviles");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener presupuestos con datos de móviles:", error);
    throw error;
  }
}
export async function getMovilById(movilId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/temas/${movilId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error al obtener el móvil con ID ${movilId}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener móvil con ID ${movilId}:`, error);
    throw error;
  }
}
// Obtener todos los presupuestos
export async function getPresupuestos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/presupuestos`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los presupuestos");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    throw error;
  }
}

// Obtener un presupuesto por ID
export async function getPresupuesto(id: string) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    const res = await fetch(`${BACKEND_URL}/api/presupuestos/${numericId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error al obtener el presupuesto con ID ${id}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener presupuesto con ID ${id}:`, error);
    throw error;
  }
}

// Crear un presupuesto
export async function createPresupuesto(formData: FormData) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/presupuestos`, {
      method: "POST",
      body: formData,
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn("[CSRF] No se pudo parsear el cuerpo de la respuesta:", error);
    }

    if (!res.ok) {
      console.error("Error del backend:", data);
      return {
        success: false,
        data: null,
        error: data?.error || "Error desconocido",
        message: null,
      };
    }

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || "Error desconocido",
      message: null,
    };
  }
}

// Actualizar un presupuesto
export async function updatePresupuesto(id: string, formData: FormData) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    const res = await fetch(`${BACKEND_URL}/api/presupuestos/${numericId}`, {
      method: "PATCH",
      body: formData,
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      console.warn("[CSRF] No se pudo parsear el cuerpo de la respuesta:", error);
    }

    if (!res.ok) {
      console.error("Error del backend:", data);
      return {
        success: false,
        data: null,
        error: data?.error || "Error desconocido",
        message: null,
      };
    }

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error(`Error al actualizar presupuesto con ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || "Error desconocido",
      message: null,
    };
  }
}

// Eliminar un presupuesto
export async function deletePresupuesto(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    const res = await fetch(`${BACKEND_URL}/api/presupuestos/${numericId}`, {
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
      console.warn("[CSRF] No se pudo parsear el cuerpo de la respuesta:", error);
    }

    if (!res.ok) {
      console.error("Error del backend:", data);
      return {
        success: false,
        data: null,
        error: data?.error || "Error desconocido",
        message: null,
      };
    }

    return {
      success: true,
      data: data?.data ?? null,
      message: data?.message ?? "Operación exitosa",
      error: null,
    };
  } catch (error) {
    console.error(`Error al eliminar presupuesto con ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error)?.message || "Error desconocido",
      message: null,
    };
  }
}

// Obtener el token CSRF desde las cookies
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