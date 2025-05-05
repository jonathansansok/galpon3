//usa este componente para crear un componente que renderice la siguiente lista
import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  onChange: (selectedValue: string) => void; // Callback para manejar el cambio de selección
  options: Option[]; // Recibir las opciones directamente
}

const SelectGeneric: React.FC<SelectProps> = ({ onChange, options }) => {
  return (
    <div className="w-full"> {/* Ocupa todo el ancho disponible */}
      <label htmlFor="underline_select" className="sr-only">
        Seleccione una opción
      </label>
      <select
        id="underline_select"
        onChange={(e) => onChange(e.target.value)}
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
      >
        <option value="" disabled>
          Seleccione una opción
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectGeneric;
