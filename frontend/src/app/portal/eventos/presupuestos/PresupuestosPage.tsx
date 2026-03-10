//frontend\src\app\portal\eventos\presupuestos\PresupuestosPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPresupuestos, getMovilById, getPresupuestosWithMovilData } from "./Presupuestos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Presupuesto, SearchResult } from "@/types/Presupuesto";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarPresupuestos } from "@/components/ui/SearchBars/SearchBarPresupuestos";

export const dynamic = "force-dynamic";

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Presupuesto | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const hasAutoLoadedRef = useRef(false);

  // Auto-cargar datos si hay filtros guardados en sessionStorage
  useEffect(() => {
    if (hasAutoLoadedRef.current) return;
    hasAutoLoadedRef.current = true;
    try {
      const saved = sessionStorage.getItem("searchBar_presupuestos");
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

  const applyFilters = (data: Presupuesto[], queries: {
    generalQuery: string;
    monto: string;
    estado: string;
    observaciones: string;
    movilId: string;
    patente: string;
  }) => {
    const filtered = data.filter((presupuesto) => {
      const matchesGeneralQuery =
        queries.generalQuery &&
        Object.values(presupuesto).some((value) =>
          String(value).toLowerCase().includes(queries.generalQuery.toLowerCase())
        );
      const matchesMonto =
        queries.monto &&
        String(presupuesto.monto || "").toLowerCase().includes(queries.monto.toLowerCase());
      const matchesEstado =
        queries.estado &&
        presupuesto.estado?.toLowerCase().includes(queries.estado.toLowerCase());
      const matchesObservaciones =
        queries.observaciones &&
        presupuesto.observaciones?.toLowerCase().includes(queries.observaciones.toLowerCase());
      const matchesMovilId =
        queries.movilId &&
        String(presupuesto.movilId || "").toLowerCase().includes(queries.movilId.toLowerCase());
      const matchesPatente =
        queries.patente &&
        presupuesto.patente?.toLowerCase().includes(queries.patente.toLowerCase());

      return (
        matchesGeneralQuery || matchesMonto || matchesEstado ||
        matchesObservaciones || matchesMovilId || matchesPatente
      );
    });
    return filtered;
  };

  const handleLoadData = async () => {
    try {
      const presupuestos = await getPresupuestosWithMovilData();

      const presupuestosConMovil = await Promise.all(
        presupuestos.map(async (presupuesto: Presupuesto) => {
          if (presupuesto.movilId) {
            const movil = await getMovilById(presupuesto.movilId);
            return { ...movil, ...presupuesto };
          }
          return presupuesto;
        })
      );

      setPresupuestos(presupuestosConMovil);

      // Aplicar filtros guardados automáticamente después de cargar
      try {
        const saved = sessionStorage.getItem("searchBar_presupuestos");
        if (saved) {
          const parsed = JSON.parse(saved);
          const hasFilter = Object.values(parsed).some((v: unknown) => typeof v === "string" && (v as string).length >= 3);
          if (hasFilter) {
            setSearchTerms(Object.values(parsed).filter((v: unknown) => typeof v === "string" && (v as string).length > 0) as string[]);
            const filtered = applyFilters(presupuestosConMovil, parsed);
            setSearchResults(filtered.map((item) => ({ item, matches: [] })));
            return;
          }
        }
      } catch (e) { /* ignorar */ }

      setSearchResults(
        presupuestosConMovil.map((item) => ({ item, matches: [] }))
      );
    } catch (error) {
      console.error("Error al obtener presupuestos:", error);
      setPresupuestos([]);
      setSearchResults([]);
    }
  };

  const handleSearch = (queries: {
    generalQuery: string;
    monto: string;
    estado: string;
    observaciones: string;
    movilId: string;
    patente: string;
  }) => {
    setSearchTerms(Object.values(queries).filter((v) => v.length > 0));
    const filtered = applyFilters(presupuestos, queries);
    setSearchResults(
      filtered.map((item) => ({ item, matches: [] }))
    );
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/presupuestos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/presupuestos/${id}/edit`);
  };

  const handleSort = (column: keyof Presupuesto): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "monto", label: "Monto" },
    { key: "estado", label: "Estado" },
    { key: "observaciones", label: "Observaciones" },
    {
      key: "marca",
      label: "Marca del Móvil",
      render: (item: Presupuesto) => item.marca || "N/A", // Asegúrate de que "marca" esté en el objeto
    },
    {
      key: "modelo",
      label: "Modelo del Móvil",
      render: (item: Presupuesto) => item.modelo || "N/A",
    },
    {
      key: "anio",
      label: "Año del Móvil",
      render: (item: Presupuesto) => item.anio || "N/A",
    },
    {
      key: "movilId",
      label: "ID del Móvil",
      render: (item: Presupuesto) => item.movilId || "N/A",
    },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Presupuesto) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Presupuesto) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Presupuestos</h1>
      <Link
        href="/portal/eventos/presupuestos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Presupuesto-Trabajo
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Presupuesto>
        data={searchResults.map((result) => result.item)}
        fileName="Presupuestos"
      />

      <SearchBarPresupuestos onSearch={handleSearch} />

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
          getEditUrl={(id) => `/portal/eventos/presupuestos/${id}/edit`}
          getViewUrl={(id) => `/portal/eventos/presupuestos/${id}`}
          searchTerms={searchTerms}
          hasPDFs={(item) =>
            [
              item.pdf1,
              item.pdf2,
              item.pdf3,
              item.pdf4,
              item.pdf5,
              item.pdf6,
              item.pdf7,
              item.pdf8,
              item.pdf9,
              item.pdf10,
            ].some((pdf) => pdf && pdf.trim() !== "")
          }
        />
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}