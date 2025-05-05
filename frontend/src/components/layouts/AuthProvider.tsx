//frontend\src\components\layouts\AuthProvider.tsx
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaShieldAlt } from "react-icons/fa";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const handleActivity = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        router.push("/api/auth/logout");
      }, 600000000); // 10 minutos de inactividad
    };

    const handleUnload = () => {
      localStorage.removeItem("user");
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("beforeunload", handleUnload);

    handleActivity(); // Inicializar el temporizador

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [router]);

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