//frontend\src\components\ui\PersonalInvolucrado.tsx
"use client";
import { FC, useState, useEffect } from "react";
import Swal from 'sweetalert2';

interface Agente {
  grado: string;
  nombreApellidoAgente: string;
  credencial: string;
  gravedad: string;
  atencionART: string;
  detalle: string;
}

interface PersonalInvolucradoProps {
  initialAgentes: Agente[];
  onSelect: (selectedAgentes: Agente[]) => void;
}

const PersonalInvolucrado: FC<PersonalInvolucradoProps> = ({ initialAgentes, onSelect }) => {
  const [agentesArray, setAgentesArray] = useState<Agente[]>(initialAgentes);
  const [gradoAgente, setGradoAgente] = useState<string>("");
  const [nombreApellidoAgente, setNombreApellidoAgente] = useState<string>("");
  const [credencial, setCredencial] = useState<string>("");
  const [gravedad, setGravedad] = useState<string>("");
  const [atencionART, setAtencionART] = useState<string>("");
  const [detalleAgente, setDetalleAgente] = useState<string>("");

  useEffect(() => {
    setAgentesArray(initialAgentes);
  }, [initialAgentes]);

  const abrirModalAgentes = () => {
    const modal = document.getElementById("modalCargaAgentes");
    if (modal) {
      modal.style.display = "flex";
    }
  };

  const cerrarModalAgentes = () => {
    const modal = document.getElementById("modalCargaAgentes");
    if (modal) {
      modal.style.display = "none";
    }
  };

  const verificarFormularioAgentes = () => {
    const btnGuardarAgente = document.getElementById("btnGuardarAgente");
    if (btnGuardarAgente) {
      if (gradoAgente || nombreApellidoAgente || credencial || gravedad || atencionART) {
        btnGuardarAgente.style.display = "inline-flex";
      } else {
        btnGuardarAgente.style.display = "none";
      }
    }
  };

  const guardarAgenteActual = () => {
    if (!gradoAgente || !nombreApellidoAgente || !credencial || !gravedad || !atencionART) {
      Swal.fire({
        title: 'Campos incompletos',
        text: "¿Desea agregar este agente con algunos campos sin completar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          agregarAgente();
        }
      });
    } else {
      agregarAgente();
    }
  };

  const agregarAgente = () => {
    const agente: Agente = { 
      grado: gradoAgente, 
      nombreApellidoAgente, 
      credencial, 
      gravedad, 
      atencionART, 
      detalle: detalleAgente || "Sin Detalle" 
    };
    setAgentesArray((prev) => [...prev, agente]);

    setGradoAgente("");
    setNombreApellidoAgente("");
    setCredencial("");
    setGravedad("");
    setAtencionART("");
    setDetalleAgente("");

    verificarFormularioAgentes();
  };

  const eliminarAgente = (index: number) => {
    setAgentesArray((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarAgentes = () => {
    cerrarModalAgentes();
    onSelect(agentesArray);
  };

  return (
    <div>
      <button
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        type="button"
        onClick={abrirModalAgentes}
      >
        Agregar Personal
      </button>

      <div id="modalCargaAgentes" className="modal hidden fixed inset-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50 overflow-y-auto">
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-y-auto">
          <span className="close cursor-pointer text-gray-500 hover:text-gray-700" onClick={cerrarModalAgentes}>&times;</span>
          <h2 className="text-xl font-semibold mb-4">Carga de Personal</h2>

          <h2 id="tituloAgentes" className="text-lg font-semibold mb-2">Personal Seleccionado ({agentesArray.length})</h2>
          <ul id="agentesSeleccionados" className="list-group mb-4">
            {agentesArray.map((agente, index) => (
              <li key={index} className="list-group-item flex justify-between items-center mb-2 bg-green-300 rounded-lg p-4 shadow-md">
                <span>
                  <strong>Grado:</strong> {agente.grado} - <strong>Nombre y Apellido:</strong> {agente.nombreApellidoAgente} (Cred.: {agente.credencial}) - <strong>Gravedad:</strong> {agente.gravedad} - <strong>At. A.R.T.:</strong> {agente.atencionART} - <strong>Detalle:</strong> {agente.detalle}
                </span>
                <span className="delete-btn cursor-pointer text-red-500 hover:text-red-700" onClick={() => eliminarAgente(index)}><strong>x</strong></span>
              </li>
            ))}
          </ul>

          <div id="nuevoAgenteForm" className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gradoAgente" className="block text-sm font-medium text-gray-700">Grado:</label>
              <select className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full" id="gradoAgente" value={gradoAgente} onChange={(e) => { setGradoAgente(e.target.value); verificarFormularioAgentes(); }}>
                <option value="">Seleccione Grado</option>
                <option value="Inspec. Gral.">Inspec. Gral.</option>
                <option value="Prefecto">Prefecto</option>
                <option value="Subprefecto">Subprefecto</option>
                <option value="Alcaide Mayor">Alcaide Mayor</option>
                <option value="Alcaide">Alcaide</option>
                <option value="Subalcaide">Subalcaide</option>
                <option value="Adjutor Ppal.">Adjutor Ppal.</option>
                <option value="Adjutor">Adjutor</option>
                <option value="Subadjutor">Subadjutor</option>
                <option value="AYTE. My.">Ayte. My.</option>
                <option value="Ayte. Ppal.">Ayte. Ppal.</option>
                <option value="Ayte de 1ra.">Ayte de 1ra.</option>
                <option value="Ayte de 2da.">Ayte de 2da.</option>
                <option value="Ayte de 3ra.">Ayte de 3ra.</option>
                <option value="Ayte de 4ta.">Ayte de 4ta.</option>
                <option value="Ayte de 5ta">Ayte de 5ta</option>
                <option value="Subayte.">Subayte.</option>
              </select>
            </div>

            <div>
              <label htmlFor="nombreApellidoAgente" className="block text-sm font-medium text-gray-700">Nombre y Apellido:</label>
              <input type="text" className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full" placeholder="Nombre y Apellido" id="nombreApellidoAgente" value={nombreApellidoAgente} onChange={(e) => { setNombreApellidoAgente(e.target.value); verificarFormularioAgentes(); }} />
            </div>

            <div>
              <label htmlFor="credencial" className="block text-sm font-medium text-gray-700">Cred.:</label>
              <input type="text" className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full" placeholder="Cred." id="credencial" value={credencial} onChange={(e) => { setCredencial(e.target.value); verificarFormularioAgentes(); }} />
            </div>

            <div>
              <label htmlFor="gravedadAgente" className="block text-sm font-medium text-gray-700">Gravedad:</label>
              <select className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full" id="gravedadAgente" value={gravedad} onChange={(e) => { setGravedad(e.target.value); verificarFormularioAgentes(); }}>
                <option value=""></option>
                <option value="Ninguna">Ninguna</option>
                <option value="Indefinida">Indefinida</option>
                <option value="Leve">Leve</option>
                <option value="Grave">Grave</option>
                <option value="Gravisima">Gravísima</option>
              </select>
            </div>

            <div>
              <label htmlFor="atencionART" className="block text-sm font-medium text-gray-700">Atención ART:</label>
              <select className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full" id="atencionART" value={atencionART} onChange={(e) => { setAtencionART(e.target.value); verificarFormularioAgentes(); }}>
                <option value="">Atención ART</option>
                <option value="Indefinido">Indefinido al momento</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="detalleAgente" className="block text-sm font-medium text-gray-700">Detalle:</label>
              <textarea className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full" placeholder="Detalle" id="detalleAgente" value={detalleAgente} onChange={(e) => { setDetalleAgente(e.target.value); verificarFormularioAgentes(); }} rows={4} />
            </div>
          </div>

          <div className="botones-form mb-4">
            <button type="button" className="btn-guardar-form bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={guardarAgenteActual} id="btnGuardarAgente" style={{ display: "none" }}>
              Confirm. personal
            </button>
          </div>

          <div className="modal-footer flex justify-end">
            <button type="button" className="btn-cerrar bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={cerrarModalAgentes}>
              Cerrar
            </button>
            <button type="button" className="btn-guardar bg-green-500 text-white px-4 py-2 rounded-lg" onClick={guardarAgentes}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInvolucrado;