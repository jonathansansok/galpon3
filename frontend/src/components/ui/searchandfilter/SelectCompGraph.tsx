//frontend\src\components\ui\searchandfilter\SelectCompGraph.tsx
"use client";

import { FC, useState, useEffect } from "react";

interface SelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
  className?: string; // Nueva prop para la clase CSS adicional
}

const Select: FC<SelectProps> = ({ selectedValue, onChange, label, options, className }) => {
  return (
    <div className="w-full">
      <label htmlFor="underline_select" className="sr-only">
        {label}
      </label>
      <select
        id="underline_select"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className={`block py-2.5 px-4 w-full text-sm font-semibold text-black border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer rounded-lg ${className}`}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface SelectCompWithFilterProps {
  initialEstablecimiento?: string;
  initialModuloUr?: string;
  initialPabellon?: string;
  onEstablecimientoChange: (value: string) => void;
  onModuloUrChange: (value: string) => void;
  onPabellonChange?: (value: string) => void; // Hacer opcional
}

const SelectCompWithFilter: FC<SelectCompWithFilterProps> = ({
  initialEstablecimiento = "",
  initialModuloUr = "",
  initialPabellon = "",
  onEstablecimientoChange,
  onModuloUrChange,
  onPabellonChange,
}) => {
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<string>(initialEstablecimiento);
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(initialModuloUr);
  const [selectedPabellon, setSelectedPabellon] = useState<string>(initialPabellon);
  const [establecimientos, setEstablecimientos] = useState<{ value: string; label: string }[]>([]);
  const [modulosUr, setModulosUr] = useState<{ value: string; label: string }[]>([]);
  const [pabellones, setPabellones] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const response = await fetch("/data/json/alojs.json");
        const data = await response.json();
        const keys = Object.keys(data);
        const formattedOptions = keys.map((key) => ({
          value: key,
          label: key,
        }));
        setEstablecimientos(formattedOptions);
      } catch (error) {
        console.error("Error al obtener establecimientos:", error);
      }
    };

    fetchEstablecimientos();
  }, []);

  useEffect(() => {
    if (selectedEstablecimiento) {
      const fetchModulosUr = async () => {
        try {
          const response = await fetch("/data/json/alojs.json");
          const data = await response.json();
          const modulos = Object.keys(data[selectedEstablecimiento]);
          const formattedOptions = modulos.map((key) => ({
            value: key,
            label: key,
          }));
          setModulosUr(formattedOptions);
        } catch (error) {
          console.error("Error al obtener modulosUr:", error);
        }
      };

      fetchModulosUr();
    } else {
      setModulosUr([]);
    }
  }, [selectedEstablecimiento]);

  useEffect(() => {
    if (selectedModuloUr) {
      const fetchPabellones = async () => {
        try {
          const response = await fetch("/data/json/alojs.json");
          const data = await response.json();
          const pabellones = Object.keys(data[selectedEstablecimiento][selectedModuloUr]);
          const formattedOptions = pabellones.map((key: string) => ({
            value: key,
            label: key,
          }));
          setPabellones(formattedOptions);
        } catch (error) {
          console.error("Error al obtener pabellones:", error);
        }
      };

      fetchPabellones();
    } else {
      setPabellones([]);
    }
  }, [selectedModuloUr, selectedEstablecimiento]);

  return (
    <div className="w-full flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4 items-start sm:items-end p-5 bg-[rgba(255,255,255,0.8)] shadow-lg rounded-lg">
      <Select
        label="Establecimiento"
        selectedValue={selectedEstablecimiento}
        onChange={(value) => {
          setSelectedEstablecimiento(value);
          setSelectedModuloUr("");
          setSelectedPabellon("");
          onEstablecimientoChange(value);
        }}
        options={establecimientos}
        className="bg-[rgba(172,93,97,0.9)]" 
      />
      {selectedEstablecimiento && (
        <Select
          label="Modulo-U.R."
          selectedValue={selectedModuloUr}
          onChange={(value) => {
            setSelectedModuloUr(value);
            setSelectedPabellon("");
            onModuloUrChange(value);
          }}
          options={modulosUr}
          className="bg-[rgba(173,216,230,0.9)]" // Azul claro
        />
      )}
      {selectedModuloUr && (
        <Select
          label="Pabellon"
          selectedValue={selectedPabellon}
          onChange={(value) => {
            setSelectedPabellon(value);
            if (onPabellonChange) onPabellonChange(value);
          }}
          options={pabellones}
          className="bg-[rgba(221,160,221,0.9)]" // Púrpura claro
        />
      )}
    </div>
  );
};

export default SelectCompWithFilter;