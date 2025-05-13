//frontend\src\app\portal\eventos\marcas\MarcaCrud.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import MarcaTable from "./MarcaTable";
import SelectMarca from "./SelectMarca";

interface Marca {
  id: string;
  value: string;
  label: string;
}

interface MarcaCrudProps {
  marcas: Marca[];
  onCreate: (newMarca: { value: string; label: string }) => void;
  onUpdate: (id: string, updatedMarca: { value: string; label: string }) => void;
  onDelete: (id: string) => void;
  onCreateModelo: (newModelo: { label: string; value: string; marcaId: number }) => void;
}

const MarcaCrud: React.FC<MarcaCrudProps> = ({
  marcas,
  onCreate,
  onUpdate,
  onDelete,
  onCreateModelo,
}) => {
  const [newMarca, setNewMarca] = useState({ value: "", label: "" });
  const [newModelo, setNewModelo] = useState({ label: "", value: "", marcaId: 0 });

  // Función para generar automáticamente el value basado en el label
  const generateValueFromLabel = (label: string) => {
    return label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleCreateMarca = () => {
    if (newMarca.value.trim() && newMarca.label.trim()) {
      onCreate({ value: newMarca.value, label: newMarca.label });
      setNewMarca({ value: "", label: "" });
    } else {
      Swal.fire("Error", "Los campos 'value' y 'label' son obligatorios.", "error");
    }
  };

  const handleCreateModelo = () => {
    if (newModelo.label.trim() && newModelo.value.trim() && newModelo.marcaId) {
      onCreateModelo(newModelo);
      setNewModelo({ label: "", value: "", marcaId: 0 });
    } else {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Crear nueva marca */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Crear nueva marca</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Etiqueta visible"
            value={newMarca.label}
            onChange={(e) => {
              const label = e.target.value;
              setNewMarca({ label, value: generateValueFromLabel(label) });
            }}
            className="border rounded px-4 py-2 w-full md:w-1/2"
          />
          <input
            type="text"
            placeholder="Valor (value)"
            value={newMarca.value}
            onChange={(e) => setNewMarca({ ...newMarca, value: e.target.value })}
            className="border rounded px-4 py-2 w-full md:w-1/2"
          />
        </div>
        <button
          onClick={handleCreateMarca}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Crear
        </button>
      </div>

      {/* Crear nuevo modelo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Crear nuevo modelo</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <SelectMarca
            name="marcaId"
            label="Seleccionar marca"
            register={() => {}}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewModelo({ ...newModelo, marcaId: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Etiqueta visible del modelo"
            value={newModelo.label}
            onChange={(e) => {
              const label = e.target.value;
              setNewModelo({ ...newModelo, label, value: generateValueFromLabel(label) });
            }}
            className="border rounded px-4 py-2 w-full md:w-1/2"
          />
        </div>
        <button
          onClick={handleCreateModelo}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Crear Modelo
        </button>
      </div>

      {/* Tabla de marcas */}
      <MarcaTable marcas={marcas} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
};

export default MarcaCrud;