//frontend\src\app\page.tsx
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useUserStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";
import { FaShieldAlt } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Image from "next/image";
import { Auth0User } from "@/lib/types";
import { getUserByEmail } from "@/lib/api/users";

export default function HomePage() {
  const setComp = useUserStore((state) => state.setComp); // Agregar setComp
  const { user, error, isLoading } = useUser(); // Usuario desde Auth0
  const setUser = useUserStore((state) => state.setUser);
  const setPrivilege = useUserStore((state) => state.setPrivilege);
  const privilege = useUserStore((state) => state.privilege);
  const comp = useUserStore((state) => state.comp); // Obtener comp desde Zustand
  const router = useRouter();
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Cargar Google Maps API
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
          await loadGoogleMaps(apiKey);
          setGoogleLoaded(true);
        } else {
          console.error("Google Maps API key is missing");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    fetchApiKey();
  }, []);

  // Manejar usuario y privilegios
  useEffect(() => {
    if (user) {
      console.log("Usuario obtenido desde Auth0:", user);

      // Guardar usuario en el estado global
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user as Auth0User);

      // Validar usuario en la base de datos
      if (user.email) {
        console.log("Consultando datos del usuario en el backend...");
        getUserByEmail(user.email)
          .then((data) => {
            if (data) {
              console.log("Datos del usuario obtenidos del backend:", data);
              setPrivilege(data.privilege || null); // Establecer privilegio
              setComp(data.comp || null); // Establecer comp
              console.log("Valor de comp establecido en Zustand:", data.comp);
            } else {
              console.log("Usuario encontrado pero sin datos válidos.");
              setPrivilege(null);
              setComp(null);
            }
          })
          .catch((error) => {
            console.error(
              "Error al obtener datos del usuario desde el backend:",
              error.message
            );
            setPrivilege(null);
            setComp(null);
          });
      }
    } else {
      console.log(
        "Usuario no autenticado. Verificando almacenamiento local..."
      );
      // Recuperar usuario almacenado localmente
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        console.log(
          "Usuario recuperado del almacenamiento local:",
          JSON.parse(storedUser)
        );
        setUser(JSON.parse(storedUser) as Auth0User);
      }
    }
  }, [user, setUser, setPrivilege, setComp]);

  // Mostrar spinner mientras se cargan datos
  if (isLoading || !googleLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-900">
        <div className="flex flex-col items-center">
          <ImSpinner2 className="animate-spin text-white text-7xl mb-4" />
          <FaShieldAlt className="text-white text-12xl" />
        </div>
      </div>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  console.log("Valor actual de comp desde Zustand:", comp);

  return (
    <div className="flex justify-center items-center min-h-screen flex-col w-full mt-0">
      {user ? (
        <>
          <div className="bg-white shadow-lg p-4 mb-4 w-full max-w-6xl flex flex-col md:flex-row">
            <div className="md:w-1/4 mb-3 md:mb-0">
              <Image
                src="/images/torreon.png"
                alt="Torreon"
                width={262}
                height={112}
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-3/4 md:pl-0">
              <h1 className="text-3xl font-bold mb-3">INTRODUCCIÓN</h1>
              <p className="text-base mb-3 text-justify">
                El Servicio Penitenciario Federal, en su compromiso con la
                seguridad pública y la gestión penitenciaria, ha desarrollado un
                sistema integral para la recopilación, análisis y visualización
                de información relevante sobre los hechos que ocurren en el
                ámbito penitenciario a nivel nacional. Este sistema busca
                fortalecer la capacidad de respuesta y la toma de decisiones
                estratégicas en tiempo real.
              </p>
              <p className="text-base mb-3 text-justify">
                Entre sus principales funcionalidades, el sistema permite la
                creación, visualización, actualización y eliminación de eventos
                relevantes, así como la generación de gráficos históricos para
                el análisis de tendencias. Además, cuenta con herramientas
                avanzadas como mapas de calor, análisis de redes de internos y
                la posibilidad de descargar todo tipo de archivos relacionados
                con los eventos registrados.
              </p>
              <div className="text-base mb-3 text-justify">
                Este proyecto también incluye un sistema de mensajería
                automática para notificaciones importantes, junto con un logueo
                y autenticación de alta seguridad que garantiza la protección de
                los datos. Estas características están diseñadas para optimizar
                la gestión de la información penitenciaria, promoviendo la
                transparencia, la eficiencia y la seguridad en todos los niveles
                del sistema.
              </div>
            </div>
          </div>
          <div className="bg-gray-200 shadow-lg p-4 w-full max-w-6xl">
            <h1 className="text-3xl font-bold mb-3">IMPORTANTE</h1>
            <p className="text-base mb-3 text-justify">
              Este sistema es una herramienta clave para el Servicio
              Penitenciario Federal, ya que permite centralizar y analizar la
              información de manera eficiente. Su implementación busca reducir
              la reincidencia, fomentar el desistimiento del delito y contribuir
              a la seguridad pública mediante el desarrollo de programas basados
              en datos confiables y actualizados.
            </p>
            <p className="text-base text-justify">
              Además, el sistema ofrece funcionalidades avanzadas como la
              generación de estadísticas detalladas, gráficos históricos, mapas
              de calor y análisis de redes de internos. Estas herramientas
              permiten identificar patrones, evaluar riesgos y tomar decisiones
              informadas que impacten positivamente en la gestión penitenciaria.
              La posibilidad de descargar archivos y el sistema de autenticación
              de alta seguridad refuerzan su utilidad y confiabilidad.
            </p>
          </div>
          <div className="text-left w-full mt-3 text-green-600 font-semibold">
            <p>Rol del usuario: {privilege || "No definido"}</p>
            <p>Valor de comp: {comp || "No definido"}</p>
          </div>
        </>
      ) : (
        <Link href="/api/auth/login" style={{ marginTop: "20px" }}></Link>
      )}
    </div>
  );
}
