import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

const FechaHoraUlOrCap = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [date, setDate] = useState<Date | null>(value ? parseISO(value) : null);

  // Sincroniza el estado local con la prop value
  useEffect(() => {
    setDate(value ? parseISO(value) : null);
  }, [value]);

  // Maneja el cambio de fecha
  const handleDateChange = (date: Date | null) => {
    setDate(date);
    if (date) {
      const formattedDate = date.toISOString();
      onChange(formattedDate); // Pasa la fecha al formulario en formato ISO
    } else {
      onChange(""); // Maneja el caso en que se borra la fecha
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="FechaHoraUlOrCap"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Fecha de la ultima orden de captura (vigente)
      </label>
      <DatePicker
        id="FechaHoraUlOrCap"
        selected={date}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        placeholderText="DD/MM/AAAA HH:mm"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        calendarClassName="z-50"
        popperClassName="z-50"
        wrapperClassName="w-full"
      />
    </div>
  );
};

export default FechaHoraUlOrCap;