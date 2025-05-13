//frontend\src\components\ui\marca\SelectMarca.tsx
import React, { useEffect, useState } from "react";
import { getAutos } from "./Autos.api";

interface SelectFieldProps {
  name: string;
  label: string;
  register: any;
}

const SelectMarca: React.FC<SelectFieldProps> = ({ name, label, register }) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchAutos = async () => {
      try {
        const autos = await getAutos();
        setOptions(autos.map((auto: any) => ({ value: auto.value, label: auto.label })));
      } catch (error) {
        console.error("Error al obtener las marcas de autos:", error);
      }
    };

    fetchAutos();
  }, []);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMarca;