"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getPreingresos } from "./Preingresos.api";
import Link from "next/link";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarPreingresos } from "@/components/ui/SearchBars/SearchBarPreingresos";
import { Preingreso, SearchResult } from "@/types/Preingreso"; // Importa la interfaz Preingreso y SearchResult
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table

export const dynamic = "force-dynamic";

export default function PreingresosPage() {
  const [preingresos, setPreingresos] = useState<Preingreso[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Preingreso | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getPreingresos();
      const formattedData = Array.isArray(data) ? data : [];
      setPreingresos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener los preingresos:", error);
      setPreingresos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/preingresos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/preingresos/${id}/edit`);
  };

  const handleSort = (column: keyof Preingreso): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "fechaHoraIng", label: "Fecha y Hora" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "internosinvolucradoSimple", label: "Reingresos:" },
    { key: "apellido", label: "Apellido" },
    { key: "nombres", label: "Nombres" },
    { key: "lpu", label: "LPU" },
    { key: "sitProc", label: "Situación Procesal" },
    { key: "alias", label: "Alias" },
    { key: "nacionalidad", label: "Nacionalidad" },
    { key: "provincia", label: "Provincia" },
    { key: "numeroDni", label: "Número de DNI" },
    { key: "domicilios", label: "Domicilios" },
    { key: "ubicacionMap", label: "Ubicación en el Mapa" },
    { key: "orgCrim", label: "Organización Criminal" },
    { key: "cualorg", label: "Cual Organización" },
    { key: "procedencia", label: "Procedencia" },
    { key: "observacion", label: "Observación" },
    { key: "delitos", label: "Delitos" },
    { key: "detalle_adicional", label: "Detalle Adicional" },
    { key: "juzgados", label: "Juzgados" },
    { key: "org_judicial", label: "Organización Judicial" },
    { key: "numeroCausa", label: "Número de Causa" },
    { key: "reingreso", label: "Reingreso" },
    { key: "reg_suv", label: "Registro SUV" },
    { key: "reg_cir", label: "Registro CIR" },
    { key: "titInfoPublic", label: "Título de Información Pública" },
    { key: "resumen", label: "Resumen" },
    { key: "link", label: "Link" },
    { key: "cirDet", label: "CIR Detalle" },
    { key: "t_r", label: "T/R" },
    { key: "electrodomesticos", label: "Electrodomésticos" },
    { key: "electrodomesticosDetalles", label: "Detalles de Electrodomésticos" },
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
    const aValue = a.item[sortColumn as keyof Preingreso];
    const bValue = b.item[sortColumn as keyof Preingreso];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Preingresos</h1>
      <Link
        href="/portal/eventos/preingresos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Preingreso
      </Link>
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Preingreso> data={searchResults.map((result) => result.item)} fileName="Preingresos" />

      <SearchBarPreingresos data={preingresos} onSearchResults={handleSearchResults} />

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