//frontend\src\components\ui\MovilesModal.tsx
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MovilesTable from "./MovilesTable";
import { SearchBarMoviles } from "@/components/ui/SearchBars/SearchBarMoviles";

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
  const [filteredMoviles, setFilteredMoviles] = useState(moviles); // Estado para los móviles filtrados

  const toggleSelection = (id: number) => {
    setSelectedMoviles((prev) =>
      prev.includes(id)
        ? prev.filter((movilId) => movilId !== id)
        : [...prev, id]
    );

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

  const handleSearch = (queries: {
    generalQuery: string;
    patente: string;
    marca: string;
    modelo: string;
    anio: string;
    color: string;
    tipoVehic: string;
    vin: string;
  }) => {
    const filtered = moviles.filter((movil) => {
      const matchesGeneralQuery =
        queries.generalQuery &&
        Object.values(movil).some((value) =>
          String(value).toLowerCase().includes(queries.generalQuery.toLowerCase())
        );

      const matchesPatente =
        queries.patente &&
        movil.patente?.toLowerCase().includes(queries.patente.toLowerCase());

      const matchesMarca =
        queries.marca &&
        movil.marca?.toLowerCase().includes(queries.marca.toLowerCase());

      const matchesModelo =
        queries.modelo &&
        movil.modelo?.toLowerCase().includes(queries.modelo.toLowerCase());

      const matchesAnio =
        queries.anio &&
        movil.anio?.toLowerCase().includes(queries.anio.toLowerCase());

      const matchesColor =
        queries.color &&
        movil.color?.toLowerCase().includes(queries.color.toLowerCase());

      const matchesTipoVehic =
        queries.tipoVehic &&
        movil.tipoVehic
          ?.toLowerCase()
          .includes(queries.tipoVehic.toLowerCase());

      const matchesVin =
        queries.vin &&
        movil.vin?.toLowerCase().includes(queries.vin.toLowerCase());

      return (
        matchesGeneralQuery ||
        matchesPatente ||
        matchesMarca ||
        matchesModelo ||
        matchesAnio ||
        matchesColor ||
        matchesTipoVehic ||
        matchesVin
      );
    });

    setFilteredMoviles(filtered.length > 0 ? filtered : moviles); // Si no hay coincidencias, mostrar todos los móviles
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
      {/* Barra de búsqueda */}
      <SearchBarMoviles onSearch={handleSearch} />
      {/* Tabla de móviles */}
      <MovilesTable
        moviles={filteredMoviles}
        selectedMoviles={selectedMoviles}
        toggleSelection={toggleSelection}
      />
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