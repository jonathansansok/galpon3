//frontend\src\components\ui\SelectTipoDoc.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesTipoDocumento: Option[] = [
  { value: "", label: "Selecciona el Tipo de Documento" },
  { value: "DNI", label: "DNI (Documento Nacional de Identidad)" },
  { value: "DNI EXT.", label: "DNI Extranjero" },
  { value: "Ced. Id.", label: "DNI Cédula de identidad" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "LE", label: "LE (Libreta de Enrolamiento)" },
  { value: "LC", label: "LC (Libreta Cívica)" },
];

interface SelectTipoDocProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectTipoDoc: React.FC<SelectTipoDocProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [options, setOptions] = useState<Option[]>(opcionesTipoDocumento);
  const [newOption, setNewOption] = useState<string>("");

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleAddOption = () => {
    if (newOption.trim() !== "") {
      const newOptionObj = { value: newOption, label: newOption };
      setOptions((prevOptions) => [...prevOptions, newOptionObj]);
      setSelectedValue(newOption);
      onChange(newOption);
      setNewOption(""); // Limpiar el campo de entrada
    }
  };

  return (
    <div>
      <select
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mt-2 flex items-center">
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="Agregar nuevo tipo"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <button
          type="button"
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
          onClick={handleAddOption}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default SelectTipoDoc;