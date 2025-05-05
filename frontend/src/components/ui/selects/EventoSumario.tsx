import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesEvento: Option[] = [
  { value: "", label: "Tipo de informe" },
  { value: "Sumario", label: "Sumario" },
  { value: "Información sumaria", label: "Información sumaria" },
];

interface EventoSumarioProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const EventoSumario: React.FC<EventoSumarioProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
      <select
        id="evento"
        name="evento"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesEvento.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventoSumario;