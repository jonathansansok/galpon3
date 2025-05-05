// frontend/src/components/ui/selects/InternacionSelect.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesInternacion: Option[] = [
    { value: "", label: "Internación:" },
  { value: "si", label: "Si" },
  { value: "no", label: "No" },
  { value: "Sujeto a evolución", label: "Sujeto a evolución" },
];

interface InternacionSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const InternacionSelect: React.FC<InternacionSelectProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
{/*       <label htmlFor="internacion">Internación:</label> */}
      <select
        id="internacion"
        name="internacion"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesInternacion.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InternacionSelect;