"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabIngresos.tsx
import { useState, useEffect } from "react";
import { useRepairStore } from "@/lib/repairStore";
import { getTurnosWithPresupuestoData, updateTurno } from "../../turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import { Alert } from "@/components/ui/alert";
import Textarea from "@/components/ui/Textarea";
import { buttonVariants } from "@/components/ui/button";

function toDatetimeLocal(val: string | Date | null | undefined) {
  if (!val) return "";
  try {
    const d = new Date(val as string);
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
  } catch { return ""; }
}

function nowDatetimeLocal() {
  return toDatetimeLocal(new Date().toISOString());
}

const estadoColor: Record<string, string> = {
  Programado: "bg-blue-100 text-blue-800",
  "En curso": "bg-yellow-100 text-yellow-800",
  Finalizado: "bg-green-100 text-green-800",
  Cancelado: "bg-red-100 text-red-800",
};

const floatLabel = "absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white ml-2 peer-focus:ml-2 peer-focus:text-blue-600";
const floatInput = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";

export default function TabIngresos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formState, setFormState] = useState<Record<number, any>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const selectedPresupuesto = useRepairStore((s) => s.selectedPresupuesto);

  useEffect(() => {
    handleLoadData();
  }, [selectedPresupuesto]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const data = await getTurnosWithPresupuestoData();
      setTurnos(Array.isArray(data) ? data : []);
    } catch {
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (turno: Turno) => {
    if (expandedId === turno.id) { setExpandedId(null); return; }
    setExpandedId(turno.id);
    setFormState((prev) => ({
      ...prev,
      [turno.id]: {
        fechaHoraInicioReal: toDatetimeLocal((turno as any).fechaHoraInicioReal) || nowDatetimeLocal(),
        fechaHoraFinReal: toDatetimeLocal((turno as any).fechaHoraFinReal) || "",
        estado: turno.estado === "Programado" ? "En curso" : turno.estado,
        observaciones: turno.observaciones || "",
      },
    }));
  };

  const handleChange = (id: number, field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSubmit = async (turno: Turno) => {
    const form = formState[turno.id];
    if (!form) return;
    setSaving(turno.id);
    try {
      const payload: Record<string, any> = {
        estado: form.estado,
        observaciones: form.observaciones || null,
        fechaHoraInicioReal: form.fechaHoraInicioReal || null,
      };
      if (form.fechaHoraFinReal) payload.fechaHoraFinReal = form.fechaHoraFinReal;
      const result = await updateTurno(String(turno.id), payload);
      if (result.success) {
        await Alert.success({ title: "Ingreso registrado", text: "Turno actualizado correctamente", icon: "success" });
        setExpandedId(null);
        handleLoadData();
      } else {
        Alert.error({ title: "Error", text: result.error || "Error al actualizar", icon: "error" });
      }
    } catch {
      Alert.error({ title: "Error", text: "Error inesperado", icon: "error" });
    } finally {
      setSaving(null);
    }
  };

  const byPresupuesto = selectedPresupuesto
    ? turnos.filter((t) => t.presupuestoId === String((selectedPresupuesto as any).uuid ?? selectedPresupuesto.id))
    : turnos;

  const formatFecha = (fecha: string | null | undefined) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return fecha as string; }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Ingresos al Taller</h2>
        <p className="text-sm text-gray-500">Registrá el ingreso real de los vehículos y actualizá el estado de los turnos.</p>
      </div>

      {selectedPresupuesto && (
        <div className="text-sm text-indigo-700 bg-indigo-50 px-3 py-2 rounded-md border border-indigo-200">
          Filtrando por presupuesto: <strong>#{selectedPresupuesto.id}{selectedPresupuesto.monto ? ` — $${selectedPresupuesto.monto}` : ""}</strong>
          <span className="ml-2 text-indigo-500">({byPresupuesto.length} turno{byPresupuesto.length !== 1 ? "s" : ""})</span>
        </div>
      )}

      <div>
        <button onClick={handleLoadData} disabled={loading} className={buttonVariants({ variant: "outline" })}>
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </div>

      {byPresupuesto.length === 0 ? (
        <p className="text-gray-400 text-sm">{loading ? "Cargando..." : "No hay turnos para mostrar."}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {byPresupuesto.map((turno) => {
            const isExpanded = expandedId === turno.id;
            const form = formState[turno.id] || {};
            return (
              <div key={turno.id} className={`border rounded-lg overflow-hidden transition-all ${isExpanded ? "border-indigo-300" : "border-gray-200"}`}>
                {/* Cabecera */}
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none ${isExpanded ? "bg-indigo-50" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => handleExpand(turno)}
                >
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="font-semibold text-gray-700">Plaza {turno.plaza}</span>
                    <span className="text-gray-500">{turno.patente || "—"}</span>
                    <span className="text-gray-400">{formatFecha((turno as any).fechaHoraInicioEstimada)}</span>
                    {(turno as any).fechaHoraInicioReal && (
                      <span className="text-green-600 text-xs font-medium">✓ Ingresó: {formatFecha((turno as any).fechaHoraInicioReal)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[turno.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {turno.estado}
                    </span>
                    <span className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Formulario inline */}
                {isExpanded && (
                  <div className="px-4 py-4 bg-indigo-50 border-t border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-4 text-sm">Registrar Ingreso — Turno #{turno.id}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative mb-1">
                        <input
                          type="datetime-local"
                          id={`inicioReal-${turno.id}`}
                          value={form.fechaHoraInicioReal || ""}
                          onChange={(e) => handleChange(turno.id, "fechaHoraInicioReal", e.target.value)}
                          className={floatInput}
                        />
                        <label htmlFor={`inicioReal-${turno.id}`} className={floatLabel}>Fecha/Hora Real de Ingreso</label>
                      </div>
                      <div className="relative mb-1">
                        <input
                          type="datetime-local"
                          id={`finReal-${turno.id}`}
                          value={form.fechaHoraFinReal || ""}
                          onChange={(e) => handleChange(turno.id, "fechaHoraFinReal", e.target.value)}
                          className={floatInput}
                        />
                        <label htmlFor={`finReal-${turno.id}`} className={floatLabel}>Fecha/Hora Real de Egreso (opcional)</label>
                      </div>
                    </div>
                    <div className="relative mb-4">
                      <select
                        id={`estado-${turno.id}`}
                        value={form.estado || "En curso"}
                        onChange={(e) => handleChange(turno.id, "estado", e.target.value)}
                        className={floatInput}
                      >
                        <option value="En curso">En curso</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Programado">Programado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                      <label htmlFor={`estado-${turno.id}`} className={floatLabel}>Estado</label>
                    </div>
                    <Textarea
                      id={`obs-${turno.id}`}
                      value={form.observaciones || ""}
                      onChange={(val) => handleChange(turno.id, "observaciones", val)}
                      label="Comentarios del ingreso"
                      placeholder="Observaciones sobre el ingreso..."
                    />
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleSubmit(turno)}
                        disabled={saving === turno.id}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                      >
                        {saving === turno.id ? "Guardando..." : "Confirmar Ingreso"}
                      </button>
                      <button onClick={() => setExpandedId(null)} className={buttonVariants({ variant: "outline" })}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
