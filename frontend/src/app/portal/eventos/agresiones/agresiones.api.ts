// frontend\src\app\portal\eventos\agresiones\agresiones.api.ts
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

export async function getAgresiones() {
  const response = await fetch(`${BACKEND_URL}/api/agresiones`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error('Error al obtener las agresiones');
  }
  return await response.json();
}

export async function getAgresion(id: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/agresiones/${parseInt(id, 10)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Detalles del error de la API:", errorData);
      throw new Error(
        `Error al obtener la agresión con id ${id}: ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error en getAgresion: ${error.message}`);
    throw new Error(`No se pudo obtener la agresión con id ${id}. Detalles: ${error.message}`);
  }
}

export async function createAgresion(formData: FormData) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');

    const res = await fetch(`${BACKEND_URL}/api/agresiones`, {
      method: "POST",
      body: formData,
      headers: {
        'csrf-token': csrfToken,
      },
      credentials: 'include',
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      return { success: true, data };
    } else {
      console.error("Error al crear agresión:", data);
      return { success: false, error: data?.error || "Error desconocido" };
    }
  } catch (error: any) {
    console.error("Error en la solicitud:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAgresion(id: string) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');

    const res = await fetch(`${BACKEND_URL}/api/agresiones/${parseInt(id, 10)}`, {
      method: "DELETE",
      headers: {
        'csrf-token': csrfToken,
      },
      credentials: 'include',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Error al eliminar agresión:", data);
      throw new Error(data?.error || `Error al eliminar la agresión con id ${id}`);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error en deleteAgresion:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAgresion(id: string, formData: FormData) {
  try {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) throw new Error('[CSRF] No se encontró el token CSRF en las cookies.');

    const res = await fetch(`${BACKEND_URL}/api/agresiones/${parseInt(id, 10)}`, {
      method: "PATCH",
      body: formData,
      headers: {
        'csrf-token': csrfToken,
      },
      credentials: 'include',
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      return { success: true, data };
    } else {
      console.error("Error al actualizar agresión:", data);
      return { success: false, error: data?.error || "Error desconocido" };
    }
  } catch (error: any) {
    console.error("Error en updateAgresion:", error);
    return { success: false, error: error.message };
  }
}
