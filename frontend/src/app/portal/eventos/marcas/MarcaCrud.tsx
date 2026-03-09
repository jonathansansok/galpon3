import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import MarcaTable from "./MarcaTable";
import SelectMarca from "./SelectMarca";
import TableModelos from "./TableModelos";
import { getModelos } from "./Marcas.api";

interface Marca {
  id: string;
  value: string;
  label: string;
}

interface Modelo {
  id: number;
  label: string;
  value: string;
  marcaId: number;
  marcaLabel: string; // Nombre de la marca asociada
}

interface MarcaCrudProps {
  marcas: Marca[];
  onCreate: (newMarca: { value: string; label: string }) => void;
  onUpdate: (
    id: string,
    updatedMarca: { value: string; label: string }
  ) => void;
  onDelete: (id: string) => void;
  onCreateModelo: (newModelo: {
    label: string;
    value: string;
    marcaId: number;
  }) => void;
  privilege?: string | null;
}

const MarcaCrud: React.FC<MarcaCrudProps> = ({
  marcas,
  onCreate,
  onUpdate,
  onDelete,
  onCreateModelo,
  privilege,
}) => {
  const [newMarca, setNewMarca] = useState({ value: "", label: "" });
  const [newModelo, setNewModelo] = useState({
    label: "",
    value: "",
    marcaId: 0,
  });
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const generateValueFromLabel = (label: string) => {
    return label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleCreateMarca = () => {
    const marcaInput = document.getElementById("marca-label-input");
    if (newMarca.value.trim() && newMarca.label.trim()) {
      marcaInput?.classList.remove("border-red-500", "ring-1", "ring-red-500");
      marcaInput?.classList.add("border-gray-300");
      onCreate({ value: newMarca.value, label: newMarca.label });
      setNewMarca({ value: "", label: "" });
    } else {
      toast.error("El nombre de la marca es obligatorio");
      marcaInput?.classList.remove("border-gray-300");
      marcaInput?.classList.add("border-red-500", "ring-1", "ring-red-500");
      marcaInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      marcaInput?.focus();
    }
  };

  const handleCreateModelo = () => {
    const modeloInput = document.getElementById("modelo-label-input");
    if (newModelo.label.trim() && newModelo.value.trim() && newModelo.marcaId) {
      modeloInput?.classList.remove("border-red-500", "ring-1", "ring-red-500");
      modeloInput?.classList.add("border-gray-300");
      onCreateModelo(newModelo);
      setNewModelo({ ...newModelo, label: "", value: "" });
      fetchModelos();
    } else {
      if (!newModelo.marcaId) toast.error("Debe seleccionar una marca");
      if (!newModelo.label.trim()) toast.error("El nombre del modelo es obligatorio");
      modeloInput?.classList.remove("border-gray-300");
      modeloInput?.classList.add("border-red-500", "ring-1", "ring-red-500");
      modeloInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      modeloInput?.focus();
    }
  };

  const fetchModelos = useCallback(async () => {
    try {
      console.log("Iniciando fetchModelos en MarcaCrud..."); // Debug
      const data = await getModelos();
      console.log("Modelos obtenidos del backend en MarcaCrud:", data); // Debug

      // Asignar el nombre de la marca asociada a cada modelo
      const modelosConMarca = data.map((modelo: Modelo) => {
        const marca = marcas.find((m) => Number(m.id) === modelo.marcaId);
        return {
          ...modelo,
          marcaLabel: marca ? marca.label : "Desconocida", // Si no se encuentra la marca, mostrar "Desconocida"
        };
      });

      console.log("Modelos procesados con marca en MarcaCrud:", modelosConMarca); // Debug
      setModelos(modelosConMarca);
    } catch (error) {
      console.error("Error al obtener los modelos en MarcaCrud:", error);
    }
  }, [marcas]); // Dependencias: marcas

  useEffect(() => {
    fetchModelos();
  }, [fetchModelos]); // Dependencias: fetchModelos

  return (
    <div className="space-y-6">
      {/* Crear nueva marca */}
      <div className="space-y-4 p-6 rounded-lg shadow-2xl">
        <h3 className="text-xl font-semibold text-blue-700">
          Crear nueva marca
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo visible para "Etiqueta visible" */}
          <input
            id="marca-label-input"
            type="text"
            placeholder="Etiqueta visible"
            value={newMarca.label}
            onChange={(e) => {
              const label = e.target.value;
              setNewMarca({ label, value: generateValueFromLabel(label) });
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          />

          {/* Campo oculto para "Valor (value)" */}
          <input
            type="hidden"
            value={newMarca.value}
            onChange={(e) =>
              setNewMarca({ ...newMarca, value: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleCreateMarca}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Crear
        </button>

        {/* Tabla de marcas */}
        <MarcaTable marcas={marcas} onUpdate={onUpdate} onDelete={onDelete} privilege={privilege} />
      </div>

      {/* Crear nuevo modelo */}
      <div className="space-y-4  p-6 rounded-lg shadow-md bg-green-200">
        <h3 className="text-xl font-semibold text-green-700">
          Crear nuevo modelo
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <SelectMarca
            name="marcaId"
            label="Seleccionar marca"
            register={() => {}}
            watch={() => {}} // Agregar un valor predeterminado para evitar el error
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewModelo({ ...newModelo, marcaId: Number(e.target.value) })
            }
          />
          <input
            id="modelo-label-input"
            type="text"
            placeholder="Etiqueta visible del modelo"
            value={newModelo.label}
            onChange={(e) => {
              const label = e.target.value;
              setNewModelo({
                ...newModelo,
                label,
                value: generateValueFromLabel(label),
              });
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          />
        </div>
        <button
          onClick={handleCreateModelo}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Crear Modelo
        </button>
        {/* Tabla de modelos */}
        <TableModelos
          modelos={modelos}
          onUpdate={fetchModelos} // Recargar la lista de modelos después de actualizar
          onDelete={fetchModelos} // Recargar la lista de modelos después de eliminar
          privilege={privilege}
        />
      </div>
    </div>
  );
};

export default MarcaCrud;