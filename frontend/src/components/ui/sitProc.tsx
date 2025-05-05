import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesSituacionProcesal: Option[] = [
  { value: "", label: "Seleccione Situación Procesal" },
  { value: "Procesado", label: "Procesado" },
  { value: "Condenado", label: "Condenado" },
  { value: "Absuelto", label: "Absuelto" },
];

interface SelectSituacionProcesalProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectSituacionProcesal: React.FC<SelectSituacionProcesalProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <select
    className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
      value={selectedValue}
      onChange={(e) => {
        setSelectedValue(e.target.value);
        onChange(e.target.value);
        
      }}
    >
      {opcionesSituacionProcesal.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectSituacionProcesal;