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
  createdAt: string;
  updatedAt: string;
}

export async function getPlazas(): Promise<Plaza[]> {
  const res = await fetch(`${BACKEND_URL}/api/plazas`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener plazas');
  return res.json();
}

export async function getPlazaTurnosActivos(id: number): Promise<{ count: number; plazaNumero: number }> {
  const res = await fetch(`${BACKEND_URL}/api/plazas/${id}/turnos-activos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al consultar turnos activos');
  return res.json();
}

export async function createPlaza(data: { numero: number; nombre: string; activa?: boolean }) {
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

export async function updatePlaza(id: number, data: Partial<{ numero: number; nombre: string; activa: boolean }>) {
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

export async function getTallerConfig(): Promise<{ canvasW: number; canvasH: number }> {
  const res = await fetch(`${BACKEND_URL}/api/taller-config`, { cache: 'no-store' });
  if (!res.ok) return { canvasW: 1400, canvasH: 600 };
  return res.json();
}

export async function updateTallerConfig(canvasW: number, canvasH: number) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/taller-config`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify({ canvasW, canvasH }),
  });
  return res.ok;
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
