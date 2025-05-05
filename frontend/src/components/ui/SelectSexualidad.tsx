import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesSexualidad: Option[] = [
  { value: "", label: "Seleccione sexualidad" },
  { value: "No declara", label: "No declara" },
  { value: "Heterosexual", label: "Heterosexual" },
  { value: "Homosexual", label: "Homosexual" },
  { value: "Bisexual", label: "Bisexual" },
  { value: "Pansexual", label: "Pansexual" },
  { value: "Asexual", label: "Asexual" },
  { value: "Demisexual", label: "Demisexual" },
  { value: "Polisexual", label: "Polisexual" },
  { value: "Queer", label: "Queer" },
  { value: "Androsexual", label: "Androsexual" },
  { value: "Ginecosocial", label: "Ginecosocial" },
  { value: "Bicurioso", label: "Bicurioso" },
  { value: "Heteroflexible", label: "Heteroflexible" },
  { value: "Homoflexible", label: "Homoflexible" },
  { value: "Pomosexual", label: "Pomosexual" },
  { value: "Sapiosexual", label: "Sapiosexual" },
  { value: "Graysexual", label: "Graysexual" },
  { value: "Demiromantic", label: "Demiromantic" },
  { value: "Aromantic", label: "Aromantic" },
  { value: "Autosexual", label: "Autosexual" },
  { value: "Cupiosexual", label: "Cupiosexual" },
  { value: "Demiagénero", label: "Demiagénero" },
  { value: "Genderqueer", label: "Genderqueer" },
  { value: "Bigénero", label: "Bigénero" },
  { value: "Trigénero", label: "Trigénero" },
  { value: "Agénero", label: "Agénero" },
  { value: "Transgénero", label: "Transgénero" },
  { value: "Cisgénero", label: "Cisgénero" },
  { value: "Genderfluid", label: "Genderfluid" },
  { value: "Intersexual", label: "Intersexual" },
  { value: "Omnisexual", label: "Omnisexual" },
  { value: "Pangénero", label: "Pangénero" },
  { value: "Neutrois", label: "Neutrois" },
  { value: "Bicuriosa", label: "Bicuriosa" },
  { value: "Gay", label: "Gay" },
  { value: "Lesbiana", label: "Lesbiana" },
  { value: "Homoafectivo", label: "Homoafectivo" },
  { value: "Homorromántico", label: "Homorromántico" },
  { value: "Plurisexual", label: "Plurisexual" },
  { value: "No-binario", label: "No binario" },
];

interface SelectSexualidadProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectSexualidad: React.FC<SelectSexualidadProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="form-group">
      <select
        id="sexualidad"
        name="sexualidad"
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onChange(e.target.value);
        }}
      >
        {opcionesSexualidad.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectSexualidad;