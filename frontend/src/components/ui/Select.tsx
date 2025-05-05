// frontend\src\components\ui\Select.tsx
"use client";

import { FC, useState, useEffect } from "react";

interface SelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  jsonUrl: string; // URL del archivo JSON (o API) para obtener las opciones
}

const Select: FC<SelectProps> = ({
  selectedValue,
  onChange,
  label,
  jsonUrl,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([
    { value: "No definido al momento", label: "No definido al momento" },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(jsonUrl);
        const data = await response.json();

        const keys = Object.keys(data);
        const formattedOptions = keys.map((key) => ({
          value: key,
          label: key,
        }));

        setOptions((prevOptions) => [
          prevOptions[0], // Mantener la opción "No definido al momento" como la primera
          ...formattedOptions,
        ]);
      } catch (error) {
        setError("Error al cargar las opciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [jsonUrl]);

  // Agregar dinámicamente el valor seleccionado si no está en las opciones
  useEffect(() => {
    if (
      selectedValue &&
      !options.some((option) => option.value === selectedValue)
    ) {
      setOptions((prevOptions) => [
        ...prevOptions,
        { value: selectedValue, label: selectedValue },
      ]);
    }
  }, [selectedValue, options]);

  if (loading) {
    return <div>Cargando opciones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

export default Select;