import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-4xl font-bold mb-8">Página no encontrada o sin permisos de usuario</h1>
      <Link href="/" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
        Click aquí para Volver
      </Link>
    </div>
  );
}