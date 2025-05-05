// frontend/src/components/ui/SelectCompWithFilter.tsx
"use client";

import { FC, useState, useEffect } from "react";

interface SelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
}

const Select: FC<SelectProps> = ({
  selectedValue,
  onChange,
  label,
  options,
}) => {
  return (
    <div className="w-full">
      <label htmlFor="underline_select" className="sr-only">
        {label}
      </label>
      <select
        id="underline_select"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
      >
        <option value="" disabled>
          {label}
        </option>
        <option value="todos">Todos</option>
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
  onPabellonChange: (value: string) => void;
}

const SelectCompWithFilter: FC<SelectCompWithFilterProps> = ({
  initialEstablecimiento = "",
  initialModuloUr = "",
  initialPabellon = "",
  onEstablecimientoChange,
  onModuloUrChange,
  onPabellonChange,
}) => {
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(initialEstablecimiento);
  const [selectedModuloUr, setSelectedModuloUr] =
    useState<string>(initialModuloUr);
  const [selectedPabellon, setSelectedPabellon] =
    useState<string>(initialPabellon);
  const [establecimientos, setEstablecimientos] = useState<
    { value: string; label: string }[]
  >([]);
  const [modulosUr, setModulosUr] = useState<{ value: string; label: string }[]>(
    []
  );
  const [pabellones, setPabellones] = useState<{ value: string; label: string }[]>(
    []
  );

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
          const formattedOptions = pabellones.map((key) => ({
            value: key,
            label: key,
          }));
          setPabellones(formattedOptions);
        } catch (error) {
          
        }
      };

      fetchPabellones();
    } else {
      setPabellones([]);
    }
  }, [selectedModuloUr, selectedEstablecimiento]);

  return (
<div className="w-full flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4 items-start sm:items-end p-5 bg-white shadow-lg rounded-lg">
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
        />
      )}
      {selectedModuloUr && (
        <Select
          label="Pabellón"
          selectedValue={selectedPabellon}
          onChange={(value) => {
            setSelectedPabellon(value);
            onPabellonChange(value);
          }}
          options={pabellones}
        />
      )}
    </div>
  );
};

export default SelectCompWithFilter;