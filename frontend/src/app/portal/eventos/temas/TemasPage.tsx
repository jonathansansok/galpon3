//frontend\src\app\portal\eventos\temas\TemasPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTemas } from "./Temas.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Tema, SearchResult } from "@/types/Tema";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarTemas } from "@/components/ui/SearchBars/SearchBarTemas";


export const dynamic = "force-dynamic";

export default function TemasPage() {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Tema | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getTemas();
      const formattedData = Array.isArray(data) ? data : [];
      setTemas(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener temas:", error);
      setTemas([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/temas/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/temas/${id}/edit`);
  };

  const handleSort = (column: keyof Tema): void => {
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
    { key: "observacion", label: "Observación" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Tema) => <DateTimeFormatter dateTime={item.fechaHora} />,
    },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Tema) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Tema) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Móviles</h1>
      <Link
        href="/portal/eventos/temas/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Móviles
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Tema>
        data={searchResults.map((result) => result.item)}
        fileName="Temas"
      />

      <SearchBarTemas data={temas} onSearchResults={handleSearchResults} />

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