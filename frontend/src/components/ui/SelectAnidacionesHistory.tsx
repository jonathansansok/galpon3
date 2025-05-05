//frontend\src\components\ui\SelectAnidacionesHistory.tsx
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
  comp: string | null; // El valor de comp desde Zustand
  initialModuloUr?: string;
  initialPabellon?: string;
  onEstablecimientoChange: (value: string) => void;
  onModuloUrChange: (value: string) => void;
  onPabellonChange: (value: string) => void;
  onFilterClick: (filters: {
    establecimiento: string;
    modulo_ur?: string;
    pabellon?: string;
  }) => void; // Nueva prop para manejar el click del botón de filtrar
}

const SelectComp: FC<SelectCompProps> = ({
  comp,
  initialModuloUr = "",
  initialPabellon = "",
  onEstablecimientoChange,
  onModuloUrChange,
  onPabellonChange,
  onFilterClick,
}) => {
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(comp || ""); // Inicializar con el valor de comp si está definido
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
    console.log("Valor de comp recibido:", comp);

    if (comp) {
      // Si comp está definido, solo mostrar ese establecimiento
      setEstablecimientos([{ value: comp, label: comp }]);
      setSelectedEstablecimiento(comp);
      console.log("Establecimientos restringidos a:", [{ value: comp, label: comp }]);
    } else {
      // Si comp no está definido, cargar todos los establecimientos
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
          console.log("Establecimientos cargados:", formattedOptions);
        } catch (error) {
          console.error("Error al cargar establecimientos:", error);
        }
      };

      fetchEstablecimientos();
    }
  }, [comp]);

  useEffect(() => {
    if (selectedEstablecimiento) {
      console.log("Establecimiento seleccionado:", selectedEstablecimiento);
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
          console.log("Módulos cargados para:", selectedEstablecimiento, formattedOptions);
        } catch (error) {
          console.error("Error al cargar módulos:", error);
        }
      };

      fetchModulosUr();
    } else {
      setModulosUr([]);
    }
  }, [selectedEstablecimiento]);

  useEffect(() => {
    if (selectedModuloUr) {
      console.log("Módulo seleccionado:", selectedModuloUr);
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
          console.log("Pabellones cargados para:", selectedModuloUr, formattedOptions);
        } catch (error) {
          console.error("Error al cargar pabellones:", error);
        }
      };

      fetchPabellones();
    } else {
      setPabellones([]);
    }
  }, [selectedModuloUr, selectedEstablecimiento]);

  return (
    <div className="flex space-x-4">
      <Select
        label="Establecimiento"
        selectedValue={selectedEstablecimiento}
        onChange={(value) => {
          console.log("Cambio en establecimiento:", value);
          if (comp && value !== comp) {
            console.warn(
              `El usuario intentó seleccionar un establecimiento no permitido: ${value}`
            );
            alert("No tienes permiso para seleccionar este establecimiento.");
            return;
          }
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
            console.log("Cambio en módulo:", value);
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
            console.log("Cambio en pabellón:", value);
            setSelectedPabellon(value);
            onPabellonChange(value);
          }}
          options={pabellones}
        />
      )}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
        onClick={() =>
          onFilterClick({
            establecimiento: selectedEstablecimiento,
            modulo_ur: selectedModuloUr || undefined, // Si no hay módulo seleccionado, no lo incluye
            pabellon: selectedPabellon || undefined, // Si no hay pabellón seleccionado, no lo incluye
          })
        }
      >
        Filtrar
      </button>
    </div>
  );
};

export default SelectComp;