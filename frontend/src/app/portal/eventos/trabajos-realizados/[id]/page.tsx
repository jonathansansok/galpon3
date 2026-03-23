//frontend\src\app\portal\eventos\trabajos-realizados\[id]\page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrabajoRealizado, deleteTrabajoRealizado } from "../TrabajosRealizados.api";

interface Props {
  params: { id: string };
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value || "—"}</dd>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-AR");
}

export default function TrabajoRealizadoDetailPage({ params }: Props) {
  const router = useRouter();
  const [trabajo, setTrabajo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrabajoRealizado(params.id)
      .then(setTrabajo)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este trabajo realizado?")) return;
    const result = await deleteTrabajoRealizado(params.id);
    if (result.success) router.push("/portal/eventos/trabajos-realizados");
    else alert("Error al eliminar: " + result.error);
  };

  if (loading) return <div className="p-6 text-gray-400">Cargando...</div>;
  if (!trabajo) return <div className="p-6 text-gray-400">No encontrado</div>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trabajo Realizado #{trabajo.id}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/portal/eventos/trabajos-realizados/${params.id}/edit`)}
            className="bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 text-sm transition"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm transition"
          >
            Eliminar
          </button>
        </div>
      </div>

      <dl className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <Field label="Turno ID" value={trabajo.turnoId} />
        <Field label="Fecha de realización" value={formatDate(trabajo.fechaRealiz)} />
        <Field label="Descripción" value={trabajo.descripcion} />
        <Field label="Monto" value={trabajo.monto ? `$${trabajo.monto}` : null} />
        <Field label="Observaciones" value={trabajo.observaciones} />
        <Field label="Creado" value={formatDate(trabajo.createdAt)} />
        <Field label="Actualizado" value={formatDate(trabajo.updatedAt)} />
      </dl>

      <button
        onClick={() => router.back()}
        className="mt-4 text-sm text-gray-500 hover:underline"
      >
        ← Volver
      </button>
    </div>
  );
}
