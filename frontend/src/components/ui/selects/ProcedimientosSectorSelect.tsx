"use client";
import { FC, useState, useEffect } from "react";

interface Sector {
  option: string;
}

interface ProcedimientosSectorSelectProps {
  initialSectors: Sector[];
  onSelect: (selectedSectors: Sector[]) => void;
}

const ProcedimientosSectorSelect: FC<ProcedimientosSectorSelectProps> = ({ initialSectors, onSelect }) => {
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(initialSectors);
  const [customSector, setCustomSector] = useState<string>("");

  const sectorOptions = [
    "General/Completo",
    "S.U.M. (Salón de Usos Múltiples)",
    "Baños",
    "Celdas",
    "Cocina",
    "Pasillo",
    "Campo de Deportes",
    "Educación",
    "Servicio Social",
    "Psicología",
    "Administrativa",
    "Otro",
  ];

  useEffect(() => {
    setSelectedSectors(initialSectors);
  }, [initialSectors]);

  const handleToggleSector = (sector: string) => {
    setSelectedSectors((prevSelected) => {
      if (prevSelected.some((s) => s.option === sector)) {
        return prevSelected.filter((s) => s.option !== sector);
      } else {
        return [...prevSelected, { option: sector }];
      }
    });
  };

  const handleCustomSectorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomSector(value);
  };

  const handleAddCustomSector = () => {
    if (customSector.trim() !== "") {
      setSelectedSectors((prevSelected) => [...prevSelected, { option: customSector }]);
      setCustomSector("");
    }
  };

  const handleRemoveSector = (sector: string) => {
    setSelectedSectors((prevSelected) => prevSelected.filter((s) => s.option !== sector));
  };

  const closeModal = () => {
    const modal = document.getElementById("sectors-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("sectors-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleSaveChanges = () => {
    onSelect(selectedSectors);
    closeModal();
  };

  return (
    <div id="sectors-group">
      <button
        data-modal-target="sectors-modal"
        data-modal-toggle="sectors-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Seleccionar Sector/es
      </button>

      <div
        id="sectors-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Seleccione Sector/es
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="sectors-modal"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {sectorOptions.map((sector) => (
                  <label
                    key={sector}
                    className={`sector-label cursor-pointer p-2 border rounded-lg ${
                      selectedSectors.some((s) => s.option === sector)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    onClick={() => handleToggleSector(sector)}
                  >
                    {sector}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={customSector}
                  onChange={handleCustomSectorChange}
                  placeholder="Agregar otro sector..."
                  className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSector}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Agregar Sector Personalizado
                </button>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sectores Seleccionados</h4>
                <ul className="list-disc list-inside">
                  {selectedSectors.map((sector) => (
                    <li key={sector.option} className="flex items-center mb-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveSector(sector.option)}
                        className="mr-2 px-2 py-1 bg-red-500 text-white rounded-lg"
                      >
                        Quitar
                      </button>
                      <span>{sector.option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSaveChanges}
                type="button"
              >
                Guardar cambios
              </button>
              <button
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                data-modal-hide="sectors-modal"
                onClick={closeModal}
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedimientosSectorSelect;