//frontend\src\components\layouts\AuthProvider.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaShieldAlt } from "react-icons/fa";
import { useUserStore } from "@/lib/store";
import { getMe, logout as logoutApi } from "@/lib/api/auth";

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

  // Si hay caché en localStorage, cargamos inmediatamente sin spinner
  const cached = !isAuthPage ? (() => {
    try { return JSON.parse(localStorage.getItem(AUTH_CACHE_KEY) || "null"); } catch { return null; }
  })() : null;

  const [isLoading, setIsLoading] = useState(!cached);

  console.log('[AuthProvider] pathname:', pathname, 'isAuthPage:', isAuthPage, 'cached:', !!cached);

  useEffect(() => {
    if (isAuthPage) {
      setIsLoading(false);
      return;
    }

    // Restaurar desde caché al instante (nueva pestaña, F5 sin BFCache, etc.)
    if (cached) {
      setUser(cached.user);
      setPrivilege(cached.privilege);
      setComp(cached.comp);
    }

    // Validar sesión contra el backend (siempre, en segundo plano si hay caché)
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
      timeoutRef.current = setTimeout(async () => {
        await logoutApi().catch(() => {});
        localStorage.removeItem(AUTH_CACHE_KEY);
        setUser(null);
        router.push("/auth/login");
      }, 3600000); // 1 hora de inactividad
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
