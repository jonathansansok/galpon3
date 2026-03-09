//frontend\src\components\layouts\AppContentLayoutComponent.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MdOutlineSpaceDashboard,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineEvent,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import {
  FaCarAlt,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaCar,
  FaCogs,
  FaWrench,
  FaUserShield,
} from "react-icons/fa";
import { useUserStore } from "@/lib/store";
import { logout as logoutApi } from "@/lib/api/auth";
import NotificationBell from "@/components/ui/NotificationBell";

interface AppContentLayoutComponentProps {
  children?: React.ReactNode;
}

export default function AppContentLayoutComponent(
  props: AppContentLayoutComponentProps
) {
  const privilege = useUserStore((state) => state.privilege);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { children } = props;
  const router = useRouter();
  const pathname = usePathname();

  console.log('[AppContentLayout] user:', user, 'privilege:', privilege);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Redirigir C1 a turnos si intenta acceder a otra sección
  const isC1 = privilege === "C1";
  const allowedForC1 = pathname?.startsWith("/portal/eventos/turnos") || pathname === "/auth/login" || pathname === "/auth/register";
  if (isC1 && user && pathname && !allowedForC1) {
    router.replace("/portal/eventos/turnos");
  }

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
        <div className="relative h-full">
          {/* Contenido desplazable */}
          <div className="p-6 h-full overflow-y-auto pb-20">
            <div className="flex flex-col justify-start items-center">
              <Link href="/" onClick={handleLinkClick}>
                <h1 className="text-2xl text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-1 w-full">
                  Galpón 3 Taller
                </h1>
              </Link>
              <div className="my-0 border-b border-gray-100 pb-4">
                {[
                  { href: "/portal/eventos", label: "Dashboard", icon: <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/ingresos", label: "Clientes", icon: <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/temas", label: "Móviles", icon: <FaCarAlt className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/presupuestos", label: "Presupuestos", icon: <FaFileInvoiceDollar className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/turnos", label: "Turnos", icon: <MdOutlineEvent className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1", "C1"] },
                  { href: "/portal/eventos/ingresosok", label: "Ingresos", icon: <FaCheckCircle className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/marcas", label: "Marcas/Modelos", icon: <FaCar className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/piezas", label: "Piezas", icon: <FaCogs className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                  { href: "/portal/eventos/realizados", label: "Trabajos realizados", icon: <FaWrench className="text-2xl text-gray-600 group-hover:text-white" />, roles: ["A1", "B1"] },
                ].filter((item) => !privilege || item.roles.includes(privilege)).map((item) => (
                  <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                    <div className="flex mb-1 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      {item.icon}
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                        {item.label}
                      </h3>
                    </div>
                  </Link>
                ))}
                {privilege === "A1" && (
                  <Link href="/portal/eventos/admin" onClick={handleLinkClick}>
                    <div className="flex mb-1 justify-start items-center gap-4 pl-5 hover:bg-red-700 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <FaUserShield className="text-2xl text-red-600 group-hover:text-white" />
                      <h3 className="text-base text-red-600 group-hover:text-white font-semibold">
                        Admin
                      </h3>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* Botón de logout fijo */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-200">
            <p className="text-left text-gray-800 font-bold mb-5 break-words">
              {[user?.nombre, user?.apellido].filter(Boolean).join(" ") || user?.email}
            </p>
            <button
              onClick={async () => {
                await logoutApi().catch(() => {});
                setUser(null);
                router.push("/auth/login");
              }}
              className="flex w-full justify-start items-center gap-4 pl-5 border border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
            >
              <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Logout
              </h3>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-screen bg-green-400 z-30 cursor-pointer ${
          isSidebarCollapsed ? "block" : "hidden"
        }`}
        onMouseEnter={handleMouseEnter}
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
      {/* Notification bell - fixed top right (hidden for C1 clients) */}
      {privilege !== "C1" && (
        <div className="fixed top-3 right-4 z-40">
          <NotificationBell />
        </div>
      )}
      <main className="flex-1 p-6 lg:ml-2 bg-white">{children}</main>
    </div>
  )}
  {user && (
    <footer className="bg-blue-500 text-white text-center py-2 w-full z-30 fixed bottom-0 left-0 text-sm sm:text-base">
      © 2025 - Galpón 3 - Todos los derechos reservados
    </footer>
  )}
  {!user && <>{children}</>}
</div>
  );
}
