
// frontend/src/components/ui/DateRangeFilter.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

interface DateRangeFilterProps {
  onFilter: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleFilter = () => {
    onFilter(startDate, endDate); // Llama a la función de filtro con los parámetros
    Swal.fire({
      title: "Filtrado exitoso",
      text: "Los eventos han sido filtrados correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  return (
    <div className="flex space-x-4 mb-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Desde:
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date ?? undefined)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Hasta:
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date ?? undefined)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd/MM/yyyy"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
      >
        Filtrar
      </button>
    </div>
  );
};

export default DateRangeFilter;