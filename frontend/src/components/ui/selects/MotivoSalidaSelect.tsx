// frontend/src/components/ui/selects/MotivoSalidaSelect.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesMotivoSalida: Option[] = [
  { value: "", label: "Motivo de salida" },
  { value: "Turno programado", label: "Turno programado" },
  { value: "Urgencia", label: "Urgencia" },
  { value: "Emergencia", label: "Emergencia" },
  { value: "Control", label: "Control" },
  { value: "Internación", label: "Internación" },
  { value: "Orden judicial", label: "Orden judicial" },
];

interface MotivoSalidaSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const MotivoSalidaSelect: React.FC<MotivoSalidaSelectProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
{/*       <label htmlFor="motivoSalida">Motivo de la salida:</label> */}
      <select
        id="motivoSalida"
        name="motivoSalida"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesMotivoSalida.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MotivoSalidaSelect;