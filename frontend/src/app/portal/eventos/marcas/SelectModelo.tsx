//frontend\src\app\portal\eventos\marcas\SelectModelo.tsx
import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { getModelos } from "./Marcas.api"; // Asegúrate de que esta función exista y obtenga los modelos
import { FaSyncAlt } from "react-icons/fa"; // Ícono de actualización
import Swal from "sweetalert2"; // SweetAlert para notificaciones

interface SelectFieldProps {
  name: string;
  label: string;
  register: any;
  watch: any; // Agregar watch como prop
  marcaId: string; // ID de la marca seleccionada
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void; // Agregar onChange como opcional
}

const SelectModelo: React.FC<SelectFieldProps> = ({
  name,
  label,
  register,
  watch,
  marcaId,
  onChange,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el estado de carga

  const fetchModelos = useCallback(async () => {
    if (!marcaId) {
      console.log("No se proporcionó marcaId en SelectModelo."); // Debug
      setOptions([]); // Si no hay marca seleccionada, limpiar los modelos
      return;
    }

    console.log("Iniciando fetchModelos en SelectModelo para marcaId:", marcaId); // Debug

    setIsLoading(true); // Mostrar estado de carga
    try {
      const modelos = await getModelos(); // Obtener todos los modelos
      console.log("Modelos obtenidos del backend en SelectModelo:", modelos); // Debug

      const filteredModelos = modelos.filter(
        (modelo: any) => modelo.marcaId === parseInt(marcaId)
      ); // Filtrar por marcaId
      console.log("Modelos filtrados en SelectModelo:", filteredModelos); // Debug

      setOptions(
        filteredModelos.map((modelo: any) => ({
          value: modelo.id.toString(),
          label: modelo.label,
        }))
      ); // Mapear a opciones
    } catch (error) {
      console.error("Error al obtener los modelos en SelectModelo:", error);
    } finally {
      setIsLoading(false); // Ocultar estado de carga
    }
  }, [marcaId]);

  useEffect(() => {
    fetchModelos(); // Obtener los modelos al cambiar la marca seleccionada
  }, [fetchModelos]);

  useEffect(() => {
    // Asegúrate de que el valor predeterminado se establece solo cuando las opciones están listas
    const currentValue = watch(name);
    if (currentValue && options.some((option) => option.value === currentValue)) {
      console.log(`Estableciendo valor predeterminado para ${name}:`, currentValue);
    }
  }, [options, watch, name]);

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <select
          id={name}
          {...register(name)}
          onChange={onChange}
          value={watch(name)} // Configura el valor predeterminado
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seleccione un modelo</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Botón de actualización */}
        <button
          type="button"
          onClick={fetchModelos}
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Actualizar modelos"
        >
          <FaSyncAlt
            className={`text-white ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default SelectModelo;