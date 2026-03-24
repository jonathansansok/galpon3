"use client";
// frontend/src/app/portal/eventos/tabs/tabs/TabRealizados.tsx
import { useState, useEffect, useRef } from "react";
import { getTurnosWithPresupuestoData } from "../../turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { exportTurnoPDF, exportTurnoExcel, exportTurnoWord } from "@/utils/exportTurno";

const estadoColor: Record<string, string> = {
  Programado: "bg-blue-100 text-blue-700 border-blue-200",
  "En curso": "bg-violet-100 text-violet-700 border-violet-200",
  Finalizado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelado: "bg-red-100 text-red-700 border-red-200",
};

const ESTADOS = ["", "Programado", "En curso", "Finalizado", "Cancelado"];

function formatFecha(val: string | null | undefined) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return val as string; }
}

function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value || "—"}</span>
    </div>
  );
}

function SectionCard({
  color, title, icon, children,
}: {
  color: string; title: string; icon: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${color}`}>
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-current border-opacity-20">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  );
}

function ExportButtons({ turno }: { turno: Turno }) {
  const [loading, setLoading] = useState<"pdf" | "xlsx" | "docx" | null>(null);

  const handle = (type: "pdf" | "xlsx" | "docx") => async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(type);
    try {
      if (type === "pdf") await exportTurnoPDF(turno);
      else if (type === "xlsx") await exportTurnoExcel(turno);
      else await exportTurnoWord(turno);
    } finally {
      setLoading(null);
    }
  };

  const btn = (type: "pdf" | "xlsx" | "docx", label: string, color: string) => (
    <button
      onClick={handle(type)}
      disabled={loading !== null}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50 ${color}`}
    >
      {loading === type ? "..." : label}
    </button>
  );

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-200">
      <span className="text-xs text-gray-500 font-medium mr-1">Descargar:</span>
      {btn("pdf", "⬇ PDF", "bg-red-100 text-red-700 hover:bg-red-200")}
      {btn("xlsx", "⬇ Excel", "bg-emerald-100 text-emerald-700 hover:bg-emerald-200")}
      {btn("docx", "⬇ Word", "bg-blue-100 text-blue-700 hover:bg-blue-200")}
    </div>
  );
}

function ExpandedRow({ turno }: { turno: Turno }) {
  const t = turno as any;
  return (
    <div className="p-4 bg-amber-50 border-t border-amber-200">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

        {/* Cliente */}
        <SectionCard color="border-blue-200 bg-blue-50 text-blue-800" title="Cliente" icon="👤">
          <InfoField label="Apellido" value={t.clienteApellido} />
          <InfoField label="Nombres" value={t.clienteNombres} />
          <InfoField label="Teléfono" value={t.clienteTelefono} />
          {t.clienteId && (
            <div className="col-span-2">
              <Link
                href={`/portal/eventos/ingresos/${t.clienteId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Ver ficha del cliente ↗
              </Link>
            </div>
          )}
        </SectionCard>

        {/* Móvil */}
        <SectionCard color="border-green-200 bg-green-50 text-green-800" title="Móvil" icon="🚗">
          <InfoField label="Patente" value={t.patente} />
          <InfoField label="Marca" value={t.marca} />
          <InfoField label="Modelo" value={t.modelo} />
          <InfoField label="Año" value={t.anio} />
          <InfoField label="Color" value={t.color} />
        </SectionCard>

        {/* Presupuesto */}
        <SectionCard color="border-teal-200 bg-teal-50 text-teal-800" title="Presupuesto" icon="📋">
          <InfoField label="N°" value={t.presupuestoNumId ? `#${t.presupuestoNumId}` : undefined} />
          <InfoField label="Monto" value={t.monto ? `$${t.monto}` : undefined} />
          <InfoField label="Estado" value={t.presupuestoEstado} />
          <div className="col-span-2">
            <InfoField label="Observaciones" value={t.presupuestoObservaciones} />
          </div>
          {t.presupuestoNumId && (
            <div className="col-span-2">
              <Link
                href={`/portal/eventos/presupuestos/${t.presupuestoNumId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
              >
                Ver presupuesto ↗
              </Link>
            </div>
          )}
        </SectionCard>

        {/* Turno */}
        <SectionCard color="border-violet-200 bg-violet-50 text-violet-800" title="Turno" icon="📅">
          <InfoField label="Plaza" value={`Plaza ${turno.plaza}`} />
          <InfoField label="Estado" value={turno.estado} />
          <InfoField label="Inicio estimado" value={formatFecha(turno.fechaHoraInicioEstimada)} />
          <InfoField label="Fin estimado" value={formatFecha(turno.fechaHoraFinEstimada)} />
          <div className="col-span-2">
            <InfoField label="Observaciones" value={turno.observaciones} />
          </div>
          <div className="col-span-2">
            <Link
              href={`/portal/eventos/turnos/${turno.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
            >
              Ver turno ↗
            </Link>
          </div>
        </SectionCard>

        {/* Ingresos */}
        <SectionCard color="border-indigo-200 bg-indigo-50 text-indigo-800" title="Ingresos al Taller" icon="🔧">
          <InfoField label="Ingreso real" value={formatFecha(t.fechaHoraInicioReal)} />
          <InfoField label="Egreso real" value={formatFecha(t.fechaHoraFinReal)} />
          <div className="col-span-2">
            <InfoField label="Reparadores" value={t.reparadoresTexto?.replace(/\|/g, "·")} />
          </div>
        </SectionCard>

      </div>
      <ExportButtons turno={turno} />
    </div>
  );
}

export default function TabRealizados() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const [query, setQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  useEffect(() => { handleLoadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    if (expandedId !== null)
      rowRefs.current.get(expandedId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expandedId]);

  const handleRowClick = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filtered = turnos.filter((t) => {
    const matchEstado = filterEstado ? t.estado === filterEstado : true;
    const matchQuery =
      query.length < 2
        ? true
        : [t.patente, (t as any).marca, (t as any).modelo, (t as any).reparadoresTexto, String(t.plaza)]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());
    return matchEstado && matchQuery;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trabajos Realizados</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Historial completo de todos los turnos y sus reparaciones.
          </p>
        </div>
        <button
          onClick={handleLoadData}
          disabled={loading}
          className={buttonVariants({ variant: "outline" })}
        >
          {loading ? "Cargando..." : "↻ Recargar"}
        </button>
      </div>

      {/* Controles de filtro */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Buscar patente, marca, reparador..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e || "Todos los estados"}</option>
          ))}
        </select>
        {filtered.length !== turnos.length && (
          <span className="self-center text-xs text-gray-400">
            {filtered.length} de {turnos.length} resultados
          </span>
        )}
        {turnos.length > 0 && filtered.length === turnos.length && (
          <span className="self-center text-xs text-gray-400">{turnos.length} turno{turnos.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm py-6 text-center">
          {loading ? "Cargando..." : turnos.length === 0 ? "No hay turnos registrados." : "No hay resultados para ese filtro."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-3 py-3 w-10" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Patente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Vehículo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Plaza</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Inicio estimado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Ingreso real</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Egreso real</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Reparadores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((turno) => {
                const t = turno as any;
                const isExpanded = expandedId === turno.id;
                return (
                  <>
                    <tr
                      key={turno.id}
                      ref={(el) => { if (el) rowRefs.current.set(turno.id, el); else rowRefs.current.delete(turno.id); }}
                      onClick={() => handleRowClick(turno.id)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? "bg-amber-50" : "hover:bg-gray-50/70"
                      }`}
                    >
                      <td className="px-3 py-2.5 w-10">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-gray-400 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoColor[turno.estado] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {turno.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{t.patente || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {[t.marca, t.modelo].filter(Boolean).join(" ") || "—"}
                        {t.anio && <span className="text-gray-400 text-xs ml-1">({t.anio})</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                          P{turno.plaza}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatFecha(turno.fechaHoraInicioEstimada)}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        {t.fechaHoraInicioReal
                          ? <span className="text-emerald-600 font-medium">{formatFecha(t.fechaHoraInicioReal)}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        {t.fechaHoraFinReal
                          ? <span className="text-emerald-600 font-medium">{formatFecha(t.fechaHoraFinReal)}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">
                        {t.reparadoresTexto?.replace(/\|/g, "·") || <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${turno.id}-expanded`}>
                        <td colSpan={9} className="p-0">
                          <ExpandedRow turno={turno} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
