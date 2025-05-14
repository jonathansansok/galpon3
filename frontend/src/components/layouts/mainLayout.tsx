//frontend\src\components\layouts\mainLayout.tsx
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,

  MdOutlineSettings,
  MdOutlineLogout,
  MdSearch,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import { FaShieldAlt, FaMapMarkedAlt } from "react-icons/fa"; // Importar el ícono de escudo
import { ImSpinner2 } from "react-icons/im"; // Importar el ícono de spinner

interface MainLayoutComponentProps {
  children?: React.ReactNode;
}

export default function MainLayoutComponent(props: MainLayoutComponentProps) {
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

  return <AppContentLayoutComponent {...props} />;
}
function AppContentLayoutComponent(props: MainLayoutComponentProps) {
  const { children } = props;
  const { user } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleMouseEnter = () => {
    setIsSidebarCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsSidebarCollapsed(true);
  };

  const handleLinkClick = () => {
    setIsSidebarCollapsed(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {user && (
        <div className="flex flex-col lg:flex-row flex-grow">
          <div
            className={`fixed top-0 left-0 h-screen bg-white z-20 transition-transform duration-300 ${
              isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
            } lg:w-60 w-2/3 md:hidden lg:block`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-6 h-full">
              <div className="flex flex-col justify-start item-center">
                <Link href="/" onClick={handleLinkClick}>
                  <h1 className="text-2xl text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-4 w-full">
                    Galpón 3 Taller
                  </h1>
                </Link>
                <div className="my-4 border-b border-gray-100 pb-4">
                  <Link href="/portal/eventos" onClick={handleLinkClick}>
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Eventos
                      </h3>
                    </div>
                  </Link>
                  <Link
                    href="/portal/eventos/ingresos"
                    onClick={handleLinkClick}
                  >
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Internos
                      </h3>
                    </div>
                  </Link>
                  <Link
                    href="/portal/eventos/establecimientos"
                    onClick={handleLinkClick}
                  >
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdSearch className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Establecimientos
                      </h3>
                    </div>
                  </Link>

                  <Link href="/portal/eventos/maps" onClick={handleLinkClick}>
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <FaMapMarkedAlt className="text-2xl text-gray-600 group-hover:text-white" />{" "}
                      {/* Usa el ícono de mapamundi */}
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Mapa de calor
                      </h3>
                    </div>
                  </Link>

                  <Link href="/portal/analytics" onClick={handleLinkClick}>
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineAnalytics className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Gráficos
                      </h3>
                    </div>
                  </Link>
                </div>
                {/* setting */}
                <Link href="/portal/eventos/admin" onClick={handleLinkClick}>
                  <div className="my-4 border-b border-gray-100 pb-4">
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineSettings className="text-2xl text-gray-600 group-hover:text-white" />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        Admin
                      </h3>
                    </div>
                  </div>
                </Link>
                {/* logout */}
                <div className="my-4">
                  <p className="text-left text-gray-800 font-bold">Usuario</p>
                  <p className="text-left text-gray-800 font-bold mb-5 break-words">
                    {user.name}
                  </p>
                  <a
                    href="/api/auth/logout"
                    className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
                    onClick={handleLinkClick}
                  >
                    <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white" />
                    <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                      Logout
                    </h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`fixed top-0 left-0 h-screen bg-green-400 z-30 cursor-pointer ${
              isSidebarCollapsed ? "block" : "hidden"
            }`}
            onMouseEnter={handleMouseEnter}
            //style={{ width: window.innerWidth < 600 ? "0px" : "9px" }}
            style={{ width: "9px" }}
          >
            <div className="absolute top-[6%] left-0 bg-green-400 w-5 h-1/6 rounded-tr-sm rounded-br-xl"></div>
          </div>
          <div
            className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm z-10 transition-opacity duration-300 ${
              isSidebarCollapsed ? "hidden" : "block"
            }`}
            onClick={handleMouseLeave}
          />
          <main className="flex-1 p-6 lg:ml-2 bg-white">{children}</main>
        </div>
      )}
      {user && (
        <footer className="bg-blue-500 text-white text-center py-2 w-full z-30 fixed bottom-0 left-0 text-sm sm:text-base">
          © 2025 - Galpón3
        </footer>
      )}
    </div>
  );
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
