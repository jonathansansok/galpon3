
"use client";
import { useState, useEffect, useRef } from "react";

interface Patologia {
  level: number;
  code: string;
  description: string;
  code_2: string;
  code_0: string;
  code_1: string;
  detalles?: string;
}

interface PatologiaSelectorProps {
  onSelect: (selectedPatologias: Patologia[]) => void;
  defaultPatologias?: Patologia[];
}

export const PatologiaSelector = ({ onSelect, defaultPatologias = [] }: PatologiaSelectorProps) => {
  const [patologias, setPatologias] = useState<Patologia[]>([]);
  const [filteredPatologias, setFilteredPatologias] = useState<Patologia[]>([]);
  const [selectedPatologias, setSelectedPatologias] = useState<Patologia[]>(defaultPatologias);
  const [searchTerm, setSearchTerm] = useState("");
  const busquedaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/json/cie10.json")
      .then((response) => response.json())
      .then((data) => {
        setPatologias(data || []);
      })
      .catch((error) => {
        console.error("Error fetching patologias:", error);
      });
  }, []);

  useEffect(() => {
    setSelectedPatologias(defaultPatologias);
  }, [defaultPatologias]);

  const filterPatologias = (term: string) => {
    if (term.length < 3) {
      return [];
    }
    return patologias.filter(
      (patologia) =>
        patologia.code.toLowerCase().includes(term.toLowerCase()) ||
        patologia.description.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredPatologias(filterPatologias(term));
  };

  const handleSelectPatologia = (patologia: Patologia) => {
    if (
      !selectedPatologias.some(
        (selected) =>
          selected.code === patologia.code &&
          selected.description === patologia.description
      )
    ) {
      setSelectedPatologias((prevSelected) => [...prevSelected, { ...patologia, detalles: "" }]);
    }
    setSearchTerm("");
    setFilteredPatologias([]);
    if (busquedaInputRef.current) {
      busquedaInputRef.current.value = "";
    }
  };

  const handleRemovePatologia = (patologiaToRemove: Patologia) => {
    setSelectedPatologias((prevSelected) =>
      prevSelected.filter((patologia) => patologia !== patologiaToRemove)
    );
  };

  const handleDetalleChange = (index: number, detalle: string) => {
    const updatedPatologias = [...selectedPatologias];
    updatedPatologias[index].detalles = detalle;
    setSelectedPatologias(updatedPatologias);
  };

  const closeModal = () => {
    const modal = document.getElementById("patologias-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("patologias-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleSaveChanges = () => {
    onSelect(selectedPatologias);
    closeModal();
  };

  return (
    <div id="patologia-group">
      <button
        data-modal-target="patologias-modal"
        data-modal-toggle="patologias-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Seleccione Patología/s
      </button>

      <div
        id="patologias-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full"> 
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Seleccione Patología/s
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="patologias-modal"
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
              <label
                htmlFor="busquedaInputPatologia"
                className="block text-sm text-gray-600"
              >
                Buscar Patología:
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  id="busquedaInputPatologia"
                  ref={busquedaInputRef}
                  placeholder="Buscar patología"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={handleSearchChange}
                />
              </div>

              <select
                id="resultadosBusquedaPatologia"
                size={10}
                className="w-full max-h-60 overflow-y-auto overflow-x-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  display: filteredPatologias.length > 0 ? "block" : "none",
                }}
              >
                {filteredPatologias.map((patologia) => (
                  <option
                    key={patologia.code}
                    onClick={() => handleSelectPatologia(patologia)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {patologia.code} - {patologia.description} - {patologia.code_2} - {patologia.code_0} - {patologia.code_1}
                  </option>
                ))}
              </select>

              <div className="flex justify-end">
                <button
                  id="ocultarDesplegablePatologia"
                  className="bg-red-500 text-white p-1 rounded-full mt-2 w-8 h-8 flex justify-center items-center"
                  style={{
                    display: filteredPatologias.length > 0 ? "block" : "none",
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    setFilteredPatologias([]);
                  }}
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>

              <div id="selectedPatologias" className="space-y-2">
                {selectedPatologias.map((patologia, index) => (
                  <div
                    key={patologia.code}
                    className="flex flex-col p-2 border-b border-gray-200 selected-patologia"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">
                        {patologia.code} - {patologia.description}
                      </span>
                      <i
                        className="fas fa-times cursor-pointer text-red-500"
                        onClick={() => handleRemovePatologia(patologia)}
                      ></i>
                    </div>
                    <textarea
                      placeholder="Detalles de la patologia particular..."
                      className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={patologia.detalles || ""}
                      onChange={(e) => handleDetalleChange(index, e.target.value)}
                    ></textarea>
                  </div>
                ))}
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
                data-modal-hide="patologias-modal"
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