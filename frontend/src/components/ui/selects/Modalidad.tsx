import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesSelectAcontecimientoAt: Option[] = [
  { value: "", label: "Modalidad:" },
  { value: "Comision", label: "Comision" },
  { value: "Comparendo", label: "Comparendo" },
  { value: "Comparendo programado", label: "Comparendo programado" },
  { value: "Hospital Borda", label: "Hospital Borda" },
  { value: "Hospital de emergencias psiquiatricas Alvear", label: "Hospital de emergencias psiquiatricas Alvear" },
  { value: "Hospital Moyano", label: "Hospital Moyano" },
  { value: "Salida fuera del diagrama", label: "Salida fuera del diagrama" },
  { value: "Salida laboral", label: "Salida laboral" },
  { value: "Salida por estudio", label: "Salida por estudio" },
];

interface SelectAcontecimientoAtProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const Modalidad: React.FC<SelectAcontecimientoAtProps> = ({ value, onChange }) => {
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

export default Modalidad;