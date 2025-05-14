//frontend\src\components\layouts\AppContentLayoutComponent.tsx
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import Link from "next/link";
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineSettings,
  MdOutlineLogout,
  MdSearch,
  MdOutlineEvent,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import {
  FaMapMarkedAlt,
  FaCarAlt,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaCar,
  FaCogs,
  FaWrench,
} from "react-icons/fa";
import { IoGitNetworkSharp } from "react-icons/io5";
interface AppContentLayoutComponentProps {
  children?: React.ReactNode;
}
import { useUserStore } from "@/lib/store"; // Importa el estado global
export default function AppContentLayoutComponent(
  props: AppContentLayoutComponentProps
) {
  const privilege = useUserStore((state) => state.privilege); // Obtén el privilegio del usuario
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
        <div className="p-6 h-full overflow-y-auto max-h-screen">
          <div className="flex flex-col justify-start items-center">
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
                    Dashboard
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/ingresos" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Clientes
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/temas" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaCarAlt className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Móviles
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/presupuestos" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaFileInvoiceDollar className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Presupuestos
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/turnos" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineEvent className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Turnos
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/ingresosok" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaCheckCircle className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Ingresos
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/marcas" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaCar className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Marcas/Modelos
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/piezas" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaCogs className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Piezas
                  </h3>
                </div>
              </Link>
              <Link href="/portal/eventos/realizados" onClick={handleLinkClick}>
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaWrench className="text-2xl text-gray-600 group-hover:text-white" />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                    Trabajos realizados
                  </h3>
                </div>
              </Link>
              {privilege !== "B1" && (
                <Link href="/portal/eventos/analytics" onClick={handleLinkClick}>
                  <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <MdOutlineAnalytics className="text-2xl text-gray-600 group-hover:text-white" />
                    <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                      Gráficos
                    </h3>
                  </div>
                </Link>
              )}
            </div>
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
