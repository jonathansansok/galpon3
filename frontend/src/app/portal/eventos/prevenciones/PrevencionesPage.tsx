"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getPrevenciones } from "./Prevenciones.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarPrevenciones } from "@/components/ui/SearchBars/SearchBarPrevenciones";
import { Prevencion } from "@/types/Prevencion";
import { PrevencionSearchResult } from "@/types/SearchResult";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";

export const dynamic = "force-dynamic";

export default function PrevencionesPage() {
  const [prevenciones, setPrevenciones] = useState<Prevencion[]>([]);
  const [searchResults, setSearchResults] = useState<PrevencionSearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Prevencion | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getPrevenciones();
      const formattedData = Array.isArray(data) ? data : [];
      setPrevenciones(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener prevenciones:", error);
      setPrevenciones([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: PrevencionSearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/prevenciones/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/prevenciones/${id}/edit`);
  };

  const handleSort = (column: keyof Prevencion): void => {
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
      render: (item: Prevencion) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Prevencion) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Prevencion) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "sector", label: "Sector" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención de Requisa" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "juzgados", label: "Juzgados" },
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
      <h1 className="text-4xl font-bold mb-4">Evento: Prevenciones</h1>
      <Link
        href="/portal/eventos/prevenciones/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Prevención
      </Link>
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Prevencion>
        data={searchResults.map((result) => result.item)}
        fileName="Prevenciones"
      />

      <SearchBarPrevenciones data={prevenciones} onSearchResults={handleSearchResults} />

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