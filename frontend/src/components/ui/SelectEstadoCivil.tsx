import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesEstadoCivil: Option[] = [
  { value: "", label: "Seleccionar estado civil" },
  { value: "No declara", label: "No declara" },
  { value: "soltero", label: "Soltero/a" },
  { value: "casado", label: "Casado/a" },
  { value: "divorciado", label: "Divorciado/a" },
  { value: "viudo", label: "Viudo/a" },
  { value: "unionLibre", label: "Unión Libre" },
];

interface SelectEstadoCivilProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectEstadoCivil: React.FC<SelectEstadoCivilProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
      <select
        id="estadoCivil"
        name="estadoCivil"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesEstadoCivil.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectEstadoCivil;