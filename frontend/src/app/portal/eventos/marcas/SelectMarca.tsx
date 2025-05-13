import React, { useEffect, useState } from "react";
import { getMarcas } from "./Marcas.api";
import { FaSyncAlt } from "react-icons/fa"; // Ícono de actualización
import Swal from "sweetalert2"; // SweetAlert para notificaciones

interface SelectFieldProps {
  name: string;
  label: string;
  register: any;
}

const SelectMarca: React.FC<SelectFieldProps> = ({ name, label, register }) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el estado de carga

  const fetchMarcas = async () => {
    Swal.fire({
      title: "Actualizando marcas...",
      text: "Por favor, espera mientras se actualizan las marcas.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Mostrar el spinner de carga
      },
    });

    setIsLoading(true); // Mostrar estado de carga
    try {
      const marcas = await getMarcas();
      setOptions(marcas.map((marca: any) => ({ value: marca.value, label: marca.label })));
      Swal.close(); // Cerrar el SweetAlert al finalizar
      Swal.fire("Actualizado", "Las marcas se han actualizado con éxito.", "success");
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
      Swal.close(); // Cerrar el SweetAlert al finalizar
      Swal.fire("Error", "Hubo un problema al actualizar las marcas.", "error");
    } finally {
      setIsLoading(false); // Ocultar estado de carga
    }
  };

  useEffect(() => {
    fetchMarcas(); // Obtener las marcas al cargar el componente
  }, []);

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
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
        {/* Botón de actualización */}
        <button
          type="button"
          onClick={fetchMarcas}
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Actualizar marcas"
        >
          <FaSyncAlt className={`text-white ${isLoading ? "animate-spin" : ""}`} />
        </button>
        {/* Botón "Nuevo" */}
        <button
          type="button"
          onClick={() => window.open("/portal/eventos/marcas", "_blank")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Nuevo
        </button>
      </div>
    </div>
  );
};

export default SelectMarca;