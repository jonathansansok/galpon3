// frontend/src/components/ui/selects/MotivoReintegroSelect.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesMotivoReintegro: Option[] = [
  { value: "", label: "Motivo de reintegro:" },
  { value: "Finalización de atención", label: "Finalización de atención" },
  { value: "Alta médica", label: "Alta médica" },
  {
    value: "Sin fecha de reintegro estimada",
    label: "Sin fecha de reintegro estimada",
  },
];

interface MotivoReintegroSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const MotivoReintegroSelect: React.FC<MotivoReintegroSelectProps> = ({
  value,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
 {/*      <label htmlFor="motivoReintegro">Motivo del reintegro:</label> */}
      <select
        id="motivoReintegro"
        name="motivoReintegro"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesMotivoReintegro.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MotivoReintegroSelect;
