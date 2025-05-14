//frontend\src\app\portal\eventos\page.tsx
"use client";

import Link from "next/link";
import { useUserStore } from "@/lib/store"; // Importa el estado global
import { useEffect, useState } from "react";
import { getCsrfToken } from "./Eventos.api"; // Importa la función para obtener el token CSRF

export default function EventosPage() {
  const privilege = useUserStore((state) => state.privilege); // Obtén el privilegio del usuario
  const [csrfLoaded, setCsrfLoaded] = useState(false); // Flag para evitar solicitudes duplicadas

  useEffect(() => {
    // Verificar si ya se cargó el token CSRF en esta sesión
    if (!csrfLoaded && !window.__csrfLoaded) {
      console.log("[CSRF] Ejecutando useEffect para obtener el token CSRF...");
      window.__csrfLoaded = true; // Marcar como cargado globalmente

      const fetchCsrf = async () => {
        try {
          await getCsrfToken(); // Solicita el token CSRF
          setCsrfLoaded(true); // Marcar como cargado localmente
        } catch (error) {
          console.error("Error al obtener el token CSRF:", error);
        }
      };

      fetchCsrf();
    }
  }, [csrfLoaded]); // El array asegura que esto se ejecute solo una vez

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-8">Ingresar a:</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl justify-center">
        <Link
          href="/portal/eventos/ingresos"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Clientes
        </Link>

        <Link
          href="/portal/eventos/temas"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Móviles
        </Link>
        <Link
          href="/portal/eventos/prepuestos"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Prepuestos
        </Link>
        <Link
          href="/portal/eventos/marcas"
          className="bg-blue-500 shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Marcas de autos
        </Link>


        <Link
          href="/portal/eventos/piezas"
          className="bg-blue-500 shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Piezas
        </Link>



        <Link
          href="/portal/eventos/turnos"
          className="bg-blue-500 shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Turnos
        </Link>


        <Link
          href="/portal/eventos/ingresosok"
          className="bg-blue-500 shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Ingresos
        </Link>

        <Link
          href="/portal/eventos/realizados"
          className="bg-blue-500 shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Trabajos realizados
        </Link>


        {/* Enlaces visibles solo para usuarios que no son B1 */}
        {privilege !== "B1" && (
          <>
            <Link
              href="/portal/eventos/preingresos"
              className="bg-blue-500 text-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
            >
              Gráficos
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
