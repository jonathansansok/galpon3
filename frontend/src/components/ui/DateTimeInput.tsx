// components/ui/DateTimeInput.tsx
import React from "react";

interface DateTimeInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  id,
  value,
  onChange,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;


    // Convierte la fecha a formato ISO sin la parte de la zona horaria
    const formattedDate = new Date(selectedDate).toISOString();
    onChange(formattedDate);
  };

  return (
    <div className="relative max-w-sm">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        Selecciona Fecha y Hora
      </label>
      <input
        id={id}
        type="datetime-local"
        value={value ? value.slice(0, 16) : ""} // Asegura que el valor esté en el formato correcto para datetime-local
        onChange={handleDateChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  );
};

export default DateTimeInput;
