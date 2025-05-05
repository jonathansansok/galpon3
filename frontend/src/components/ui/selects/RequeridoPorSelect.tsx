import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesRequeridoPor: Option[] = [
  { value: "PI INTERNO", label: "PI INTERNO" },
  { value: "PHD", label: "PHD" },
];

interface RequeridoPorSelectProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const RequeridoPorSelect: React.FC<RequeridoPorSelectProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group mb-4">
      <label htmlFor="requerido-por" className="block text-sm font-medium text-gray-700 mb-2">
        Requerido por:
      </label>
      <select
        id="requerido-por"
        name="requerido-por"
        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesRequeridoPor.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RequeridoPorSelect;