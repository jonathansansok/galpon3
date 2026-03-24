"use client";
// frontend/src/components/ui/TurnoDatePicker.tsx
import { useState, useEffect, useRef } from "react";
import {
  format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval,
  addMonths, subMonths, isSameDay, isSameMonth, startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { HorarioDiaConfig, FeriadoConfig, getFeriadoNombre } from "@/utils/businessHours";

interface TurnoDatePickerProps {
  value: string;                 // ISO datetime string o ""
  onChange: (iso: string) => void;
  horario: HorarioDiaConfig[];   // 7 elementos, índice = Date.getDay()
  feriados: FeriadoConfig[];
  label: string;
  required?: boolean;
  minDate?: Date;
  allowPast?: boolean;           // true = permite seleccionar fechas pasadas
}

const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function parseTime(timeStr: string): { h: number; m: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { h, m };
}

function combineDateAndTime(date: Date, time: string): Date {
  const { h, m } = parseTime(time);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function isEnCorte(time: string, cfg: HorarioDiaConfig): boolean {
  if (!cfg.tieneAlmuerzo || !cfg.inicioAlmuerzo || !cfg.finAlmuerzo) return false;
  return time >= cfg.inicioAlmuerzo && time < cfg.finAlmuerzo;
}

export default function TurnoDatePicker({
  value, onChange, horario, feriados, label, required, minDate, allowPast,
}: TurnoDatePickerProps) {
  const today = startOfDay(new Date());
  const efectivoMin = allowPast ? startOfDay(new Date(2000, 0, 1)) : (minDate ? startOfDay(minDate) : today);

  // Parsear value inicial
  const parsedValue = value ? parseISO(value) : null;
  const initialDate = parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : null;

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(initialDate ?? new Date());
  const [pickedDate, setPickedDate] = useState<Date | null>(initialDate ? startOfDay(initialDate) : null);
  const [pickedTime, setPickedTime] = useState<string>(
    initialDate ? format(initialDate, "HH:mm") : ""
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar cuando value cambia externamente (ej: duración autocompleta fin)
  useEffect(() => {
    if (!value) { setPickedDate(null); setPickedTime(""); return; }
    const d = parseISO(value);
    if (isNaN(d.getTime())) return;
    const newDate = startOfDay(d);
    const newTime = format(d, "HH:mm");
    setPickedDate(newDate);
    setPickedTime(newTime);
    setViewMonth(newDate);
  }, [value]);

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cfgDia = pickedDate ? horario[pickedDate.getDay()] : null;
  const horaMin = cfgDia?.horaEntrada ?? "08:00";
  const horaMax = cfgDia?.horaSalida ?? "17:00";
  const enCorte = pickedDate && pickedTime && cfgDia ? isEnCorte(pickedTime, cfgDia) : false;

  // ---- Helpers de estado de día ----
  function esDiaNoHabil(dia: Date): boolean {
    const cfg = horario[dia.getDay()];
    return !cfg?.activo;
  }
  function esPasado(dia: Date): boolean {
    return startOfDay(dia) < efectivoMin;
  }

  function getDiaClasses(dia: Date): { cell: string; clickable: boolean; feriadoNombre: string | null } {
    const seleccionado = pickedDate && isSameDay(dia, pickedDate);
    const esHoy = isSameDay(dia, new Date());
    const feriado = getFeriadoNombre(dia, feriados);
    const pasado = esPasado(dia);
    const noHabil = esDiaNoHabil(dia);

    if (seleccionado) {
      return { cell: "bg-blue-600 text-white font-bold rounded-full", clickable: true, feriadoNombre: feriado };
    }
    if (pasado) {
      return { cell: "text-gray-300 cursor-not-allowed", clickable: false, feriadoNombre: null };
    }
    if (feriado) {
      return { cell: "bg-orange-100 text-orange-600 rounded cursor-not-allowed", clickable: false, feriadoNombre: feriado };
    }
    if (noHabil) {
      return { cell: "text-gray-300 cursor-not-allowed", clickable: false, feriadoNombre: null };
    }
    const ring = esHoy ? "ring-2 ring-blue-400 rounded-full" : "";
    return { cell: `hover:bg-blue-50 text-gray-700 rounded-full cursor-pointer ${ring}`, clickable: true, feriadoNombre: null };
  }

  function handleDayClick(dia: Date) {
    const { clickable } = getDiaClasses(dia);
    if (!clickable) return;
    setPickedDate(startOfDay(dia));
    // Auto-setear hora de entrada como default
    const cfg = horario[dia.getDay()];
    const defaultTime = cfg?.horaEntrada ?? "08:00";
    setPickedTime(defaultTime);
    onChange(combineDateAndTime(dia, defaultTime).toISOString());
  }

  function handleTimeChange(time: string) {
    setPickedTime(time);
    if (pickedDate && time) {
      onChange(combineDateAndTime(pickedDate, time).toISOString());
    }
  }

  // ---- Render del grid del mes ----
  const mesInicio = startOfMonth(viewMonth);
  const mesFin = endOfMonth(viewMonth);
  const diasDelMes = eachDayOfInterval({ start: mesInicio, end: mesFin });
  // offset: lunes=0
  const offsetInicio = (mesInicio.getDay() + 6) % 7;

  // ---- Texto del trigger ----
  const feriadoDelValor = parsedValue ? getFeriadoNombre(parsedValue, feriados) : null;
  const noHabilDelValor = parsedValue ? esDiaNoHabil(parsedValue) : false;

  const triggerText = parsedValue && !isNaN(parsedValue.getTime())
    ? format(parsedValue, "EEE dd/MM/yyyy HH:mm", { locale: es })
    : null;

  return (
    <div className="relative mb-4" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-3 py-3 text-sm rounded-lg border transition-colors text-left
          ${open ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300 hover:border-gray-400"}
          ${!triggerText ? "text-gray-400" : "text-gray-900"}
          ${feriadoDelValor ? "border-orange-400 bg-orange-50" : ""}
          ${noHabilDelValor && !feriadoDelValor ? "border-yellow-400 bg-yellow-50" : ""}`}
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          {feriadoDelValor && <FaExclamationTriangle className="text-orange-500 shrink-0 text-xs" />}
          {noHabilDelValor && !feriadoDelValor && <FaExclamationTriangle className="text-yellow-500 shrink-0 text-xs" />}
          <span className="truncate">
            {triggerText ?? label}
          </span>
          {feriadoDelValor && (
            <span className="text-xs text-orange-600 shrink-0">— {feriadoDelValor}</span>
          )}
        </span>
        <FaCalendarAlt className="text-gray-400 shrink-0 ml-2 text-xs" />
      </button>
      <span className="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-500">
        {label}{required && " *"}
      </span>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 overflow-hidden">

          {/* Header mes */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <button type="button" onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
              <FaChevronLeft className="text-xs" />
            </button>
            <span className="text-sm font-semibold text-gray-800 capitalize">
              {format(viewMonth, "MMMM yyyy", { locale: es })}
            </span>
            <button type="button" onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
              <FaChevronRight className="text-xs" />
            </button>
          </div>

          <div className="p-3">
            {/* Cabecera días */}
            <div className="grid grid-cols-7 mb-1">
              {DIAS_SEMANA.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Grid días */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: offsetInicio }).map((_, i) => <div key={`p${i}`} />)}
              {diasDelMes.map((dia) => {
                const { cell, clickable, feriadoNombre } = getDiaClasses(dia);
                const inMonth = isSameMonth(dia, viewMonth);
                return (
                  <div key={dia.toISOString()} className="relative flex items-center justify-center">
                    <button
                      type="button"
                      title={feriadoNombre ?? undefined}
                      disabled={!clickable}
                      onClick={() => handleDayClick(dia)}
                      className={`w-8 h-8 text-xs flex flex-col items-center justify-center transition-colors
                        ${cell} ${!inMonth ? "opacity-30" : ""}`}
                    >
                      <span>{format(dia, "d")}</span>
                      {feriadoNombre && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Feriado</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block" /> No hábil</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Seleccionado</span>
            </div>
          </div>

          {/* Time picker — aparece cuando hay fecha seleccionada */}
          {pickedDate && cfgDia?.activo && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-gray-400 text-xs" />
                <span className="text-xs text-gray-600 font-medium">
                  Horario: {cfgDia.horaEntrada} – {cfgDia.horaSalida}
                  {cfgDia.tieneAlmuerzo && ` (corte ${cfgDia.inicioAlmuerzo}–${cfgDia.finAlmuerzo})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={pickedTime}
                  min={horaMin}
                  max={horaMax}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button type="button"
                  onClick={() => handleTimeChange(horaMin)}
                  className="text-xs text-blue-600 hover:underline whitespace-nowrap">
                  Apertura
                </button>
              </div>
              {enCorte && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                  <FaExclamationTriangle className="shrink-0" />
                  Hora dentro del corte del mediodía ({cfgDia.inicioAlmuerzo}–{cfgDia.finAlmuerzo})
                </div>
              )}
              {pickedTime && (pickedTime < horaMin || pickedTime > horaMax) && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
                  <FaExclamationTriangle className="shrink-0" />
                  Hora fuera del horario laboral ({horaMin}–{horaMax})
                </div>
              )}
              <button type="button" onClick={() => setOpen(false)}
                className="mt-3 w-full py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Confirmar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
