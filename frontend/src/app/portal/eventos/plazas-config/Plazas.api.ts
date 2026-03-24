// frontend/src/app/portal/eventos/plazas-config/Plazas.api.ts
import { getCsrfToken } from '../Eventos.api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Plaza {
  id: number;
  uuid: string;
  numero: number;
  nombre: string;
  activa: boolean;
  posX: number | null;
  posY: number | null;
  ancho: number | null;
  alto: number | null;
  pisoId: number | null;
  piso?: { id: number; nombre: string; orden: number } | null;
  createdAt: string;
  updatedAt: string;
}

export async function getPlazas(pisoId?: number): Promise<Plaza[]> {
  const url = pisoId !== undefined
    ? `${BACKEND_URL}/api/plazas?pisoId=${pisoId}`
    : `${BACKEND_URL}/api/plazas`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener plazas');
  return res.json();
}

export async function getPlazaTurnosActivos(id: number): Promise<{ count: number; plazaNumero: number }> {
  const res = await fetch(`${BACKEND_URL}/api/plazas/${id}/turnos-activos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al consultar turnos activos');
  return res.json();
}

export async function createPlaza(data: { numero: number; nombre: string; activa?: boolean; pisoId?: number }) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/plazas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al crear' };
  return { success: true, data: json };
}

export async function updatePlaza(id: number, data: Partial<{ numero: number; nombre: string; activa: boolean; pisoId: number; posX: number; posY: number; ancho: number; alto: number }>) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/plazas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al actualizar' };
  return { success: true, data: json };
}

export async function deletePlaza(id: number, reasignarA?: number) {
  const csrfToken = await getCsrfToken();
  const url = reasignarA
    ? `${BACKEND_URL}/api/plazas/${id}?reasignarA=${reasignarA}`
    : `${BACKEND_URL}/api/plazas/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'csrf-token': csrfToken },
    credentials: 'include',
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al eliminar', needsReasign: res.status === 409 };
  return { success: true };
}
