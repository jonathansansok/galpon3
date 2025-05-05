import { FC, useState, useEffect } from "react";

interface ArmasModalProps {
  initialArmas: string;
  onSave: (armas: string) => void;
}

interface Arma {
  tipoArma: string;
  tipoEspecifico: string;
  medida: string;
  detalles: string;
  dentroCelda: string;
  sectorHabitacional: string;
  donde: string;
  pabellon: string;
  otroSector: string;
  otroDetalle: string;
}

const ArmasModal: FC<ArmasModalProps> = ({ initialArmas, onSave }) => {
  const [armas, setArmas] = useState<Arma[]>([]);
  const [tipoArma, setTipoArma] = useState<string>("");
  const [tipoEspecifico, setTipoEspecifico] = useState<string>("");
  const [medida, setMedida] = useState<string>("");
  const [detalles, setDetalles] = useState<string>("");
  const [dentroCelda, setDentroCelda] = useState<string>("");
  const [sectorHabitacional, setSectorHabitacional] = useState<string>("");
  const [donde, setDonde] = useState<string>("");
  const [pabellon, setPabellon] = useState<string>("");
  const [otroSector, setOtroSector] = useState<string>("");
  const [otroDetalle, setOtroDetalle] = useState<string>("");

  useEffect(() => {
    if (initialArmas) {
      const data = JSON.parse(initialArmas);
      setArmas(data);
      if (data.length > 0) {
        const lastArma = data[data.length - 1];
        setTipoArma(lastArma.tipoArma);
        setTipoEspecifico(lastArma.tipoEspecifico);
        setMedida(lastArma.medida);
        setDetalles(lastArma.detalles);
        setDentroCelda(lastArma.dentroCelda);
        setSectorHabitacional(lastArma.sectorHabitacional);
        setDonde(lastArma.donde);
        setPabellon(lastArma.pabellon);
        setOtroSector(lastArma.otroSector);
        setOtroDetalle(lastArma.otroDetalle);
      }
    }
  }, [initialArmas]);
  const openModal = () => {
    const modal = document.getElementById("armas-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("armas-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const handleAddArma = () => {
    if (!tipoArma || !tipoEspecifico) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    const newArma: Arma = {
      tipoArma,
      tipoEspecifico,
      medida,
      detalles,
      dentroCelda,
      sectorHabitacional,
      donde,
      pabellon,
      otroSector,
      otroDetalle,
    };
    setArmas([...armas, newArma]);
    setTipoArma("");
    setTipoEspecifico("");
    setMedida("");
    setDetalles("");
    setDentroCelda("");
    setSectorHabitacional("");
    setDonde("");
    setPabellon("");
    setOtroSector("");
    setOtroDetalle("");
  };

  const handleRemoveArma = (index: number) => {
    const updatedArmas = armas.filter((_, i) => i !== index);
    setArmas(updatedArmas);
  };

  const handleSaveChanges = () => {
    onSave(JSON.stringify(armas));
    closeModal();
  };

  const mostrarOpcionesArma = () => {
    const tipoArma = document.getElementById("tipoArma") as HTMLSelectElement;
    const opcionesArmaBlanca = document.getElementById("opcionesArmaBlanca");
    const opcionesArmaFuego = document.getElementById("opcionesArmaFuego");

    if (opcionesArmaBlanca && opcionesArmaFuego) {
      opcionesArmaBlanca.style.display =
        tipoArma.value === "Arma Blanca" ||
        tipoArma.value === "Parte de Arma Blanca"
          ? "block"
          : "none";
      opcionesArmaFuego.style.display =
        tipoArma.value === "Arma de Fuego" ||
        tipoArma.value === "Parte de Arma de Fuego"
          ? "block"
          : "none";
    }
  };

  return (
    <div id="armas-group">
      <button
        data-modal-target="armas-modal"
        data-modal-toggle="armas-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Armas secuestradas
      </button>

      <div
        id="armas-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Registro de Secuestro de Armas
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="armas-modal"
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
                Armas Secuestradas:
                <span id="contadorArmas" className="ml-2">
                  {armas.length}
                </span>
              </h4>
              <ul id="listaArmas" className="list-group space-y-2">
                {armas.map((arma, index) => (
                  <li
                    key={index}
                    className="list-group-item p-2 bg-green-100 rounded-md dark:bg-gray-700"
                  >
                    <strong>Tipo:</strong> {arma.tipoArma} -{" "}
                    {arma.tipoEspecifico} <br />
                    <strong>Medida:</strong> {arma.medida} cm <br />
                    <strong>Detalles:</strong> {arma.detalles || "Ninguno"}{" "}
                    <br />
                    <strong>Dentro de Celda:</strong> {arma.dentroCelda} <br />
                    {arma.dentroCelda === "Sí" && (
                      <p>
                        <strong>Celda:</strong> {arma.pabellon}
                      </p>
                    )}
                    <strong>Sector Habitacional:</strong>{" "}
                    {arma.sectorHabitacional} <br />
                    {arma.sectorHabitacional === "Otro" && (
                      <p>
                        <strong>Otro Sector:</strong> {arma.otroSector}
                      </p>
                    )}
                    <strong>Donde (específico):</strong> {arma.donde} <br />
                    {arma.donde === "Otro" && (
                      <p>
                        <strong>Detalle:</strong> {arma.otroDetalle}
                      </p>
                    )}
                    <button
                      className="ml-2 text-red-500 hover:text-pink-500 font-bold cursor-pointer"
                      onClick={() => handleRemoveArma(index)}
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
                  htmlFor="tipoArma"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo de Arma:
                </label>
                <select
                  id="tipoArma"
                  value={tipoArma}
                  onChange={(e) => {
                    setTipoArma(e.target.value);
                    mostrarOpcionesArma();
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Seleccione</option>
                  <option value="Arma Blanca">Arma Blanca</option>
                  <option value="Parte de Arma Blanca">
                    Parte de Arma Blanca
                  </option>
                  <option value="Arma de Fuego">Arma de Fuego</option>
                  <option value="Parte de Arma de Fuego">
                    Parte de Arma de Fuego
                  </option>
                </select>
              </div>

              <div
                id="opcionesArmaBlanca"
                className="form-group"
                style={{ display: "none" }}
              >
                <label
                  htmlFor="tipoArmaBlanca"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  ¿Qué tipo de arma blanca?
                </label>
                <select
                  id="tipoArmaBlanca"
                  value={tipoEspecifico}
                  onChange={(e) => setTipoEspecifico(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Seleccione</option>
                  <option value="Fabricación casera">Fabricación casera</option>
                  <option value="Abanico de guerra">Abanico de guerra</option>
                  <option value="Alabarda">Alabarda</option>
                  <option value="Alfanje">Alfanje</option>
                  <option value="Almarada">Almarada</option>
                  <option value="Bayoneta">Bayoneta</option>
                  <option value="Bracamante">Bracamante</option>
                  <option value="Barreta">Barreta</option>
                  <option value="Corvo">Corvo</option>
                  <option value="Cuchillo">Cuchillo</option>
                  <option value="Cuchillo canario">Cuchillo canario</option>
                  <option value="Chakram">Chakram</option>
                  <option value="Daga">Daga</option>
                  <option value="Dirk">Dirk</option>
                  <option value="Destornillador">Destornillador</option>
                  <option value="Espada">Espada</option>
                  <option value="Espadín">Espadín</option>
                  <option value="Estilete">Estilete</option>
                  <option value="Estoque medieval">Estoque medieval</option>
                  <option value="Falcata">Falcata</option>
                  <option value="Flecha">Flecha</option>
                  <option value="Florete">Florete</option>
                  <option value="Garra">Garra</option>
                  <option value="Gladius">Gladius</option>
                  <option value="Guadaña de guerra">Guadaña de guerra</option>
                  <option value="Hacha">Hacha</option>
                  <option value="Hacha de guerra">Hacha de guerra</option>
                  <option value="Katana">Katana</option>
                  <option value="Katar">Katar</option>
                  <option value="Kubotan">Kubotan</option>
                  <option value="Kunai">Kunai</option>
                  <option value="Karambit">Karambit</option>
                  <option value="Lanza">Lanza</option>
                  <option value="Macuahuitl">Macuahuitl</option>
                  <option value="Machete">Machete</option>
                  <option value="Mandoble">Mandoble</option>
                  <option value="Maza">Maza</option>
                  <option value="Navaja">Navaja</option>
                  <option value="Picahielo">Picahielo</option>
                  <option value="Puñal">Puñal</option>
                  <option value="Sai">Sai</option>
                  <option value="Sica">Sica</option>
                  <option value="Sable">Sable</option>
                  <option value="Shuriken">Shuriken</option>
                  <option value="Tantō">Tantō</option>
                  <option value="Tenedor">Tenedor</option>
                  <option value="Tijeras">Tijeras</option>
                  <option value="Tridente">Tridente</option>
                  <option value="Wakizashi">Wakizashi</option>
                </select>
              </div>

              <div
                id="opcionesArmaFuego"
                className="form-group"
                style={{ display: "none" }}
              >
                <label
                  htmlFor="tipoArmaFuego"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  ¿Qué tipo de arma de fuego?
                </label>
                <select
                  id="tipoArmaFuego"
                  value={tipoEspecifico}
                  onChange={(e) => setTipoEspecifico(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Seleccione una </option>
                  <option value="Arma de fuego">Arma de fuego</option>
                  <option value="Arma de lanzamiento">
                    Arma de lanzamiento
                  </option>
                  <option value="Arma portátil">Arma portátil</option>
                  <option value="Arma no portátil">Arma no portátil</option>
                  <option value="Arma de puño o corta">
                    Arma de puño o corta
                  </option>
                  <option value="Arma de carga tiro a tiro">
                    Arma de carga tiro a tiro
                  </option>
                  <option value="Arma de repetición">Arma de repetición</option>
                  <option value="Arma semiautomática">
                    Arma semiautomática
                  </option>
                  <option value="Arma automática">Arma automática</option>
                  <option value="Fusil">Fusil</option>
                  <option value="Carabina">Carabina</option>
                  <option value="Escopeta">Escopeta</option>
                  <option value="Fusil de caza">Fusil de caza</option>
                  <option value="Pistolón de caza">Pistolón de caza</option>
                  <option value="Pistola">Pistola</option>
                  <option value="Pistola ametralladora">
                    Pistola ametralladora
                  </option>
                  <option value="Revólver">Revólver</option>
                  <option value="Cartucho o tiro">Cartucho o tiro</option>
                  <option value="Munición">Munición</option>
                  <option value="Transporte de armas">
                    Transporte de armas
                  </option>
                  <option value="Ánima">Ánima</option>
                  <option value="Estría o macizo">Estría o macizo</option>
                  <option value="Punta">Punta</option>
                  <option value="Estampa de culote">Estampa de culote</option>
                </select>
              </div>

              <div className="form-group">
                <label
                  htmlFor="medidaArma"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Medida del Arma (cm):
                </label>
                <input
                  type="number"
                  id="medidaArma"
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
                  htmlFor="detallesArma"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Detalles:
                </label>
                <textarea
                  id="detallesArma"
                  placeholder="Detalles adicionales sobre el arma"
                  rows={3}
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                  className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleAddArma}
                  className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                >
                  Guardar Arma
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

export default ArmasModal;
