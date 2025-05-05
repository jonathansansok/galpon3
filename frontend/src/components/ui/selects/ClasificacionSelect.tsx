import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  color: string;
}

const opcionesClasificacion: Option[] = [
  { value: "", label: "Clasificación", color: "black" },
  { value: "BAJA", label: "BAJA", color: "green" },
  { value: "MEDIA", label: "MEDIA", color: "orange" },
  { value: "ALTA", label: "ALTA", color: "red" },
];

interface ClasificacionSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const ClasificacionSelect: React.FC<ClasificacionSelectProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const getColor = (value: string) => {
    const option = opcionesClasificacion.find(option => option.value === value);
    return option ? option.color : "gray";
  };

  return (
    <select
      className={`block py-2.5 px-0 w-full text-sm font-semibold bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${
        selectedValue === "BAJA" ? "text-green-500 border-green-500" :
        selectedValue === "MEDIA" ? "text-orange-500 border-orange-500" :
        selectedValue === "ALTA" ? "text-red-500 border-red-500" :
        "text-gray-500 border-gray-200"
      }`}
      value={selectedValue}
      onChange={(e) => {
        setSelectedValue(e.target.value);
        onChange(e.target.value);
      }}
      style={{ color: getColor(selectedValue) }}
    >
      {opcionesClasificacion.map((option) => (
        <option
          key={option.value}
          value={option.value}
          data-color={option.color}
          style={{ color: option.color }}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ClasificacionSelect;