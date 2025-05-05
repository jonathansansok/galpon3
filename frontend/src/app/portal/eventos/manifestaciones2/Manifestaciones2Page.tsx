"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getManifestaciones2 } from "./manifestaciones2.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarManifestaciones2 } from "@/components/ui/SearchBars/SearchBarManifestaciones2";
import { Manifestacion2, SearchResult } from "@/types/Manifestacion2";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";

import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import {
  formatInternosInvolucrados,
  formatPersonalInvolucrado,
} from "@/app/utils/formatUtils";

export const dynamic = "force-dynamic";

export default function Manifestaciones2Page() {
  const [manifestaciones2, setManifestaciones] = useState<Manifestacion2[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Manifestacion2 | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getManifestaciones2();
      const formattedData = Array.isArray(data) ? data : [];
      setManifestaciones(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener manifestaciones2:", error);
      setManifestaciones([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/manifestaciones2/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/manifestaciones2/${id}/edit`);
  };

  const handleSort = (column: keyof Manifestacion2): void => {
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
      render: (item: Manifestacion2) => (
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
      render: (item: Manifestacion2) => (
        <div
          dangerouslySetInnerHTML={{
            __html: formatPersonalInvolucrado(item.personalinvolucrado || ""),
          }}
        />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Manifestacion2) => (
        <DateTimeFormatter dateTime={item.fechaHora} />
      ), // Usar el nuevo componente
    },
    { key: "sector", label: "Sector" },
    { key: "expediente", label: "Expediente" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención de Requisa" },
    { key: "observacion", label: "Observaciones" },
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
      <h1 className="text-4xl font-bold mb-4">Alteración al orden en sec. común</h1>

      <Link
        href="/portal/eventos/manifestaciones2/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Alteración al orden en sec. común
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Manifestacion2>
        data={searchResults.map((result) => result.item)}
        fileName="Manifestaciones2"
      />

      <SearchBarManifestaciones2
        data={manifestaciones2}
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
