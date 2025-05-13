"use client";

import { useState, useEffect } from "react";
import { getMarcas, createMarca, updateMarca, deleteMarca } from "./Marcas.api";
import MarcaCrud from "./MarcaCrud";

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<{ id: string; value: string; label: string }[]>([]);

  const fetchMarcas = async () => {
    try {
      console.log("Fetching marcas...");
      const data = await getMarcas();
      console.log("Marcas fetched:", data);
      setMarcas(data);
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
    }
  };

  const handleCreate = async (newMarca: { value: string; label: string }) => {
    try {
      console.log("Creating new marca:", newMarca);
      await createMarca(newMarca);
      console.log("Marca creada con éxito");
      fetchMarcas(); // Recargar las marcas después de crear
    } catch (error) {
      console.error("Error al crear la marca:", error);
    }
  };

  const handleUpdate = async (id: string, updatedMarca: { value: string; label: string }) => {
    try {
      console.log("Updating marca:", { id, updatedMarca });
      await updateMarca(id, updatedMarca);
      console.log("Marca actualizada con éxito");
      fetchMarcas(); // Recargar las marcas después de actualizar
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting marca with id:", id);
      await deleteMarca(id);
      console.log("Marca eliminada con éxito");
      fetchMarcas(); // Recargar las marcas después de eliminar
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return (
    <div className="flex flex-col w-full px-4 py-6">
      <h1 className="text-4xl font-bold mb-4">Gestión de Marcas</h1>
      <MarcaCrud
        marcas={marcas}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}