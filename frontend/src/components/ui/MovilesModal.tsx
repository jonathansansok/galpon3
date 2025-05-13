import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; // Importar Toastify
import "react-toastify/dist/ReactToastify.css"; // Importar estilos de Toastify

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
      prev.includes(id)
        ? prev.filter((movilId) => movilId !== id)
        : [...prev, id]
    );

    // Mostrar Toastify
    toast.info("Recuerde clickear en guardar para confirmar cambios", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Seleccionar móviles</h2>
      <a
        href="/portal/eventos/temas/new"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mb-4"
      >
        Crear Móvil
      </a>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Creado el</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actualizado el</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Patente</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Marca</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Modelo</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Año</th>
            </tr>
          </thead>
          <tbody>
            {moviles.map((movil) => (
              <tr
                key={movil.id}
                onClick={() => toggleSelection(movil.id)} // Seleccionar fila al hacer clic
                className={`cursor-pointer ${
                  selectedMoviles.includes(movil.id)
                    ? "bg-green-100" // Fondo verde claro si está seleccionado
                    : "bg-white"
                } hover:bg-green-50`} // Fondo verde claro al pasar el cursor
              >
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(movil.createdAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(movil.updatedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{movil.patente || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{movil.marca || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{movil.modelo || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{movil.anio || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
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