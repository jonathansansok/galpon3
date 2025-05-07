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
export async function anexarMoviles(clienteId: number, movilesIds: number[]) {
  const response = await fetch(`${BACKEND_URL}/api/ingresos/anexar-moviles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clienteId, movilesIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error desconocido");
  }

  return await response.json();
}
export async function getIngresos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ingresos`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los ingresos");
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
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/ingresos`, {
      method: "POST",
      body: formData,
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error del backend:", data);
      return { success: false, error: data?.error || "Error desconocido" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error en createIngreso:", error);
    return { success: false, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function deleteIngreso(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error del backend:", data);
      return { success: false, error: data?.error || "Error desconocido" };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Error al eliminar ingreso con id ${id}:`, error);
    return { success: false, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function updateIngreso(id: string, formData: FormData) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      throw new Error("[CSRF] No se encontró el token CSRF en las cookies.");
    }

    const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
      method: "PATCH",
      body: formData,
      headers: {
        "csrf-token": csrfToken,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error del backend:", data);
      return { success: false, error: data?.error || "Error desconocido" };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Error al actualizar ingreso con id ${id}:`, error);
    return { success: false, error: (error as Error)?.message || "Error desconocido" };
  }
}

export async function getEventosByLpu(evento: string, lpu: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ingresos/${evento}/${lpu}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener eventos por LPU");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener eventos para ${evento} con LPU ${lpu}:`, error);
    throw error;
  }
}

export async function searchInternos(query: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ingresos/search?query=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error desconocido");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al buscar internos:", error);
    throw error;
  }
}