//frontend\src\components\ui\SelectAnidaciones.tsx
"use client";

import { FC, useState, useEffect } from "react";

interface SelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
}

const Select: FC<SelectProps> = ({ selectedValue, onChange, label, options }) => {
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface SelectCompProps {
  initialEstablecimiento?: string;
  initialModuloUr?: string;
  initialPabellon?: string;
  initialCelda?: string;
  onEstablecimientoChange: (value: string) => void;
  onModuloUrChange: (value: string) => void;
  onPabellonChange?: (value: string) => void;
  onCeldaChange?: (value: string) => void;
  showPabellon?: boolean;
  showCelda?: boolean;
}

const SelectComp: FC<SelectCompProps> = ({
  initialEstablecimiento = "",
  initialModuloUr = "",
  initialPabellon = "",
  initialCelda = "",
  onEstablecimientoChange,
  onModuloUrChange,
  onPabellonChange,
  onCeldaChange,
  showPabellon = true,
  showCelda = true,
}) => {
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<string>(initialEstablecimiento);
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(initialModuloUr);
  const [selectedPabellon, setSelectedPabellon] = useState<string>(initialPabellon);
  const [selectedCelda, setSelectedCelda] = useState<string>(initialCelda);
  const [establecimientos, setEstablecimientos] = useState<{ value: string; label: string }[]>([]);
  const [modulosUr, setModulosUr] = useState<{ value: string; label: string }[]>([]);
  const [pabellones, setPabellones] = useState<{ value: string; label: string }[]>([]);
  const [celdas, setCeldas] = useState<{ value: string; label: string }[]>([]);

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
        console.error("Error al cargar establecimientos:", error);
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
          console.error("Error al cargar módulos UR:", error);
        }
      };

      fetchModulosUr();
    } else {
      setModulosUr([]);
    }
  }, [selectedEstablecimiento]);

  useEffect(() => {
    if (selectedModuloUr && showPabellon) {
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
          console.error("Error al cargar pabellones:", error);
        }
      };

      fetchPabellones();
    } else {
      setPabellones([]);
    }
  }, [selectedModuloUr, selectedEstablecimiento, showPabellon]);

  useEffect(() => {
    if (selectedPabellon && showCelda) {
      const fetchCeldas = async () => {
        try {
          const response = await fetch("/data/json/alojs.json");
          const data = await response.json();
          const celdas = data[selectedEstablecimiento][selectedModuloUr][selectedPabellon];
          const formattedOptions = celdas.map((key: string) => ({
            value: key,
            label: key,
          }));
          setCeldas(formattedOptions);
        } catch (error) {
          console.error("Error al cargar celdas:", error);
        }
      };

      fetchCeldas();
    } else {
      setCeldas([]);
    }
  }, [selectedPabellon, selectedModuloUr, selectedEstablecimiento, showCelda]);

  return (
    <div className="flex space-x-4">
      <Select
        label="Seleccione Establecimiento"
        selectedValue={selectedEstablecimiento}
        onChange={(value) => {
          setSelectedEstablecimiento(value);
          setSelectedModuloUr("");
          setSelectedPabellon("");
          setSelectedCelda("");
          onEstablecimientoChange(value);
        }}
        options={establecimientos}
      />
      <Select
        label="Modulo-U.R."
        selectedValue={selectedModuloUr}
        onChange={(value) => {
          setSelectedModuloUr(value);
          setSelectedPabellon("");
          setSelectedCelda("");
          onModuloUrChange(value);
        }}
        options={modulosUr}
      />
      {showPabellon && (
        <Select
          label="Elige Pabellon"
          selectedValue={selectedPabellon}
          onChange={(value) => {
            setSelectedPabellon(value);
            setSelectedCelda("");
            if (onPabellonChange) {
              onPabellonChange(value);
            }
          }}
          options={pabellones}
        />
      )}
      {showCelda && (
        <Select
          label="Elige Celda"
          selectedValue={selectedCelda}
          onChange={(value) => {
            setSelectedCelda(value);
            if (onCeldaChange) {
              onCeldaChange(value);
            }
          }}
          options={celdas}
        />
      )}
    </div>
  );
};

export default SelectComp;