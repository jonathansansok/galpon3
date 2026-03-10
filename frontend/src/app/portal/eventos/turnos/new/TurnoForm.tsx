//frontend\src\app\portal\eventos\turnos\new\TurnoForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { createTurno, updateTurno, getPlazaAvailability, getTurno } from "../Turnos.api";
import { getPresupuestosWithMovilData } from "../../presupuestos/Presupuestos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";

interface FormValues {
  presupuestoId: string;
  plaza: string;
  fechaHoraInicioEstimada: string;
  fechaHoraFinEstimada: string;
  fechaHoraInicioReal: string;
  fechaHoraFinReal: string;
  estado: string;
  observaciones: string;
}

export function TurnoForm({ turno }: { turno: any }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [presupuestosAprobados, setPresupuestosAprobados] = useState<any[]>([]);
  const [plazaAvailability, setPlazaAvailability] = useState<Record<number, any[]> | null>(null);

  const toDatetimeLocal = (val: string | null | undefined) => {
    if (!val) return "";
    try {
      const d = new Date(val);
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - offset * 60000);
      return local.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      presupuestoId: turno?.presupuestoId || "",
      plaza: turno?.plaza?.toString() || "",
      fechaHoraInicioEstimada: toDatetimeLocal(turno?.fechaHoraInicioEstimada),
      fechaHoraFinEstimada: toDatetimeLocal(turno?.fechaHoraFinEstimada),
      fechaHoraInicioReal: toDatetimeLocal(turno?.fechaHoraInicioReal),
      fechaHoraFinReal: toDatetimeLocal(turno?.fechaHoraFinReal),
      estado: turno?.estado || "Programado",
      observaciones: turno?.observaciones || "",
    },
  });

  const watchInicio = watch("fechaHoraInicioEstimada");
  const watchFin = watch("fechaHoraFinEstimada");

  // Cargar turno existente en modo edición
  useEffect(() => {
    if (params?.id) {
      const loadTurno = async () => {
        try {
          console.log("[turnos] Cargando turno para editar:", params.id);
          const data = await getTurno(params.id);
          if (data) {
            setValue("presupuestoId", data.presupuestoId || "");
            setValue("plaza", data.plaza?.toString() || "");
            setValue("fechaHoraInicioEstimada", toDatetimeLocal(data.fechaHoraInicioEstimada));
            setValue("fechaHoraFinEstimada", toDatetimeLocal(data.fechaHoraFinEstimada));
            setValue("fechaHoraInicioReal", toDatetimeLocal(data.fechaHoraInicioReal));
            setValue("fechaHoraFinReal", toDatetimeLocal(data.fechaHoraFinReal));
            setValue("estado", data.estado || "Programado");
            setValue("observaciones", data.observaciones || "");
          }
        } catch (error) {
          console.error("[turnos] Error al cargar turno:", error);
        }
      };
      loadTurno();
    }
  }, [params?.id, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cargar presupuestos aprobados
  useEffect(() => {
    const loadPresupuestos = async () => {
      try {
        console.log("[turnos] Cargando presupuestos aprobados...");
        const data = await getPresupuestosWithMovilData();
        const aprobados = data.filter((p: any) => p.estado === "Aprobado");
        setPresupuestosAprobados(aprobados);
        console.log("[turnos] Presupuestos aprobados:", aprobados);
      } catch (error) {
        console.error("[turnos] Error al cargar presupuestos:", error);
      }
    };
    loadPresupuestos();
  }, []);

  // Consultar disponibilidad cuando cambian las fechas
  useEffect(() => {
    if (watchInicio && watchFin) {
      const checkAvailability = async () => {
        try {
          const data = await getPlazaAvailability(watchInicio, watchFin);
          setPlazaAvailability(data);
          console.log("[turnos] Disponibilidad actualizada:", data);
        } catch (error) {
          console.error("[turnos] Error al consultar disponibilidad:", error);
        }
      };
      checkAvailability();
    }
  }, [watchInicio, watchFin]);

  const isPlazaOccupied = (plazaNum: number): boolean => {
    if (!plazaAvailability) return false;
    const turnosEnPlaza = plazaAvailability[plazaNum] || [];
    // Si estamos editando, excluir el turno actual
    if (params?.id) {
      return turnosEnPlaza.some((t: any) => t.id !== parseInt(params.id));
    }
    return turnosEnPlaza.length > 0;
  };

  const onSubmit = async (data: FormValues) => {
    console.log("[turnos] Enviando formulario:", data);

    if (!data.plaza) {
      Alert.error({ title: "Error", text: "Debe seleccionar una plaza.", icon: "error" });
      return;
    }
    if (!data.fechaHoraInicioEstimada || !data.fechaHoraFinEstimada) {
      Alert.error({ title: "Error", text: "Debe completar las fechas estimadas.", icon: "error" });
      return;
    }
    if (new Date(data.fechaHoraFinEstimada) <= new Date(data.fechaHoraInicioEstimada)) {
      Alert.error({ title: "Error", text: "La fecha de fin debe ser posterior a la de inicio.", icon: "error" });
      return;
    }

    const payload: Record<string, any> = {
      presupuestoId: data.presupuestoId || null,
      plaza: parseInt(data.plaza),
      fechaHoraInicioEstimada: data.fechaHoraInicioEstimada,
      fechaHoraFinEstimada: data.fechaHoraFinEstimada,
      estado: data.estado,
      observaciones: data.observaciones || null,
    };
    if (data.fechaHoraInicioReal) {
      payload.fechaHoraInicioReal = data.fechaHoraInicioReal;
    }
    if (data.fechaHoraFinReal) {
      payload.fechaHoraFinReal = data.fechaHoraFinReal;
    }

    try {
      let result;
      if (params?.id) {
        result = await updateTurno(params.id, payload);
      } else {
        result = await createTurno(payload);
      }

      if (result.success) {
        await Alert.success({
          title: params?.id ? "Turno actualizado" : "Turno creado",
          text: result.message || "Operación exitosa",
          icon: "success",
        });
        router.push("/portal/eventos/turnos");
      } else {
        Alert.error({
          title: "Error",
          text: result.error || "Error al guardar el turno",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("[turnos] Error al enviar formulario:", error);
      Alert.error({
        title: "Error",
        text: "Error inesperado al guardar el turno",
        icon: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Presupuesto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Presupuesto Aprobado
        </label>
        <select
          {...register("presupuestoId")}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">— Sin presupuesto —</option>
          {presupuestosAprobados.map((p: any) => (
            <option key={p.uuid || p.id} value={p.uuid || ""}>
              {p.patente || "Sin patente"} - {p.marca || ""} {p.modelo || ""} - ${p.monto || "0"}
            </option>
          ))}
        </select>
      </div>

      {/* Fechas estimadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inicio Estimado *
          </label>
          <input
            type="datetime-local"
            {...register("fechaHoraInicioEstimada")}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fin Estimado *
          </label>
          <input
            type="datetime-local"
            {...register("fechaHoraFinEstimada")}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
      </div>

      {/* Plaza */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plaza * {plazaAvailability && <span className="text-xs text-gray-500">(disponibilidad actualizada)</span>}
        </label>
        <select
          {...register("plaza")}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="">— Seleccionar plaza —</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const occupied = isPlazaOccupied(num);
            return (
              <option key={num} value={num}>
                Plaza #{num} {occupied ? "(Ocupada)" : "(Disponible)"}
              </option>
            );
          })}
        </select>
      </div>

      {/* Fechas reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inicio Real (opcional)
          </label>
          <input
            type="datetime-local"
            {...register("fechaHoraInicioReal")}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fin Real (opcional)
          </label>
          <input
            type="datetime-local"
            {...register("fechaHoraFinReal")}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          {...register("estado")}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="Programado">Programado</option>
          <option value="En curso">En curso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          {...register("observaciones")}
          className="border rounded px-3 py-2 w-full"
          rows={3}
          placeholder="Observaciones adicionales..."
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">
          {params?.id ? "Actualizar Turno" : "Crear Turno"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/portal/eventos/turnos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
