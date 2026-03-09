"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { useUserStore } from "@/lib/store";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setPrivilege = useUserStore((state) => state.setPrivilege);
  const setComp = useUserStore((state) => state.setComp);

  console.log('[LoginPage] Rendered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('[LoginPage] handleSubmit called, email:', email);

    try {
      const data = await login(email, password);
      console.log('[LoginPage] login success:', data);
      setUser(data.user);
      setPrivilege(data.user.privilege || null);
      setComp(data.user.comp || null);
      toast.success("Sesión iniciada correctamente");
      router.push("/");
    } catch (err: any) {
      console.log('[LoginPage] login error:', err.message);
      toast.error(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <FaShieldAlt className="text-blue-900 text-5xl mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Galpón 3 Taller</h1>
          <p className="text-gray-500 text-sm">Iniciar sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm space-y-2">
          <div>
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Crear cuenta
            </Link>
          </div>
          <div>
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
