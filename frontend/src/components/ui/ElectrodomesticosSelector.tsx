import { useState, useEffect, useRef } from "react";

interface Electrodomestico {
  Electrodomestico: string;
  Norma: string;
  titulo: number;
  capitulo: number;
  articulo: number;
  inciso: number;
  apartado: number;
  Otros: number;
  "Tipo de Electrodomestico": string;
  DetalleUser?: string;
}

interface ElectrodomesticoSelectorProps {
  initialElectrodomesticos: string;
  onSelect: (selectedElectrodomesticos: Electrodomestico[]) => void;
}

export const ElectrodomesticoSelector = ({
  initialElectrodomesticos,
  onSelect,
}: ElectrodomesticoSelectorProps) => {
  const [electrodomesticos, setElectrodomesticos] = useState<Electrodomestico[]>([]);
  const [filteredElectrodomesticos, setFilteredElectrodomesticos] = useState<Electrodomestico[]>([]);
  const [selectedElectrodomesticos, setSelectedElectrodomesticos] = useState<Electrodomestico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const busquedaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/json/mandarinas.json")
      .then((response) => response.json())
      .then((data) => {
        setElectrodomesticos(data.Electrodomesticos || []);
      })
      .catch((error) => {
        console.error("Error al cargar los Delitos:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Datos iniciales de electrodomésticos:", initialElectrodomesticos);
    if (initialElectrodomesticos) {
      const parsedElectrodomesticos = initialElectrodomesticos.split(", ").map((electrodomestico) => {
        const [Electrodomestico, Norma] = electrodomestico.split(" (");
        return {
          Electrodomestico,
          Norma: Norma ? Norma.replace(")", "") : "",
          titulo: 0,
          capitulo: 0,
          articulo: 0,
          inciso: 0,
          apartado: 0,
          Otros: 0,
          "Tipo de Electrodomestico": "",
          DetalleUser: "",
        };
      });
      setSelectedElectrodomesticos(parsedElectrodomesticos);
    }
  }, [initialElectrodomesticos]);

  const filterElectrodomesticos = (term: string) => {
    if (!term) {
      return [];
    }
    return electrodomesticos.filter(
      (electrodomestico) =>
        electrodomestico.Electrodomestico.toLowerCase().includes(term.toLowerCase()) ||
        electrodomestico.Norma.toLowerCase().includes(term.toLowerCase()) ||
        electrodomestico["Tipo de Electrodomestico"].toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const filtered = filterElectrodomesticos(event.target.value);
    setFilteredElectrodomesticos(filtered);
  };

  const handleSelectElectrodomestico = (electrodomestico: Electrodomestico) => {
    if (
      !selectedElectrodomesticos.some(
        (selected) =>
          selected.Electrodomestico === electrodomestico.Electrodomestico &&
          selected.Norma === electrodomestico.Norma
      )
    ) {
      setSelectedElectrodomesticos((prevSelected) => [...prevSelected, electrodomestico]);
    }
    setSearchTerm("");
    setFilteredElectrodomesticos([]);
    if (busquedaInputRef.current) {
      busquedaInputRef.current.value = "";
    }
  };

  const handleRemoveElectrodomestico = (electrodomesticoToRemove: Electrodomestico) => {
    setSelectedElectrodomesticos((prevSelected) =>
      prevSelected.filter((electrodomestico) => electrodomestico !== electrodomesticoToRemove)
    );
  };

  const handleDetalleChange = (index: number, detalle: string) => {
    const updatedElectrodomesticos = [...selectedElectrodomesticos];
    updatedElectrodomesticos[index].DetalleUser = detalle;
    setSelectedElectrodomesticos(updatedElectrodomesticos);
  };

  const openModal = () => {
    const modal = document.getElementById("electrodomestico-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("electrodomestico-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const handleSaveChanges = () => {
    onSelect(selectedElectrodomesticos);
    closeModal();
  };

  return (
    <div id="electrodomestico-group">
      <button
        data-modal-target="electrodomestico-modal"
        data-modal-toggle="electrodomestico-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Seleccione delitos
      </button>

      <div
        id="electrodomestico-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-7xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Seleccione Delitos
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="electrodomestico-modal"
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
                htmlFor="busquedaInputElectrodomestico"
                className="block text-sm text-gray-600"
              >
                Buscar Delitos:
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  id="busquedaInputElectrodomestico"
                  ref={busquedaInputRef}
                  placeholder="Buscar Delitos"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={handleSearchChange}
                />
              </div>

              <select
                id="resultadosBusquedaElectrodomestico"
                size={10}
                className="w-full max-h-60 overflow-y-auto overflow-x-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  display: filteredElectrodomesticos.length > 0 ? "block" : "none",
                }}
              >
                {filteredElectrodomesticos.map((electrodomestico) => (
                  <option
                    key={`${electrodomestico.Electrodomestico}-${electrodomestico.Norma}`}
                    onClick={() => handleSelectElectrodomestico(electrodomestico)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {electrodomestico.Electrodomestico} ({electrodomestico.Norma})
                  </option>
                ))}
              </select>

              <div className="flex justify-end">
                <button
                  id="ocultarDesplegableElectrodomestico"
                  className="bg-red-500 text-white p-1 rounded-full mt-2 w-8 h-8 flex justify-center items-center"
                  style={{
                    display: filteredElectrodomesticos.length > 0 ? "block" : "none",
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    setFilteredElectrodomesticos([]);
                  }}
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>

              <div id="selectedElectrodomesticos" className="space-y-2">
                {selectedElectrodomesticos.map((electrodomestico, index) => (
                  <div
                    key={`${electrodomestico.Electrodomestico}-${electrodomestico.Norma}`}
                    className="flex flex-col justify-between items-start p-2 border-b border-gray-200 selected-electrodomestico"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-semibold">
                        {electrodomestico.Electrodomestico} ({electrodomestico.Norma})
                      </span>
                      <i
                        className="fas fa-times cursor-pointer text-red-500"
                        onClick={() => handleRemoveElectrodomestico(electrodomestico)}
                      ></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Detalle del usuario"
                      value={electrodomestico.DetalleUser || ""}
                      onChange={(e) => handleDetalleChange(index, e.target.value)}
                      className="mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                    />
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
                data-modal-hide="electrodomestico-modal"
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