//frontend\src\app\portal\eventos\ingresos\IngresosPage.tsx
"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { searchInternos } from "./ingresos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBar } from "@/components/ui/SearchBars/SearchBarIngresos";
import { Ingreso } from "@/types/Ingreso"; // Importa la interfaz Ingreso
import { IngresoSearchResult } from "@/types/SearchResult"; // Importa la interfaz IngresoSearchResult
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter"; // Importa el componente Table
import WatermarkBackground from "@/components/WatermarkBackground"; // Importa el componente de marca de agua

export const dynamic = "force-dynamic";

export default function IngresosPage() {
  const [searchResults, setSearchResults] = useState<IngresoSearchResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Ingreso | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // Definir el estado backgroundImage
  const router = useRouter();
  // Mostrar SweetAlert al iniciar la página
  useEffect(() => {
    Swal.fire({
      title: "Atención",
      text: "Recuerde buscar un interno por L.P.U. antes de agregarlo para no crear duplicaciones. Asimismo, en el formulario de Ingreso, se le indicará si el L.P.U. ya existe.",
      icon: "info",
      timer: 10000, 
      timerProgressBar: true, 
      showConfirmButton: true, 
      confirmButtonText: "Aceptar",
    });
  }, []);
  const handleSearch = async (queries: { generalQuery: string; apellido: string; nombres: string; lpu: string; lpuProv: string }) => {
    const { generalQuery, apellido, nombres, lpu, lpuProv } = queries;
    const query = generalQuery || apellido || nombres || lpu || lpuProv;
    if (query) {
      try {
        const data = await searchInternos(query); // Usa la nueva función searchInternos
        if (Array.isArray(data)) {
          if (data.length === 0) {
            Alert.info({
              title: "Sin resultados",
              text: "No se encontraron resultados para la búsqueda.",
            });
          }
          setSearchResults(
            data.filter((item: Ingreso) => 
              (!apellido || item.apellido?.toLowerCase().includes(apellido.toLowerCase())) &&
              (!nombres || item.nombres?.toLowerCase().includes(nombres.toLowerCase())) &&
              (!lpu || item.lpu?.toLowerCase().includes(lpu.toLowerCase())) &&
              (!lpuProv || item.lpuProv?.toLowerCase().includes(lpuProv.toLowerCase()))
            ).map((item: Ingreso) => ({ item, matches: [] }))
          );
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
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
    { key: "lpu", label: "LPU" },
    { key: "sitProc", label: "Situación Procesal" },
    { key: "lpuProv", label: "LPU Prov" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "celda", label: "Celda" },
    { key: "tipoDoc", label: "Tipo de Documento" },
    { key: "docNacionalidad", label: "Nacionalidad del Documento" }, // Agregado
    { key: "numeroDni", label: "Número de Documento" },
    { key: "condicion", label: "Condición" },
    { key: "fechaHoraIng", label: "Fecha de Ingreso" },
    { key: "alias", label: "Alias" },
    { key: "esAlerta", label: "Es Alerta" },
    { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
    { key: "edad_ing", label: "Edad" },
    { key: "nacionalidad", label: "Nacionalidad" },
    { key: "provincia", label: "Provincia" },
    { key: "domicilios", label: "Domicilios" },
    { key: "numeroCausa", label: "Número/s de Causa/s" },
    { key: "procedencia", label: "Procedencia" },
    { key: "orgCrim", label: "Organización Criminal" },
    { key: "electrodomesticos", label: "Delitos" },
    { key: "juzgados", label: "Juzgados" },
    { key: "ubicacionMap", label: "Ubicación en el Mapa" },
    { key: "perfil", label: "Perfil" },
    { key: "reingreso", label: "Reingreso" },
    { key: "titInfoPublic", label: "Título de Información Pública" },
    { key: "temaInf", label: "Tema informativo" },
    { key: "resumen", label: "Resumen" },
    { key: "observacion", label: "Observación" },
    { key: "link", label: "Link" },
    { key: "patologias", label: "Patologías" },
    { key: "tatuajes", label: "Tatuajes" },
    { key: "cicatrices", label: "Cicatrices" },
    { key: "subGrupo", label: "Subgrupo" },
    { key: "sexo", label: "Sexo" },
    { key: "sexualidad", label: "Sexualidad" },
    { key: "estadoCivil", label: "Estado Civil" },
    { key: "profesion", label: "Profesión" },
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
        Agregar interno
      </Link>

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
          data={sortedResults.map(result => result.item)}
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