"use client";
// frontend/src/app/portal/eventos/admin/FeriadosTab.tsx
import { useState, useEffect } from "react";
import { getFeriados, createFeriado, deleteFeriado, feriadoFecha, Feriado } from "./Feriados.api";
import { getHorario } from "../plazas-config/Horario.api";
import { getTurnosWithPresupuestoData } from "../turnos/Turnos.api";
import { updateTurno } from "../turnos/Turnos.api";
import { detectarAfectadosPorFeriado, fmtTurnoFecha, TurnoReprogramado } from "@/utils/reprogramarTurnos";
import { HorarioDiaConfig, FeriadoConfig } from "@/utils/businessHours";
import Swal from "sweetalert2";
import { FaTrash, FaPlus } from "react-icons/fa";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function labelFecha(f: Feriado): string {
  const d = new Date(feriadoFecha(f) + "T12:00:00");
  const dia = d.getDate();
  const mes = MESES[d.getMonth()];
  return f.esAnual ? `${dia} de ${mes} (todos los años)` : `${dia} de ${mes} de ${d.getFullYear()}`;
}

export default function FeriadosTab() {
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fecha: "", nombre: "", esAnual: false });
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());

  const load = () => {
    setLoading(true);
    getFeriados().then(setFeriados).catch(() => setAlert({ type: "error", msg: "Error al cargar feriados" })).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const feriadosVisibles = feriados.filter((f) => {
    if (f.esAnual) return true;
    return new Date(feriadoFecha(f) + "T12:00:00").getFullYear() === anioFiltro;
  }).sort((a, b) => {
    // Ordenar por mes-día (ignorando año para anuales)
    const da = new Date(feriadoFecha(a) + "T12:00:00");
    const db = new Date(feriadoFecha(b) + "T12:00:00");
    const ma = da.getMonth() * 100 + da.getDate();
    const mb = db.getMonth() * 100 + db.getDate();
    return ma - mb;
  });

  const handleCreate = async () => {
    if (!form.fecha || !form.nombre.trim()) {
      setAlert({ type: "error", msg: "Completá la fecha y el nombre" });
      return;
    }

    // Capturar antes de limpiar el form — React puede re-renderizar antes de que los usemos
    const feriadoFecha   = form.fecha;
    const feriadoNombre  = form.nombre.trim();
    const feriadoEsAnual = form.esAnual;

    setSaving(true);
    setAlert(null);
    const result = await createFeriado({ fecha: feriadoFecha, nombre: feriadoNombre, esAnual: feriadoEsAnual });
    setSaving(false);
    if (!result.success) {
      setAlert({ type: "error", msg: result.error || "Error al guardar" });
      return;
    }
    setForm({ fecha: "", nombre: "", esAnual: false });
    setShowForm(false);
    const nuevaLista = await getFeriados();
    setFeriados(nuevaLista);
    setAlert({ type: "success", msg: "Feriado agregado" });

    // Detectar turnos afectados y ofrecer reprogramación
    try {
      const [horarioRaw, turnosRaw] = await Promise.all([getHorario(), getTurnosWithPresupuestoData()]);
      const horario: HorarioDiaConfig[] = horarioRaw;
      const feriadosConf: FeriadoConfig[] = nuevaLista.map((f) => ({ fecha: f.fecha, esAnual: f.esAnual, nombre: f.nombre }));
      const afectados = detectarAfectadosPorFeriado(turnosRaw, feriadoFecha, feriadoEsAnual, horario, feriadosConf);

      if (afectados.length > 0) {
        await ofrecerReprogramar(afectados, `Feriado: ${feriadoNombre}`);
      }
    } catch (e) {
      console.error('[feriados] Error en detección de turnos afectados:', e);
    }
  };

  const handleDelete = async (f: Feriado) => {
    if (!confirm(`¿Eliminar "${f.nombre}"?`)) return;
    const result = await deleteFeriado(f.id);
    if (result.success) {
      setFeriados((prev) => prev.filter((x) => x.id !== f.id));
    } else {
      setAlert({ type: "error", msg: result.error || "Error al eliminar" });
    }
  };

  const ofrecerReprogramar = async (afectados: TurnoReprogramado[], motivo: string) => {
    const lista = afectados.map((a) =>
      `<li class="py-1 border-b border-gray-100 last:border-0 text-left">
        <span class="font-semibold">${a.turno.patente || "Sin patente"}</span>
        — Plaza ${a.turno.plaza}<br>
        <span class="text-gray-500 text-xs">
          ${fmtTurnoFecha(a.turno.fechaHoraInicioEstimada)} →
          <strong>${fmtTurnoFecha(a.newInicio)}</strong>
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

    const ok      = resultados.filter((r) => r.ok).length;
    const fallidos = resultados.filter((r) => !r.ok);

    if (fallidos.length > 0) {
      const detalle = fallidos.map((r) => `${r.turno.patente || r.turno.id}: ${r.error}`).join(' | ');
      setAlert({ type: "error", msg: `${ok} reprogramados. ${fallidos.length} fallaron: ${detalle}` });
    } else {
      setAlert({ type: "success", msg: `✓ ${ok} turno${ok > 1 ? 's' : ''} reprogramado${ok > 1 ? 's' : ''} en la base de datos` });
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Feriados</h2>
          <p className="text-sm text-gray-500">Los feriados no se cuentan como días hábiles en los turnos ni en el calendario.</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm((v) => !v); setAlert(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="text-xs" /> Agregar feriado
        </button>
      </div>

      {alert && (
        <div className={`mb-4 flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${alert.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          <span>{alert.msg}</span>
          <button type="button" onClick={() => setAlert(null)} className="ml-4 text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Formulario inline */}
      {showForm && (
        <div className="mb-4 border border-blue-200 bg-blue-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">Nuevo feriado</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600">Nombre</label>
              <input
                type="text"
                placeholder="ej: Día de la Independencia"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-1.5">
              <input
                type="checkbox"
                checked={form.esAnual}
                onChange={(e) => setForm((f) => ({ ...f, esAnual: e.target.checked }))}
                className="rounded"
              />
              Se repite cada año
            </label>
            <div className="flex gap-2 pb-1.5">
              <button type="button" onClick={handleCreate} disabled={saving}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtro de año */}
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm text-gray-600">Año:</label>
        <button onClick={() => setAnioFiltro((y) => y - 1)} className="px-2 py-0.5 text-sm border rounded hover:bg-gray-50">‹</button>
        <span className="text-sm font-semibold w-12 text-center">{anioFiltro}</span>
        <button onClick={() => setAnioFiltro((y) => y + 1)} className="px-2 py-0.5 text-sm border rounded hover:bg-gray-50">›</button>
        <span className="text-xs text-gray-400 ml-2">Los feriados anuales siempre aparecen.</span>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : feriadosVisibles.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          No hay feriados para {anioFiltro}. Usá el botón para agregar.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Fecha</th>
                <th className="px-4 py-2 text-left font-medium">Nombre</th>
                <th className="px-4 py-2 text-center font-medium">Tipo</th>
                <th className="px-4 py-2 text-center font-medium w-16" />
              </tr>
            </thead>
            <tbody>
              {feriadosVisibles.map((f) => (
                <tr key={f.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700 font-medium">{labelFecha(f)}</td>
                  <td className="px-4 py-2 text-gray-800">{f.nombre}</td>
                  <td className="px-4 py-2 text-center">
                    {f.esAnual
                      ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Anual</span>
                      : <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Único</span>}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button type="button" onClick={() => handleDelete(f)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
