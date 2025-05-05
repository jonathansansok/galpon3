//frontend\src\app\portal\eventos\redes\RedesPage.tsx
"use client";
import { useState } from "react";
import { getAllData } from "./Redes.api";
import SelectComp from "./Anidaciones";
import DateFilter from "./DateFilter";
import ResultList from "./ResultList";
import NetworkGraph from "./NetworkGraph";
import "@/../public/css/establecimientosPage.css";

export const dynamic = "force-dynamic";

const RedesPage = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<string>("");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>("");
  const [selectedPabellon, setSelectedPabellon] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [prioritizedId, setPrioritizedId] = useState<number | null>(null);
  const [viewAsNetwork, setViewAsNetwork] = useState<boolean>(false);

  const handleFilter = async () => {
    setIsFiltering(true);
    console.log("Selected Establecimiento:", selectedEstablecimiento);
    console.log("Selected Modulo UR:", selectedModuloUr);
    console.log("Selected Pabellon:", selectedPabellon);
    console.log("Selected Date:", selectedDate);
  
    const allData = await getAllData();
    console.log("Fetched Data:", allData);
    const ingresos = allData.Ingresos || [];
  
    const filtered = ingresos.filter((interno: any) => {
      const historial = interno.historial || "";
      console.log("Procesando historial:", historial);
    
      const historialEntries = historial
      .split("\n")
      .filter((entry: string) => entry.trim() !== "");
    console.log("Historial dividido en entradas:", historialEntries);
    
      for (let i = 0; i < historialEntries.length; i++) {
        const entry: string = historialEntries[i]; // Especificar el tipo como string
        console.log("Procesando entrada:", entry);
    
        const [datePart, ...rest] = entry.split(" - ");
        console.log("Fecha de la entrada:", datePart);
        console.log("Detalles de la entrada:", rest);
    
        const establecimientoMatch = rest.some((part: string) =>
          part.includes(`Establecimiento: ${selectedEstablecimiento}`)
        );
        const moduloUrMatch = rest.some((part: string) =>
          part.includes(`Módulo UR: ${selectedModuloUr}`)
        );
        const pabellonMatch = rest.some((part: string) =>
          part.includes(`Pabellón: ${selectedPabellon}`)
        );
    
        console.log("Establecimiento coincide:", establecimientoMatch);
        console.log("Modulo UR coincide:", moduloUrMatch);
        console.log("Pabellón coincide:", pabellonMatch);
    
        if (establecimientoMatch && moduloUrMatch && pabellonMatch) {
          if (selectedDate) {
            const entryDate = datePart.split(",")[0];
            console.log("Fecha de la entrada:", entryDate);
    
            if (i < historialEntries.length - 1) {
              const nextEntry = historialEntries[i + 1];
              const [nextDatePart] = nextEntry.split(" - ");
              const nextEntryDate = nextDatePart.split(",")[0];
              console.log("Fecha de la siguiente entrada:", nextEntryDate);
    
              if (selectedDate >= entryDate && selectedDate <= nextEntryDate) {
                console.log("Coincidencia encontrada:", interno);
                interno.historial = `${entryDate} - ${rest.join(" - ")}\nhasta\n${nextEntryDate}`;
                setIsFiltering(false);
                return true;
              }
            } else {
              if (selectedDate >= entryDate) {
                console.log("Coincidencia encontrada (última entrada):", interno);
                interno.historial = `${entryDate} - ${rest.join(" - ")}\nhasta\n${entryDate}`;
                setIsFiltering(false);
                return true;
              }
            }
          } else {
            console.log("Coincidencia encontrada (sin fecha):", interno);
            setIsFiltering(false);
            return true;
          }
        }
      }
    
      return false;
    });
  
    console.log("Filtered Data:", filtered);
    setFilteredData(filtered);
    setIsFiltering(false);
  };

  const handlePrioritize = (id: number) => {
    setPrioritizedId(id);
  };

  const toggleView = () => {
    setViewAsNetwork(!viewAsNetwork);
  };

  const title = `Internos alojados en Establecimiento: ${selectedEstablecimiento}, Módulo - U.R.: ${selectedModuloUr}, Pabellón: ${selectedPabellon} en la fecha ${selectedDate}`;

  return (
    <div className="flex flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Redes</h1>
      <div className="flex flex-col lg:flex-row justify-start items-center w-full h-14 mb-3 gap-3">
        <SelectComp
          onEstablecimientoChange={(value) => {
            console.log("Establecimiento seleccionado:", value);
            setSelectedEstablecimiento(value);
          }}
          onModuloUrChange={(value) => {
            console.log("Modulo UR seleccionado:", value);
            setSelectedModuloUr(value);
          }}
          onPabellonChange={(value) => {
            console.log("Pabellon seleccionado:", value);
            setSelectedPabellon(value);
          }}
        />
        <DateFilter
          onFilter={(date) => {
            console.log("Fecha seleccionada:", date);
            setSelectedDate(date);
          }}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
          onClick={handleFilter}
          disabled={isFiltering}
        >
          {isFiltering ? "Filtrando..." : "Filtrar"}
        </button>
        {Array.isArray(filteredData) && filteredData.length > 0 && prioritizedId && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            onClick={toggleView}
          >
            {viewAsNetwork ? "Ver como lista" : "Ver como red"}
          </button>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Internos alojados en <span className="text-green-500">Establecimiento: {selectedEstablecimiento}</span>, <span className="text-green-500">Módulo - U.R.: {selectedModuloUr}</span>, <span className="text-green-500">Pabellón: {selectedPabellon}</span> en la fecha <span className="text-green-500">{selectedDate}</span>
        </h2>
        {viewAsNetwork ? (
          <NetworkGraph filteredData={filteredData} prioritizedId={prioritizedId} title={title} onClose={toggleView} />
        ) : (
          <ResultList
            filteredData={filteredData}
            prioritizedId={prioritizedId}
            handlePrioritize={handlePrioritize}
          />
        )}
      </div>
    </div>
  );
};

export default RedesPage;