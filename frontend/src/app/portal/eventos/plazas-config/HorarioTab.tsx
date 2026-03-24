"use client";
// frontend/src/app/portal/eventos/plazas-config/HorarioTab.tsx
import { useState, useEffect } from "react";
import { getHorario, updateHorarioCompleto, HorarioDia } from "./Horario.api";
import { getFeriados } from "../admin/Feriados.api";
import { getTurnosWithPresupuestoData, updateTurno } from "../turnos/Turnos.api";
import { detectarAfectadosPorHorario, fmtTurnoFecha, TurnoReprogramado } from "@/utils/reprogramarTurnos";
import { HorarioDiaConfig, FeriadoConfig } from "@/utils/businessHours";
import Swal from "sweetalert2";

const DIA_NOMBRES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DIAS_EDITABLES = [1, 2, 3, 4, 5, 6]; // Lun–Sáb

const timeCls = "border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[7.5rem] disabled:bg-gray-100 disabled:text-gray-400";
const toggleCls = (active: boolean) =>
  `relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors ${active ? "bg-blue-600" : "bg-gray-300"}`;

export default function HorarioTab() {
  const [dias, setDias] = useState<HorarioDia[]>([]);
  const [diasOriginal, setDiasOriginal] = useState<HorarioDia[]>([]); // snapshot para detectar cambios
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    getHorario().then((data) => {
      setDias(data);
      setDiasOriginal(data);
    }).catch(() => setAlert({ type: "error", msg: "Error al cargar el horario" }));
  }, []);

  const update = (diaSemana: number, patch: Partial<HorarioDia>) => {
    setDias((prev) =>
      prev.map((d) => {
        if (d.diaSemana !== diaSemana) return d;
        const updated = { ...d, ...patch };
        if (patch.tieneAlmuerzo === false) {
          updated.inicioAlmuerzo = null;
          updated.finAlmuerzo = null;
        }
        return updated;
      })
    );
  };

  const validate = (): string | null => {
    for (const d of dias.filter((x) => DIAS_EDITABLES.includes(x.diaSemana) && x.activo)) {
      if (!d.horaEntrada || !d.horaSalida) return `${DIA_NOMBRES[d.diaSemana]}: faltan horas`;
      if (d.horaEntrada >= d.horaSalida) return `${DIA_NOMBRES[d.diaSemana]}: la entrada debe ser antes de la salida`;
      if (d.tieneAlmuerzo) {
        if (!d.inicioAlmuerzo || !d.finAlmuerzo) return `${DIA_NOMBRES[d.diaSemana]}: faltan horas de corte`;
        if (d.inicioAlmuerzo >= d.finAlmuerzo) return `${DIA_NOMBRES[d.diaSemana]}: inicio del corte debe ser antes del fin`;
        if (d.inicioAlmuerzo <= d.horaEntrada || d.finAlmuerzo >= d.horaSalida)
          return `${DIA_NOMBRES[d.diaSemana]}: el corte debe estar dentro del horario laboral`;
      }
    }
    return null;
  };

  const ofrecerReprogramar = async (afectados: TurnoReprogramado[], motivo: string) => {
    const lista = afectados.map((a) =>
      `<li class="py-1 border-b border-gray-100 last:border-0 text-left">
        <span class="font-semibold">${a.turno.patente || "Sin patente"}</span>
        — Plaza ${a.turno.plaza}<br>
        <span class="text-gray-500 text-xs">
          ${fmtTurnoFecha(a.turno.fechaHoraFinEstimada)} →
          <strong>${fmtTurnoFecha(a.newFin)}</strong>
        </span>
      </li>`
    ).join('');

    const { isConfirmed } = await Swal.fire({
      title: `${afectados.length} turno${afectados.length > 1 ? 's' : ''} afectado${afectados.length > 1 ? 's' : ''}`,
      html: `<p class="text-sm text-gray-600 mb-2">${motivo}</p>
             <ul class="text-sm max-h-52 overflow-y-auto border border-gray-200 rounded p-2">${lista}</ul>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reprogramar',
      cancelButtonText: 'Dejar como están',
      confirmButtonColor: '#2563eb',
    });

    if (!isConfirmed) return;

    const resultados = await Promise.all(
      afectados.map((a) =>
        updateTurno(String(a.turno.id), {
          fechaHoraInicioEstimada: a.newInicio,
          fechaHoraFinEstimada:    a.newFin,
        }).then((r) => ({ turno: a.turno, ok: r.success, error: r.error }))
      )
    );

    const ok       = resultados.filter((r) => r.ok).length;
    const fallidos = resultados.filter((r) => !r.ok);

    if (fallidos.length > 0) {
      const detalle = fallidos.map((r) => `${r.turno.patente || r.turno.id}: ${r.error}`).join(' | ');
      setAlert({ type: "error", msg: `${ok} reprogramados. ${fallidos.length} fallaron: ${detalle}` });
    } else {
      setAlert({ type: "success", msg: `✓ ${ok} turno${ok > 1 ? 's' : ''} reprogramado${ok > 1 ? 's' : ''} en la base de datos` });
    }
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setAlert({ type: "error", msg: err }); return; }
    setSaving(true);
    setAlert(null);
    const result = await updateHorarioCompleto(dias);
    setSaving(false);
    if (!result.success) {
      setAlert({ type: "error", msg: result.error || "Error al guardar" });
      return;
    }
    setAlert({ type: "success", msg: "Horario guardado correctamente" });
    setDiasOriginal(dias); // actualizar snapshot

    // Detectar turnos afectados por el cambio de horario
    try {
      const [feriadosRaw, turnosRaw] = await Promise.all([getFeriados(), getTurnosWithPresupuestoData()]);
      const feriados: FeriadoConfig[] = feriadosRaw.map((f) => ({ fecha: f.fecha, esAnual: f.esAnual, nombre: f.nombre }));
      const afectados = detectarAfectadosPorHorario(turnosRaw, diasOriginal as HorarioDiaConfig[], dias as HorarioDiaConfig[], feriados);
      if (afectados.length > 0) {
        await ofrecerReprogramar(afectados, "Cambio de horario del taller");
      }
    } catch (e) {
      console.error('[horario] Error en detección de turnos afectados:', e);
    }
  };

  if (dias.length === 0 && !alert) {
    return <div className="p-6 text-gray-500 text-sm">Cargando horario...</div>;
  }

  return (
    <div className="py-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Horario del taller</h2>
      <p className="text-sm text-gray-500 mb-4">
        Configurá los días y horas de atención. Los turnos calcularán su fin estimado respetando este horario.
      </p>

      {alert && (
        <div className={`mb-4 flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${alert.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          <span>{alert.msg}</span>
          <button type="button" onClick={() => setAlert(null)} className="ml-4 text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* overflow-x-auto para que la tabla no se corte en pantallas chicas */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Día</th>
              <th className="px-4 py-2 text-center font-medium">Activo</th>
              {/* Orden cronológico: Entrada → Corte → Regreso → Salida */}
              <th className="px-4 py-2 text-center font-medium">Entrada</th>
              <th className="px-4 py-2 text-center font-medium">Corte mediodía</th>
              <th className="px-4 py-2 text-center font-medium">Inicio corte</th>
              <th className="px-4 py-2 text-center font-medium">Regreso</th>
              <th className="px-4 py-2 text-center font-medium">Salida</th>
            </tr>
          </thead>
          <tbody>
            {DIAS_EDITABLES.map((ds) => {
              const d = dias.find((x) => x.diaSemana === ds);
              if (!d) return null;
              return (
                <tr key={ds} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700">{DIA_NOMBRES[ds]}</td>

                  {/* Toggle activo */}
                  <td className="px-4 py-2 text-center">
                    <button type="button" className={toggleCls(d.activo)} onClick={() => update(ds, { activo: !d.activo })}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${d.activo ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>

                  {/* Entrada (inicio del día) */}
                  <td className="px-4 py-2 text-center">
                    <input type="time" className={timeCls} value={d.horaEntrada} disabled={!d.activo}
                      onChange={(e) => update(ds, { horaEntrada: e.target.value })} />
                  </td>

                  {/* Toggle corte mediodía */}
                  <td className="px-4 py-2 text-center">
                    <button type="button" className={toggleCls(d.activo && d.tieneAlmuerzo)} disabled={!d.activo}
                      onClick={() => update(ds, { tieneAlmuerzo: !d.tieneAlmuerzo })}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${d.activo && d.tieneAlmuerzo ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>

                  {/* Inicio corte (cuando se van a almorzar) */}
                  <td className="px-4 py-2 text-center">
                    {d.tieneAlmuerzo && d.activo ? (
                      <input type="time" className={timeCls} value={d.inicioAlmuerzo ?? ""}
                        onChange={(e) => update(ds, { inicioAlmuerzo: e.target.value || null })} />
                    ) : <span className="text-gray-300">—</span>}
                  </td>

                  {/* Regreso del almuerzo */}
                  <td className="px-4 py-2 text-center">
                    {d.tieneAlmuerzo && d.activo ? (
                      <input type="time" className={timeCls} value={d.finAlmuerzo ?? ""}
                        onChange={(e) => update(ds, { finAlmuerzo: e.target.value || null })} />
                    ) : <span className="text-gray-300">—</span>}
                  </td>

                  {/* Salida (fin del día) */}
                  <td className="px-4 py-2 text-center">
                    <input type="time" className={timeCls} value={d.horaSalida} disabled={!d.activo}
                      onChange={(e) => update(ds, { horaSalida: e.target.value })} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        <p className="text-xs text-gray-400">El domingo siempre aparece como cerrado.</p>
      </div>
    </div>
  );
}
