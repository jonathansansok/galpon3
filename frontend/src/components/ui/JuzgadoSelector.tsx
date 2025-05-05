"use client";
import { useState, useEffect, useRef } from "react";

interface Juzgado {
  Juzgado: string;
}

interface JuzgadoSelectorProps {
  initialJuzgados: string[];
  onSelect: (selectedJuzgados: string[]) => void;
}

export const JuzgadoSelector: React.FC<JuzgadoSelectorProps> = ({ initialJuzgados, onSelect }) => {
  const [juzgados, setJuzgados] = useState<string[]>([]);
  const [filteredJuzgados, setFilteredJuzgados] = useState<string[]>([]);
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(initialJuzgados);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const busquedaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/json/juzgadosjuntos.json")
      .then((response) => response.json())
      .then((data) => {
        const juzgadosStrings = data.map((juzgado: Juzgado) => juzgado.Juzgado);
        setJuzgados(juzgadosStrings);

      })
      .catch((error) => {
        console.error("Error al cargar los juzgados:", error);
      });
  }, []);

  useEffect(() => {
    setSelectedJuzgados(initialJuzgados);
   }, [initialJuzgados]);

  const filterJuzgados = (term: string) => {
    if (!term) {
      return [];
    }
    return juzgados.filter((juzgado) =>
      juzgado.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setFilteredJuzgados(filterJuzgados(event.target.value));

  };

  const handleSelectJuzgado = (juzgado: string) => {
    if (!selectedJuzgados.includes(juzgado)) {
      setSelectedJuzgados((prevSelected) => [...prevSelected, juzgado]);

    }
    setSearchTerm("");
    setFilteredJuzgados([]);
    if (busquedaInputRef.current) {
      busquedaInputRef.current.value = "";
    }
  };

  const handleRemoveJuzgado = (juzgadoToRemove: string) => {
    setSelectedJuzgados((prevSelected) =>
      prevSelected.filter((juzgado) => juzgado !== juzgadoToRemove)
    );
  
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    onSelect(selectedJuzgados);
    closeModal();
  };

  return (
    <div id="juzgado-group">
      <button
        data-modal-target="static-modal"
        data-modal-toggle="static-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Seleccione Juzgado
      </button>

      {isModalOpen && (
        <div
          id="static-modal"
          data-modal-backdrop="static"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden backdrop-blur-md backdrop-brightness-50"
        >
          <div className="relative w-full max-w-7xl max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Seleccione Juzgado
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="static-modal"
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
                  htmlFor="busquedaInputJuzgado"
                  className="block text-sm text-gray-600"
                >
                  Buscar Juzgado:
                </label>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    id="busquedaInputJuzgado"
                    ref={busquedaInputRef}
                    placeholder="Buscar juzgado"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="w-full max-h-60 overflow-y-auto overflow-x-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  {filteredJuzgados.map((juzgado) => (
                    <div
                      key={juzgado}
                      onClick={() => handleSelectJuzgado(juzgado)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {juzgado}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    id="ocultarDesplegableJuzgado"
                    className="bg-red-500 text-white p-1 rounded-full mt-2 w-8 h-8 flex justify-center items-center"
                    style={{
                      display: filteredJuzgados.length > 0 ? "block" : "none",
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      setFilteredJuzgados([]);
                    }}
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                </div>

                <div id="selectedJuzgados" className="space-y-2">
                  {selectedJuzgados.map((juzgado) => (
                    <div
                      key={juzgado}
                      className="flex justify-between items-center p-2 border-b border-gray-200 bg-green-100 shadow-md rounded-lg"
                    >
                      <span className="text-sm font-semibold">
                        {juzgado}
                      </span>
                      <i
                        className="fas fa-times cursor-pointer text-red-500"
                        onClick={() => handleRemoveJuzgado(juzgado)}
                      ></i>
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
                  data-modal-hide="static-modal"
                  onClick={closeModal}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};