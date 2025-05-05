import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesProcedencia: Option[] = [
  { value: "", label: "Seleccione Procedencia" },
  { value: "P.F.A.", label: "P.F.A." },
  { value: "Ser.Pen.BA", label: "SER.PEN.B.A." },
  { value: "POL. CIUDAD", label: "POLICÍA DE LA CIUDAD" },
  { value: "G.N.A", label: "GENDARMERÍA NACIONAL ARGENTINA" },
  { value: "P.S.A", label: "POLICÍA DE SEGURIDAD AEROPORTUARIA" },
  { value: "P.N.A.", label: "PREFECTURA NAVAL ARGENTINA" },
  { value: "P.B.A.", label: "POLICÍA DE LA PROVINCIA DE BUENOS AIRES" },
  { value: "DIR. TRAS.", label: "DIRECCIÓN DE TRASLADOS" },
];

interface SelectProcedenciaProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectProcedencia: React.FC<SelectProcedenciaProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <select
      className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
      value={selectedValue}
      onChange={(e) => {
        setSelectedValue(e.target.value);
        onChange(e.target.value);
      }}
    >
      {opcionesProcedencia.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectProcedencia;