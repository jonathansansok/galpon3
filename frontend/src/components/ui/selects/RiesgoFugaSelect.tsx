// frontend/src/components/ui/selects/RiesgoFugaSelect.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  color: string;
}

const opcionesRiesgoFuga: Option[] = [
  { value: "", label: "Seleccione", color: "black" },
  { value: "Muy alto", label: "Muy alto", color: "red" },
  { value: "Alto", label: "Alto", color: "orange" },
  { value: "Medio", label: "Medio", color: "yellow" },
  { value: "Bajo", label: "Bajo", color: "green" },
];

interface RiesgoFugaSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const RiesgoFugaSelect: React.FC<RiesgoFugaSelectProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const getColor = (value: string) => {
    const option = opcionesRiesgoFuga.find(option => option.value === value);
    return option ? option.color : "gray";
  };

  return (
    <div className="form-group">
      <label htmlFor="riesgoFuga">Riesgo de Fuga:</label>
      <select
        id="riesgoFuga"
        name="riesgoFuga"
        className={`block py-2.5 px-0 w-full text-sm font-semibold bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${
          selectedValue === "Muy alto" ? "text-red-500 border-red-500" :
          selectedValue === "Alto" ? "text-orange-500 border-orange-500" :
          selectedValue === "Medio" ? "text-yellow-500 border-yellow-500" :
          selectedValue === "Bajo" ? "text-green-500 border-green-500" :
          "text-gray-500 border-gray-200"
        }`}
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{ color: getColor(selectedValue) }}
      >
        {opcionesRiesgoFuga.map((option) => (
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
    </div>
  );
};

export default RiesgoFugaSelect;