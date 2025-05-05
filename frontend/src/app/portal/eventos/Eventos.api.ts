//frontend\src\app\portal\eventos\Eventos.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Función para obtener el token CSRF
export async function getCsrfToken() {
  try {
    console.log("[CSRF] Solicitando token CSRF al backend...");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csrf/token`, {
      method: 'GET',
      credentials: 'include', // Incluir cookies
    });

    if (!res.ok) {
      throw new Error('No se pudo obtener el token CSRF');
    }

    const data = await res.json();
    console.log("[CSRF] Token CSRF obtenido del backend:", data.csrfToken);
    return data.csrfToken;
  } catch (error) {
    console.error("[CSRF] Error al obtener el token CSRF:", error);
    throw error;
  }
}