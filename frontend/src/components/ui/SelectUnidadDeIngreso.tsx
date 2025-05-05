import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const unidadesIngreso: Option[] = [
  { value: "", label: "Seleccione Unidad de Ingreso" },
  { value: "U. 28", label: "UNIDAD. 28" },
  { value: "ALC. PENAL FED. (U.29)", label: "ALCAIDIA PENAL FEDERAL (U.29)" },
  { value: "ALC. PAIVA", label: "ALCAIDIA MIGUEL ANGEL PAIVA" },
  { value: "ALC. JUNCAL", label: "ALCAIDIA JUNCAL" },
  { value: "ALC. CORR. LAVALLE", label: "ALCAIDIA CORRECCIONAL LAVALLE" },
  { value: "ALC. PENAL INSP. R. PETINATTO", label: "ALCAIDIA PENAL INSPECTOR ROBERTO PETINATTO" },
  { value: "ALC. CPO. MED FORENSE", label: "ALCAIDIA CUERPO MEDICO FORENSE" },
  { value: "ALC. YRIGOYEN", label: "ALCAIDIA YRIGOYEN" },
  { value: "CPF CABA", label: "CPF CABA" },
  { value: "CPF I", label: "CPF I" },
  { value: "CPF II", label: "CPF II" },
  { value: "CPF III", label: "CPF III" },
  { value: "CPF IV", label: "CPF IV" },
  { value: "CPF V", label: "CPF V" },
  { value: "CPF VI", label: "CPF VI" },
  { value: "CPFVII (EX-U31)", label: "CPFVII (EX-U31)" },
  { value: "CFJA", label: "CFJA" },
  { value: "UNIDAD 4", label: "UNIDAD 4" },
  { value: "UNIDAD 5", label: "UNIDAD 5" },
  { value: "UNIDAD 6", label: "UNIDAD 6" },
  { value: "UNIDAD 7", label: "UNIDAD 7" },
  { value: "UNIDAD 8", label: "UNIDAD 8" },
  { value: "UNIDAD 10", label: "UNIDAD 10" },
  { value: "UNIDAD 11", label: "UNIDAD 11" },
  { value: "UNIDAD 12", label: "UNIDAD 12" },
  { value: "UNIDAD 13", label: "UNIDAD 13" },
  { value: "UNIDAD 14", label: "UNIDAD 14" },
  { value: "UNIDAD 15", label: "UNIDAD 15" },
  { value: "UNIDAD 16", label: "UNIDAD 16" },
  { value: "UNIDAD 17", label: "UNIDAD 17" },
  { value: "UNIDAD 19", label: "UNIDAD 19" },
  { value: "UNIDAD 21", label: "UNIDAD 21" },
  { value: "UNIDAD 22", label: "UNIDAD 22" },
  { value: "UNIDAD 25", label: "UNIDAD 25" },
  { value: "UNIDAD 30", label: "UNIDAD 30" },
  { value: "UNIDAD 32", label: "UNIDAD 32" },
  { value: "UNIDAD 33", label: "UNIDAD 33" },
  { value: "UNIDAD 34", label: "UNIDAD 34" },
  { value: "UNIDAD 35", label: "UNIDAD 35" },
];

interface SelectUnidadDeIngresoProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectUnidadDeIngreso: React.FC<SelectUnidadDeIngresoProps> = ({ value, onChange }) => {
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
      {unidadesIngreso.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectUnidadDeIngreso;