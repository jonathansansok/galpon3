"use client";
import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <FaShieldAlt className="text-blue-900 text-5xl mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Galpón 3 Taller</h1>
          <p className="text-gray-500 text-sm">Recuperar contraseña</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-4 rounded-lg mb-4 text-sm leading-relaxed">
          <p className="font-semibold mb-2">Para recuperar tu contraseña:</p>
          <p>
            Contactá al administrador del sistema para que te genere un link de
            recuperación. Una vez que lo recibas, podrás establecer una nueva
            contraseña.
          </p>
        </div>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
