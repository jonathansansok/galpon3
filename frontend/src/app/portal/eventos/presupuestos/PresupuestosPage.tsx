//frontend\src\app\portal\eventos\marcas\marcasPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPresupuestos } from "./Presupuestos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Presupuesto, SearchResult } from "@/types/Presupuesto";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarPresupuestos } from "@/components/ui/SearchBars/SearchBarPresupuestos";

export const dynamic = "force-dynamic";

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Presupuesto | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getPresupuestos();
      const formattedData = Array.isArray(data) ? data : [];
      setPresupuestos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener presupuestos:", error);
      setPresupuestos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/presupuestos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/presupuestos/${id}/edit`);
  };

  const handleSort = (column: keyof Presupuesto): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "monto", label: "Monto" },
    { key: "estado", label: "Estado" },
    { key: "observaciones", label: "Observaciones" },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Presupuesto) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Presupuesto) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
    {
      key: "movilId",
      label: "ID del Móvil",
    },
    {
      key: "clienteId",
      label: "ID del Cliente",
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Presupuestos</h1>
      <Link
        href="/portal/eventos/presupuestos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Presupuesto-Trabajo
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Presupuesto>
        data={searchResults.map((result) => result.item)}
        fileName="Presupuestos"
      />

      <SearchBarPresupuestos data={presupuestos} onSearchResults={handleSearchResults} />

      {searchResults.length > 0 ? (
        <TableMoviles
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