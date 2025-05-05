import { useState } from "react";
import Toggle from "./Toggle";  // Asegúrate de importar el componente Toggle

interface Agente {
  grado: string;
  nombreApellido: string;
  credencial: string;
  gravedad: string;
  atencionART: boolean;
  detalle: string;
}

export const CargarPersonalModal = () => {
  const [grado, setGrado] = useState("");
  const [nombreApellido, setNombreApellido] = useState("");
  const [credencial, setCredencial] = useState("");
  const [gravedad, setGravedad] = useState("");
  const [atencionART, setAtencionART] = useState(false);
  const [detalle, setDetalle] = useState("");
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Abrir y cerrar modal
  const abrirModal = () => setIsOpen(true);
  const cerrarModal = () => setIsOpen(false);

  const agregarAgente = () => {
    if (!grado || !nombreApellido || !credencial || !gravedad || atencionART === undefined) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const nuevoAgente: Agente = {
      grado,
      nombreApellido,
      credencial,
      gravedad,
      atencionART,
      detalle: detalle || "Sin Detalle",
    };

    setAgentes((prev) => [...prev, nuevoAgente]);

    // Limpiar campos
    setGrado("");
    setNombreApellido("");
    setCredencial("");
    setGravedad("");
    setAtencionART(false);
    setDetalle("");
  };

  const eliminarAgente = (index: number) => {
    const updatedAgentes = agentes.filter((_, i) => i !== index);
    setAgentes(updatedAgentes);
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={abrirModal}
      >
        Cargar Personal
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Cargar Personal</h2>

            <div>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Grado"
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Nombre y Apellido"
                value={nombreApellido}
                onChange={(e) => setNombreApellido(e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Credencial"
                value={credencial}
                onChange={(e) => setCredencial(e.target.value)}
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Gravedad"
                value={gravedad}
                onChange={(e) => setGravedad(e.target.value)}
              />

              {/* Usando el Toggle para Atención ART */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Atención ART</label>
                <Toggle
                  id="atencionART"
                  value={atencionART}
                  onChange={setAtencionART}
                  label={atencionART ? "Sí" : "No"}
                />
              </div>

              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Detalle (opcional)"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              ></textarea>

              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded"
                onClick={agregarAgente}
              >
                Agregar Agente
              </button>

              <ul className="mt-4 space-y-2">
                {agentes.map((agente, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      <strong>Grado:</strong> {agente.grado} -{" "}
                      <strong>Nombre:</strong> {agente.nombreApellido}
                    </span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => eliminarAgente(index)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cerrarModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
