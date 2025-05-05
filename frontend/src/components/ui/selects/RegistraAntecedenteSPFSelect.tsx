// frontend/src/components/ui/selects/RegistraAntecedenteSPFSelect.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesAntecedenteSPF: Option[] = [
  { value: "", label: "Seleccione" },
  { value: "Si", label: "Sí" },
  { value: "No", label: "No" },
];

interface RegistraAntecedenteSPFSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const RegistraAntecedenteSPFSelect: React.FC<RegistraAntecedenteSPFSelectProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
      <label htmlFor="registraAntecedenteSPF" className="redDiv">REGISTRA ANTECEDENTE EN SPF:</label>
      <select
        id="registraAntecedenteSPF"
        name="registraAntecedenteSPF"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesAntecedenteSPF.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegistraAntecedenteSPFSelect;