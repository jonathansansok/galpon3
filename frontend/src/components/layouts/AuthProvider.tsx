//frontend\src\components\layouts\AuthProvider.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaShieldAlt } from "react-icons/fa";
import { useUserStore } from "@/lib/store";
import { getMe, logout as logoutApi } from "@/lib/api/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const setPrivilege = useUserStore((state) => state.setPrivilege);
  const setComp = useUserStore((state) => state.setComp);
  const isAuthPage = pathname.startsWith("/auth/");

  console.log('[AuthProvider] pathname:', pathname, 'isAuthPage:', isAuthPage);

  useEffect(() => {
    if (isAuthPage) {
      console.log('[AuthProvider] Auth page detected, skipping getMe');
      setIsLoading(false);
      return;
    }

    console.log('[AuthProvider] Calling getMe...');
    getMe()
      .then((userData) => {
        console.log('[AuthProvider] getMe success:', userData);
        setUser(userData);
        setPrivilege(userData.privilege || null);
        setComp(userData.comp || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('[AuthProvider] getMe error:', err.message);
        setIsLoading(false);
        router.push("/auth/login");
      });
  }, [isAuthPage, router, setUser, setPrivilege, setComp]);

  useEffect(() => {
    if (isAuthPage) return;

    const handleActivity = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(async () => {
        await logoutApi().catch(() => {});
        setUser(null);
        router.push("/auth/login");
      }, 3600000); // 1 hora de inactividad
    };

    const handleUnload = () => {
      localStorage.removeItem("user");
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("beforeunload", handleUnload);

    handleActivity();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("beforeunload", handleUnload);
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
