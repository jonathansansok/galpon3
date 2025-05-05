"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTraslados } from "./Traslados.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Traslado, SearchResult } from "@/types/Traslado";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarTraslados } from "@/components/ui/SearchBars/SearchBarTraslados";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";

export const dynamic = "force-dynamic";

export default function TrasladosPage() {
  const [traslados, setTraslados] = useState<Traslado[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Traslado | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getTraslados();
      const formattedData = Array.isArray(data) ? data : [];
      setTraslados(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener traslados:", error);
      setTraslados([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/traslados/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/traslados/${id}/edit`);
  };

  const handleSort = (column: keyof Traslado): void => {
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
      render: (item: Traslado) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Traslado) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Traslado) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
     {
      key: "createdAt",
      label: "Creado el",
      render: (item: any) => <DateTimeFormatter dateTime={item.createdAt} />, 
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: any) => <DateTimeFormatter dateTime={item.updatedAt} />, 
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Evento: Traslados</h1>

      <Link
        href="/portal/eventos/traslados/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Traslado
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Traslado>
        data={searchResults.map((result) => result.item)}
        fileName="Traslados"
      />

      <SearchBarTraslados data={traslados} onSearchResults={handleSearchResults} />

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
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}