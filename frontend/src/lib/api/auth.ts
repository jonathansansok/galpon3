const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3900';

export interface AdminUser {
  id: number;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
}

export async function getAdmins(): Promise<AdminUser[]> {
  const res = await fetch(`${BACKEND_URL}/api/users/admins`);
  if (!res.ok) return [];
  return res.json();
}

export async function login(email: string, password: string) {
  const url = `${BACKEND_URL}/api/auth/login`;
  console.log('[auth.ts] login fetch:', url);

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      console.log('[auth.ts] login response status:', res.status);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.log('[auth.ts] login error data:', data);
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      const data = await res.json();
      console.log('[auth.ts] login success data:', data);
      return data;
    } catch (err: any) {
      const esErrorDeRed = err instanceof TypeError && err.message === 'Failed to fetch';
      if (esErrorDeRed && attempt < MAX_RETRIES) {
        console.log(`[auth.ts] login intento ${attempt} fallido, reintentando en ${attempt}s...`);
        await new Promise((r) => setTimeout(r, attempt * 1000));
        continue;
      }
      if (esErrorDeRed) throw new Error('No se pudo conectar al servidor. Verificá tu conexión e intentá de nuevo.');
      throw err;
    }
  }
}

export async function register(
  email: string,
  password: string,
  nombre?: string,
  apellido?: string,
  telefono?: string,
) {
  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, nombre, apellido, telefono }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Error al registrarse');
  }
  return res.json();
}

export async function logout() {
  const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Error al cerrar sesión');
  }
  return res.json();
}

export async function getMe() {
  const url = `${BACKEND_URL}/api/auth/me`;
  console.log('[auth.ts] getMe fetch:', url);
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  console.log('[auth.ts] getMe response status:', res.status);
  if (!res.ok) {
    throw new Error('No autenticado');
  }
  const data = await res.json();
  console.log('[auth.ts] getMe success data:', data);
  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Error al generar token de reset');
  }
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Error al resetear contraseña');
  }
  return res.json();
}
