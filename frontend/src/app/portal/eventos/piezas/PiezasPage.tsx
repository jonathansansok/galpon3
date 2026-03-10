//frontend\src\app\portal\eventos\piezas\PiezasPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPiezas } from "./Piezas.api";
import { Pieza, PiezaSearchResult } from "@/types/Pieza";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarPiezas } from "@/components/ui/SearchBars/SearchBarPiezas";

export const dynamic = "force-dynamic";

export default function PiezasPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [searchResults, setSearchResults] = useState<PiezaSearchResult[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Pieza | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const hasAutoLoadedRef = useRef(false);

  // Auto-cargar datos si hay filtros guardados en sessionStorage
  useEffect(() => {
    if (hasAutoLoadedRef.current) return;
    hasAutoLoadedRef.current = true;
    try {
      const saved = sessionStorage.getItem("searchBar_piezas");
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

  const applyFilters = (data: Pieza[], queries: {
    generalQuery: string;
    nombre: string;
    medida: string;
  }) => {
    const filtered = data.filter((pieza) => {
      const matchesGeneralQuery =
        queries.generalQuery &&
        Object.values(pieza).some((value) =>
          String(value).toLowerCase().includes(queries.generalQuery.toLowerCase())
        );
      const matchesNombre =
        queries.nombre &&
        (pieza.nombre || "").toLowerCase().includes(queries.nombre.toLowerCase());
      const matchesMedida =
        queries.medida &&
        (pieza.medida || "").toLowerCase().includes(queries.medida.toLowerCase());

      return matchesGeneralQuery || matchesNombre || matchesMedida;
    });
    return filtered;
  };

  const handleLoadData = async () => {
    try {
      console.log("[piezas] Cargando historial...");
      const data = await getPiezas();
      setPiezas(data);

      // Aplicar filtros guardados automáticamente después de cargar
      try {
        const saved = sessionStorage.getItem("searchBar_piezas");
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

      setSearchResults(data.map((item: Pieza) => ({ item, matches: [] })));
    } catch (error) {
      console.error("[piezas] Error al cargar datos:", error);
      setPiezas([]);
      setSearchResults([]);
    }
  };

  const handleSearch = (queries: {
    generalQuery: string;
    nombre: string;
    medida: string;
  }) => {
    setSearchTerms(Object.values(queries).filter((v) => v.length > 0));
    const filtered = applyFilters(piezas, queries);
    setSearchResults(
      filtered.map((item) => ({ item, matches: [] }))
    );
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/piezas/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/piezas/${id}/edit`);
  };

  const handleSort = (column: keyof Pieza): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "medida", label: "Medida", render: (item: Pieza) => item.medida || "N/A" },
    { key: "detalle", label: "Detalle", render: (item: Pieza) => item.detalle || "N/A" },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Pieza) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Pieza) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Piezas</h1>

      <Link
        href="/portal/eventos/piezas/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Pieza
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <SearchBarPiezas onSearch={handleSearch} />

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
          getEditUrl={(id) => `/portal/eventos/piezas/${id}/edit`}
          getViewUrl={(id) => `/portal/eventos/piezas/${id}`}
          searchTerms={searchTerms}
        />
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}
