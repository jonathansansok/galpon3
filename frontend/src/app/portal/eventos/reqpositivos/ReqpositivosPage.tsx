//frontend\src\app\portal\eventos\reqpositivos\ReqpositivosPage.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getReqpositivos } from "./Reqpositivos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarReqpositivos } from "@/components/ui/SearchBars/SearchBarReqpositivos";
import { Reqpositivo, SearchResult } from "@/types/Reqpositivo"; // Importa la interfaz Reqpositivo y SearchResult
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table

export const dynamic = "force-dynamic";

export default function ReqpositivosPage() {
  const [reqpositivos, setReqpositivos] = useState<Reqpositivo[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Reqpositivo | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getReqpositivos();
      const formattedData = Array.isArray(data) ? data : [];
      setReqpositivos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener reqpositivos:", error);
      setReqpositivos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/reqpositivos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/reqpositivos/${id}/edit`);
  };

  const handleSort = (column: keyof Reqpositivo): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "fechaHora", label: "Fecha y Hora de informe" },
    { key: "apellido", label: "Apellido" },
    { key: "nombres", label: "Nombres" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
    { key: "fechaEgreso", label: "Fecha de Egreso" },
    { key: "edad_ing", label: "Edad" },
    { key: "fechaHoraIng", label: "Fecha y Hora de Ingreso" },
    { key: "alias", label: "Alias" },
    { key: "tipoDoc", label: "Tipo de Documento" },
    { key: "numeroDni", label: "Número de Documento" },
    { key: "nacionalidad", label: "Nacionalidad" },
    { key: "domicilios", label: "Domicilios" },
    { key: "ubicacionMap", label: "Ubicación en el Mapa" },
    { key: "sexo", label: "Sexo" },
    { key: "registraantecedentespf", label: "Registra Antecedentes PF" },
    { key: "lpu", label: "LPU" },
    { key: "motivoEgreso", label: "Motivo de Egreso" },
    { key: "numeroCausa", label: "Número de Causa" },
    { key: "prensa", label: "Prensa" },
    { key: "observacion", label: "Observación" },
    { key: "juzgados", label: "Juzgados" },
    { key: "electrodomesticos", label: "Electrodomésticos" },
    { key: "electrodomesticosDetalles", label: "Detalles de Electrodomésticos" },
    { key: "sitProc", label: "Situación Procesal" },
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
    const aValue = a.item[sortColumn as keyof Reqpositivo];
    const bValue = b.item[sortColumn as keyof Reqpositivo];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Respuesta de Requerimiento: Positiva</h1>

      {/* Botón para agregar una nueva respuesta positiva */}
      <Link
        href="/portal/eventos/reqpositivos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Respuesta de Req.: Positiva
      </Link>

      {/* Botón para cargar historial */}
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      {/* Botón para exportar las respuestas positivas a Excel */}
      <ExportButton<Reqpositivo> data={searchResults.map((result) => result.item)} fileName="Reqpositivo" />

      {/* Barra de búsqueda */}
      <SearchBarReqpositivos data={reqpositivos} onSearchResults={handleSearchResults} />

      {/* Tabla para mostrar las respuestas positivas */}
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
        />
      ) : (
        <p> </p>
      )}
    </div>
  );
}