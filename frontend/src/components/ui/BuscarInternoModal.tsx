//frontend\src\components\ui\BuscarInternoModal.tsx
import React, { useState } from "react";
import { searchInternos } from "@/app/portal/eventos/ingresos/ingresos.api";

interface Ingreso {
  id: number;
  apellido: string;
  nombres: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  tipoDoc: string;
  fechaHoraIng: string;
  numeroDni: string;
  fechaNacimiento: string;
  edad_ing: string;
  nacionalidad: string;
  domicilios: string;
  sexo: string;
  sitProc: string;
  establecimiento: string;
}

interface BuscarInternoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (interno: Ingreso) => void;
}

const BuscarInternoModal: React.FC<BuscarInternoModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchResults, setSearchResults] = useState<Ingreso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Campos de búsqueda avanzados
  const [apellido, setApellido] = useState("");
  const [nombres, setNombres] = useState("");
  const [lpu, setLpu] = useState("");
  const [lpuProv, setLpuProv] = useState("");

  const buscarInternos = async () => {
    setIsLoading(true);
    setNoResults(false);

    try {
      const query = apellido || nombres || lpu || lpuProv;
      if (!query) {
        alert("Por favor, ingresa al menos un criterio de búsqueda.");
        setIsLoading(false);
        return;
      }

      const data = await searchInternos(query);
      if (Array.isArray(data)) {
        const filteredIngresos = data.filter(
          (ingreso: Ingreso) =>
            (!apellido ||
              ingreso.apellido
                ?.toLowerCase()
                .includes(apellido.toLowerCase())) &&
            (!nombres ||
              ingreso.nombres?.toLowerCase().includes(nombres.toLowerCase())) &&
            (!lpu || ingreso.lpu?.toLowerCase().includes(lpu.toLowerCase())) &&
            (!lpuProv ||
              ingreso.lpuProv?.toLowerCase().includes(lpuProv.toLowerCase()))
        );
        setSearchResults(filteredIngresos);
        setNoResults(filteredIngresos.length === 0);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      console.error("Error al buscar internos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 h-5/6 overflow-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 focus:outline-none"
        >
          Cerrar
        </button>
        <h2 className="text-xl font-bold mb-4">Buscar Interno</h2>

        {/* Campos de búsqueda avanzados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="LPU"
            value={lpu}
            onChange={(e) => setLpu(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="LPU Prov."
            value={lpuProv}
            onChange={(e) => setLpuProv(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={buscarInternos}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>

        <ul className="mt-4 space-y-2">
          {noResults && (
            <p className="text-blue-500 text-lg">No hay resultados.</p>
          )}
          {searchResults.map((interno) => (
            <li
              key={interno.id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelect({
                  ...interno,
                  fechaHoraIng:
                    interno.fechaHoraIng || "2024-05-20T00:00:00.000Z", // Valor por defecto para pruebas
                });
                onClose(); // Cierra el modal después de seleccionar el interno
              }}
            >
              <p>
                <strong>ID:</strong> {interno.id}
              </p>
              <p>
                <strong>Apellido:</strong> {interno.apellido}
              </p>
              <p>
                <strong>Nombres:</strong> {interno.nombres}
              </p>
              <p>
                <strong>Alias:</strong> {interno.alias}
              </p>
              <p>
                <strong>LPU:</strong> {interno.lpu}
              </p>
              <p>
                <strong>LPU Prov.:</strong> {interno.lpuProv}
              </p>
              <p>
                <strong>Tipo Doc.:</strong> {interno.tipoDoc}
              </p>
              <p>
                <strong>DNI:</strong> {interno.numeroDni}
              </p>
              <p>
                <strong>Fecha de Ingreso:</strong> {interno.fechaHoraIng}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong> {interno.fechaNacimiento}
              </p>
              <p>
                <strong>Edad:</strong> {interno.edad_ing}
              </p>
              <p>
                <strong>Nacionalidad:</strong> {interno.nacionalidad}
              </p>
              <p>
                <strong>Domicilios:</strong> {interno.domicilios}
              </p>
              <p>
                <strong>Sexo:</strong> {interno.sexo}
              </p>
              <p>
                <strong>Situación Procesal:</strong> {interno.sitProc}
              </p>
              <p>
                <strong>Establecimiento:</strong> {interno.establecimiento}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BuscarInternoModal;
