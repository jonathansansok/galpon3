import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesSelectAcontecimientoAt: Option[] = [
  { value: "", label: "Seleccione acontecimiento" },
  { value: "Abandono de tratamiento", label: "Abandono de tratamiento" },
  { value: "Evasión", label: "Evasión" },
  { value: "Fuga", label: "Fuga" },
  { value: "Planificación", label: "Planificación" },
  { value: "Tentativa de evasión", label: "Tentativa de evasión" },
  { value: "Tentativa de fuga", label: "Tentativa de fuga" },
];

interface SelectAcontecimientoAtProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectAcontecimientoAt: React.FC<SelectAcontecimientoAtProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
      <select
        id="acontecimiento"
        name="acontecimiento"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesSelectAcontecimientoAt.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectAcontecimientoAt;