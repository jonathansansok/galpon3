"use client";
import { FC, useState, useEffect } from "react";

interface Motivo {
  option: string;
}

interface MotivoSelectProps {
  initialMotivos: Motivo[];
  onSelect: (selectedMotivos: Motivo[]) => void;
}

const TipoHuelgaSelect: FC<MotivoSelectProps> = ({
  initialMotivos,
  onSelect,
}) => {
  const [selectedMotivos, setSelectedMotivos] =
    useState<Motivo[]>(initialMotivos);
  const [customMotivo, setCustomMotivo] = useState<string>("");
  const [error, setError] = useState<string>("");

  const motivoOptions = ["Sólida", "Seca", "Líquida"];

  useEffect(() => {
    setSelectedMotivos(initialMotivos);
  }, [initialMotivos]);

  const handleToggleMotivo = (motivo: string) => {
    setCustomMotivo(""); // Limpia el motivo personalizado al seleccionar una opción predefinida.
    setSelectedMotivos((prevMotivos) => {
      if (prevMotivos.some((m) => m.option === motivo)) {
        return prevMotivos.filter((m) => m.option !== motivo);
      } else {
        return [...prevMotivos, { option: motivo }];
      }
    });
  };

  const handleRemoveMotivo = (motivo: string) => {
    setSelectedMotivos((prevMotivos) =>
      prevMotivos.filter((m) => m.option !== motivo)
    );
  };
  const handleCustomMotivoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCustomMotivo(value);
  };

  const handleAddCustomMotivo = () => {
    if (customMotivo.trim() !== "") {
      setSelectedMotivos((prevMotivos) => [
        ...prevMotivos,
        { option: customMotivo },
      ]);
      setCustomMotivo("");
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("motivos-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("motivos-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleSaveChanges = () => {
    if (selectedMotivos.length === 0) {
      setError(
        "Debe seleccionar un tipo de huelga o agregar una opción personalizada."
      );
    } else {
      setError("");
      onSelect(selectedMotivos);
      closeModal();
    }
  };

  return (
    <div id="motivos-group">
      <button
        data-modal-target="motivos-modal"
        data-modal-toggle="motivos-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
         Tipo de Huelga
      </button>

      <div
        id="motivos-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Seleccione Tipo de Huelga
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="motivos-modal"
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
              <div className="mt-4 bg-green-100 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tipos de Huelga Seleccionados
                </h4>
                <ul className="list-disc list-inside">
                  {selectedMotivos.map((motivo) => (
                    <li
                      key={motivo.option}
                      className="flex items-center mb-2 text-lg text-black"
                    >
                      <span className="before:content-['•'] before:mr-2">
                        {motivo.option}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => handleRemoveMotivo(motivo.option)}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {motivoOptions.map((motivo) => (
                  <label
                    key={motivo}
                    className={`motivo-label cursor-pointer p-2 border rounded-lg ${
                      selectedMotivos.some((s) => s.option === motivo)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-900"
                    }`}
                    onClick={() => handleToggleMotivo(motivo)}
                  >
                    {motivo}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={customMotivo}
                  onChange={handleCustomMotivoChange}
                  placeholder="Agregar otro tipo de huelga..."
                  className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                />
                <button
                  type="button"
                  onClick={handleAddCustomMotivo}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Agregar Tipo de Huelga Personalizado
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
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
                data-modal-hide="motivos-modal"
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

export default TipoHuelgaSelect;
