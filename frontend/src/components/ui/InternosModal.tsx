import { useState } from "react";
import SelectGeneric from "./selectGeneric"; // Asegúrate de importar el Select
import Toggle from "./Toggle"; // Asegúrate de importar el Toggle

interface Interno {
  id: string;
  apellido: string;
  nombres: string;
  lpu: string;
  numeroDni: string;
  gravedad?: string;
  atencionExtramuro?: boolean; // Cambiado a booleano
  detalle?: string;
}

const InternosModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [internosArray, setInternosArray] = useState<Interno[]>([]);
  const [internoSeleccionado, setInternoSeleccionado] =
    useState<Interno | null>(null);

  // Estado para controlar el toggle de atención extramuro
  const [atencionExtramuro, setAtencionExtramuro] = useState(false);

  // Estado para controlar la gravedad seleccionada
  const [gravedad, setGravedad] = useState<string>("");

  const abrirModal = () => setIsOpen(true);
  const cerrarModal = () => setIsOpen(false);

  const confirmarInterno = () => {
    if (!internoSeleccionado) {
      alert("Debe seleccionar un interno primero.");
      return;
    }

    // Obtenemos el valor de gravedad desde el estado
    const detalle = (document.getElementById("detalle") as HTMLInputElement)
      .value;

    setInternosArray((prev) => [
      ...prev,
      { ...internoSeleccionado, gravedad, atencionExtramuro, detalle },
    ]);

    limpiarFormulario();
    cerrarModal();
  };

  const limpiarFormulario = () => {
    setInternoSeleccionado(null);
    setAtencionExtramuro(false); // Limpiar el toggle
    setGravedad(""); // Limpiar el estado de gravedad
    (document.getElementById("detalle") as HTMLInputElement).value = "";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Botón para abrir el modal */}
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={abrirModal}
      >
        Agregar cliente
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Internos Seleccionados</h2>

            {/* Formulario */}
            <div className="mb-4">
              <label
                htmlFor="gravedad"
                className="block text-sm font-medium text-gray-700"
              >
                Gravedad
              </label>
              <SelectGeneric
                onChange={setGravedad} // Actualiza el estado de gravedad con el valor seleccionado
                options={[
                  { value: "no especificada", label: "No especificada" },
                  { value: "leve", label: "Leve" },
                  { value: "grave", label: "Grave" },
                  { value: "gravísima", label: "Gravísima" },
                ]} // Pasamos las opciones de gravedad
              />
            </div>

            {/* Toggle para Atención Extramuro */}
            <div className="mb-4 flex items-center">
              <Toggle
                id="atencionExtramuro"
                value={atencionExtramuro}
                onChange={setAtencionExtramuro} // Actualiza el estado del toggle
                label="Atención Extramuro"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="detalle"
                className="block text-sm font-medium text-gray-700"
              >
                Detalle
              </label>
              <textarea
                id="detalle"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            {/* Lista de Internos dentro del Modal */}
            <div className="mt-6 w-full">
              <h3 className="text-lg font-bold">Internos Seleccionados</h3>
              <ul className="list-disc pl-6">
                {internosArray.map((interno, index) => (
                  <li key={index} className="mb-2">
                    {interno.nombres} {interno.apellido} - {interno.lpu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={confirmarInterno}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternosModal;
