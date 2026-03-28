"use client";
import { useState } from "react";
import Link from "next/link";
import { register, getAdmins, AdminUser } from "@/lib/api/auth";
import { FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

function buildWhatsAppUrl(admin: AdminUser): string {
  const phone = admin.telefono?.replace(/\D/g, "") ?? "";
  const adminName = [admin.nombre, admin.apellido].filter(Boolean).join(" ") || "Administrador";
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const message = `Hola ${adminName}! Me acabo de registrar en Galpón 3 Taller y me gustaría que me apruebes el acceso. Podés hacerlo desde: ${appUrl}/portal/eventos/admin`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  const selectedAdmin = admins.find((a) => a.id === selectedAdminId) ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD_REGEX.test(password)) {
      toast.error("La contraseña debe tener al menos 6 caracteres, una mayúscula y un número");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, nombre, apellido, telefono);
      setSubmitted(true);
      setLoadingAdmins(true);
      getAdmins()
        .then(setAdmins)
        .catch(() => setAdmins([]))
        .finally(() => setLoadingAdmins(false));
    } catch (err: any) {
      toast.error(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-900 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
            <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Solicitud enviada</h2>
            <p className="text-gray-500 text-sm">
              Tu solicitud fue enviada. Un administrador revisará tu cuenta y te habilitará el acceso.
            </p>
          </div>

          <div className="border-t pt-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              ¿Querés que te aprueben más rápido? Avisale a un administrador por WhatsApp:
            </p>
            {loadingAdmins ? (
              <p className="text-sm text-gray-400 text-center py-2">Cargando administradores...</p>
            ) : admins.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">No hay administradores disponibles.</p>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedAdminId ?? ""}
                  onChange={(e) => setSelectedAdminId(Number(e.target.value) || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccioná un administrador</option>
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>
                      {[a.nombre, a.apellido].filter(Boolean).join(" ") || "Administrador"}
                    </option>
                  ))}
                </select>
                {selectedAdmin && (
                  selectedAdmin.telefono ? (
                    <a
                      href={buildWhatsAppUrl(selectedAdmin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition"
                    >
                      <FaWhatsapp className="text-xl" />
                      Contactar a {[selectedAdmin.nombre, selectedAdmin.apellido].filter(Boolean).join(" ")}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">
                      Este administrador no tiene teléfono cargado.
                    </p>
                  )
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-5">
            <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <FaShieldAlt className="text-blue-900 text-5xl mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Galpon 3 Taller</h1>
          <p className="text-gray-500 text-sm">Solicitar cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 11-1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Mínimo 6, una mayúscula, un número"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Repetí la contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Enviando solicitud..." : "Enviar solicitud"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
