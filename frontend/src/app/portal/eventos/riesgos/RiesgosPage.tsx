"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getRiesgos } from "./Riesgos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarRiesgos } from "@/components/ui/SearchBars/SearchBarRiesgos";
import { Riesgo, SearchResult } from "@/types/Riesgo"; // Importa la interfaz Riesgo y SearchResult
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table
import { useUserStore } from "@/lib/store"; // Importa el estado global

export const dynamic = "force-dynamic";

export default function RiesgosPage() {
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Riesgo | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const privilege = useUserStore((state) => state.privilege); // Obtén el privilegio del usuario

  // Redirige a los usuarios con privilegio B1
  useEffect(() => {
    if (privilege === "B1") {
      router.push("/acceso-denegado");
    }
  }, [privilege, router]);

  const handleLoadData = async () => {
    try {
      const data = await getRiesgos();
      const formattedData = Array.isArray(data) ? data : [];
      setRiesgos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener riesgos:", error);
      setRiesgos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/riesgos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/riesgos/${id}/edit`);
  };

  const handleViewClick = (id: string) => {
    router.push(`/portal/eventos/riesgos/${id}`);
  };

  const handleSort = (column: keyof Riesgo): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "condicion", label: "Condición" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Riesgo) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "lpu", label: "LPU" },
    { key: "apellido", label: "Apellido" },
    { key: "nombres", label: "Nombres" },
    { key: "sitProc", label: "Situación Procesal" },
    { key: "condena", label: "Condena" },
    { key: "orgCrim", label: "Organización Criminal" },
    { key: "territorio", label: "Territorio" },
    { key: "riesgo_de_fuga", label: "Riesgo de Fuga" },
    { key: "riesgo_de_conf", label: "Riesgo de Conflicto" },
    { key: "restricciones", label: "Restricciones" },
    { key: "observacion", label: "Observación" },
    { key: "created_at", label: "Creado el" },
    { key: "updated_at", label: "Actualizado el" },
  ];

  const sortedResults = [...searchResults].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a.item[sortColumn as keyof Riesgo];
    const bValue = b.item[sortColumn as keyof Riesgo];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Eval. S.I.G.P.P.L.A.R.</h1>

      <Link
        href="/portal/eventos/riesgos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Eval. S.I.G.P.P.L.A.R.
      </Link>
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>


      {/* Barra de búsqueda */}
      <SearchBarRiesgos
        data={riesgos}
        onSearchResults={handleSearchResults}
      />

      {/* Tabla para mostrar las evaluaciones */}
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