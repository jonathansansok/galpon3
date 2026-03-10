//frontend\src\app\portal\eventos\turnos\TurnosPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTurnosWithPresupuestoData, getPlazaAvailability } from "./Turnos.api";
import { Turno, TurnoSearchResult } from "@/types/Turno";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarTurnos } from "@/components/ui/SearchBars/SearchBarTurnos";

export const dynamic = "force-dynamic";

const TOTAL_PLAZAS = 8;

const estadoBadge = (estado: string) => {
  const colors: Record<string, string> = {
    Programado: "bg-blue-100 text-blue-800",
    "En curso": "bg-yellow-100 text-yellow-800",
    Finalizado: "bg-green-100 text-green-800",
    Cancelado: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[estado] || "bg-gray-100 text-gray-800"}`}>
      {estado}
    </span>
  );
};

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [searchResults, setSearchResults] = useState<TurnoSearchResult[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Turno | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const hasAutoLoadedRef = useRef(false);

  // Disponibilidad
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [availability, setAvailability] = useState<Record<number, any[]> | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Auto-cargar datos si hay filtros guardados en sessionStorage
  useEffect(() => {
    if (hasAutoLoadedRef.current) return;
    hasAutoLoadedRef.current = true;
    try {
      const saved = sessionStorage.getItem("searchBar_turnos");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasFilter = Object.values(parsed).some((v: unknown) => typeof v === "string" && (v as string).length >= 3);
        if (hasFilter) {
          handleLoadData();
        }
      }
    } catch (e) {
      // Ignorar errores
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = (data: Turno[], queries: {
    generalQuery: string;
    plaza: string;
    estado: string;
    patente: string;
    vehiculo: string;
    monto: string;
    observaciones: string;
  }) => {
    const filtered = data.filter((turno) => {
      const matchesGeneralQuery =
        queries.generalQuery &&
        Object.values(turno).some((value) =>
          String(value).toLowerCase().includes(queries.generalQuery.toLowerCase())
        );
      const matchesPlaza =
        queries.plaza &&
        String(turno.plaza || "").toLowerCase().includes(queries.plaza.toLowerCase());
      const matchesEstado =
        queries.estado &&
        turno.estado?.toLowerCase().includes(queries.estado.toLowerCase());
      const matchesPatente =
        queries.patente &&
        (turno.patente || "").toLowerCase().includes(queries.patente.toLowerCase());
      const matchesVehiculo =
        queries.vehiculo &&
        (turno.marca || "").toLowerCase().includes(queries.vehiculo.toLowerCase());
      const matchesMonto =
        queries.monto &&
        String(turno.monto || "").toLowerCase().includes(queries.monto.toLowerCase());
      const matchesObservaciones =
        queries.observaciones &&
        (turno.observaciones || "").toLowerCase().includes(queries.observaciones.toLowerCase());

      return (
        matchesGeneralQuery || matchesPlaza || matchesEstado ||
        matchesPatente || matchesVehiculo || matchesMonto || matchesObservaciones
      );
    });
    return filtered;
  };

  const handleLoadData = async () => {
    try {
      console.log("[turnos] Cargando historial...");
      const data = await getTurnosWithPresupuestoData();
      setTurnos(data);

      // Aplicar filtros guardados automáticamente después de cargar
      try {
        const saved = sessionStorage.getItem("searchBar_turnos");
        if (saved) {
          const parsed = JSON.parse(saved);
          const hasFilter = Object.values(parsed).some((v: unknown) => typeof v === "string" && (v as string).length >= 3);
          if (hasFilter) {
            setSearchTerms(Object.values(parsed).filter((v: unknown) => typeof v === "string" && (v as string).length > 0) as string[]);
            const filtered = applyFilters(data, parsed);
            setSearchResults(filtered.map((item) => ({ item, matches: [] })));
            return;
          }
        }
      } catch (e) { /* ignorar */ }

      setSearchResults(data.map((item: Turno) => ({ item, matches: [] })));
    } catch (error) {
      console.error("[turnos] Error al cargar datos:", error);
      setTurnos([]);
      setSearchResults([]);
    }
  };

  const handleCheckAvailability = async () => {
    if (!fechaInicio || !fechaFin) return;
    try {
      setLoadingAvailability(true);
      console.log("[turnos] Consultando disponibilidad...");
      const data = await getPlazaAvailability(fechaInicio, fechaFin);
      setAvailability(data);
    } catch (error) {
      console.error("[turnos] Error al consultar disponibilidad:", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleSearch = (queries: {
    generalQuery: string;
    plaza: string;
    estado: string;
    patente: string;
    vehiculo: string;
    monto: string;
    observaciones: string;
  }) => {
    setSearchTerms(Object.values(queries).filter((v) => v.length > 0));
    const filtered = applyFilters(turnos, queries);
    setSearchResults(
      filtered.map((item) => ({ item, matches: [] }))
    );
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/turnos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/turnos/${id}/edit`);
  };

  const handleSort = (column: keyof Turno): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatDateTimeLocal = (dt: string) => {
    if (!dt) return "—";
    try {
      return new Date(dt).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dt;
    }
  };

  const columns = [
    {
      key: "plaza",
      label: "Plaza",
      render: (item: Turno) => <span className="font-bold text-lg">#{item.plaza}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: Turno) => estadoBadge(item.estado),
    },
    { key: "patente", label: "Patente", render: (item: Turno) => item.patente || "N/A" },
    {
      key: "marca",
      label: "Vehículo",
      render: (item: Turno) =>
        item.marca ? `${item.marca} ${item.modelo || ""} ${item.anio || ""}` : "N/A",
    },
    {
      key: "fechaHoraInicioEstimada",
      label: "Inicio Estimado",
      render: (item: Turno) => formatDateTimeLocal(item.fechaHoraInicioEstimada),
    },
    {
      key: "fechaHoraFinEstimada",
      label: "Fin Estimado",
      render: (item: Turno) => formatDateTimeLocal(item.fechaHoraFinEstimada),
    },
    { key: "monto", label: "Monto", render: (item: Turno) => item.monto || "N/A" },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Turno) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Turnos del Taller</h1>

      <Link
        href="/portal/eventos/turnos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Turno
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Turno>
        data={searchResults.map((result) => result.item)}
        fileName="Turnos"
      />

      {/* Panel de disponibilidad de plazas */}
      <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Disponibilidad de Plazas</h2>
        <div className="flex gap-4 items-end mb-4 flex-wrap">
          <div className="relative">
            <input
              type="datetime-local"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="fechaInicio"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
            >
              Fecha/Hora Inicio
            </label>
          </div>
          <div className="relative">
            <input
              type="datetime-local"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="fechaFin"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
            >
              Fecha/Hora Fin
            </label>
          </div>
          <button
            onClick={handleCheckAvailability}
            disabled={!fechaInicio || !fechaFin || loadingAvailability}
            className={buttonVariants({ variant: "outline" })}
          >
            {loadingAvailability ? "Consultando..." : "Consultar disponibilidad"}
          </button>
        </div>

        {availability && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: TOTAL_PLAZAS }, (_, i) => i + 1).map((plaza) => {
              const turnosEnPlaza = availability[plaza] || [];
              const libre = turnosEnPlaza.length === 0;
              return (
                <div
                  key={plaza}
                  className={`rounded-lg p-4 border-2 ${
                    libre
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">Plaza #{plaza}</h3>
                  {libre ? (
                    <p className="text-green-700 font-semibold">Disponible</p>
                  ) : (
                    <div>
                      <p className="text-red-700 font-semibold mb-1">Ocupada</p>
                      {turnosEnPlaza.map((t: any, idx: number) => (
                        <div key={idx} className="text-sm text-gray-600 mb-1">
                          <p>{formatDateTimeLocal(t.fechaHoraInicioEstimada)} → {formatDateTimeLocal(t.fechaHoraFinEstimada)}</p>
                          <p className="text-xs">{t.estado}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SearchBarTurnos onSearch={handleSearch} />

      {searchResults.length > 0 ? (
        <TableMoviles
          data={searchResults.map((result) => result.item)}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onViewClick={handleRowClick}
          getEditUrl={(id) => `/portal/eventos/turnos/${id}/edit`}
          getViewUrl={(id) => `/portal/eventos/turnos/${id}`}
          searchTerms={searchTerms}
        />
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}
