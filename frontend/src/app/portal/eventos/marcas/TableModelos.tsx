import React, { useState } from "react";
import { FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa"; // Íconos para editar, eliminar y actualizar
import Swal from "sweetalert2";
import { updateModelo, deleteModelo } from "./Marcas.api"; // Importar las funciones para actualizar y eliminar modelos

interface Modelo {
  id: number;
  label: string;
  value: string;
  marcaId: number;
  marcaLabel: string; // Nombre de la marca asociada
}

interface TableModelosProps {
  modelos: Modelo[];
  onUpdate: () => void; // Recargar la lista de modelos
  onDelete: () => void; // Recargar la lista de modelos
}

const TableModelos: React.FC<TableModelosProps> = ({
  modelos,
  onUpdate,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el estado de carga

  const handleRefresh = async () => {
    setIsLoading(true); // Activar el estado de carga
    try {
      await onUpdate(); // Llama a la función para recargar la lista de modelos
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  const handleEdit = async (modelo: Modelo) => {
    Swal.fire({
      title: "Editar Modelo",
      html: `
            <label for="label" class="block text-left font-semibold mb-2">Etiqueta visible:</label>
            <input id="label" class="swal2-input" value="${modelo.label}" />
            <label for="value" class="block text-left font-semibold mb-2">Valor (value):</label>
            <input id="value" class="swal2-input" value="${modelo.value}" />
          `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const labelInput = document.getElementById("label") as HTMLInputElement;
        const valueInput = document.getElementById("value") as HTMLInputElement;

        // Escuchar cambios en el campo `label` para autocompletar `value`
        labelInput.addEventListener("input", () => {
          valueInput.value = labelInput.value
            .toLowerCase()
            .replace(/\s+/g, "-") // Reemplazar espacios por guiones
            .replace(/[^a-z0-9-]/g, ""); // Eliminar caracteres especiales
        });
      },
      preConfirm: () => {
        const label = (document.getElementById("label") as HTMLInputElement)
          .value;
        const value = (document.getElementById("value") as HTMLInputElement)
          .value;

        if (!label.trim() || !value.trim()) {
          Swal.showValidationMessage("Ambos campos son obligatorios.");
          return null;
        }

        return { label, value };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { label, value } = result.value;
        try {
          await updateModelo(modelo.id, {
            label,
            value,
            marcaId: modelo.marcaId,
          });
          onUpdate(); // Recargar la lista de modelos
          Swal.fire(
            "Actualizado",
            "El modelo ha sido actualizado con éxito.",
            "success"
          );
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar el modelo.", "error");
        }
      }
    });
  };

  const handleDelete = (id: number, label: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el modelo "${label}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteModelo(id);
          onDelete(); // Recargar la lista de modelos
          Swal.fire("Eliminado", "El modelo ha sido eliminado.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el modelo.", "error");
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-4 mb-4">
        {/* Botón de refresh */}
        <button
          onClick={handleRefresh} // Llama a la función para recargar la lista de modelos
          className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Actualizar lista de modelos"
        >
          <FaSyncAlt
            className={`text-white ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
        {/* Título */}
        <h3 className="text-xl font-semibold">Lista de Modelos</h3>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-300">
            <th className="px-4 py-2 border text-left">Acciones</th>
            <th className="px-4 py-2 border text-left">ID</th>
            <th className="px-4 py-2 border text-left">Modelo</th>
            <th className="px-4 py-2 border text-left">Valor</th>
            <th className="px-4 py-2 border text-left">Marca Asociada</th>
          </tr>
        </thead>
        <tbody>
          {modelos.map((modelo, index) => (
            <tr
              key={modelo.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2 flex gap-2 justify-start">
                <button
                  onClick={() => handleEdit(modelo)}
                  className="text-yellow-500 hover:text-yellow-600"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(modelo.id, modelo.label)}
                  className="text-red-500 hover:text-red-600"
                  title="Eliminar"
                >
                  <FaTrash />
                </button>
              </td>
              <td className="px-4 py-2 border">{modelo.id}</td>
              <td className="px-4 py-2 border">{modelo.label}</td>
              <td className="px-4 py-2 border">{modelo.value}</td>
              <td className="px-4 py-2 border">{modelo.marcaLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableModelos;
