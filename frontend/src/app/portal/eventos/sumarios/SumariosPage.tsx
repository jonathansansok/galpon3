"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSumarios } from "./Sumarios.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Sumario, SearchResult } from "@/types/Sumario";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarSumarios } from "@/components/ui/SearchBars/SearchBarSumarios";
import {
  formatInternosInvolucrados,
  formatPersonalInvolucrado,
} from "@/app/utils/formatUtils";

export const dynamic = "force-dynamic";

export default function SumariosPage() {
  const [sumarios, setSumarios] = useState<Sumario[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Sumario | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getSumarios();
      const formattedData = Array.isArray(data) ? data : [];
      setSumarios(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener sumarios:", error);
      setSumarios([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/sumarios/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/sumarios/${id}/edit`);
  };

  const handleSort = (column: keyof Sumario): void => {
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
      render: (item: Sumario) => (
        <div
          dangerouslySetInnerHTML={{
            __html: formatInternosInvolucrados(item.internosinvolucrado || ""),
          }}
        />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Sumario) => (
        <div
          dangerouslySetInnerHTML={{
            __html: formatPersonalInvolucrado(item.personalinvolucrado || ""),
          }}
        />
      ),
    },
    { key: "evento", label: "Evento" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Sumario) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
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
      <h1 className="text-4xl font-bold mb-4">
        Evento: Sumarios - Info. sumaria
      </h1>
      <Link
        href="/portal/eventos/sumarios/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Sumario
      </Link>
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>


      <SearchBarSumarios
        data={sumarios}
        onSearchResults={handleSearchResults}
      />

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