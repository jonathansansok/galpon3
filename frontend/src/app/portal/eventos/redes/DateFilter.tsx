// frontend/src/app/portal/eventos/redes/DateFilter.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateFilterProps {
  onFilter: (selectedDate: string | undefined) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilter }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleFilter = (date: Date | null) => {
    if (date) {
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      console.log("Fecha seleccionada en DateFilter:", formattedDate);
      setSelectedDate(date);
      onFilter(formattedDate);
    } else {
      setSelectedDate(undefined);
      onFilter(undefined);
    }
  };

  return (
    <div className="flex space-x-4 mb-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fecha:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleFilter}
          dateFormat="dd/MM/yyyy"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default DateFilter;