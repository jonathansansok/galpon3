//frontend\src\app\portal\eventos\ingresos\IngresosPage.tsx
"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getIngresos } from "./ingresos.api";
import { buttonVariants } from "@/components/ui/button";
import { searchInternos } from "./ingresos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBar } from "@/components/ui/SearchBars/SearchBarIngresos";
import { IngresoSearchResult } from "@/types/SearchResult"; // Importa la interfaz IngresoSearchResult
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Ingreso, SearchResult } from "@/types/Ingreso";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table
import WatermarkBackground from "@/components/WatermarkBackground"; // Importa el componente de marca de agua
export const dynamic = "force-dynamic";

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [searchResults, setSearchResults] = useState<IngresoSearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Ingreso | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // Definir el estado backgroundImage
  const router = useRouter();
  const handleLoadData = async () => {
    try {
      const data = await getIngresos();
      const formattedData = Array.isArray(data) ? data : [];
      setIngresos(formattedData);
      setSearchResults(formattedData.map((item) => ({ item, matches: [] })));
    } catch (error) {
      console.error("Error al obtener setIngresos:", error);
      setIngresos([]);
      setSearchResults([]);
    }
  };
  // Mostrar SweetAlert al iniciar la página
  useEffect(() => {
    Swal.fire({
      title: "Buena práctica:",
      text: "Recuerde buscar persona D.N.I. antes de agregarlo para no crear duplicaciones.",
      icon: "info",
      timer: 10000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
    });
  }, []);
  const handleSearch = async (queries: {
    generalQuery: string;
    apellido: string;
    nombres: string;
    lpu: string;
    lpuProv: string;
    telefono: string;
    emailCliente: string;
  }) => {
    console.log("Consultas recibidas en handleSearch:", queries); // Agregado

    const {
      generalQuery,
      apellido,
      nombres,
      lpu,
      lpuProv,
      telefono,
      emailCliente,
    } = queries;
    const query =
      generalQuery ||
      apellido ||
      nombres ||
      lpu ||
      lpuProv ||
      telefono ||
      emailCliente;

    if (query) {
      try {
        const data = await searchInternos(query);
        console.log("Resultados de búsqueda recibidos:", data); // Agregado

        if (Array.isArray(data)) {
          if (data.length === 0) {
            Alert.info({
              title: "Sin resultados",
              text: "No se encontraron resultados para la búsqueda.",
            });
          }
          setSearchResults(
            data
              .filter(
                (item: Ingreso) =>
                  (!apellido ||
                    item.apellido
                      ?.toLowerCase()
                      .includes(apellido.toLowerCase())) &&
                  (!nombres ||
                    item.nombres
                      ?.toLowerCase()
                      .includes(nombres.toLowerCase())) &&
                  (!lpu ||
                    item.lpu?.toLowerCase().includes(lpu.toLowerCase())) &&
                  (!lpuProv ||
                    item.lpuProv
                      ?.toLowerCase()
                      .includes(lpuProv.toLowerCase())) &&
                  (!telefono ||
                    item.telefono
                      ?.toLowerCase()
                      .includes(telefono.toLowerCase())) && // Agregado
                  (!emailCliente ||
                    item.emailCliente
                      ?.toLowerCase()
                      .includes(emailCliente.toLowerCase())) // Agregado
              )
              .map((item: Ingreso) => ({ item, matches: [] }))
          );
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error en la búsqueda:", error); // Agregado
        Alert.error({
          title: "Error en la búsqueda",
          text: (error as Error).message,
        });
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/portal/eventos/ingresos/${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/portal/eventos/ingresos/${id}/edit`);
  };

  const handleViewClick = (id: string) => {
    router.push(`/portal/eventos/ingresos/${id}`);
  };

  const handleSort = (column: keyof Ingreso) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a.item[sortColumn as keyof Ingreso];
    const bValue = b.item[sortColumn as keyof Ingreso];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const columns = [
    { key: "apellido", label: "Apellido" },
    { key: "nombres", label: "Nombres" },
    { key: "numeroDni", label: "D.N.I." },
    { key: "telefono", label: "Teléfono" }, // Agregado
    { key: "domicilios", label: "Domicilios" },
    { key: "provincia", label: "Localidad" },
    { key: "cp", label: "C.P." },
    { key: "emailCliente", label: "Email Cliente" }, // Agregado
    { key: "resumen", label: "Referencia" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email creador" }, // Agregado

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
      <h1 className="text-4xl font-bold mb-4">Internos</h1>

      {/* Botón para crear un nuevo ingreso */}
      <Link
        href="/portal/eventos/ingresos/new"
        className={buttonVariants()}
        style={{ marginBottom: "20px" }}
      >
        Agregar Cliente
      </Link>
      <button
        onClick={handleLoadData}
        className={buttonVariants({ variant: "outline" })}
        style={{ marginBottom: "20px" }}
      >
        Cargar historial
      </button>

      {/* Botón para exportar los ingresos a Excel */}
      <ExportButton<Ingreso>
        data={searchResults.map((result) => result.item)}
        fileName="Ingresos"
      />

      {/* Barra de búsqueda */}
      <SearchBar onSearch={handleSearch} />

      <div
        className="relative w-full"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <WatermarkBackground setBackgroundImage={setBackgroundImage} />
        {/* Tabla para mostrar los ingresos */}
        <Table
          data={sortedResults.map((result) => result.item)}
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onViewClick={handleViewClick}
        />
      </div>
    </div>
  );
}
