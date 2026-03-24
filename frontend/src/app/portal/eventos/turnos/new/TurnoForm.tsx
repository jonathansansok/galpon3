//frontend\src\app\portal\eventos\turnos\new\TurnoForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { createTurno, updateTurno, getPlazaAvailability, getTurno, getReparadores, Reparador } from "../Turnos.api";
import { getPresupuestosWithMovilData, updatePresupuestoEstado } from "../../presupuestos/Presupuestos.api";
import { getPlazas, Plaza } from "../../plazas-config/Plazas.api";
import { getHorario, HorarioDia } from "../../plazas-config/Horario.api";
import { getFeriados, Feriado } from "../../admin/Feriados.api";
import { calcularFinLaborable, FeriadoConfig } from "@/utils/businessHours";
import { getPresupuestosAsociados } from "../../temas/Temas.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { ShowTurnos } from "@/app/utils/alertUtils";
import TurnoDatePicker from "@/components/ui/TurnoDatePicker";
import { useState, useEffect, useRef } from "react";

interface FormValues {
  presupuestoId: string;
  plaza: string;
  fechaHoraInicioEstimada: string;
  fechaHoraFinEstimada: string;
  fechaHoraInicioReal: string;
  fechaHoraFinReal: string;
  estado: string;
  observaciones: string;
  reparadorIds: string; // JSON array serializado
}

export function TurnoForm({ turno, onSuccess, editId, preselectedPresupuesto, movilId }: { turno: any; onSuccess?: () => void; editId?: number; preselectedPresupuesto?: any; movilId?: number }) {
  const params = useParams<{ id: string }>();
  const effectiveId = editId ? String(editId) : params?.id;
  const router = useRouter();
  const [presupuestosAprobados, setPresupuestosAprobados] = useState<any[]>([]);
  const [plazaAvailability, setPlazaAvailability] = useState<Record<number, any[]> | null>(null);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [reparadores, setReparadores] = useState<Reparador[]>([]);
  const [presupuestoDropdownOpen, setPresupuestoDropdownOpen] = useState(false);
  const presupuestoDropdownRef = useRef<HTMLDivElement>(null);
  const [horarioConfig, setHorarioConfig] = useState<HorarioDia[]>([]);
  const [feriadosConfig, setFeriadosConfig] = useState<FeriadoConfig[]>([]);
  const [duracionHoras, setDuracionHoras] = useState("");

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

  const preselectedId = preselectedPresupuesto
    ? preselectedPresupuesto.uuid || String(preselectedPresupuesto.id)
    : undefined;

  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      presupuestoId: turno?.presupuestoId || preselectedId || "",
      plaza: turno?.plaza?.toString() || "",
      fechaHoraInicioEstimada: toDatetimeLocal(turno?.fechaHoraInicioEstimada),
      fechaHoraFinEstimada: toDatetimeLocal(turno?.fechaHoraFinEstimada),
      fechaHoraInicioReal: toDatetimeLocal(turno?.fechaHoraInicioReal),
      fechaHoraFinReal: toDatetimeLocal(turno?.fechaHoraFinReal),
      estado: turno?.estado || "Programado",
      observaciones: turno?.observaciones || "",
      reparadorIds: turno?.reparadorIds
        ? JSON.stringify(String(turno.reparadorIds).split(",").map(Number).filter(Boolean))
        : "[]",
    },
  });

  const watchInicio = watch("fechaHoraInicioEstimada");
  const watchPresupuestoId = watch("presupuestoId");

  const presupuestoEstadoStyle: Record<string, { bg: string; text: string }> = {
    Pendiente:     { bg: "bg-yellow-50",  text: "text-yellow-800" },
    Creado:        { bg: "bg-gray-50",    text: "text-gray-700" },
    "En revisión": { bg: "bg-blue-50",    text: "text-blue-800" },
    Aprobado:      { bg: "bg-green-50",   text: "text-green-800" },
    "En curso":    { bg: "bg-violet-50",  text: "text-violet-700 italic" },
    Finalizado:    { bg: "bg-gray-100",   text: "text-gray-400 italic" },
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (presupuestoDropdownRef.current && !presupuestoDropdownRef.current.contains(e.target as Node)) {
        setPresupuestoDropdownOpen(false);
      }
    };
    if (presupuestoDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [presupuestoDropdownOpen]);
  const watchFin = watch("fechaHoraFinEstimada");

  // Cargar turno existente en modo edición
  useEffect(() => {
    if (effectiveId && !turno) {
      const loadTurno = async () => {
        try {
          console.log("[turnos] Cargando turno para editar:", effectiveId);
          const data = await getTurno(effectiveId);
          if (data) {
            setValue("presupuestoId", data.presupuestoId || "");
            setValue("plaza", data.plaza?.toString() || "");
            setValue("fechaHoraInicioEstimada", toDatetimeLocal(data.fechaHoraInicioEstimada));
            setValue("fechaHoraFinEstimada", toDatetimeLocal(data.fechaHoraFinEstimada));
            setValue("fechaHoraInicioReal", toDatetimeLocal(data.fechaHoraInicioReal));
            setValue("fechaHoraFinReal", toDatetimeLocal(data.fechaHoraFinReal));
            setValue("estado", data.estado || "Programado");
            setValue("observaciones", data.observaciones || "");
            setValue("reparadorIds", data.reparadorIds
              ? JSON.stringify(String(data.reparadorIds).split(",").map(Number).filter(Boolean))
              : "[]");
          }
        } catch (error) {
          console.error("[turnos] Error al cargar turno:", error);
        }
      };
      loadTurno();
    }
  }, [effectiveId, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cargar presupuestos del móvil seleccionado (o todos si no hay móvil)
  useEffect(() => {
    const loadPresupuestos = async () => {
      try {
        console.log("[turnos] Cargando presupuestos, movilId:", movilId);
        const data = movilId
          ? await getPresupuestosAsociados(String(movilId))
          : await getPresupuestosWithMovilData();
        // Sin filtro por estado: mostrar todos los del móvil con colores
        const aprobados = [...data];
        // Si hay un preseleccionado no aprobado, incluirlo al principio
        if (preselectedPresupuesto && preselectedPresupuesto.estado !== "Aprobado") {
          const yaIncluido = aprobados.some((p: any) =>
            p.id === preselectedPresupuesto.id || (p.uuid && p.uuid === preselectedPresupuesto.uuid)
          );
          if (!yaIncluido) {
            aprobados.unshift({ ...preselectedPresupuesto, _pendienteAprobacion: true });
          }
        }
        setPresupuestosAprobados(aprobados);
        // Aplicar preselección luego de que las opciones existan en el DOM
        if (preselectedId && !effectiveId) {
          setValue("presupuestoId", preselectedId);
        }
        console.log("[turnos] Presupuestos aprobados:", aprobados);
      } catch (error) {
        console.error("[turnos] Error al cargar presupuestos:", error);
      }
    };
    loadPresupuestos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getPlazas().then((data) => setPlazas(data.filter((p) => p.activa))).catch(() => {});
    getReparadores().then(setReparadores).catch(() => {});
    getHorario().then(setHorarioConfig).catch(() => {});
    getFeriados().then((data) => setFeriadosConfig(data.map((f) => ({ fecha: f.fecha, esAnual: f.esAnual, nombre: f.nombre })))).catch(() => {});
  }, []);

  const handleDuracionChange = (value: string) => {
    setDuracionHoras(value);
    if (!value || !watchInicio || horarioConfig.length !== 7) return;
    const horas = parseFloat(value);
    if (isNaN(horas) || horas <= 0) return;
    const inicio = new Date(watchInicio);
    if (isNaN(inicio.getTime())) return;
    const fin = calcularFinLaborable(inicio, horas, horarioConfig, feriadosConfig);
    setValue("fechaHoraFinEstimada", toDatetimeLocal(fin.toISOString()));
  };

  useEffect(() => {
    if (duracionHoras && watchInicio && horarioConfig.length === 7) {
      handleDuracionChange(duracionHoras);
    }
  }, [watchInicio]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-rellenar duración desde preciosCyP del presupuesto seleccionado
  useEffect(() => {
    if (!watchPresupuestoId || effectiveId) return; // no tocar en modo edición
    const sel = presupuestosAprobados.find(
      (p: any) => (p.uuid || String(p.id)) === watchPresupuestoId
    );
    if (!sel?.preciosCyP) return;
    try {
      const cyp = JSON.parse(sel.preciosCyP);
      const total = (cyp?.chapa?.horas ?? 0) + (cyp?.pintura?.horas ?? 0);
      if (total > 0 && !duracionHoras) {
        handleDuracionChange(String(total));
      }
    } catch { /* preciosCyP malformado — ignorar */ }
  }, [watchPresupuestoId, presupuestosAprobados]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (effectiveId) {
      return turnosEnPlaza.some((t: any) => t.id !== parseInt(effectiveId!));
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
      reparadorIds: (() => { try { return JSON.parse(data.reparadorIds || "[]"); } catch { return []; } })(),
    };
    if (data.fechaHoraInicioReal) {
      payload.fechaHoraInicioReal = data.fechaHoraInicioReal;
    }
    if (data.fechaHoraFinReal) {
      payload.fechaHoraFinReal = data.fechaHoraFinReal;
    }

    try {
      let result;
      if (effectiveId) {
        result = await updateTurno(effectiveId!, payload);
      } else {
        result = await createTurno(payload);
      }

      if (result.success) {
        // Si el presupuesto preseleccionado no estaba aprobado, promoverlo ahora
        if (!effectiveId && preselectedPresupuesto && preselectedPresupuesto.estado !== "Aprobado") {
          try {
            await updatePresupuestoEstado(String(preselectedPresupuesto.id), "Aprobado");
            console.log("[turnos] Presupuesto promovido a Aprobado:", preselectedPresupuesto.id);
          } catch (err) {
            console.warn("[turnos] No se pudo actualizar estado del presupuesto:", err);
          }
        }
        const selectedPresupuesto = presupuestosAprobados.find(
          (p: any) => String(p.id) === String(data.presupuestoId) || p.uuid === data.presupuestoId
        ) ?? preselectedPresupuesto ?? null;
        const plazaObj = plazas.find((p) => p.numero === parseInt(data.plaza));
        const plazaNombre = plazaObj ? plazaObj.nombre : `Plaza ${data.plaza}`;
        const reparadorIds: number[] = (() => { try { return JSON.parse(data.reparadorIds || "[]"); } catch { return []; } })();
        const reparadoresTexto = reparadorIds
          .map((id) => {
            const r = reparadores.find((rep) => rep.id === id);
            return r ? `${r.nombre} ${r.apellido}` : String(id);
          })
          .join(", ");
        const clienteTelefono: string =
          selectedPresupuesto?.clienteTelefono ??
          preselectedPresupuesto?.clienteTelefono ??
          "";
        await ShowTurnos(
          true,
          effectiveId ? "Turno actualizado" : "Turno creado",
          { ...payload, ...result.data },
          selectedPresupuesto,
          plazaNombre,
          reparadoresTexto,
          clienteTelefono
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/portal/eventos/turnos");
        }
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

  const floatLabel = "absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white ml-2 peer-focus:ml-2 peer-focus:text-blue-600";
  const floatInput = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">

      {/* Presupuesto — dropdown personalizado con colores por estado */}
      <div className="relative mb-4" ref={presupuestoDropdownRef}>
        <div
          className={`${floatInput} cursor-pointer flex items-center justify-between min-h-[46px]`}
          onClick={() => setPresupuestoDropdownOpen(!presupuestoDropdownOpen)}
        >
          {(() => {
            const sel = presupuestosAprobados.find((p: any) => (p.uuid || String(p.id)) === watchPresupuestoId);
            if (!sel) return <span className="text-gray-400 text-sm">— Sin presupuesto —</span>;
            const st = presupuestoEstadoStyle[sel.estado] || {};
            return <span className={`text-sm ${st.text || "text-gray-900"}`}>{sel.patente || "Sin patente"} — {sel.marca || ""} {sel.modelo || ""} — ${sel.monto || "0"} [{sel.estado}]</span>;
          })()}
          <span className="text-gray-400 ml-2 shrink-0">▾</span>
        </div>
        <label className={floatLabel} style={{ pointerEvents: "none" }}>Presupuesto Aprobado</label>

        {presupuestoDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            <div
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-400 border-b border-gray-100"
              onClick={() => { setValue("presupuestoId", ""); setPresupuestoDropdownOpen(false); }}
            >
              — Sin presupuesto —
            </div>
            {presupuestosAprobados.map((p: any) => {
              const val = p.uuid || String(p.id);
              const st = presupuestoEstadoStyle[p.estado] || { bg: "bg-white", text: "text-gray-900" };
              const isSelected = watchPresupuestoId === val;
              return (
                <div
                  key={val}
                  className={`px-3 py-2 cursor-pointer text-sm ${st.bg} ${st.text} hover:opacity-75 ${isSelected ? "ring-2 ring-inset ring-blue-400" : ""}`}
                  onClick={() => { setValue("presupuestoId", val); setPresupuestoDropdownOpen(false); }}
                >
                  {p.patente || "Sin patente"} — {p.marca || ""} {p.modelo || ""} — ${p.monto || "0"}
                  {p._pendienteAprobacion
                    ? <span className="ml-1 text-xs opacity-70">({p.estado} → se aprobará al crear)</span>
                    : <span className="ml-1 text-xs opacity-60">[{p.estado}]</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fechas estimadas */}
      <TurnoDatePicker
        value={watchInicio ?? ""}
        onChange={(iso) => setValue("fechaHoraInicioEstimada", toDatetimeLocal(iso))}
        horario={horarioConfig}
        feriados={feriadosConfig}
        label="Inicio Estimado"
        required
      />

      <div className="relative mb-4">
        <input
          type="number"
          id="duracionHoras"
          min="0.5"
          step="0.5"
          value={duracionHoras}
          onChange={(e) => handleDuracionChange(e.target.value)}
          className={floatInput}
          placeholder=" "
        />
        <label htmlFor="duracionHoras" className={floatLabel}>Duración estimada (hs laborables) — opcional</label>
      </div>

      <TurnoDatePicker
        value={watch("fechaHoraFinEstimada") ?? ""}
        onChange={(iso) => setValue("fechaHoraFinEstimada", toDatetimeLocal(iso))}
        horario={horarioConfig}
        feriados={feriadosConfig}
        label="Fin Estimado"
        required
        minDate={watchInicio ? new Date(watchInicio) : undefined}
      />

      {/* Plaza */}
      <div className="relative mb-4">
        <select id="plaza" {...register("plaza")} className={floatInput} required>
          <option value="">— Seleccionar plaza —</option>
          {plazas.map((p) => {
            const occupied = isPlazaOccupied(p.numero);
            return (
              <option key={p.numero} value={p.numero}>
                {p.nombre} {occupied ? "(Ocupada)" : "(Disponible)"}
              </option>
            );
          })}
        </select>
        <label htmlFor="plaza" className={floatLabel}>
          Plaza * {plazaAvailability && <span className="text-xs text-gray-400">(disponibilidad actualizada)</span>}
        </label>
      </div>

      {/* Fechas reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative mb-4">
          <input type="datetime-local" id="fechaHoraInicioReal" {...register("fechaHoraInicioReal")} className={floatInput} />
          <label htmlFor="fechaHoraInicioReal" className={floatLabel}>Inicio Real (opcional)</label>
        </div>
        <div className="relative mb-4">
          <input type="datetime-local" id="fechaHoraFinReal" {...register("fechaHoraFinReal")} className={floatInput} />
          <label htmlFor="fechaHoraFinReal" className={floatLabel}>Fin Real (opcional)</label>
        </div>
      </div>

      {/* Estado */}
      <div className="relative mb-4">
        <select id="estado" {...register("estado")} className={floatInput}>
          <option value="Programado">Programado</option>
          <option value="En curso">En curso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <label htmlFor="estado" className={floatLabel}>Estado</label>
      </div>

      {/* Reparadores — multi-select con checkboxes */}
      {reparadores.length > 0 && (() => {
        const selected: number[] = (() => { try { return JSON.parse(watch("reparadorIds") || "[]"); } catch { return []; } })();
        const toggle = (id: number) => {
          const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
          setValue("reparadorIds", JSON.stringify(next));
        };
        return (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Reparadores asignados{selected.length > 0 && <span className="ml-1 text-blue-600 font-medium">({selected.length})</span>}
            </p>
            <div className="border border-gray-300 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
              {reparadores.map((r) => {
                const checked = selected.includes(r.id);
                return (
                  <label key={r.id} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${checked ? "bg-blue-50" : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(r.id)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm text-gray-800 flex-1">
                      {[r.apellido, r.nombre].filter(Boolean).join(", ")}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${r.privilege === "A1" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {r.privilege === "A1" ? "Admin" : "Operador"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Observaciones */}
      <Textarea
        id="observaciones"
        value={watch("observaciones")}
        onChange={(val) => setValue("observaciones", val)}
        label="Observaciones"
        placeholder="Observaciones adicionales..."
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {effectiveId ? "Actualizar Turno" : "Crear Turno"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/portal/eventos/turnos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
