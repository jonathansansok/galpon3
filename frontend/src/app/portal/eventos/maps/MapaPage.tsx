//frontend\src\app\portal\eventos\maps\MapaPage.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { searchInternos } from "./ingresos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { SearchBar } from "@/components/ui/SearchBars/SearchBarIngresos";
import { SearchByMultipleLpu } from "./SearchByMultipleLpu"; // Importa el nuevo buscador
import { Ingreso } from "@/types/Ingreso";
import Swal from "sweetalert2";
import MapsTable from "@/components/mapsTable/mapsTable";
import Mapa from "@/app/portal/eventos/maps/google/Mapa";
import SelectedInternosList from "@/components/mapsTable/SelectedInternosList";
import { useUserStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const IngresosPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Ingreso[]>([]);
  const [query, setQuery] = useState("");
  const [selectedInternos, setSelectedInternos] = useState<Ingreso[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const setLocations = useUserStore((state) => state.setLocations);

  const handleSearch = async (queries: { generalQuery: string; apellido: string; nombres: string; lpu: string; lpuProv: string }) => {
    const { generalQuery, apellido, nombres, lpu, lpuProv } = queries;
    const query = generalQuery || apellido || nombres || lpu || lpuProv;
    if (query) {
      try {
        const data = await searchInternos(query);
        if (Array.isArray(data)) {
          if (data.length === 0) {
            Swal.fire({
              icon: "info",
              title: "Sin resultados",
              text: "No se encontraron resultados para la búsqueda.",
            });
          }
          setSearchResults(data);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error en la búsqueda",
          text: (error as Error).message,
        });
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchByMultipleLpu = (results: Ingreso[]) => {
    setSearchResults(results); // Actualiza los resultados con los internos encontrados
  
    // Agregar automáticamente los resultados al estado `selectedInternos`
    setSelectedInternos((prevSelectedInternos) => {
      const nuevosInternos = results.filter(
        (interno) => !prevSelectedInternos.some((item) => item.id === interno.id)
      );
      return [...prevSelectedInternos, ...nuevosInternos];
    });
  };
  const handleRowClick = (id: string) => {
    // Solo expandir la fila, no agregar a seleccionados
  };

  const handleAddClick = (id: string) => {
    const interno = searchResults.find((item) => item.id.toString() === id);
    if (interno && !selectedInternos.some((item) => item.id.toString() === id)) {
      setSelectedInternos((prevSelectedInternos) => [...prevSelectedInternos, interno]);
      Swal.fire({
        icon: "success",
        title: "Interno agregado",
        text: "Interno agregado a Internos Seleccionados debajo de la tabla",
        confirmButtonText: "Entendido",
      });
    }
  };

  const handleRemoveClick = (id: string) => {
    setSelectedInternos((prevSelectedInternos) =>
      prevSelectedInternos.filter((interno) => interno.id.toString() !== id)
    );
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleMapExpand = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  const locations = selectedInternos
    .map((interno) => {
      if (interno.ubicacionMap) {
        try {
          const ubicacion = JSON.parse(interno.ubicacionMap);
          return {
            lat: ubicacion.coordenadas.lat,
            lng: ubicacion.coordenadas.lng,
            apellido: interno.apellido,
            nombres: interno.nombres,
            lpu: interno.lpu || "",
            tipoDoc: interno.tipoDoc || "",
            numeroDni: interno.numeroDni || "",
            cualorg: interno.cualorg || "",
            condicion: interno.condicion || "",
            ubicacionMap: interno.ubicacionMap,
            imagen: interno.imagen,
          };
        } catch (error) {
          console.error("Error parsing ubicacionMap:", error);
          return null;
        }
      }
      return null;
    })
    .filter((location) => location !== null);

  useEffect(() => {
    setLocations(locations);
  }, [locations, setLocations]);

  return (
    <div className={`flex justify-start items-start flex-col w-full px-4 py-6 ${isMapExpanded ? "fixed inset-0 z-50 h-screen overflow-hidden" : ""}`}>
      {!isMapExpanded && (
        <>
          <h1 className="text-4xl font-bold mb-4">Busque y seleccione internos para el mapa de calor</h1>

          <ExportButton<Ingreso>
            data={searchResults}
            fileName="Ingresos"
          />

          {/* Barra de búsqueda */}
          <SearchBar onSearch={handleSearch} />

          {/* Nuevo buscador por múltiples LPU */}
          <SearchByMultipleLpu onSearchResults={handleSearchByMultipleLpu} />

          {/* Botón de colapso */}
          <button
            onClick={toggleCollapse}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {collapsed ? "Mostrar Tabla" : "Ocultar Tabla"}
          </button>

          {/* Tabla de resultados */}
          {!collapsed && (
            <MapsTable
              searchResults={searchResults}
              onRowClick={handleRowClick}
              handleAddClick={handleAddClick}
              handleRemoveClick={handleRemoveClick}
            />
          )}

          {/* Cuadro con los resultados seleccionados */}
          {selectedInternos.length > 0 && (
            <SelectedInternosList
              selectedIngresos={selectedInternos}
              handleRemoveClick={handleRemoveClick}
            />
          )}
        </>
      )}

      {/* Botón para expandir el mapa */}
      <button
        onClick={toggleMapExpand}
        className="mb-4 mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        {isMapExpanded ? "Reducir Mapa" : "Expandir Mapa"}
      </button>

      {/* Mapa con las ubicaciones de los internos seleccionados */}
      <div className={`w-full ${isMapExpanded ? "fixed inset-0 z-9999 h-screen" : "h-64"} bg-white`}>
        <Mapa locations={locations} isMapExpanded={isMapExpanded} toggleMapExpand={toggleMapExpand} />
      </div>
    </div>
  );
};

export default IngresosPage;