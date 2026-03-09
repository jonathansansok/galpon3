const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3900';

export interface AuditNotification {
  id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  entityId: number | null;
  detail: string | null;
  userId: number;
  readBy: number[];
  createdAt: string;
  user: { id: number; name: string | null; email: string };
}

export async function getRecentNotifications(since?: string): Promise<AuditNotification[]> {
  const params = since ? `?since=${encodeURIComponent(since)}` : '';
  const res = await fetch(`${BACKEND_URL}/api/notifications/recent${params}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener notificaciones');
  return res.json();
}

export async function getUnreadCount(): Promise<number> {
  const res = await fetch(`${BACKEND_URL}/api/notifications/unread-count`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener conteo');
  const data = await res.json();
  return data.count;
}

export async function markNotificationsRead(ids: number[]): Promise<void> {
  await fetch(`${BACKEND_URL}/api/notifications/mark-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ ids }),
  });
}

export async function logAudit(data: {
  action: string;
  entity: string;
  entityId?: number;
  detail?: string;
}): Promise<void> {
  await fetch(`${BACKEND_URL}/api/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  }).catch(() => {}); // silently fail - audit should not block UI
}
