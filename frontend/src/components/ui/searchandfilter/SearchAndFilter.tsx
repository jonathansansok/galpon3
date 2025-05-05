// frontend/src/components/ui/searchandfilter/SearchAndFilter.tsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectCompWithFilter from "@/components/ui/searchandfilter/SelectCompWithFilter";

interface SearchAndFilterProps {
  onSearch: () => void;
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void;
  onQueryChange: (query: string) => void;
  onAdditionalQueryChange: (additionalQuery: string) => void;
  isSearching: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  query: string;
  additionalQuery: string;
  selectedEstablecimiento: string;
  selectedModuloUr: string;
  selectedPabellon: string;
  setSelectedEstablecimiento: (value: string) => void;
  setSelectedModuloUr: (value: string) => void;
  setSelectedPabellon: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onDateRangeChange,
  onQueryChange,
  onAdditionalQueryChange,
  isSearching,
  startDate,
  endDate,
  query,
  additionalQuery,
  selectedEstablecimiento,
  selectedModuloUr,
  selectedPabellon,
  setSelectedEstablecimiento,
  setSelectedModuloUr,
  setSelectedPabellon,
}) => {
  const setDateRange = (range: string) => {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined = now;

    if (range === "24h") {
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (range === "week") {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "month") {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    onDateRangeChange(start, end);
  };

  return (
    <div className="w-full mb-4 flex flex-col items-start max-w-[900px]">
      <SelectCompWithFilter
        initialEstablecimiento={selectedEstablecimiento}
        initialModuloUr={selectedModuloUr}
        initialPabellon={selectedPabellon}
        onEstablecimientoChange={setSelectedEstablecimiento}
        onModuloUrChange={setSelectedModuloUr}
        onPabellonChange={setSelectedPabellon}
      />
      <div className="w-full flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4 items-start sm:items-end p-5 bg-white shadow-lg rounded-lg">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left sm:text-left">
            Desde:
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => onDateRangeChange(date ?? undefined, endDate)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left sm:text-right">
            Hasta:
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => onDateRangeChange(startDate, date ?? undefined)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd/MM/yyyy"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 w-full sm:w-auto">
          <button
            onClick={() => setDateRange("24h")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            24 hs.
          </button>
          <button
            onClick={() => setDateRange("week")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Últ. semana
          </button>
          <button
            onClick={() => setDateRange("month")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Últ. mes
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 items-start w-full p-5 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Busqueda elástica 1..."
          className="w-full max-w-[400px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        />
        <input
          type="text"
          value={additionalQuery}
          onChange={(e) => onAdditionalQueryChange(e.target.value)}
          placeholder="Busqueda elástica 2..."
          className="w-full max-w-[400px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        />
        <button
          onClick={onSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-left"
          disabled={isSearching}
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;