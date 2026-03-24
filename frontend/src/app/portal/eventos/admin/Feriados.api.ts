// frontend/src/app/portal/eventos/admin/Feriados.api.ts
import { getCsrfToken } from '../Eventos.api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Feriado {
  id: number;
  fecha: string;    // ISO "YYYY-MM-DD" (o datetime string)
  nombre: string;
  esAnual: boolean;
}

/** Normaliza la fecha a "YYYY-MM-DD" sin zona horaria */
export function feriadoFecha(f: Feriado): string {
  return f.fecha.slice(0, 10);
}

export async function getFeriados(): Promise<Feriado[]> {
  const res = await fetch(`${BACKEND_URL}/api/feriados`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener feriados');
  return res.json();
}

export async function createFeriado(
  data: { fecha: string; nombre: string; esAnual: boolean },
): Promise<{ success: boolean; data?: Feriado; error?: string }> {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/feriados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al crear feriado' };
  return { success: true, data: json };
}

export async function deleteFeriado(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/feriados/${id}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrfToken },
    credentials: 'include',
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    return { success: false, error: json?.message || 'Error al eliminar feriado' };
  }
  return { success: true };
}
