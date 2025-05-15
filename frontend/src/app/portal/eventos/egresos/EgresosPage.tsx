"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getEgresos } from "./Egresos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBarEgresos } from "@/components/ui/SearchBars/SearchBarEgresos";
import { Egreso, SearchResult } from "@/types/Egreso";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";


export const dynamic = "force-dynamic";

export default function EgresosPage() {
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Egreso | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getEgresos();
      const formattedData = Array.isArray(data) ? data : [];
      setEgresos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener los egresos:", error);
      setEgresos([]);
      setSearchResults([]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/egresos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/egresos/${id}/edit`);
  };

  const handleSort = (column: keyof Egreso): void => {
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
      render: (item: Egreso) => (
        <div dangerouslySetInnerHTML={{ __html: formatInternosInvolucrados(item.internosinvolucrado || "") }} />
      ),
    },
    {
      key: "personalinvolucrado",
      label: "Personal Involucrado",
      render: (item: Egreso) => (
        <div dangerouslySetInnerHTML={{ __html: formatPersonalInvolucrado(item.personalinvolucrado || "") }} />
      ),
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Egreso) => <DateTimeFormatter dateTime={item.fechaHora} />, // Usar el nuevo componente
    },
    { key: "tipoDeSalida", label: "Tipo de Salida" },
    { key: "modalidad", label: "Modalidad" },
    { key: "jurisdiccion", label: "Jurisdicción" },
    { key: "juzgados", label: "Juzgados" },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
    { key: "prevencioSiNo", label: "Prevención" },
    { key: "fechaVenc", label: "Fecha de Vencimiento" },
    { key: "ordenCapDip", label: "Orden de Captura" },
    { key: "reintFueraTerm", label: "Reint. Fuera de Término" },
    { key: "revArrDom", label: "Rev. Arr. Dom." },
    { key: "revLibCond", label: "Rev. Lib. Cond." },
    { key: "revlibAsis", label: "Rev. Lib. Asis." },
    { key: "reingPorRecap", label: "Reing. por Recap." },
    { key: "detalle", label: "Detalle" },
    { key: "fechaHoraReintFueTerm", label: "Fecha Hora Reint. Fuera de Término" },
    { key: "fechaHoraReingPorRecap", label: "Fecha Hora Reing. por Recap." },
    { key: "otrosDatos", label: "Otros Datos" },
    { key: "fechaHoraVencTime", label: "Fecha Hora Venc. Time" },
    { key: "fechaHoraUlOrCap", label: "Fecha Hora Ul. Or. Cap." },
    { key: "plazo", label: "Plazo" },
    { key: "noReintSalTra", label: "No Reint. Sal. Tra." },
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
      <h1 className="text-4xl font-bold mb-4">Evento: Egresos extramuro</h1>

      <Link
        href="/portal/eventos/egresos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Egreso extramuro
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      <SearchBarEgresos data={egresos} onSearchResults={handleSearchResults} />

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