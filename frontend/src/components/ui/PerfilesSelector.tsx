"use client";
import { useState, useEffect } from "react";

interface Perfil {
  option: string;
}

interface PerfilesSelectorProps {
  initialPerfiles: Perfil[];
  onSelect: (selectedPerfiles: Perfil[]) => void;
}

export const PerfilesSelector = ({ initialPerfiles, onSelect }: PerfilesSelectorProps) => {
  const [selectedPerfiles, setSelectedPerfiles] = useState<Perfil[]>(initialPerfiles);
  const perfilesOptions = [
    "COMUN",
    "MEDIATICO",
    "JOVEN ADULTO",
    "TRANSGENERO",
    "HOMOSEXUAL",
    "EMBARAZADA",
    "VIOLENCIA DE GENERO",
    "ABUSO SEXUAL",
    "PROTIN",
    "PRISMA",
    "LESA HUMANIDAD",
    "ASIMILADO",
    "FUERZAS DE SEGURIDAD",
    "RIF",
  ];

  useEffect(() => {
    setSelectedPerfiles(initialPerfiles);
  }, [initialPerfiles]);

  const handleTogglePerfil = (perfil: string) => {
    setSelectedPerfiles((prevSelected) => {
      if (prevSelected.some((p) => p.option === perfil)) {
        return prevSelected.filter((p) => p.option !== perfil);
      } else {
        return [...prevSelected, { option: perfil }];
      }
    });
  };

  const closeModal = () => {
    const modal = document.getElementById("perfiles-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("perfiles-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleSaveChanges = () => {
    onSelect(selectedPerfiles);
    closeModal();
  };

  return (
    <div id="perfiles-group">
      <button
        data-modal-target="perfiles-modal"
        data-modal-toggle="perfiles-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Agregar Perfil
      </button>

      <div
        id="perfiles-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Seleccione Perfil
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="perfiles-modal"
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
                {perfilesOptions.map((perfil) => (
                  <label
                    key={perfil}
                    className={`perfil-label cursor-pointer p-2 border rounded-lg ${
                      selectedPerfiles.some((p) => p.option === perfil)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    onClick={() => handleTogglePerfil(perfil)}
                  >
                    {perfil}
                  </label>
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
                data-modal-hide="perfiles-modal"
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