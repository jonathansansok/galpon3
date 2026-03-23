//frontend\src\app\portal\eventos\trabajos-realizados\[id]\edit\page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrabajoRealizado, updateTrabajoRealizado } from "../../TrabajosRealizados.api";

interface Props {
  params: { id: string };
}

export default function EditTrabajoRealizadoPage({ params }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    turnoId: "",
    fechaRealiz: "",
    descripcion: "",
    monto: "",
    observaciones: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrabajoRealizado(params.id)
      .then((data) => {
        setForm({
          turnoId: data.turnoId || "",
          fechaRealiz: data.fechaRealiz
            ? new Date(data.fechaRealiz).toISOString().slice(0, 16)
            : "",
          descripcion: data.descripcion || "",
          monto: data.monto || "",
          observaciones: data.observaciones || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const result = await updateTrabajoRealizado(params.id, form);
    setSaving(false);
    if (result.success) {
      router.push(`/portal/eventos/trabajos-realizados/${params.id}`);
    } else {
      setError(result.error || "Error al guardar");
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Cargando...</div>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Trabajo Realizado</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Turno ID (UUID)</label>
          <input
            name="turnoId"
            value={form.turnoId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de realización</label>
          <input
            type="datetime-local"
            name="fechaRealiz"
            value={form.fechaRealiz}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
          <input
            name="monto"
            value={form.monto}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
