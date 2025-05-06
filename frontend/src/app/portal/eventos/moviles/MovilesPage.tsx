"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getMoviles } from "./Moviles.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Movil, SearchResult } from "@/types/Movil";
import { useRouter } from "next/navigation";
import TableMovil from "@/components/eventossearch/TableMovil";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarMoviles } from "@/components/ui/SearchBars/SearchBarMoviles";
export const dynamic = "force-dynamic";

export default function MovilesPage() {
  const [moviles, setMoviles] = useState<Movil[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Movil | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getMoviles();
      const formattedData = Array.isArray(data) ? data : [];
      setMoviles(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener móviles:", error);
      setMoviles([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/moviles/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/moviles/${id}/edit`);
  };

  const handleSort = (column: keyof Movil): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "patente", label: "Patente" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "anio", label: "Año" },
    { key: "color", label: "Color" },
    { key: "tipoPintura", label: "Tipo de Pintura" },
    { key: "paisOrigen", label: "País de Origen" },
    { key: "tipoVehic", label: "Tipo de Vehículo" },
    { key: "motor", label: "Motor" },
    { key: "chasis", label: "Chasis" },
    { key: "combustion", label: "Combustión" },
    { key: "vin", label: "VIN" },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Movil) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Movil) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Gestión de Móviles</h1>
      <Link
        href="/portal/eventos/moviles/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Móvil
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Movil>
        data={searchResults.map((result) => result.item)}
        fileName="Moviles"
      />

      <SearchBarMoviles data={moviles} onSearchResults={handleSearchResults} />

      {searchResults.length > 0 ? (
        <TableMovil
          data={searchResults.map((result) => result.item)}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onViewClick={handleRowClick}
        />
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}