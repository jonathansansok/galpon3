//frontend\src\app\portal\eventos\establecimientos\EstablecimientosPage.tsx
"use client";

import { useState, useEffect } from "react";
import { getAllData, fetchData } from "./Establecimientos.api";
import { ExportButton } from "@/components/ui/ExportButton";
import { useRouter } from "next/navigation";
import { GenericTable } from "./Tables";
import tableColumns from "./ColumnsHistory";
import DateRangeFilter from "./DateRangeFilter";
import SelectComp from "@/components/ui/SelectAnidacionesHistory";
import { tableNames, tableDisplayNames } from "./TableDisplayNames";
import { FaEye, FaTimes } from "react-icons/fa";
import "@/../public/css/establecimientosPage.css";
import WatermarkBackground from "@/components/WatermarkBackground";
import { useUserStore } from "@/lib/store";
import Swal from "sweetalert2";

export const dynamic = "force-dynamic";

const EstablecimientosPage = () => {
  const comp = useUserStore((state) => state.comp);
  console.log("Valor de comp desde Zustand al cargar la página:", comp);

  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [filteredData, setFilteredData] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [sortColumn, setSortColumn] = useState<string | number | symbol | null>(
    null
  );
  const [isAllDataVisible, setIsAllDataVisible] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleTables, setVisibleTables] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>("");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>("");
  const [selectedPabellon, setSelectedPabellon] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [isFiltersEnabled, setIsFiltersEnabled] = useState(false); // Habilitar filtros después de cargar datos
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Deshabilitar botón temporalmente
  const router = useRouter();
  const handleSort = (column: string | number | symbol): void => {
    console.log("Ordenando por columna:", column);
    setSortColumn(column);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Sincronizar el valor de comp con el selector de establecimientos
  useEffect(() => {
    console.log("La página EstablecimientosPage se ha cargado.");
    if (comp !== undefined) {
      console.log("Establecimiento inicial basado en comp:", comp);
      setSelectedEstablecimiento(comp || ""); // Establecer el valor inicial
      setIsLoading(false); // Finalizar la carga
    } else {
      console.warn(
        "El valor de comp es undefined. Verifica el flujo de datos."
      );
    }
  }, [comp]);

  const handleLoadAllData = async () => {
    console.log("Se hizo clic en el botón 'Cargar Historiales'");
    setIsLoading(true);
    setIsButtonDisabled(true); // Deshabilitar el botón temporalmente

    try {
      const allData = await getAllData();
      setData(allData);
      setFilteredData(allData);

      const allVisible = tableNames.reduce((acc, tableName) => {
        acc[tableName] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setVisibleTables(allVisible);
      setIsAllDataVisible(true);
      setIsFiltersEnabled(true); // Habilitar filtros después de cargar datos
      console.log("Datos cargados para todas las tablas:", allData);
    } catch (error: any) {
      console.error("Error al cargar los datos:", error);
      if (error.message.includes("Too Many Requests")) {
        Swal.fire({
          title: "Servidor renovando",
          text: "Por favor, espere 5 segundos antes de intentar nuevamente.",
          icon: "warning",
          timer: 5000,
          showConfirmButton: false,
        });
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsButtonDisabled(false), 5000); // Habilitar el botón después de 5 segundos
    }
  };

  const handleFilter = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    console.log("Aplicando filtro con las siguientes condiciones:");
    console.log("Fecha de inicio:", startDate);
    console.log("Fecha de fin:", endDate);
    console.log("Establecimiento seleccionado:", selectedEstablecimiento);
    console.log("Módulo seleccionado:", selectedModuloUr);
    console.log("Pabellón seleccionado:", selectedPabellon);

    const filtered = Object.keys(data).reduce((acc, tableName) => {
      const tableData = Array.isArray(data[tableName]) ? data[tableName] : [];
      const filteredTableData = tableData.filter((item: any) => {
        const itemDate = new Date(item.fechaHora);
        return (
          (!startDate || itemDate >= startDate) &&
          (!endDate || itemDate <= endDate) &&
          (!selectedEstablecimiento ||
            item.establecimiento === selectedEstablecimiento) &&
          (!selectedModuloUr || item.modulo_ur === selectedModuloUr) &&
          (!selectedPabellon || item.pabellon === selectedPabellon)
        );
      });
      acc[tableName] = filteredTableData;
      return acc;
    }, {} as { [key: string]: any[] });

    setFilteredData(filtered);
    setVisibleTables(
      Object.keys(filtered).reduce((acc, tableName) => {
        acc[tableName] = filtered[tableName].length > 0;
        return acc;
      }, {} as { [key: string]: boolean })
    );
    console.log("Datos filtrados:", filtered);
  };

  const handleRowClick = (id: string, tableName: string) => {
    console.log(`Fila seleccionada: ID=${id}, Tabla=${tableName}`);
    router.push(`/portal/eventos/${tableName.toLowerCase()}/${id}`);
  };

  const handleEditClick = (id: string, tableName: string) => {
    console.log(`Editando fila: ID=${id}, Tabla=${tableName}`);
    router.push(`/portal/eventos/${tableName.toLowerCase()}/${id}/edit`);
  };

  const handleViewClick = (id: string, tableName: string) => {
    console.log(`Visualizando fila: ID=${id}, Tabla=${tableName}`);
    router.push(`/portal/eventos/${tableName.toLowerCase()}/${id}`);
  };

  const handleLoadTableData = async (tableName: string) => {
    console.log(`Cargando datos para la tabla: ${tableName}`);
    const tableData = await fetchData(tableName);
    setData((prevData) => ({
      ...prevData,
      [tableName]: tableData,
    }));
    setFilteredData((prevFilteredData) => ({
      ...prevFilteredData,
      [tableName]: tableData,
    }));
    setVisibleTables((prevState) => ({
      ...prevState,
      [tableName]: true,
    }));
    console.log(`Datos cargados para la tabla ${tableName}:`, tableData);
  };

  const handleToggleAllTables = () => {
    if (isAllDataVisible) {
      setVisibleTables({});
      setIsAllDataVisible(false);
      console.log("Ocultando todas las tablas");
    } else {
      handleLoadAllData();
    }
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="relative flex flex-col w-full px-4 py-6">
      <WatermarkBackground setBackgroundImage={() => {}} />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-4">Establecimientos</h1>
        {/* Botón principal para cargar/ocultar todos los historiales */}
        <div className="flex flex-wrap mt-9 gap-2 max-w-full overflow-hidden">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-semibold text-white ${
              isAllDataVisible
                ? "bg-red-500 hover:bg-red-600" // Rojo cuando todas las tablas están visibles
                : "bg-green-500 hover:bg-green-600" // Verde cuando todas las tablas están ocultas
            } sm:mb-1 mb-5 text-left w-full sm:w-auto`}
            onClick={handleToggleAllTables}
            disabled={isButtonDisabled} // Deshabilitar botón si está en espera
          >
            {isAllDataVisible ? "Ocultar Historiales" : "Cargar Historiales"}
          </button>
        </div>

        {/* Mostrar contenido adicional solo si las tablas están visibles */}
        {isAllDataVisible && (
          <>
            {/* Filtros de establecimiento y fechas */}
            <div className="flex flex-col lg:flex-row justify-start items-center w-full h-14 mb-3 gap-3">
              <SelectComp
                comp={comp} // Pasar comp como propiedad
                onEstablecimientoChange={(value) => {
                  console.log("Establecimiento seleccionado:", value);
                  if (comp && value !== comp) {
                    console.warn(
                      `El usuario intentó seleccionar un establecimiento no permitido: ${value}`
                    );
                    alert(
                      "No tienes permiso para seleccionar este establecimiento."
                    );
                    return;
                  }
                  setSelectedEstablecimiento(value);
                }}
                onModuloUrChange={(value) => {
                  console.log("Módulo seleccionado:", value);
                  setSelectedModuloUr(value);
                }}
                onPabellonChange={(value) => {
                  console.log("Pabellón seleccionado:", value);
                  setSelectedPabellon(value);
                }}
                onFilterClick={() => handleFilter(startDate, endDate)}
              />
              <DateRangeFilter
                onFilter={(start, end) => {
                  console.log("Rango de fechas seleccionado:", start, end);
                  setStartDate(start);
                  setEndDate(end);
                  handleFilter(start, end);
                }}
              />
            </div>

            <div className="flex flex-wrap mt-9 gap-2 max-w-full overflow-hidden">
              {/* Botón para mostrar todas las tablas */}
              <button
                type="button"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 sm:mb-1 mb-5 text-left w-full sm:w-auto"
                onClick={() => {
                  setVisibleTables(
                    tableNames.reduce((acc, tableName) => {
                      acc[tableName] = true; // Hacer visibles todas las tablas
                      return acc;
                    }, {} as { [key: string]: boolean })
                  );
                  setIsAllDataVisible(true); // Asegurar que el estado global refleje que todas las tablas están visibles
                  console.log("Mostrando todas las tablas");
                }}
              >
                Mostrar Todos
              </button>

              {/* Botones individuales para mostrar/ocultar tablas */}
              {tableNames.map((tableName) => (
                <button
                  key={tableName}
                  className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                    visibleTables[tableName]
                      ? "bg-red-500 hover:bg-red-600" // Rojo cuando la tabla está visible
                      : "bg-blue-500 hover:bg-blue-600" // Azul cuando la tabla está oculta
                  } sm:mb-1 mb-5 text-left w-full sm:w-auto`}
                  onClick={() => {
                    setVisibleTables((prevState) => ({
                      ...prevState,
                      [tableName]: !prevState[tableName], // Alternar visibilidad de la tabla
                    }));
                    console.log(
                      visibleTables[tableName]
                        ? `Ocultando tabla: ${tableName}`
                        : `Mostrando tabla: ${tableName}`
                    );
                  }}
                >
                  {visibleTables[tableName] ? (
                    <>
                      <FaTimes className="inline-block mr-2" />{" "}
                      {/* Ícono para cerrar */}
                      {tableDisplayNames[tableName]}
                    </>
                  ) : (
                    <>
                      <FaEye className="inline-block mr-2" />{" "}
                      {/* Ícono para mostrar */}
                      {tableDisplayNames[tableName]}
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Renderizado de tablas visibles */}
            {/* Renderizado de tablas visibles */}
            {tableNames.map(
              (tableName) =>
                visibleTables[tableName] && (
                  <div key={tableName} className="w-full overflow-x-auto">
                    <h1 className="text-3xl font-bold mb-4 mt-8">
                      {tableDisplayNames[tableName]}
                    </h1>
                    {filteredData[tableName] &&
                    filteredData[tableName].length > 0 ? (
                      <>
                        <ExportButton
                          data={filteredData[tableName] || []}
                          fileName={tableDisplayNames[tableName]}
                        />
                        <GenericTable
                          data={filteredData[tableName] || []}
                          columns={tableColumns[tableName] || []}
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                          onRowClick={(id) => handleRowClick(id, tableName)}
                          onEditClick={(id) => handleEditClick(id, tableName)}
                          onViewClick={(id) => handleViewClick(id, tableName)}
                        />
                      </>
                    ) : (
                      <p className="text-gray-500 text-left mt-4">
                        Sin registros
                      </p>
                    )}
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EstablecimientosPage;
