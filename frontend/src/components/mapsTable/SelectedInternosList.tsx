// frontend/src/components/mapsTable/SelectedInternosList.tsx
import React from "react";
import { Ingreso } from "@/types/Ingreso";
import Image from "next/image";

interface SelectedInternosListProps {
  selectedIngresos: Ingreso[];
  handleRemoveClick: (id: string) => void;
}

const SelectedInternosList = ({
  selectedIngresos,
  handleRemoveClick,
}: SelectedInternosListProps) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-100 w-full">
      <h2 className="text-xl font-bold mb-2">Internos Seleccionados</h2>
      <div className="flex flex-wrap gap-4">
        {selectedIngresos.map((ingreso) => (
          <div key={ingreso.id} className="mb-2 p-2 border rounded-lg bg-white flex items-start" style={{ width: "auto" }}>
            {ingreso.imagen && (
              <div className="mr-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagen}`}
                  alt="Imagen del ingreso"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            )}
            <div>
              <p><strong>Apellido:</strong> {ingreso.apellido}</p>
              <p><strong>Nombres:</strong> {ingreso.nombres}</p>
              <p><strong>L.P.U.:</strong> {ingreso.lpu}</p>
              <p><strong>Tipo Doc.:</strong> {ingreso.tipoDoc}</p>
              <p><strong>Doc.:</strong> {ingreso.numeroDni}</p>
              <p><strong>G.Do.:</strong> {ingreso.cualorg}</p>
              <p><strong>Condicion:</strong> {ingreso.condicion}</p>
              <p><strong>Ubicación:</strong> {ingreso.ubicacionMap}</p>
              <button
                onClick={() => handleRemoveClick(ingreso.id.toString())}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedInternosList;