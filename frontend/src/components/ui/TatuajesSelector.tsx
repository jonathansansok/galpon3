"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

interface Tatuaje {
  zona: string;
  details: string[];
}

interface TatuajesSelectorProps {
  onSelect: (selectedTatuajes: Tatuaje[]) => void;
  defaultTatuajes?: Tatuaje[];
}

export const TatuajesSelector = ({ onSelect, defaultTatuajes = [] }: TatuajesSelectorProps) => {
  const [selectedTatuajes, setSelectedTatuajes] = useState<Tatuaje[]>(defaultTatuajes);
  const [zona, setZona] = useState("");
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    setSelectedTatuajes(defaultTatuajes);
  }, [defaultTatuajes]);

  const zonasOptions = [
    "01-Facial",
    "02-Cuello",
    "03-Pectoral",
    "04-Brazo",
    "05-Antebrazo",
    "06-Palmar",
    "07-Costa",
    "08-Flanco",
    "09-(Epig.-Meso-Hipo)",
    "10-Muslo",
    "11-Pierna",
    "12-Tobillo",
    "13-Cervical",
    "14-Escapular",
    "15-Lumbar",
  ];

  const handleAddTatuaje = () => {
    if (!zona || !detalle) {
      Swal.fire({
        icon: 'error',
        title: 'Campo faltante',
        text: 'Por favor, complete todos los campos antes de agregar un tatuaje.',
      });
      return;
    }
  
    const newTatuaje = { zona, details: [detalle] };
    setSelectedTatuajes((prevSelected) => [...prevSelected, newTatuaje]);
    setZona("");
    setDetalle("");
  };

  const handleRemoveTatuaje = (index: number) => {
    setSelectedTatuajes((prevSelected) =>
      prevSelected.filter((_, i) => i !== index)
    );
  };

  const closeModal = () => {
    const modal = document.getElementById("tatuajes-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("tatuajes-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleSaveChanges = () => {
    onSelect(selectedTatuajes);
    closeModal();
  };

  return (
    <div id="tatuajes-group">
      <button
        data-modal-target="tatuajes-modal"
        data-modal-toggle="tatuajes-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Agregar Tatuajes
      </button>

      <div
        id="tatuajes-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agregar Tatuajes
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="tatuajes-modal"
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
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-2/5 flex-shrink-0">
                  <Image
                    src="/images/cuerpo.png"
                    width={500} // Ajusta el valor según sea necesario
                    height={300} // Ajusta el valor según sea necesario
                    className="w-98 h-auto" // Ajustado para ser más grande
                    alt="foto-cuerpo"
                  />
                </div>
                <div className="w-3/5 flex-grow">
                  <div className="flex flex-col space-y-2">
                    <select
                      value={zona}
                      onChange={(e) => setZona(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Parte del cuerpo</option>
                      {zonasOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={detalle}
                      onChange={(e) => setDetalle(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Detalles del tatuaje"
                    />
                    <button
                      type="button"
                      onClick={handleAddTatuaje}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Agregar tatuaje
                    </button>
                  </div>
                  <ul className="list-disc list-inside mt-4">
                    {selectedTatuajes.map((tatuaje, index) => (
                      <li key={index} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTatuaje(index)}
                          className="mr-2 text-red-500 hover:text-red-700"
                        >
                          x
                        </button>
                        {tatuaje.zona} - {tatuaje.details.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
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
                data-modal-hide="tatuajes-modal"
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