"use client";
// frontend/src/components/ui/CalendarioPlazas.tsx
import { useState, useEffect, useCallback } from "react";
import { format, addDays, addWeeks, addMonths, addYears, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getTurnosWithPresupuestoData } from "@/app/portal/eventos/turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import { useRepairStore } from "@/lib/repairStore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getPlazas, Plaza } from "@/app/portal/eventos/plazas-config/Plazas.api";

const HORA_INICIO = 7;
const HORA_FIN = 22;
const TOTAL_HORAS = HORA_FIN - HORA_INICIO;
const HORAS = Array.from({ length: TOTAL_HORAS + 1 }, (_, i) => HORA_INICIO + i);

function pillStyle(turno: Turno): string {
  if (turno.estado === "Cancelado") return "bg-gray-200 text-gray-500 border-gray-300";
  if (turno.estado === "Finalizado") return "bg-green-500 text-white border-green-600";
  if (turno.estado === "En curso" || turno.fechaHoraInicioReal) return "bg-yellow-400 text-yellow-900 border-yellow-500";
  return "bg-blue-500 text-white border-blue-600";
}

function toLocalDate(str: string | null | undefined): Date | null {
  if (!str) return null;
  try { return parseISO(str); } catch { return null; }
}

function calcTop(date: Date): number {
  const h = date.getHours() + date.getMinutes() / 60;
  return Math.max(0, Math.min(100, ((h - HORA_INICIO) / TOTAL_HORAS) * 100));
}

function calcHeight(start: Date, end: Date): number {
  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.max(2, Math.min(100, (diff / TOTAL_HORAS) * 100));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarioPlazas({ isOpen, onClose }: Props) {
  const jumpToIngreso = useRepairStore((s) => s.jumpToIngreso);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year">("day");
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const loadTurnos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTurnosWithPresupuestoData();
      setTurnos(Array.isArray(data) ? data : []);
    } catch { setTurnos([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadTurnos();
      getPlazas().then((data) => setPlazas(data.filter((p) => p.activa))).catch(() => {});
    }
  }, [isOpen, loadTurnos]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // --- helpers ---
  const turnosDelDia = (date: Date, plaza: number) =>
    turnos.filter((t) => {
      const inicio = toLocalDate(t.fechaHoraInicioEstimada);
      return inicio && isSameDay(inicio, date) && t.plaza === plaza;
    });

  const semana = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i));

  const navPrev = () => setCurrentDate((d) =>
    view === "day" ? addDays(d, -1) : view === "week" ? addWeeks(d, -1) : view === "month" ? addMonths(d, -1) : addYears(d, -1));
  const navNext = () => setCurrentDate((d) =>
    view === "day" ? addDays(d, 1) : view === "week" ? addWeeks(d, 1) : view === "month" ? addMonths(d, 1) : addYears(d, 1));

  const handleTurnoClick = (t: Turno) => {
    // Construir un Presupuesto mínimo con los datos del join disponibles en el turno
    const presupuesto: any = {
      id: 0,
      uuid: t.presupuestoId ?? undefined,
      patente: t.patente ?? null,
      marca: t.marca ?? null,
      modelo: t.modelo ?? null,
      anio: t.anio ?? null,
      monto: t.monto ?? null,
      estado: t.presupuestoEstado ?? "Aprobado",
      movilId: null,
    };
    jumpToIngreso(presupuesto, t);
    window.open("/portal/eventos/tabs", "_blank");
  };

  // --- Tooltip ---
  const tooltip = (t: Turno) => (
    <div className="absolute z-50 left-0 top-full mt-1 w-52 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl pointer-events-none">
      <p className="font-bold">{t.patente || "Sin patente"} — Plaza {t.plaza}</p>
      <p>{t.marca} {t.modelo} {t.anio}</p>
      <p className="mt-1">Estimado: {t.fechaHoraInicioEstimada ? format(parseISO(t.fechaHoraInicioEstimada), "dd/MM HH:mm") : "—"}</p>
      {t.fechaHoraInicioReal && <p>Real: {format(parseISO(t.fechaHoraInicioReal), "dd/MM HH:mm")}</p>}
      <p className="mt-1 font-medium">{t.estado}</p>
    </div>
  );

  // --- Day view ---
  const DayView = () => (
    <div className="flex overflow-x-auto">
      {/* Columna de horas */}
      <div className="shrink-0 w-14 border-r border-gray-200">
        <div className="h-10 border-b border-gray-200" />
        <div className="relative" style={{ height: 600 }}>
          {HORAS.map((h) => (
            <div key={h} className="absolute w-full text-right pr-2 text-xs text-gray-400"
              style={{ top: `${((h - HORA_INICIO) / TOTAL_HORAS) * 100}%`, transform: "translateY(-50%)" }}>
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>

      {/* Columnas de plazas */}
      {plazas.map((p) => {
        const turnosPlaza = turnosDelDia(currentDate, p.numero);
        return (
          <div key={p.numero} className="flex-1 min-w-[100px] border-r border-gray-100 last:border-r-0">
            <div className="h-10 border-b border-gray-200 flex items-center justify-center bg-gray-50">
              <span className="text-xs font-semibold text-gray-600">{p.nombre}</span>
            </div>
            <div className="relative bg-white" style={{ height: 600 }}>
              {/* Líneas de hora */}
              {HORAS.map((h) => (
                <div key={h} className="absolute w-full border-t border-gray-100"
                  style={{ top: `${((h - HORA_INICIO) / TOTAL_HORAS) * 100}%` }} />
              ))}
              {/* Línea actual */}
              {isSameDay(currentDate, new Date()) && (() => {
                const now = new Date();
                const pct = ((now.getHours() + now.getMinutes() / 60 - HORA_INICIO) / TOTAL_HORAS) * 100;
                if (pct < 0 || pct > 100) return null;
                return <div className="absolute w-full border-t-2 border-red-400 z-10" style={{ top: `${pct}%` }} />;
              })()}
              {/* Pills */}
              {turnosPlaza.map((t) => {
                const inicio = toLocalDate(t.fechaHoraInicioEstimada);
                const fin = toLocalDate(t.fechaHoraFinEstimada);
                if (!inicio || !fin) return null;
                const top = calcTop(inicio);
                const height = calcHeight(inicio, fin);
                return (
                  <div key={t.id} className={`absolute inset-x-0.5 rounded border text-xs overflow-hidden cursor-pointer select-none ${pillStyle(t)}`}
                    style={{ top: `${top}%`, height: `${height}%`, minHeight: 18 }}
                    onMouseEnter={() => setHoveredId(t.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleTurnoClick(t)}>
                    <div className="px-1 py-0.5 leading-tight truncate font-medium">
                      {t.patente || "—"}
                    </div>
                    {t.fechaHoraInicioReal && (
                      <span className="absolute top-0.5 right-0.5 text-green-300 text-[8px]">●</span>
                    )}
                    {hoveredId === t.id && tooltip(t)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- Week view ---
  const WeekView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="w-24 border border-gray-200 bg-gray-50 p-2" />
            {plazas.map((p) => (
              <th key={p.numero} className="border border-gray-200 bg-gray-50 p-2 font-semibold text-gray-600 min-w-[90px]">
                {p.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {semana.map((dia) => (
            <tr key={dia.toISOString()} className={isSameDay(dia, new Date()) ? "bg-blue-50" : ""}>
              <td className="border border-gray-200 p-2 text-center font-medium text-gray-600 whitespace-nowrap">
                <div>{format(dia, "EEE", { locale: es })}</div>
                <div className="text-base font-bold">{format(dia, "d")}</div>
              </td>
              {plazas.map((p) => {
                const pills = turnosDelDia(dia, p.numero);
                return (
                  <td key={p.numero} className="border border-gray-200 p-1 align-top min-h-[60px]">
                    <div className="flex flex-col gap-0.5">
                      {pills.map((t) => (
                        <div key={t.id} className={`rounded px-1 py-0.5 truncate border ${pillStyle(t)} relative cursor-pointer`}
                          onMouseEnter={() => setHoveredId(t.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => handleTurnoClick(t)}>
                          <span>{t.patente || "—"}</span>
                          {t.fechaHoraInicioReal && <span className="ml-1 text-green-300">●</span>}
                          {hoveredId === t.id && tooltip(t)}
                        </div>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- Month view ---
  const MonthView = () => {
    const mesInicio = startOfMonth(currentDate);
    const mesFin = endOfMonth(currentDate);
    const dias = eachDayOfInterval({ start: mesInicio, end: mesFin });
    // Padding inicial: lunes=0 ... domingo=6
    const offsetInicio = (mesInicio.getDay() + 6) % 7;
    const semanas = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const turnosDelDiaTodos = (date: Date) =>
      turnos.filter((t) => { const i = toLocalDate(t.fechaHoraInicioEstimada); return i && isSameDay(i, date); });

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 border-l border-t border-gray-200">
          {semanas.map((d) => (
            <div key={d} className="border-r border-b border-gray-200 bg-gray-50 py-2 text-center text-xs font-semibold text-gray-500">
              {d}
            </div>
          ))}
          {Array.from({ length: offsetInicio }).map((_, i) => (
            <div key={`pad-${i}`} className="border-r border-b border-gray-100 bg-gray-50 min-h-[90px]" />
          ))}
          {dias.map((dia) => {
            const hoy = isSameDay(dia, new Date());
            const esMes = isSameMonth(dia, currentDate);
            const turnosDia = turnosDelDiaTodos(dia);
            const visibles = turnosDia.slice(0, 3);
            const resto = turnosDia.length - 3;
            return (
              <div key={dia.toISOString()}
                className={`border-r border-b border-gray-200 min-h-[90px] p-1 ${!esMes ? "opacity-40 bg-gray-50" : "bg-white"}`}>
                <div className={`text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  hoy ? "bg-blue-600 text-white" : "text-gray-600"}`}>
                  {format(dia, "d")}
                </div>
                <div className="flex flex-col gap-0.5">
                  {visibles.map((t) => (
                    <div key={t.id}
                      className={`rounded px-1 py-0.5 text-[10px] truncate border cursor-pointer ${pillStyle(t)} relative`}
                      onMouseEnter={() => setHoveredId(t.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleTurnoClick(t)}>
                      {t.patente || "—"} {plazas.find((p) => p.numero === t.plaza)?.nombre ?? `P${t.plaza}`}
                      {t.fechaHoraInicioReal && <span className="ml-0.5 text-green-300">●</span>}
                      {hoveredId === t.id && tooltip(t)}
                    </div>
                  ))}
                  {resto > 0 && (
                    <div className="text-[10px] text-gray-400 px-1">+{resto} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Year view ---
  const YearView = () => {
    const year = currentDate.getFullYear();
    const meses = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];
    const diasConTurnos = new Set(
      turnos.map((t) => { const d = toLocalDate(t.fechaHoraInicioEstimada); return d ? format(d, "yyyy-MM-dd") : null; }).filter(Boolean)
    );
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {meses.map((mesDate) => {
          const mesInicio = startOfMonth(mesDate);
          const mesFin = endOfMonth(mesDate);
          const dias = eachDayOfInterval({ start: mesInicio, end: mesFin });
          const offset = (mesInicio.getDay() + 6) % 7;
          return (
            <div key={mesDate.getMonth()} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className={`px-3 py-2 text-sm font-semibold text-center capitalize border-b border-gray-200 ${isSameMonth(mesDate, new Date()) ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-700"}`}>
                {format(mesDate, "MMMM", { locale: es })}
              </div>
              <div className="p-2">
                <div className="grid grid-cols-7 mb-1">
                  {diasSemana.map((d) => (
                    <div key={d} className="text-center text-[9px] font-semibold text-gray-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-0.5">
                  {Array.from({ length: offset }).map((_, i) => <div key={`p${i}`} />)}
                  {dias.map((dia) => {
                    const key = format(dia, "yyyy-MM-dd");
                    const tiene = diasConTurnos.has(key);
                    const hoy = isSameDay(dia, new Date());
                    return (
                      <button key={key}
                        onClick={() => { setCurrentDate(dia); setView("day"); }}
                        className={`relative flex items-center justify-center text-[10px] h-5 w-full rounded transition-colors
                          ${hoy ? "bg-blue-600 text-white font-bold" : tiene ? "font-semibold text-gray-800 hover:bg-gray-100" : "text-gray-400 hover:bg-gray-50"}`}>
                        {format(dia, "d")}
                        {tiene && !hoy && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50 shrink-0 gap-4">

        {/* Izquierda: título + navegación */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800 shrink-0">Plazas del Taller</h2>
          <div className="w-px h-5 bg-gray-300" />
          <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5">
            <button onClick={navPrev} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700 transition-colors capitalize min-w-[64px] text-center"
            >
              {view === "day" || view === "week"
                ? "Hoy"
                : view === "month"
                ? format(new Date(), "MMM", { locale: es })
                : format(new Date(), "yyyy")}
            </button>
            <button onClick={navNext} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
              <FaChevronRight className="text-xs" />
            </button>
          </div>
          <span className="text-sm font-semibold text-gray-700 capitalize">
            {view === "day"
              ? format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })
              : view === "week"
              ? `${format(semana[0], "d MMM", { locale: es })} — ${format(semana[6], "d MMM yyyy", { locale: es })}`
              : view === "month"
              ? format(currentDate, "MMMM yyyy", { locale: es })
              : format(currentDate, "yyyy")}
          </span>
        </div>

        {/* Derecha: selector de vista + acciones */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5">
            {(["day", "week", "month", "year"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${view === v ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {v === "day" ? "Día" : v === "week" ? "Semana" : v === "month" ? "Mes" : "Año"}
              </button>
            ))}
          </div>
          <button onClick={loadTurnos} disabled={loading}
            className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm">
            {loading ? "…" : "↻"}
          </button>
          <button onClick={onClose}
            className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors font-bold text-lg leading-none">
            ✕
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 px-6 py-2 border-b border-gray-100 bg-white text-xs text-gray-600 shrink-0">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Programado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> En curso / Ingresado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Finalizado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Cancelado</span>
        <span className="flex items-center gap-1 text-green-600">● Tiene ingreso real registrado</span>
      </div>

      {/* Cuerpo */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Cargando turnos...</div>
        ) : view === "day" ? <DayView /> : view === "week" ? <WeekView /> : view === "month" ? <MonthView /> : <YearView />}
      </div>
    </div>
  );
}
