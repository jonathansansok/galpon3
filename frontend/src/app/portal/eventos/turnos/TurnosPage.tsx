//frontend\src\app\portal\eventos\turnos\TurnosPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTurnosWithPresupuestoData, getPlazaAvailability } from "./Turnos.api";
import { Turno, TurnoSearchResult } from "@/types/Turno";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";

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

  // Disponibilidad
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [availability, setAvailability] = useState<Record<number, any[]> | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const handleLoadData = async () => {
    try {
      console.log("[turnos] Cargando historial...");
      const data = await getTurnosWithPresupuestoData();
      setTurnos(data);
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

  const handleSearch = (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults(turnos.map((item) => ({ item, matches: [] })));
      setSearchTerms([]);
      return;
    }
    setSearchTerms([query]);
    const filtered = turnos.filter((turno) =>
      Object.values(turno).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setSearchResults(filtered.map((item) => ({ item, matches: [] })));
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

      <div className="flex gap-3 mb-5 flex-wrap">
        <Link
          href="/portal/eventos/turnos/new"
          className={buttonVariants()}
        >
          Agregar Turno
        </Link>

        <button
          onClick={handleLoadData}
          className={buttonVariants({ variant: "outline" })}
        >
          Cargar historial
        </button>
      </div>

      {/* Panel de disponibilidad de plazas */}
      <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Disponibilidad de Plazas</h2>
        <div className="flex gap-4 items-end mb-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha/Hora Inicio</label>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha/Hora Fin</label>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border rounded px-3 py-2"
            />
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

      {/* Buscador simple */}
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Buscar turnos (mín. 3 caracteres)..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md"
        />
      </div>

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
        <p>No hay datos disponibles. Presione &quot;Cargar historial&quot; para ver los turnos.</p>
      )}
    </div>
  );
}
