"use client";
// frontend/src/components/ui/CalendarioPlazas.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { format, addDays, addWeeks, addMonths, addYears, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { getTurnosWithPresupuestoData } from "@/app/portal/eventos/turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import { useRepairStore } from "@/lib/repairStore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getPlazas, Plaza } from "@/app/portal/eventos/plazas-config/Plazas.api";
import { getHorario, HorarioDia } from "@/app/portal/eventos/plazas-config/Horario.api";
import { getFeriados, Feriado } from "@/app/portal/eventos/admin/Feriados.api";
import { getRangoHorarioCalendario, getFeriadoNombre } from "@/utils/businessHours";

function pillStyle(turno: Turno): string {
  if (turno.estado === "Cancelado") return "bg-gray-200 text-gray-500 border-gray-300";
  if (turno.estado === "Finalizado") return "bg-green-500 text-white border-green-600";
  if (turno.estado === "En curso" || turno.fechaHoraInicioReal) return "bg-violet-500 text-white border-violet-600";
  return "bg-blue-500 text-white border-blue-600";
}

function toLocalDate(str: string | null | undefined): Date | null {
  if (!str) return null;
  try { return parseISO(str); } catch { return null; }
}


/** Verifica si un turno se superpone con el día dado (maneja eventos multi-día) */
function turnoEnDia(t: Turno, date: Date): boolean {
  const inicio = toLocalDate(t.fechaHoraInicioEstimada);
  const fin = toLocalDate(t.fechaHoraFinEstimada);
  if (!inicio) return false;
  const dayStart = startOfDay(date);
  const dayNext = addDays(dayStart, 1);
  const eventEnd = fin ?? inicio;
  return inicio < dayNext && eventEnd >= dayStart;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarioPlazas({ isOpen, onClose }: Props) {
  const jumpFromCalendar = useRepairStore((s) => s.jumpFromCalendar);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year">("day");
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [tooltipTurno, setTooltipTurno] = useState<Turno | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = (t: Turno, e: React.MouseEvent) => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.right + 8 + 320 > window.innerWidth ? rect.left - 328 : rect.right + 8;
    const y = Math.min(rect.top, window.innerHeight - 520);
    setTooltipTurno(t);
    setTooltipPos({ x, y });
  };
  const hideTooltip = () => {
    tooltipTimer.current = setTimeout(() => { setTooltipTurno(null); setTooltipPos(null); }, 150);
  };
  const cancelHide = () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  const [horarioConfig, setHorarioConfig] = useState<HorarioDia[] | null>(null);
  const [feriados, setFeriados] = useState<Feriado[]>([]);

  // Rango horario dinámico basado en la config del taller
  const { horaInicio: HORA_INICIO, horaFin: HORA_FIN } = horarioConfig
    ? getRangoHorarioCalendario(horarioConfig)
    : { horaInicio: 7, horaFin: 22 };
  const TOTAL_HORAS = HORA_FIN - HORA_INICIO;
  const HORAS = Array.from({ length: TOTAL_HORAS + 1 }, (_, i) => HORA_INICIO + i);

  const calcTop = (date: Date): number => {
    const h = date.getHours() + date.getMinutes() / 60;
    return Math.max(0, Math.min(100, ((h - HORA_INICIO) / TOTAL_HORAS) * 100));
  };

  const calcDayBlock = (date: Date, inicio: Date, fin: Date) => {
    const visStart = new Date(date);
    visStart.setHours(HORA_INICIO, 0, 0, 0);
    const visEnd = new Date(date);
    visEnd.setHours(HORA_FIN, 0, 0, 0);
    const continuesBefore = inicio < visStart;
    const continuesAfter = fin > visEnd;
    const effStart = continuesBefore ? visStart : inicio;
    const effEnd = continuesAfter ? visEnd : fin;
    const top = calcTop(effStart);
    const startH = effStart.getHours() + effStart.getMinutes() / 60;
    const endH = effEnd.getHours() + effEnd.getMinutes() / 60;
    const height = Math.max(2, ((endH - startH) / TOTAL_HORAS) * 100);
    return { top, height, continuesBefore, continuesAfter };
  };

  const loadTurnos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTurnosWithPresupuestoData();
      setTurnos(Array.isArray(data) ? data : []);
    } catch { setTurnos([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    loadTurnos();
    getPlazas().then((data) => setPlazas(data.filter((p) => p.activa))).catch(() => {});
    getHorario().then(setHorarioConfig).catch(() => {});
    getFeriados().then(setFeriados).catch(() => {});
    const interval = setInterval(loadTurnos, 60000);
    return () => clearInterval(interval);
  }, [isOpen, loadTurnos]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const turnosDelDia = (date: Date, plaza: number) =>
    turnos.filter((t) => t.plaza === plaza && turnoEnDia(t, date));

  const semana = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i));

  // Badges individuales por reparador
  const ReparadoresBadges = ({ texto, mini = false }: { texto: string | null | undefined; mini?: boolean }) => {
    if (!texto) return null;
    const personas = texto.split(" | ").map((s) => s.trim()).filter(Boolean);
    return (
      <div className="flex gap-0.5 flex-wrap">
        {personas.map((nombre, i) => {
          const palabras = nombre.split(" ");
          const iniciales = (palabras[0]?.[0] ?? "") + (palabras[1]?.[0] ?? "");
          const colors = ["bg-indigo-200 text-indigo-900", "bg-violet-200 text-violet-900", "bg-sky-200 text-sky-900", "bg-emerald-200 text-emerald-900"];
          const color = colors[i % colors.length];
          return (
            <span key={i} title={nombre}
              className={`${mini ? "text-[8px] px-0.5" : "text-[9px] px-1"} ${color} rounded font-bold uppercase leading-tight`}>
              {iniciales || nombre[0]}
            </span>
          );
        })}
      </div>
    );
  };

  const navPrev = () => setCurrentDate((d) =>
    view === "day" ? addDays(d, -1) : view === "week" ? addWeeks(d, -1) : view === "month" ? addMonths(d, -1) : addYears(d, -1));
  const navNext = () => setCurrentDate((d) =>
    view === "day" ? addDays(d, 1) : view === "week" ? addWeeks(d, 1) : view === "month" ? addMonths(d, 1) : addYears(d, 1));

  const handleTurnoClick = (t: Turno) => {
    jumpFromCalendar(t);
    window.open("/portal/eventos/tabs", "_blank");
  };

  const tryParse = (s: string | null | undefined) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

  const tooltipContent = (t: Turno) => {
    const chapa: Array<{ parte?: string; piezas?: string; accion?: string; horas?: number }> = tryParse(t.chapaRows) ?? [];
    const pintura: Array<{ parte?: string; piezas?: string; pintarDifuminar?: string; tipoPintura?: string; horas?: number }> = tryParse(t.pinturaRows) ?? [];
    const cyp: { chapa?: { horas?: number; diasPanos?: number; materiales?: string }; pintura?: { horas?: number; diasPanos?: number; materiales?: string } } = tryParse(t.preciosCyP) ?? {};
    const magnitud: string[] = tryParse(t.magnitudDanio) ?? [];
    return (
    <div className="w-80 bg-gray-900 text-white text-xs rounded-lg shadow-xl overflow-hidden overflow-y-auto max-h-[80vh]">
      {/* Header */}
      <div className="px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-sm">{t.patente || "Sin patente"}</span>
          <span className="text-gray-400 text-[10px]">Plaza {t.plaza}{t.presupuestoNumId ? ` · #${t.presupuestoNumId}` : ""}</span>
        </div>
        <div className="text-gray-300 text-[11px] mt-0.5">{[t.marca, t.modelo, t.anio, t.color].filter(Boolean).join(" · ")}</div>
        {t.tipoTrabajo && (
          <div className="text-sky-300 text-[11px] font-medium mt-0.5">{t.tipoTrabajo}</div>
        )}
      </div>
      {/* Cliente */}
      {(t.clienteNombres || t.clienteApellido) && (
        <div className="px-3 py-1.5 border-b border-gray-700 text-gray-300">
          <span className="text-gray-500 mr-1">Cliente:</span>
          {[t.clienteNombres, t.clienteApellido].filter(Boolean).join(" ")}
          {t.clienteTelefono && <span className="text-gray-400 ml-1">· {t.clienteTelefono}</span>}
        </div>
      )}
      {/* Fechas */}
      <div className="px-3 py-1.5 border-b border-gray-700">
        <div>
          <span className="text-gray-500">Estimado: </span>
          {t.fechaHoraInicioEstimada ? format(parseISO(t.fechaHoraInicioEstimada), "dd/MM HH:mm") : "—"}
          {t.fechaHoraFinEstimada ? ` → ${format(parseISO(t.fechaHoraFinEstimada), "dd/MM HH:mm")}` : ""}
        </div>
        {t.fechaHoraInicioReal && (
          <div className="text-green-400 mt-0.5">
            ● Real: {format(parseISO(t.fechaHoraInicioReal), "dd/MM HH:mm")}
            {t.fechaHoraFinReal ? ` → ${format(parseISO(t.fechaHoraFinReal), "dd/MM HH:mm")}` : ""}
          </div>
        )}
      </div>
      {/* Monto + estado */}
      <div className="px-3 py-1.5 border-b border-gray-700 flex items-center gap-3">
        {t.monto && <span className="text-yellow-300 font-semibold">${Number(t.monto).toLocaleString("es-AR")}</span>}
        <span className="font-medium">{t.estado}</span>
      </div>
      {/* Reparadores */}
      {t.reparadoresTexto && (
        <div className="px-3 py-1.5 border-b border-gray-700 text-indigo-300">
          👤 {t.reparadoresTexto}
        </div>
      )}
      {/* Magnitud del daño */}
      {magnitud.length > 0 && (
        <div className="px-3 py-1.5 border-b border-gray-700 flex items-center gap-1.5">
          <span className="text-gray-500">Daño:</span>
          {magnitud.map((m, i) => (
            <span key={i} className="bg-orange-700/60 text-orange-200 px-1.5 py-0.5 rounded text-[10px] font-medium">{m}</span>
          ))}
        </div>
      )}
      {/* Chapa */}
      {chapa.length > 0 && (
        <div className="px-3 py-1.5 border-b border-gray-700">
          <div className="text-gray-400 font-semibold mb-1">🔧 CHAPA</div>
          {chapa.map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-2 py-0.5">
              <span className="text-gray-300 flex-1">{[r.parte, r.piezas].filter(Boolean).join(" / ")}</span>
              <span className="text-gray-400 whitespace-nowrap">{r.accion}</span>
              <span className="text-yellow-400 whitespace-nowrap font-medium">{r.horas}h</span>
            </div>
          ))}
        </div>
      )}
      {/* Pintura */}
      {pintura.length > 0 && (
        <div className="px-3 py-1.5 border-b border-gray-700">
          <div className="text-gray-400 font-semibold mb-1">🎨 PINTURA</div>
          {pintura.map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-2 py-0.5">
              <span className="text-gray-300 flex-1">{[r.parte, r.piezas].filter(Boolean).join(" / ")}</span>
              <span className="text-gray-400 whitespace-nowrap">{[r.pintarDifuminar, r.tipoPintura].filter(Boolean).join(" · ")}</span>
              <span className="text-yellow-400 whitespace-nowrap font-medium">{r.horas}h</span>
            </div>
          ))}
        </div>
      )}
      {/* Resumen preciosCyP */}
      {(cyp.chapa || cyp.pintura) && (
        <div className="px-3 py-1.5 border-b border-gray-700 text-[10px] text-gray-400">
          {cyp.chapa && (
            <div><span className="text-gray-300 font-medium">Chapa:</span> {cyp.chapa.horas}h · {cyp.chapa.diasPanos} {Number(cyp.chapa.diasPanos) === 1 ? "día" : "días"}{cyp.chapa.materiales ? ` · ${cyp.chapa.materiales}` : ""}</div>
          )}
          {cyp.pintura && (
            <div className="mt-0.5"><span className="text-gray-300 font-medium">Pintura:</span> {cyp.pintura.horas}h · {cyp.pintura.diasPanos} {Number(cyp.pintura.diasPanos) === 1 ? "día" : "días"}{cyp.pintura.materiales ? ` · ${cyp.pintura.materiales}` : ""}</div>
          )}
        </div>
      )}
      {/* Observaciones del presupuesto */}
      {t.presupuestoObservaciones && (
        <div className="px-3 py-1.5 border-b border-gray-700 italic text-gray-300">{t.presupuestoObservaciones}</div>
      )}
      {/* Observaciones del turno */}
      {t.observaciones && (
        <div className="px-3 py-1.5 italic text-gray-400 text-[10px]">Turno: {t.observaciones}</div>
      )}
    </div>
    );
  };

  /** true si ese día de la semana está marcado como inactivo en el horario del taller */
  const esDiaInactivo = (date: Date) => {
    if (!horarioConfig) return false;
    const cfg = horarioConfig.find((h) => h.diaSemana === date.getDay());
    return !cfg?.activo;
  };

  // --- Day view ---
  const DAY_GRID_HEIGHT = "calc(100vh - 170px)";
  const feriadoHoy = getFeriadoNombre(currentDate, feriados);

  const DayView = () => {
    // Calcular banda de corte para el día actual
    const horarioHoy = horarioConfig?.find((h) => h.diaSemana === currentDate.getDay());
    const lunchBand = !feriadoHoy && horarioHoy?.tieneAlmuerzo && horarioHoy.inicioAlmuerzo && horarioHoy.finAlmuerzo
      ? (() => {
          const [sh, sm] = horarioHoy.inicioAlmuerzo!.split(':').map(Number);
          const [eh, em] = horarioHoy.finAlmuerzo!.split(':').map(Number);
          const top    = Math.max(0, ((sh + sm / 60 - HORA_INICIO) / TOTAL_HORAS) * 100);
          const height = Math.max(0, ((eh + em / 60 - (sh + sm / 60)) / TOTAL_HORAS) * 100);
          const label  = `${horarioHoy.inicioAlmuerzo} – ${horarioHoy.finAlmuerzo}`;
          return { top, height, label, startHour: sh, endHour: eh };
        })()
      : null;

    return (
    <div className="flex flex-col overflow-hidden h-full">
      {feriadoHoy && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-orange-50 border-b border-orange-200 text-orange-700 text-sm font-medium">
          <span>🗓</span>
          <span>Feriado: <strong>{feriadoHoy}</strong> — El taller no opera este día, se postergan las horas de trabajo automaticamente.</span>
        </div>
      )}
    <div className={`flex overflow-x-auto h-full ${feriadoHoy ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Columna de horas */}
      <div className="shrink-0 w-14 border-r border-gray-200">
        <div className="h-10 border-b border-gray-200" />
        <div className="relative" style={{ height: DAY_GRID_HEIGHT }}>
          {HORAS.map((h) => {
            const isLunchStart = lunchBand && h === lunchBand.startHour;
            const isLunchEnd = lunchBand && h === lunchBand.endHour;
            return (
            <div key={h} className="absolute w-full text-right pr-2 text-xs text-gray-400"
              style={{
                top: `${((h - HORA_INICIO) / TOTAL_HORAS) * 100}%`,
                transform: isLunchStart ? "translateY(-100%)" : isLunchEnd ? "translateY(0%)" : "translateY(-50%)",
              }}>
              {String(h).padStart(2, "0")}:00
            </div>
            );
          })}
          {/* Banda corte en columna de horas */}
          {lunchBand && (
            <div className="absolute inset-x-0 pointer-events-none flex items-center justify-center overflow-hidden box-border"
              style={{ top: `${lunchBand.top}%`, height: `${lunchBand.height}%`, background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)", boxShadow: "inset 0 1px 0 0 #bae6fd, inset 0 -1px 0 0 #bae6fd" }}>
              <span className="text-[9px] text-sky-400 font-semibold select-none whitespace-nowrap tracking-wide uppercase">
                ☕
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Columnas de plazas */}
      {plazas.map((p) => {
        const turnosPlaza = turnosDelDia(currentDate, p.numero);
        return (
          <div key={p.numero} className="flex-1 min-w-[100px] border-r border-gray-100 last:border-r-0">
            <div className="h-10 border-b border-gray-200 flex items-center justify-center bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 text-center leading-tight">
                {p.piso?.nombre && <span className="block text-[9px] text-gray-400">{p.piso.nombre}</span>}
                {p.nombre}
              </span>
            </div>
            <div className="relative bg-white" style={{ height: DAY_GRID_HEIGHT }}>
              {/* Líneas de hora */}
              {HORAS.map((h) => (
                <div key={h} className="absolute w-full border-t border-gray-100"
                  style={{ top: `${((h - HORA_INICIO) / TOTAL_HORAS) * 100}%` }} />
              ))}
              {/* Banda corte del mediodía */}
              {lunchBand && (
                <div className="absolute inset-x-0 pointer-events-none z-[1] overflow-hidden box-border"
                  style={{
                    top: `${lunchBand.top}%`,
                    height: `${lunchBand.height}%`,
                    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
                    boxShadow: "inset 0 1px 0 0 #bae6fd, inset 0 -1px 0 0 #bae6fd",
                  }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] text-sky-400/70 font-medium select-none whitespace-nowrap tracking-wider">
                      {lunchBand.label}
                    </span>
                  </div>
                </div>
              )}
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
                const inicioReal = toLocalDate(t.fechaHoraInicioReal);
                const finReal = toLocalDate(t.fechaHoraFinReal);
                const inicioShow = inicioReal ?? inicio;
                const finShow = finReal ?? fin;
                const { top, height, continuesBefore, continuesAfter } = calcDayBlock(currentDate, inicio, fin);
                return (
                  <div key={t.id} className={`absolute inset-x-0.5 rounded border overflow-hidden cursor-pointer select-none ${pillStyle(t)}`}
                    style={{ top: `${top}%`, height: `${height}%`, minHeight: 48 }}
                    onMouseEnter={(e) => showTooltip(t, e)}
                    onMouseLeave={hideTooltip}
                    onClick={() => handleTurnoClick(t)}>
                    <div className="px-1.5 py-1 leading-tight flex flex-col gap-0.5 overflow-hidden h-full">
                      {continuesBefore && (
                        <div className="text-[10px] opacity-80 font-semibold">
                          ↑ desde {format(inicio, "dd/MM")}
                        </div>
                      )}
                      <div className="text-[11px] font-bold whitespace-nowrap">
                        {format(inicioShow, "HH:mm")} – {format(finShow, continuesAfter ? "dd/MM" : "HH:mm")}
                        {inicioReal && <span className="ml-1 font-normal opacity-75">● real</span>}
                      </div>
                      <div className="text-sm font-extrabold truncate">{t.patente || "—"}</div>
                      {t.reparadoresTexto && <ReparadoresBadges texto={t.reparadoresTexto} />}
                      {(t.marca || t.modelo) && (
                        <div className="text-[11px] opacity-80 truncate">{t.marca} {t.modelo}</div>
                      )}
                      {t.observaciones && (
                        <div className="text-[10px] italic opacity-75 truncate">{t.observaciones}</div>
                      )}
                      {continuesAfter && (
                        <div className="text-[10px] opacity-80 font-semibold mt-auto">
                          ↓ hasta {format(fin, "dd/MM")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );};

  // --- Week view ---
  const WeekView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="w-24 border border-gray-200 bg-gray-50 p-2" />
            {plazas.map((p) => (
              <th key={p.numero} className="border border-gray-200 bg-gray-50 p-2 font-semibold text-gray-600 min-w-[90px] text-center leading-tight">
                {p.piso?.nombre && <div className="text-[9px] font-normal text-gray-400">{p.piso.nombre}</div>}
                {p.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {semana.map((dia) => {
            const feriadoDia = getFeriadoNombre(dia, feriados);
            const inactivoDia = esDiaInactivo(dia);
            const noHabil = feriadoDia || inactivoDia;
            return (
            <tr key={dia.toISOString()} className={feriadoDia ? "bg-orange-50" : inactivoDia ? "bg-gray-100" : isSameDay(dia, new Date()) ? "bg-blue-50" : ""}>
              <td className="border border-gray-200 p-2 text-center font-medium whitespace-nowrap">
                <div className={noHabil ? "text-gray-400" : "text-gray-600"}>{format(dia, "EEE", { locale: es })}</div>
                <div className={`text-base font-bold ${noHabil ? "text-gray-400" : "text-gray-700"}`}>{format(dia, "d")}</div>
                {feriadoDia && (
                  <div className="text-[9px] text-orange-600 font-semibold mt-0.5 leading-tight max-w-[72px] mx-auto">{feriadoDia}</div>
                )}
                {inactivoDia && !feriadoDia && (
                  <div className="text-[9px] text-gray-400 font-medium mt-0.5">No hábil</div>
                )}
              </td>
              {plazas.map((p) => {
                const pills = turnosDelDia(dia, p.numero);
                return (
                  <td key={p.numero} className={`border border-gray-200 p-1.5 align-top min-h-[70px] ${noHabil ? "bg-gray-100/60" : ""}`}>
                    <div className="flex flex-col gap-2">
                      {!noHabil && pills.map((t) => {
                        const inicioT = toLocalDate(t.fechaHoraInicioEstimada);
                        const finT = toLocalDate(t.fechaHoraFinEstimada);
                        const inicioReal = toLocalDate(t.fechaHoraInicioReal);
                        const finReal = toLocalDate(t.fechaHoraFinReal);
                        const inicioShow = inicioReal ?? inicioT;
                        const finShow = finReal ?? finT;
                        const esInicio = inicioT ? isSameDay(dia, inicioT) : false;
                        const esFin = finT ? isSameDay(dia, finT) : false;
                        const diasDuracion = inicioT && finT
                          ? Math.ceil((finT.getTime() - inicioT.getTime()) / (1000 * 60 * 60 * 24))
                          : null;
                        return (
                          <div key={t.id} className={`rounded-md px-2 py-1.5 shadow-sm ${pillStyle(t)} cursor-pointer`}
                            onMouseEnter={(e) => showTooltip(t, e)}
                            onMouseLeave={hideTooltip}
                            onClick={() => handleTurnoClick(t)}>
                            <div className="flex flex-col gap-1 leading-tight">
                              {/* Hora inicio → fin */}
                              <div className="flex items-center justify-between gap-1">
                                <div className="text-[11px] font-bold whitespace-nowrap">
                                  {esInicio && inicioShow ? format(inicioShow, "HH:mm") : "↑"}
                                  {" → "}
                                  {esFin && finShow ? format(finShow, "HH:mm") : "↓"}
                                  {inicioReal && <span className="ml-1 font-normal opacity-75">●</span>}
                                </div>
                                {diasDuracion && diasDuracion > 1 && (
                                  <span className="text-[9px] opacity-75 font-semibold">{diasDuracion}d</span>
                                )}
                              </div>
                              {/* Patente */}
                              <div className="text-sm font-extrabold tracking-wide">{t.patente || "—"}</div>
                              {/* Marca modelo año color */}
                              {(t.marca || t.modelo || t.anio || t.color) && (
                                <div className="text-[10px] opacity-90 leading-tight">
                                  {[t.marca, t.modelo, t.anio, t.color].filter(Boolean).join(" · ")}
                                </div>
                              )}
                              {/* Reparadores */}
                              {t.reparadoresTexto && <ReparadoresBadges texto={t.reparadoresTexto} mini />}
                              {/* Monto y estado presupuesto */}
                              {(t.monto || t.presupuestoEstado) && (
                                <div className="flex items-center gap-1.5 text-[10px] opacity-90 font-medium">
                                  {t.monto && <span>${Number(t.monto).toLocaleString("es-AR")}</span>}
                                  {t.presupuestoEstado && (
                                    <span className="opacity-70">· {t.presupuestoEstado}</span>
                                  )}
                                </div>
                              )}
                              {/* Rango de fechas si es multi-día y es el inicio */}
                              {esInicio && inicioT && finT && !isSameDay(inicioT, finT) && (
                                <div className="text-[9px] opacity-70 border-t border-white/20 pt-0.5 mt-0.5">
                                  {format(inicioT, "dd/MM")} → {format(finT, "dd/MM")}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // --- Month view ---
  const MonthView = () => {
    const mesInicio = startOfMonth(currentDate);
    const mesFin = endOfMonth(currentDate);
    const dias = eachDayOfInterval({ start: mesInicio, end: mesFin });
    const offsetInicio = (mesInicio.getDay() + 6) % 7;
    const semanas = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    // Muestra el turno en cada día que abarca (multi-día)
    const turnosDelDiaTodos = (date: Date) =>
      turnos.filter((t) => turnoEnDia(t, date));

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
            const feriadoMes = getFeriadoNombre(dia, feriados);
            const inactivoMes = esDiaInactivo(dia);
            return (
              <div key={dia.toISOString()}
                className={`border-r border-b border-gray-200 min-h-[90px] p-1 ${!esMes ? "opacity-40 bg-gray-50" : feriadoMes ? "bg-orange-50" : inactivoMes ? "bg-gray-100" : "bg-white"}`}>
                <div className={`text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  hoy ? "bg-blue-600 text-white" : "text-gray-600"}`}>
                  {format(dia, "d")}
                </div>
                <div className="flex flex-col gap-0.5">
                  {feriadoMes && (
                    <div className="rounded px-1 py-0.5 text-[9px] font-semibold truncate bg-orange-200 text-orange-800 border border-orange-300">
                      🗓 {feriadoMes}
                    </div>
                  )}
                  {inactivoMes && !feriadoMes && (
                    <div className="text-[9px] text-gray-400 font-medium px-1">No hábil</div>
                  )}
                  {visibles.map((t) => {
                    const inicioT = toLocalDate(t.fechaHoraInicioEstimada);
                    const esInicio = inicioT ? isSameDay(dia, inicioT) : false;
                    return (
                      <div key={t.id}
                        className={`rounded px-1 py-0.5 text-[10px] truncate border cursor-pointer ${pillStyle(t)}`}
                        onMouseEnter={(e) => showTooltip(t, e)}
                        onMouseLeave={hideTooltip}
                        onClick={() => handleTurnoClick(t)}>
                        {!esInicio && <span className="mr-0.5 opacity-60">↑</span>}
                        {t.patente || "—"} {plazas.find((p) => p.numero === t.plaza)?.nombre ?? `P${t.plaza}`}
                        {t.fechaHoraInicioReal && <span className="ml-0.5 text-green-300">●</span>}
                      </div>
                    );
                  })}
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
    // Marcar todos los días que abarca cada turno (multi-día)
    const diasConTurnos = new Set<string>();
    turnos.forEach((t) => {
      const inicio = toLocalDate(t.fechaHoraInicioEstimada);
      const fin = toLocalDate(t.fechaHoraFinEstimada);
      if (!inicio) return;
      eachDayOfInterval({ start: startOfDay(inicio), end: startOfDay(fin ?? inicio) })
        .forEach((d) => diasConTurnos.add(format(d, "yyyy-MM-dd")));
    });
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
                    const esFeriadoAnio = !!getFeriadoNombre(dia, feriados);
                    const esInactivoAnio = esDiaInactivo(dia);
                    const noHabilAnio = esFeriadoAnio || esInactivoAnio;
                    return (
                      <button key={key}
                        onClick={() => { setCurrentDate(dia); setView("day"); }}
                        title={esFeriadoAnio ? (getFeriadoNombre(dia, feriados) ?? undefined) : esInactivoAnio ? "No hábil" : undefined}
                        className={`relative flex items-center justify-center text-[10px] h-5 w-full rounded transition-colors
                          ${hoy ? "bg-blue-600 text-white font-bold" : esFeriadoAnio ? "bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200" : esInactivoAnio ? "text-gray-300 bg-gray-50" : tiene ? "font-semibold text-gray-800 hover:bg-gray-100" : "text-gray-400 hover:bg-gray-50"}`}>
                        {format(dia, "d")}
                        {tiene && !hoy && !noHabilAnio && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />}
                        {esFeriadoAnio && !hoy && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />}
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
              {view === "day" || view === "week" ? "Hoy" : view === "month" ? format(new Date(), "MMM", { locale: es }) : format(new Date(), "yyyy")}
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
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-500 inline-block" /> En curso / Ingresado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Finalizado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Cancelado</span>
        <span className="flex items-center gap-1 text-green-600">● Tiene ingreso real registrado</span>
        <span className="flex items-center gap-1 text-orange-600"><span className="w-3 h-3 rounded bg-orange-200 inline-block" /> Feriado</span>
      </div>

      {/* Cuerpo */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Cargando turnos...</div>
        ) : view === "day" ? <DayView /> : view === "week" ? <WeekView /> : view === "month" ? <MonthView /> : <YearView />}
      </div>

      {/* Tooltip fijo — no se corta, scrolleable */}
      {tooltipTurno && tooltipPos && (
        <div
          className="fixed z-[9999] pointer-events-auto"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          onMouseEnter={cancelHide}
          onMouseLeave={hideTooltip}
        >
          {tooltipContent(tooltipTurno)}
        </div>
      )}
    </div>
  );
}
