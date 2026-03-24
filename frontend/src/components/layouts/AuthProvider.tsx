//frontend\src\components\layouts\AuthProvider.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaShieldAlt } from "react-icons/fa";
import { useUserStore } from "@/lib/store";
import { getMe } from "@/lib/api/auth";

const AUTH_CACHE_KEY = "auth_user";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const setPrivilege = useUserStore((state) => state.setPrivilege);
  const setComp = useUserStore((state) => state.setComp);
  const isAuthPage = pathname.startsWith("/auth/");

  // Siempre true al inicio: garantiza que servidor y cliente renderizan lo mismo
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthPage) {
      setIsLoading(false);
      return;
    }

    // Leer caché solo en el cliente (localStorage no existe en servidor)
    const cached = (() => {
      try { return JSON.parse(localStorage.getItem(AUTH_CACHE_KEY) || "null"); } catch { return null; }
    })();

    if (cached) {
      setUser(cached.user);
      setPrivilege(cached.privilege);
      setComp(cached.comp);
      setIsLoading(false); // ocultar spinner inmediatamente si hay caché
    }

    // Siempre validar sesión contra el backend
    getMe()
      .then((userData) => {
        setUser(userData);
        setPrivilege(userData.privilege || null);
        setComp(userData.comp || null);
        localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
          user: userData,
          privilege: userData.privilege || null,
          comp: userData.comp || null,
        }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('[AuthProvider] getMe error:', err.message);
        localStorage.removeItem(AUTH_CACHE_KEY);
        setUser(null);
        setIsLoading(false);
        router.push("/auth/login");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthPage]);

  useEffect(() => {
    if (isAuthPage) return;

    const handleActivity = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        // Solo redirigir ESTA pestaña — no tocar servidor ni localStorage
        // para no desloguear otras pestañas activas
        setUser(null);
        router.push("/auth/login");
      }, 43200000); // 12 horas de inactividad
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    handleActivity();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [router, isAuthPage, setUser]);

  if (isAuthPage) return <>{children}</>;
  if (isLoading) return <LoadingLayoutComponent />;

  return <>{children}</>;
}

function LoadingLayoutComponent() {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      <div className="flex flex-col items-center">
        <ImSpinner2 className="animate-spin text-white text-7xl mb-4" />
        <FaShieldAlt className="text-white text-12xl" />
      </div>
    </div>
  );
}
