//frontend\src\components\ui\FechaDeIngresoReqPos.tsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FechaDeIngresoReqPos = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  // Convierte la fecha a un objeto Date sin ajustes de zona horaria
  const parseDateAsLocal = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number); // Extrae solo la parte de la fecha
    return new Date(year, month - 1, day); // Crea un objeto Date como local (meses son 0-indexados)
  };

  const [date, setDate] = useState<Date | null>(parseDateAsLocal(value));

  useEffect(() => {
    setDate(parseDateAsLocal(value));
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Solo la parte de la fecha
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="fechaIngreso"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Fecha de ingreso:
      </label>
      <DatePicker
        id="fechaIngreso"
        selected={date}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/AAAA"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        calendarClassName="z-50"
        popperClassName="z-50"
        wrapperClassName="w-full"
      />
    </div>
  );
};

export default FechaDeIngresoReqPos;