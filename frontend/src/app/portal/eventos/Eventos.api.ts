//frontend\src\app\portal\eventos\Eventos.api.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Función para obtener el token CSRF (con cache en sessionStorage)
export async function getCsrfToken(): Promise<string> {
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem('csrf-token');
    if (cached) return cached;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csrf/token`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('No se pudo obtener el token CSRF');

  const data = await res.json();

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('csrf-token', data.csrfToken);
  }

  return data.csrfToken;
}