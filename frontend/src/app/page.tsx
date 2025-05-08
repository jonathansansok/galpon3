"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useUserStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const { user, error, isLoading } = useUser(); // Usuario desde Auth0
  const privilege = useUserStore((state) => state.privilege);
  const comp = useUserStore((state) => state.comp); // Obtener comp desde Zustand
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/portal/eventos/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-900">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen flex-col w-full mt-0">
      {user ? (
        <>
          <div className="bg-white shadow-lg p-6 mb-6 w-full max-w-6xl flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image
                src="/images/car.jpg"
                alt="car"
                width={400}
                height={600}
                className="w-full h-auto object-cover rounded-lg shadow-md"
                priority
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">INTRODUCCIÓN</h1>
              <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                Texto a elección. Este es un ejemplo de cómo puedes estructurar el contenido
                para que sea claro y atractivo visualmente.
              </p>
              <button
                onClick={handleNavigate}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
              >
                Ir a Eventos
              </button>
            </div>
          </div>
          <div className="bg-gray-200 shadow-lg p-6 w-full max-w-6xl rounded-lg">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">IMPORTANTE</h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Texto a elección. Este sistema es una herramienta clave para la gestión de
              información y la toma de decisiones estratégicas.
            </p>
          </div>
          <div className="text-left w-full mt-6 text-green-600 font-semibold">
            <p>Rol del usuario: {privilege || "No definido"}</p>
            <p>Valor de comp: {comp || "No definido"}</p>
          </div>
        </>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}