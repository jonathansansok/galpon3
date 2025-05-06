// frontend/src/components/ui/Condicion.tsx
import React from "react";
import StyledSelect from "@/components/ui/StyledSelect";

interface CondicionProps {
  value: string;
  onChange: (value: string) => void;
}

const opcionesCondicion = [
  { value: "Cliente", label: "Cliente" },
  { value: "Proveedor", label: "Proveedor" },
];

const Condicion: React.FC<CondicionProps> = ({ value, onChange }) => {
  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      options={opcionesCondicion}
      label="Condición"
      name="condicion"
    />
  );
};

export default Condicion;