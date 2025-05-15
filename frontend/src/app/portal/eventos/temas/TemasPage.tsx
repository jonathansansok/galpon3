"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTemas } from "./Temas.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { Tema } from "@/types/Tema";
import { useRouter } from "next/navigation";
import TableMoviles from "@/components/eventossearch/TableMoviles";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { SearchBarMoviles } from "@/components/ui/SearchBars/SearchBarMoviles";

export const dynamic = "force-dynamic";

export default function TemasPage() {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [searchResults, setSearchResults] = useState<Tema[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Tema | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      const data = await getTemas();
      const formattedData = Array.isArray(data) ? data : [];
      setTemas(formattedData);
      setSearchResults(formattedData); // Inicialmente, los resultados son todos los datos
    } catch (error) {
      console.error("Error al obtener temas:", error);
      setTemas([]);
      setSearchResults([]);
    }
  };

  const handleSearch = (queries: {
    generalQuery: string;
    patente: string;
    marca: string;
    modelo: string;
    anio: string;
    color: string;
    tipoVehic: string;
    vin: string;
  }) => {
    const filtered = temas.filter((tema) => {
      const matchesGeneralQuery =
        queries.generalQuery &&
        Object.values(tema).some((value) =>
          String(value).toLowerCase().includes(queries.generalQuery.toLowerCase())
        );

      const matchesPatente =
        queries.patente &&
        tema.patente?.toLowerCase().includes(queries.patente.toLowerCase());

      const matchesMarca =
        queries.marca &&
        tema.marca?.toLowerCase().includes(queries.marca.toLowerCase());

      const matchesModelo =
        queries.modelo &&
        tema.modelo?.toLowerCase().includes(queries.modelo.toLowerCase());

      const matchesAnio =
        queries.anio &&
        tema.anio?.toLowerCase().includes(queries.anio.toLowerCase());

      const matchesColor =
        queries.color &&
        tema.color?.toLowerCase().includes(queries.color.toLowerCase());

      const matchesTipoVehic =
        queries.tipoVehic &&
        tema.tipoVehic
          ?.toLowerCase()
          .includes(queries.tipoVehic.toLowerCase());

      const matchesVin =
        queries.vin &&
        tema.vin?.toLowerCase().includes(queries.vin.toLowerCase());

      return (
        matchesGeneralQuery ||
        matchesPatente ||
        matchesMarca ||
        matchesModelo ||
        matchesAnio ||
        matchesColor ||
        matchesTipoVehic ||
        matchesVin
      );
    });

    setSearchResults(filtered.length > 0 ? filtered : temas); // Si no hay coincidencias, mostrar todos los datos
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/temas/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/temas/${id}/edit`);
  };

  const handleSort = (column: keyof Tema): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const columns = [
    { key: "patente", label: "Patente" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "anio", label: "Año" },
    { key: "color", label: "Color" },
    { key: "tipoPintura", label: "Tipo de Pintura" },
    { key: "paisOrigen", label: "País de Origen" },
    { key: "tipoVehic", label: "Tipo de Vehículo" },
    { key: "motor", label: "Motor" },
    { key: "chasis", label: "Chasis" },
    { key: "combustion", label: "Combustión" },
    { key: "vin", label: "VIN" },
    { key: "observacion", label: "Observación" },
    {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: Tema) => <DateTimeFormatter dateTime={item.fechaHora} />,
    },
    {
      key: "createdAt",
      label: "Creado el",
      render: (item: Tema) => <DateTimeFormatter dateTime={item.createdAt} />,
    },
    {
      key: "updatedAt",
      label: "Actualizado el",
      render: (item: Tema) => <DateTimeFormatter dateTime={item.updatedAt} />,
    },
  ];

  return (
    <div className="flex justify-start items-start flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Móviles</h1>
      <Link
        href="/portal/eventos/temas/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Móviles
      </Link>

      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar moviles
      </button>

      <ExportButton<Tema>
        data={searchResults}
        fileName="Temas"
      />

      {/* Reemplazamos SearchBarTemas con SearchBarMoviles */}
      <SearchBarMoviles onSearch={handleSearch} />

      {searchResults.length > 0 ? (
        <TableMoviles
          data={searchResults}
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