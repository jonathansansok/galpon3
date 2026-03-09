const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3900';

function getCsrfTokenFromCookies() {
  const csrfCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf-token="));
  if (!csrfCookie) return null;
  return csrfCookie.split("=")[1];
}

export async function getUsers() {
  const res = await fetch(`${BACKEND_URL}/api/users`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Error al obtener usuarios');
  }
  return res.json();
}

export async function updateUser(
  id: number,
  data: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    privilege?: string;
    comp?: string;
    status?: string;
  },
) {
  const csrfToken = getCsrfTokenFromCookies();
  const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'csrf-token': csrfToken } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || 'Error al actualizar usuario');
  }
  return res.json();
}

export async function deleteUser(id: number) {
  const csrfToken = getCsrfTokenFromCookies();
  const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      ...(csrfToken ? { 'csrf-token': csrfToken } : {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || 'Error al eliminar usuario');
  }
  return res.json();
}

export async function generateResetLink(email: string) {
  const csrfToken = getCsrfTokenFromCookies();
  const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'csrf-token': csrfToken } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || 'Error al generar link de reset');
  }
  return res.json();
}
