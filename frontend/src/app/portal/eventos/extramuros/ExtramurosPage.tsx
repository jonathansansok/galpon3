"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getExtramuros } from "./Extramuros.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarExtramuros } from "@/components/ui/SearchBars/SearchBarExtramuros";
import { Extramuro, SearchResult } from "@/types/Extramuro";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";


export const dynamic = "force-dynamic";

export default function ExtramurosPage() {
  const [extramuros, setExtramuros] = useState<Extramuro[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Extramuro | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getExtramuros();
      const formattedData = Array.isArray(data) ? data : [];
      setExtramuros(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener los extramuros:", error);
      setExtramuros([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/extramuros/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/extramuros/${id}/edit`);
  };

  const handleSort = (column: keyof Extramuro): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    {
      key: "internosinvolucrado",
      label: "Internos Involucrados",
      render: (item: Extramuro) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Extramuro) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Extramuro) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "fechaHoraReintegro", label: "Fecha y Hora Reintegro" },
    { key: "internacion", label: "Internación" },
    { key: "porOrden", label: "Por Orden" },
    { key: "observacion", label: "Observación" },
    { key: "sector_internacion", label: "Sector Internación" },
    { key: "piso", label: "Piso" },
    { key: "habitacion", label: "Habitación" },
    { key: "cama", label: "Cama" },
    { key: "motivo_reintegro", label: "Motivo Reintegro" },
    { key: "hospital", label: "Hospital" },
    { key: "motivo", label: "Motivo" },
    { key: "email", label: "Email" },
    { key: "expediente", label: "Expediente" },
    { key: "created_at", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Evento: Hospital extramuro</h1>

      <Link
        href="/portal/eventos/extramuros/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Hospital extramuro
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Extramuro>
        data={searchResults.map((result) => result.item)}
        fileName="Extramuros"
      />

      <SearchBarExtramuros data={extramuros} onSearchResults={handleSearchResults} />

      {searchResults.length > 0 ? (
        <Table
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
        <p> </p>
      )}
    </div>
  );
}