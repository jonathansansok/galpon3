import React, { useState, useEffect } from "react";

interface Causa {
  num_causa: string;
}

interface CausasModalProps {
  initialCausas: Causa[];
  onSelect: (selectedCausas: Causa[]) => void;
}

export const CausasModal: React.FC<CausasModalProps> = ({ initialCausas, onSelect }) => {
  const [selectedCausas, setSelectedCausas] = useState<Causa[]>(initialCausas);
  const [numCausa, setNumCausa] = useState("");

  useEffect(() => {
    setSelectedCausas(initialCausas);
  }, [initialCausas]);

  const handleAddCausa = () => {
    if (numCausa) {
      const newCausa = { num_causa: numCausa };
      setSelectedCausas((prevSelected) => [...prevSelected, newCausa]);
      setNumCausa("");
    }
  };

  const handleRemoveCausa = (index: number) => {
    setSelectedCausas((prevSelected) =>
      prevSelected.filter((_, i) => i !== index)
    );
  };

  const closeModal = () => {
    const modal = document.getElementById("causas-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("causas-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleSaveChanges = () => {
    onSelect(selectedCausas);
    closeModal();
  };

  return (
    <div id="causas-group">
      <button
        data-modal-target="causas-modal"
        data-modal-toggle="causas-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Agregar Causas
      </button>

      <div
        id="causas-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agregar causas:
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="causas-modal"
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
              <div className="mb-4">
                <input
                  type="text"
                  id="numCausa"
                  value={numCausa}
                  onChange={(e) => setNumCausa(e.target.value)}
                  placeholder="Número/s de Causa/s"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  className="mt-2 w-1/7 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={handleAddCausa}
                  type="button"
                >
                  Agregar
                </button>
              </div>
              <ul className="list-disc list-inside">
                {selectedCausas.map((causa, index) => (
                  <li key={index} className="flex items-center">
                    <button
                      type="button"
                      className="mr-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveCausa(index)}
                    >
                      x
                    </button>
                    {causa.num_causa}
                  </li>
                ))}
              </ul>
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
                data-modal-hide="causas-modal"
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