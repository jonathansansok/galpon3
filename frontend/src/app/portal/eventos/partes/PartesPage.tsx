//frontend\src\app\portal\eventos\partes\PartesPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPartes } from "./Partes.api";
import { Parte } from "@/types/Parte";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";

export const dynamic = "force-dynamic";

export default function PartesPage() {
  const [partes, setPartes] = useState<Parte[]>([]);
  const [displayData, setDisplayData] = useState<Parte[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Parte | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState("");
  const router = useRouter();
  const hasAutoLoadedRef = useRef(false);

  useEffect(() => {
    if (hasAutoLoadedRef.current) return;
    hasAutoLoadedRef.current = true;
    handleLoadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadData = async () => {
    try {
      console.log("[partes] Cargando partes...");
      const data = await getPartes();
      setPartes(data);
      setDisplayData(data);
    } catch (error) {
      console.error("[partes] Error al cargar datos:", error);
      setPartes([]);
      setDisplayData([]);
    }
  };

  const handleFilter = (text: string) => {
    setFilterText(text);
    if (!text || text.length < 2) {
      setDisplayData(partes);
      return;
    }
    const lower = text.toLowerCase();
    const filtered = partes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(lower) ||
        (p.abreviatura || "").toLowerCase().includes(lower)
    );
    setDisplayData(filtered);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/partes/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/partes/${id}/edit`);
  };

  const handleSort = (column: keyof Parte): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "abreviatura", label: "Abreviatura", render: (item: Parte) => item.abreviatura || "N/A" },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Parte) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Parte) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Partes</h1>

      <Link
        href="/portal/eventos/partes/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Parte
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Recargar
      </button>

      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Filtrar por nombre o abreviatura..."
          value={filterText}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {displayData.length > 0 ? (
        <TableMoviles
          data={displayData}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onViewClick={handleRowClick}
          getEditUrl={(id) => `/portal/eventos/partes/${id}/edit`}
          getViewUrl={(id) => `/portal/eventos/partes/${id}`}
          searchTerms={filterText ? [filterText] : []}
        />
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}
