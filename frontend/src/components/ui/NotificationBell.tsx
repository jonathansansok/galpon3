"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaBell, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useUserStore } from "@/lib/store";
import {
  getRecentNotifications,
  getUnreadCount,
  markNotificationsRead,
  AuditNotification,
} from "@/lib/api/notifications";

const ACTION_CONFIG: Record<
  string,
  { icon: typeof FaPlus; color: string; bg: string; label: string }
> = {
  CREATE: {
    icon: FaPlus,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    label: "Creó",
  },
  UPDATE: {
    icon: FaEdit,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "Actualizó",
  },
  DELETE: {
    icon: FaTrash,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "Eliminó",
  },
};

const ENTITY_ROUTES: Record<string, string> = {
  Ingresos: "/portal/eventos/ingresos",
  Temas: "/portal/eventos/temas",
  Presupuestos: "/portal/eventos/presupuestos",
  Marcas: "/portal/eventos/marcas",
};

function getNotificationUrl(
  entity: string,
  entityId: number | null
): string | null {
  const base = ENTITY_ROUTES[entity];
  if (!base) return null;
  if (entityId) return `${base}/${entityId}/edit`;
  return base;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function NotificationBell() {
  const user = useUserStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AuditNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // silently fail
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecentNotifications();
      setNotifications(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll unread count every 5s
  useEffect(() => {
    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUnread]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (willOpen) {
      await fetchNotifications();
    }
  };

  // After fetching notifications, mark as read
  useEffect(() => {
    if (isOpen && notifications.length > 0 && user?.id) {
      const unreadIds = notifications
        .filter((n) => {
          const readBy = (n.readBy as number[]) || [];
          return !readBy.includes(user.id);
        })
        .map((n) => n.id);
      if (unreadIds.length > 0) {
        markNotificationsRead(unreadIds).then(() => setUnreadCount(0));
      }
    }
  }, [isOpen, notifications, user?.id]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Notificaciones"
      >
        <FaBell className="text-xl text-gray-600 hover:text-gray-800 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-sm font-semibold text-gray-800">
              Notificaciones
            </h3>
            <p className="text-xs text-gray-400">Actividad reciente</p>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[400px] divide-y divide-gray-50">
            {loading && notifications.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <FaBell className="text-3xl mb-2 opacity-30" />
                <p className="text-sm">Sin notificaciones</p>
              </div>
            )}

            {notifications.map((n) => {
              const config = ACTION_CONFIG[n.action] || ACTION_CONFIG.UPDATE;
              const Icon = config.icon;
              const isUnread = user?.id
                ? !((n.readBy as number[]) || []).includes(user.id)
                : false;
              const url = getNotificationUrl(n.entity, n.entityId);

              const content = (
                <>
                  {/* Action icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center mt-0.5`}
                  >
                    <Icon className={`text-sm ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-semibold">
                        {n.user?.email || n.user?.name || "Usuario"}
                      </span>{" "}
                      <span className={`font-medium ${config.color}`}>
                        {config.label.toLowerCase()}
                      </span>{" "}
                      <span className="text-gray-600">
                        {n.entity}
                        {n.entityId ? ` #${n.entityId}` : ""}
                      </span>
                    </p>
                    {n.detail && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {n.detail}
                      </p>
                    )}
                    <p className="text-xs text-gray-300 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {isUnread && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </>
              );

              const className = `flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors no-underline ${
                isUnread ? "bg-blue-50/40" : ""
              }`;

              return url ? (
                <a
                  key={n.id}
                  href={url}
                  onClick={() => setIsOpen(false)}
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <div key={n.id} className={className}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
