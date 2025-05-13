import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

interface Marca {
  id: string;
  value: string;
  label: string;
}

interface MarcaTableProps {
  marcas: Marca[];
  onUpdate: (id: string, updatedMarca: { value: string; label: string }) => void;
  onDelete: (id: string) => void;
}

const MarcaTable: React.FC<MarcaTableProps> = ({ marcas, onUpdate, onDelete }) => {
  const [sortColumn, setSortColumn] = useState<keyof Marca | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof Marca) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id: string, label: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar la marca "${label}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire("Eliminado", "La marca ha sido eliminada.", "success");
      }
    });
  };

  const generateValueFromLabel = (label: string) => {
    return label
      .toLowerCase()
      .replace(/\s+/g, "-") // Reemplazar espacios por guiones
      .replace(/[^a-z0-9-]/g, ""); // Eliminar caracteres especiales
  };

  const handleEdit = (id: string, currentValue: string, currentLabel: string) => {
    Swal.fire({
      title: "Editar Marca",
      html: `
        <label for="label" class="block text-left font-semibold mb-2">Etiqueta visible:</label>
        <input id="label" class="swal2-input" value="${currentLabel}" />
        <label for="value" class="block text-left font-semibold mb-2">Valor (value):</label>
        <input id="value" class="swal2-input" value="${currentValue}" />
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
          valueInput.value = generateValueFromLabel(labelInput.value);
        });
      },
      preConfirm: () => {
        const label = (document.getElementById("label") as HTMLInputElement).value;
        const value = (document.getElementById("value") as HTMLInputElement).value;

        if (!label.trim() || !value.trim()) {
          Swal.showValidationMessage("Ambos campos son obligatorios.");
          return null;
        }

        return { label, value };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { label, value } = result.value;
        onUpdate(id, { label, value });
        Swal.fire("Actualizado", "La marca ha sido actualizada con éxito.", "success");
      }
    });
  };

  const sortedMarcas = [...marcas].sort((a, b) => {
    if (!sortColumn) return 0;
    const direction = sortDirection === "asc" ? 1 : -1;
    return a[sortColumn].localeCompare(b[sortColumn]) * direction;
  });

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Acciones</th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("label")}
            >
              Etiqueta visible
              <span className="ml-2">▲▼</span>
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("value")}
            >
              Valor (value)
              <span className="ml-2">▲▼</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMarcas.map((marca, index) => (
            <tr
              key={marca.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(marca.id, marca.value, marca.label)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(marca.id, marca.label)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
              <td className="px-4 py-2">{marca.label}</td>
              <td className="px-4 py-2">{marca.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarcaTable;