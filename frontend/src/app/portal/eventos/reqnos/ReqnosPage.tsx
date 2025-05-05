"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getReqnos } from "./Reqnos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarReqnos } from "@/components/ui/SearchBars/SearchBarReqnos";
import { Reqno, SearchResult } from "@/types/Reqno"; // Importa la interfaz Reqno y SearchResult
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table

export const dynamic = "force-dynamic";

export default function ReqnosPage() {
  const [reqnos, setReqnos] = useState<Reqno[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Reqno | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getReqnos();
      const formattedData = Array.isArray(data) ? data : [];
      setReqnos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener reqnos:", error);
      setReqnos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/reqnos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/reqnos/${id}/edit`);
  };

  const handleViewClick = (id: string) => {
    router.push(`/portal/eventos/reqnos/${id}`);
  };

  const handleSort = (column: keyof Reqno): void => {
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
      render: (item: Reqno) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "email", label: "Email" },
    { key: "requerido_por", label: "Requerido por" },
    { key: "observacion", label: "Observación" },
    { key: "datos_filiatorios", label: "Datos Filiatorios" },
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
    const aValue = a.item[sortColumn as keyof Reqno];
    const bValue = b.item[sortColumn as keyof Reqno];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Evento: Resp. de req.: Negativo</h1>

      {/* Botón para agregar una nueva respuesta negativa */}
      <Link
        href="/portal/eventos/reqnos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Resp. de Req. Negativo
      </Link>

      {/* Botón para cargar historial */}
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      {/* Botón para exportar las respuestas negativas a Excel */}
      <ExportButton<Reqno> data={searchResults.map((result) => result.item)} fileName="Reqnos" />

      {/* Barra de búsqueda */}
      <SearchBarReqnos data={reqnos} onSearchResults={handleSearchResults} />

      {/* Tabla para mostrar las respuestas negativas */}
      {searchResults.length > 0 ? (
        <Table
          data={searchResults.map((result) => result.item)}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onViewClick={handleViewClick}
        />
      ) : (
        <p> </p>
      )}
    </div>
  );
}