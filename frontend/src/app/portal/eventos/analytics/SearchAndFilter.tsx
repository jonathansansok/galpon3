import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectCompWithFilter from "@/components/ui/searchandfilter/SelectCompGraph";

interface SearchAndFilterProps {
  isSearching: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedEstablecimiento: string;
  selectedModuloUr: string;
  selectedPabellon: string;
  setSelectedEstablecimiento: (value: string) => void;
  setSelectedModuloUr: (value: string) => void;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setSelectedPabellon: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  isSearching,
  startDate,
  endDate,
  selectedEstablecimiento,
  selectedModuloUr,
  selectedPabellon,
  setSelectedEstablecimiento,
  setSelectedModuloUr,
  setStartDate,
  setEndDate,
  setSelectedPabellon,
}) => {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    startDate
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate);

  const handleSearchByDate = () => {
    setStartDate(localStartDate);
    setEndDate(localEndDate);
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
      <div className="w-full flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4 items-start sm:items-end p-5 bg-[rgba(255,255,255,0.8)] shadow-lg rounded-lg">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-black text-left">
            Desde:
          </label>
          <DatePicker
            selected={localStartDate}
            onChange={(date) => setLocalStartDate(date ?? undefined)}
            selectsStart
            startDate={localStartDate}
            endDate={localEndDate}
            dateFormat="dd/MM/yyyy"
            className="bg-[rgba(240,240,240,0.8)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-black text-left">
            Hasta:
          </label>
          <DatePicker
            selected={localEndDate}
            onChange={(date) => setLocalEndDate(date ?? undefined)}
            selectsEnd
            startDate={localStartDate}
            endDate={localEndDate}
            minDate={localStartDate}
            dateFormat="dd/MM/yyyy"
            className="bg-[rgba(240,240,240,0.8)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <button
          onClick={handleSearchByDate}
          className="ml-2 px-4 py-2 bg-[rgba(144,238,144,0.9)] text-black rounded-lg"
          disabled={isSearching}
        >
          {isSearching ? "Confirmando..." : "Confirmar Fecha"}
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;