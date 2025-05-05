"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAtentados } from "./Atentados.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarAtentados } from "@/components/ui/SearchBars/SearchBarAtentados";
import { Atentado, SearchResult } from "@/types/Atentado";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";

export const dynamic = "force-dynamic";

export default function AtentadosPage() {
  const [atentados, setAtentados] = useState<Atentado[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Atentado | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getAtentados();
      const formattedData = Array.isArray(data) ? data : [];
      setAtentados(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener los atentados:", error);
      setAtentados([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/atentados/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/atentados/${id}/edit`);
  };

  const handleSort = (column: keyof Atentado): void => {
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
      render: (item: Atentado) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Atentado) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Atentado) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "acontecimiento", label: "Acontecimiento" },
    { key: "jurisdiccion", label: "Jurisdicción" },
    { key: "juzgados", label: "Juzgados" },
    { key: "prevencioSiNo", label: "Prevención" },
    { key: "fechaVenc", label: "Fecha Venc" },
    { key: "ordenCapDip", label: "Orden CapDip" },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observaciones" },
    { key: "otrosDatos", label: "Otros Datos" },
    { key: "fechaHoraVencTime", label: "Fecha Hora Venc" },
    { key: "fechaHoraUlOrCap", label: "Fecha Hora Últ. Cap" },
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
    { key: "email", label: "Email" },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Evento: Atentado a la seguridad</h1>

      <Link
        href="/portal/eventos/atentados/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Atentado a la seguridad
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Atentado> data={searchResults.map((result) => result.item)} fileName="Atentados" />

      <SearchBarAtentados data={atentados} onSearchResults={handleSearchResults} />

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