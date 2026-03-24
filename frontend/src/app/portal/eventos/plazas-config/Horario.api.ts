// frontend/src/app/portal/eventos/plazas-config/Horario.api.ts
import { getCsrfToken } from '../Eventos.api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface HorarioDia {
  id: number;
  diaSemana: number;   // 0=Dom, 1=Lun, ..., 6=Sáb
  activo: boolean;
  horaEntrada: string; // "08:00"
  horaSalida: string;  // "18:00"
  tieneAlmuerzo: boolean;
  inicioAlmuerzo: string | null;
  finAlmuerzo: string | null;
}

export async function getHorario(): Promise<HorarioDia[]> {
  const res = await fetch(`${BACKEND_URL}/api/horario`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener horario');
  return res.json();
}

export async function updateHorarioDia(
  diaSemana: number,
  data: Partial<Omit<HorarioDia, 'id'>>,
): Promise<{ success: boolean; data?: HorarioDia; error?: string }> {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/horario/${diaSemana}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al actualizar' };
  return { success: true, data: json };
}

export async function updateHorarioCompleto(
  dias: Partial<HorarioDia>[],
): Promise<{ success: boolean; error?: string }> {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BACKEND_URL}/api/horario`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken },
    credentials: 'include',
    body: JSON.stringify({ dias }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { success: false, error: json?.message || 'Error al guardar horario' };
  return { success: true };
}
