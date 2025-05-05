import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  style: React.CSSProperties;
}

const opcionesClasSeg: Option[] = [
  { value: "", label: "Seleccione clasificación", style: {} },
  { value: "ALTA", label: "ALTA", style: { fontWeight: "bold", backgroundColor: "#FFB3B3", color: "white", marginLeft: "5px" } },
  { value: "MEDIA", label: "MEDIA", style: { fontWeight: "bold", backgroundColor: "#FFFFB3", color: "black", marginLeft: "5px" } },
  { value: "BAJA", label: "BAJA", style: { fontWeight: "bold", backgroundColor: "#B3FFB3", color: "white", marginLeft: "5px" } },
];

interface SelectClasSegProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const ClasSegSelect: React.FC<SelectClasSegProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
      <select
        id="clas_seg"
        name="clas_seg"
        className="block w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer rounded-lg"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{
          color: selectedValue ? "black" : undefined,
          backgroundColor: selectedValue ? opcionesClasSeg.find(option => option.value === selectedValue)?.style.backgroundColor : "#FFDAB9",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        {opcionesClasSeg.map((option) => (
          <option key={option.value} value={option.value} style={{ ...option.style, borderRadius: selectedValue === option.value ? "8px" : undefined }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClasSegSelect;