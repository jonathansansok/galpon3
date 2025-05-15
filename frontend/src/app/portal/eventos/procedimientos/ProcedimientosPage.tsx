"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getProcedimientos } from "./Procedimientos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarProcedimientos } from "@/components/ui/SearchBars/SearchBarProcedimientos";
import { Procedimiento } from "@/types/Procedimiento";
import { ProcedimientoSearchResult } from "@/types/SearchResult";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";

export const dynamic = "force-dynamic";

export default function ProcedimientosPage() {
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([]);
  const [searchResults, setSearchResults] = useState<ProcedimientoSearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Procedimiento | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getProcedimientos();
      const formattedData = Array.isArray(data) ? data : [];
      setProcedimientos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener procedimientos:", error);
      setProcedimientos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: ProcedimientoSearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/procedimientos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/procedimientos/${id}/edit`);
  };

  const handleSort = (column: keyof Procedimiento): void => {
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
      render: (item: Procedimiento) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Procedimiento) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "sector", label: "Sector" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Procedimiento) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "expediente", label: "Expediente" },
    { key: "tipo_procedimiento", label: "Tipo de Procedimiento" },
    { key: "por_orden_de", label: "Por Orden de" },
    { key: "medidas", label: "Medidas" },
    { key: "interv_requisa", label: "Intervención de Requisa" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: any) => <DateTimeFormatter dateTime={item.createdAt} />, // Usar el componente para formatear
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: any) => <DateTimeFormatter dateTime={item.updatedAt} />, // Usar el componente para formatear
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Evento: Procedimientos de registro</h1>
      <Link
        href="/portal/eventos/procedimientos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Procedimiento de reg.
      </Link>
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

 

      <SearchBarProcedimientos data={procedimientos} onSearchResults={handleSearchResults} />

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