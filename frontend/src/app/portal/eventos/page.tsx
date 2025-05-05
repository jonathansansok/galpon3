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
          href="/portal/eventos/manifestaciones"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Alteración al orden &quot;habitacional&quot;
        </Link>
        <Link
          href="/portal/eventos/manifestaciones2"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Alteración al orden en &quot;Sector común&quot;
        </Link>
        <Link
          href="/portal/eventos/atentados"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Atentados a la seguridad
        </Link>

        <Link
          href="/portal/eventos/habeas"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Reclamos PPL &quot;Habeas Corpus&quot;
        </Link>
        <Link
          href="/portal/eventos/huelgas"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Reclamos PPL &quot;Huelga de hambre&quot;
        </Link>
        <Link
          href="/portal/eventos/agresiones"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Agresiones al personal penitenciario
        </Link>
        <Link
          href="/portal/eventos/egresos"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Egresos extramuros
        </Link>
        <Link
          href="/portal/eventos/extramuros"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Hospitales extramuros
        </Link>
        <Link
          href="/portal/eventos/elementos"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Secuestros de elementos
        </Link>
        <Link
          href="/portal/eventos/procedimientos"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Procedimientos de registros
        </Link>
        <Link
          href="/portal/eventos/prevenciones"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Formulación de prevenciones
        </Link>
        <Link
          href="/portal/eventos/sumarios"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Sumarios - Info. sumarias
        </Link>
        <Link
          href="/portal/eventos/impactos"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Impacto sanitario
        </Link>
        <Link
          href="/portal/eventos/traslados"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Traslados
        </Link>

        <Link
          href="/portal/eventos/temas"
          className="bg-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
        >
          Tema informativo
        </Link>

        {/* Enlaces visibles solo para usuarios que no son B1 */}
        {privilege !== "B1" && (
          <>
            <Link
              href="/portal/eventos/preingresos"
              className="bg-blue-500 text-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
            >
              Informes de Preingreso
            </Link>
            <Link
              href="/portal/eventos/reqpositivos"
              className="bg-blue-500 text-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
            >
              &quot;Resp. de req.: Positivo&quot;
            </Link>
            <Link
              href="/portal/eventos/reqnos"
              className="bg-blue-500 text-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
            >
              &quot;Resp. de req.: Negativa&quot;
            </Link>
            <Link
              href="/portal/eventos/riesgos"
              className="bg-blue-500 text-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
            >
              Eval. S.I.G.P.P.L.A.R.
            </Link>
            <Link
              href="/portal/eventos/reqexts"
              className="bg-green-500 text-white shadow-md rounded-lg p-4 text-center font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center transform hover:scale-105 active:animate-shake"
            >
              &quot;Resp. de req. externo&quot;
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
