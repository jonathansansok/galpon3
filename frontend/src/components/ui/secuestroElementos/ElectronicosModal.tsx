//frontend\src\components\ui\secuestroElementos\ElectronicosModal.tsx
import { FC, useState, useEffect } from "react";
import { phoneBrands } from "./MarcasCel";
interface ElectronicosModalProps {
  initialElectronicos: string;
  onSave: (electronicos: string) => void;
}

interface Electronico {
  tipoElectronico: string;
  marca: string;
  modelo: string;
  imei: string;
  medida: string;
  detalles: string;
  dentroCelda: string;
  sectorHabitacional: string;
  donde: string;
  pabellon: string;
  otroSector: string;
  otroDetalle: string;
}

const ElectronicosModal: FC<ElectronicosModalProps> = ({
  initialElectronicos,
  onSave,
}) => {
  const [electronicos, setElectronicos] = useState<Electronico[]>([]);
  const [tipoElectronico, setTipoElectronico] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [mostrarSelectMarca, setMostrarSelectMarca] = useState<boolean>(false);
  const [modelo, setModelo] = useState<string>("");
  const [imei, setImei] = useState<string>("");
  const [medida, setMedida] = useState<string>("");
  const [detalles, setDetalles] = useState<string>("");
  const [dentroCelda, setDentroCelda] = useState<string>("");
  const [sectorHabitacional, setSectorHabitacional] = useState<string>("");
  const [donde, setDonde] = useState<string>("");
  const [pabellon, setPabellon] = useState<string>("");
  const [otroSector, setOtroSector] = useState<string>("");
  const [otroDetalle, setOtroDetalle] = useState<string>("");

  useEffect(() => {
    if (initialElectronicos) {
      const data = JSON.parse(initialElectronicos);
      setElectronicos(data);
      if (data.length > 0) {
        const lastElectronico = data[data.length - 1];
        setTipoElectronico(lastElectronico.tipoElectronico);
        setMarca(lastElectronico.marca);
        setModelo(lastElectronico.modelo);
        setImei(lastElectronico.imei);
        setMedida(lastElectronico.medida);
        setDetalles(lastElectronico.detalles);
        setDentroCelda(lastElectronico.dentroCelda);
        setSectorHabitacional(lastElectronico.sectorHabitacional);
        setDonde(lastElectronico.donde);
        setPabellon(lastElectronico.pabellon);
        setOtroSector(lastElectronico.otroSector);
        setOtroDetalle(lastElectronico.otroDetalle);
      }
    }
  }, [initialElectronicos]);

  const openModal = () => {
    const modal = document.getElementById("electronicos-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("electronicos-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const handleAddElectronico = () => {
    if (!tipoElectronico || !donde) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    const newElectronico: Electronico = {
      tipoElectronico,
      marca,
      modelo,
      medida,
      imei,
      detalles,
      dentroCelda,
      sectorHabitacional,
      donde,
      pabellon,
      otroSector,
      otroDetalle,
    };
    setElectronicos([...electronicos, newElectronico]);
    setTipoElectronico("");
    setMarca("");
    setModelo("");
    setMedida("");
    setDetalles("");
    setDentroCelda("");
    setSectorHabitacional("");
    setDonde("");
    setPabellon("");
    setOtroSector("");
    setOtroDetalle("");
  };
  const handleTipoElectronicoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setTipoElectronico(value);
    setMostrarSelectMarca(value === "Movil celular");
  };
  const handleRemoveElectronico = (index: number) => {
    const updatedElectronicos = electronicos.filter((_, i) => i !== index);
    setElectronicos(updatedElectronicos);
  };

  const handleSaveChanges = () => {
    onSave(JSON.stringify(electronicos));
    closeModal();
  };

  return (
    <div id="electronicos-group">
      <button
        data-modal-target="electronicos-modal"
        data-modal-toggle="electronicos-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Electronicos secuestrados
      </button>

      <div
        id="electronicos-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Registro de Secuestro de Electrónicos
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="electronicos-modal"
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
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Electronicos Secuestrados:
                <span id="contadorElectronicos" className="ml-2">
                  {electronicos.length}
                </span>
              </h4>
              <ul id="listaElectronicos" className="list-group space-y-2">
                {electronicos.map((electronico, index) => (
                  <li
                    key={index}
                    className="list-group-item p-2 bg-green-100 rounded-md dark:bg-gray-700"
                  >
                    <strong>Tipo:</strong> {electronico.tipoElectronico} <br />
                    <strong>Marca:</strong> {electronico.marca} <br />
                    <strong>Modelo:</strong> {electronico.modelo} <br />
                    <strong>Medida:</strong> {electronico.medida} cm <br />
                    <strong>Detalles:</strong>{" "}
                    {electronico.detalles || "Ninguno"} <br />
                    <strong>Dentro de Celda:</strong> {electronico.dentroCelda}{" "}
                    <br />
                    {electronico.dentroCelda === "Sí" && (
                      <p>
                        <strong>Celda:</strong> {electronico.pabellon}
                      </p>
                    )}
                    <strong>Sector Habitacional:</strong>{" "}
                    {electronico.sectorHabitacional} <br />
                    {electronico.sectorHabitacional === "Otro" && (
                      <p>
                        <strong>Otro Sector:</strong> {electronico.otroSector}
                      </p>
                    )}
                    <strong>Donde (específico):</strong> {electronico.donde}{" "}
                    <br />
                    {electronico.donde === "Otro" && (
                      <p>
                        <strong>Detalle:</strong> {electronico.otroDetalle}
                      </p>
                    )}
                    <button
                      className="ml-2 text-red-500 hover:text-pink-500 font-bold cursor-pointer"
                      onClick={() => handleRemoveElectronico(index)}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>

              <div className="form-group">
                <div className="form-group" id="selectDentroCeldaContainer">
                  <label
                    htmlFor="dentro-pabellon"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ¿Fue dentro de una celda?
                  </label>
                  <select
                    id="dentro-pabellon"
                    name="dentro-pabellon"
                    value={dentroCelda}
                    onChange={(e) => setDentroCelda(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">Seleccione</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                  {dentroCelda === "Sí" && (
                    <textarea
                      id="pabellon"
                      rows={2}
                      cols={88}
                      placeholder="Especifique la celda..."
                      name="pabellon"
                      value={pabellon}
                      onChange={(e) => setPabellon(e.target.value)}
                      className="mt-2 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    ></textarea>
                  )}
                </div>

                <div
                  className="form-group"
                  id="selectSectorHabitacionalContainer"
                >
                  <label
                    htmlFor="sector-habitacional"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sector Habitacional:
                  </label>
                  <select
                    id="sector-habitacional"
                    name="sector-habitacional"
                    value={sectorHabitacional}
                    onChange={(e) => setSectorHabitacional(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    disabled={dentroCelda === "Sí"}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Banos">Baños</option>
                    <option value="SUM">S.U.M.</option>
                    <option value="Cocina">Cocina</option>
                    <option value="Aula">Aula</option>
                    <option value="Taller">Taller</option>
                    <option value="Pasillo">Pasillo</option>
                    <option value="Gimnasio">Gimnasio</option>
                    <option value="Campo de deportes">Campo de deportes</option>
                    <option value="Area Judiciales">Área Judiciales</option>
                    <option value="Area Visita">Área Visita</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {sectorHabitacional === "Otro" && (
                    <textarea
                      id="otroSectorTextarea"
                      rows={2}
                      cols={88}
                      placeholder="Especifique el sector..."
                      name="otroSector"
                      value={otroSector}
                      onChange={(e) => setOtroSector(e.target.value)}
                      className="mt-2 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    ></textarea>
                  )}
                </div>

                <div className="form-group" id="selectDondeContainer">
                  <label
                    htmlFor="donde"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ¿Dónde se le encontró?
                  </label>
                  <select
                    id="donde"
                    name="donde"
                    value={donde}
                    onChange={(e) => setDonde(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">Seleccione</option>
                    <option value="Portacion">Portación vestimenta</option>
                    <option value="Puerta de ingreso">Puerta de ingreso</option>
                    <option value="Boca">Boca</option>
                    <option value="Esófago/Estómago">Esófago/Estómago</option>
                    <option value="Ventanal">Ventanal</option>
                    <option value="Cama">Cama</option>
                    <option value="Mueble de ropa">Mueble de vestimenta</option>
                    <option value="Otro">Otro (especificar en detalle)</option>
                  </select>
                  {donde === "Otro" && (
                    <textarea
                      id="otroDetalleTextarea"
                      rows={2}
                      cols={88}
                      placeholder="Detalle donde..."
                      name="otroDetalle"
                      value={otroDetalle}
                      onChange={(e) => setOtroDetalle(e.target.value)}
                      className="mt-2 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    ></textarea>
                  )}
                </div>
                <label
                  htmlFor="tipoElectronico"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo de Electronico:
                </label>
                <select
                  id="tipoElectronico"
                  value={tipoElectronico}
                  onChange={handleTipoElectronicoChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Seleccione</option>
                  <option value="Movil celular">Movil celular</option>
                  <option value="TV">TV</option>
                  <option value="Radio">Radio</option>
                  <option value="Consola de videojuego">
                    Consola de videojuego
                  </option>
                  <option value="Heladera">Heladera</option>
                  <option value="Microondas">Microondas</option>
                  <option value="Freezer">Freezer</option>
                </select>
              </div>

              <div className="form-group">
                <label
                  htmlFor="marca"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Marca:
                </label>
                {mostrarSelectMarca ? (
                  <select
                    id="marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">Seleccione una marca</option>
                    {phoneBrands.map((brand) => (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                )}
              </div>

              <div className="form-group">
                <label
                  htmlFor="modelo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Modelo:
                </label>
                <input
                  type="text"
                  id="modelo"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="imei"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  IMEI/Nº De serie:
                </label>
                <input
                  type="text"
                  id="imei"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="medida"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Medida del Electronico (cm):
                </label>
                <input
                  type="number"
                  id="medida"
                  min="0"
                  step="0.1"
                  placeholder="Ej.: 10.15"
                  value={medida}
                  onChange={(e) => setMedida(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
             
              <div className="form-group">
                <label
                  htmlFor="detalles"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Detalles:
                </label>
                <textarea
                  id="detalles"
                  placeholder="Detalles adicionales sobre el electronico"
                  rows={3}
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                  className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleAddElectronico}
                  className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                >
                  Guardar Electronico
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectronicosModal;
