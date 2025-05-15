"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getReqexts } from "./Reqexts.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarReqexts } from "@/components/ui/SearchBars/SearchBarReqexts";
import { Reqext, SearchResult } from "@/types/Reqext"; // Importa la interfaz Reqext y SearchResult
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table

export const dynamic = "force-dynamic";

export default function ReqextsPage() {
  const [reqexts, setReqexts] = useState<Reqext[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Reqext | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getReqexts();
      const formattedData = Array.isArray(data) ? data : [];
      setReqexts(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener reqexts:", error);
      setReqexts([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/reqexts/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/reqexts/${id}/edit`);
  };

  const handleSort = (column: keyof Reqext): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Reqext) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "organismo_requiriente", label: "Organismo Requiriente" },
    { key: "internosinvolucradoSimple", label: "Internos Involucrados" },
    { key: "internosinvolucrado2", label: "Internos sin buscador" },
    { key: "causa", label: "Causa" },
    { key: "nota", label: "Nota" },
    { key: "estado", label: "Estado" },
    { key: "fechaHoraContestacion", label: "Fecha y Hora de Contestación" },
    { key: "contestacion", label: "Contestación" },
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

  const sortedResults = [...searchResults].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a.item[sortColumn as keyof Reqext];
    const bValue = b.item[sortColumn as keyof Reqext];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Evento: Respuesta de req. externo</h1>

      {/* Botón para agregar un nuevo Reqext */}
      <Link
        href="/portal/eventos/reqexts/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Registro
      </Link>

      {/* Botón para cargar historial */}
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <SearchBarReqexts data={reqexts} onSearchResults={handleSearchResults} />

      {/* Tabla de resultados */}
      <Table
        data={sortedResults.map((result) => result.item)}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={handleRowClick}
        onEditClick={handleEditClick}
        onViewClick={handleRowClick}
      />
    </div>
  );
}