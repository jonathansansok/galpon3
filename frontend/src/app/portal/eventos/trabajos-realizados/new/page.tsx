//frontend\src\app\portal\eventos\trabajos-realizados\new\page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrabajoRealizado } from "../TrabajosRealizados.api";

export default function NewTrabajoRealizadoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    turnoId: "",
    fechaRealiz: "",
    descripcion: "",
    monto: "",
    observaciones: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const result = await createTrabajoRealizado(form);
    setSaving(false);
    if (result.success) {
      router.push("/portal/eventos/trabajos-realizados");
    } else {
      setError(result.error || "Error al crear");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Trabajo Realizado</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Turno ID (UUID)</label>
          <input
            name="turnoId"
            value={form.turnoId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="UUID del turno asociado"
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
            placeholder="Ej: 15000"
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
            {saving ? "Guardando..." : "Guardar"}
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
