// frontend/src/app/portal/eventos/plazas-config/Pisos.api.ts
import { getCsrfToken } from '../Eventos.api';
import { Plaza } from './Plazas.api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Piso {
  id: number;
  uuid: string;
  nombre: string;
  orden: number;
  canvasW: number;
  canvasH: number;
  activo: boolean;
  plazas: Plaza[];
  createdAt: string;
  updatedAt: string;
}

export async function getPisos(): Promise<Piso[]> {
  const res = await fetch(`${BACKEND_URL}/api/pisos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener pisos');
  return res.json();
}

export async function createPiso(data: { nombre: string; orden: number; canvasW?: number; canvasH?: number }) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/pisos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al crear' };
  return { success: true, data: json };
}

export async function updatePiso(id: number, data: Partial<{ nombre: string; orden: number; canvasW: number; canvasH: number; activo: boolean }>) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/pisos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al actualizar' };
  return { success: true, data: json };
}

export async function deletePiso(id: number) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/pisos/${id}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrfToken },
    credentials: 'include',
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al eliminar' };
  return { success: true };
}
