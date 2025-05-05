"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getElementos } from "./elementos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarElementos } from "@/components/ui/SearchBars/SearchBarElementos";
import { Elemento, SearchResult } from "@/types/Elemento";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";


export const dynamic = "force-dynamic";

export default function ElementosPage() {
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Elemento | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getElementos();
      const formattedData = Array.isArray(data) ? data : [];
      setElementos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener los elementos:", error);
      setElementos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/elementos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/elementos/${id}/edit`);
  };

  const handleSort = (column: keyof Elemento): void => {
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
      render: (item: Elemento) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Elemento) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Elemento) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "medidas", label: "Medidas" },
    { key: "dentroDePabellon", label: "Dentro de Pabellón" },
    { key: "imagenes", label: "Imágenes" },
    { key: "email", label: "Email" },
    { key: "estupefacientes", label: "Estupefacientes" },
    { key: "armas", label: "Armas" },
    { key: "electronicos", label: "Electrónicos" },
    { key: "componentes", label: "Componentes" },
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
      <h1 className="text-4xl font-bold mb-4">Evento: Secuestro de elementos</h1>

      <Link
        href="/portal/eventos/elementos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Secuestro de elementos
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <ExportButton<Elemento>
        data={searchResults.map((result) => result.item)}
        fileName="Elementos"
      />

      <SearchBarElementos data={elementos} onSearchResults={handleSearchResults} />

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