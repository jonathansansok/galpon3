// frontend/src/components/ui/SelectOrgCrim.tsx
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const opcionesOrgCrim: Option[] = [
  { value: "", label: "¿Pertenece a una organización criminal?"},
  { value: "Pertenece a una organización criminal", label: "Pertenece a una organización criminal" },
  { value: "En investigación", label: "En investigación" },
  { value: "NO pertenece a una organización criminal", label: "NO pertenece a una organización criminal" },
];

interface SelectOrgCrimProps {
  orgCrim: string;
  cualorg: string;
  onChange: (orgCrim: string, cualorg: string) => void;
}

const SelectOrgCrim: React.FC<SelectOrgCrimProps> = ({ orgCrim, cualorg, onChange }) => {
  const [selectedOrgCrim, setSelectedOrgCrim] = useState<string>(orgCrim);
  const [cualOrgValue, setCualOrgValue] = useState<string>(cualorg);

  useEffect(() => {
    setSelectedOrgCrim(orgCrim);
    setCualOrgValue(cualorg);
  }, [orgCrim, cualorg]);

  const handleOrgCrimChange = (value: string) => {
    setSelectedOrgCrim(value);
    if (value === "NO pertenece a una organización criminal") {
      setCualOrgValue("");
      onChange(value, "");
    } else {
      onChange(value, cualOrgValue);
    }
  };

  const handleCualOrgChange = (value: string) => {
    setCualOrgValue(value);
    onChange(selectedOrgCrim, value);
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="orgCrim" className="redDiv"></label>
        <select
        
          id="orgCrim"
          name="orgCrim"
          className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
          value={selectedOrgCrim}
          onChange={(e) => handleOrgCrimChange(e.target.value)}
        >
          {opcionesOrgCrim.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {(selectedOrgCrim === "Pertenece a una organización criminal" || selectedOrgCrim === "En investigación") && (
        <div className="form-group" id="otroInput">
           <input
          placeholder="Nombre Org. criminal?"
            type="text"
            id="cualorg"
            name="cualorg"
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
            value={cualOrgValue}
            onChange={(e) => handleCualOrgChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default SelectOrgCrim;