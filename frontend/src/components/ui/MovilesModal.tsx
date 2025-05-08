//frontend\src\components\ui\MovilesModal.tsx
import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

interface MovilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  moviles: any[];
  selectedMoviles: number[];
  setSelectedMoviles: React.Dispatch<React.SetStateAction<number[]>>;
  handleAnexarMoviles: () => void;
}

const MovilesModal: React.FC<MovilesModalProps> = ({
  isOpen,
  onClose,
  moviles,
  selectedMoviles,
  setSelectedMoviles,
  handleAnexarMoviles,
}) => {
  const toggleSelection = (id: number) => {
    setSelectedMoviles((prev) =>
      prev.includes(id) ? prev.filter((movilId) => movilId !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Seleccionar móviles</h2>
      <div className="space-y-4">
        {moviles.map((movil) => (
          <label
            key={movil.id}
            htmlFor={`movil-${movil.id}`}
            className={`flex flex-col border p-4 rounded-lg shadow-sm cursor-pointer ${
              selectedMoviles.includes(movil.id) ? "bg-blue-100" : "bg-white"
            }`}
            onClick={() => toggleSelection(movil.id)}
          >
            <div className="flex items-center">
            <input
  type="checkbox"
  value={movil.id}
  checked={selectedMoviles.includes(movil.id)}
  onChange={(e) => {
    const id = parseInt(e.target.value, 10);
    setSelectedMoviles((prev) =>
      e.target.checked
        ? [...prev, id]
        : prev.filter((movilId) => movilId !== id)
    );
  }}
/>
              <span className="ml-2 font-semibold">
                {movil.patente} - {movil.marca} - {movil.modelo}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <strong>Año:</strong> {movil.anio || "N/A"}
              </p>
              <p>
                <strong>Color:</strong> {movil.color || "N/A"}
              </p>
              <p>
                <strong>Tipo de Pintura:</strong> {movil.tipoPintura || "N/A"}
              </p>
              <p>
                <strong>País de Origen:</strong> {movil.paisOrigen || "N/A"}
              </p>
              <p>
                <strong>Tipo de Vehículo:</strong> {movil.tipoVehic || "N/A"}
              </p>
              <p>
                <strong>Motor:</strong> {movil.motor || "N/A"}
              </p>
              <p>
                <strong>Chasis:</strong> {movil.chasis || "N/A"}
              </p>
              <p>
                <strong>Combustión:</strong> {movil.combustion || "N/A"}
              </p>
              <p>
                <strong>VIN:</strong> {movil.vin || "N/A"}
              </p>
            </div>
          </label>
        ))}
      </div>
      <Button
        type="button"
        onClick={handleAnexarMoviles}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Guardar
      </Button>
    </Modal>
  );
};

export default MovilesModal;