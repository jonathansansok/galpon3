// frontend/src/components/ui/SelectIVA.tsx
import React from "react";
import StyledSelect from "@/components/ui/StyledSelect";

interface SelectIVAProps {
  value: string;
  onChange: (value: string) => void;
}

const opcionesIVA = [
  { value: "Consumidor Final", label: "Consumidor Final" },
  { value: "Responsable Inscripto", label: "Responsable Inscripto" },
  { value: "Monotributista", label: "Monotributista" },
  { value: "Exento", label: "Exento" },
];

const SelectIVA: React.FC<SelectIVAProps> = ({ value, onChange }) => {
  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      options={opcionesIVA}
      label="Condición frente al IVA"
      name="iva"
    />
  );
};

export default SelectIVA;