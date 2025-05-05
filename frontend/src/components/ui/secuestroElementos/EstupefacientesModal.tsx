import { FC, useState, useEffect } from "react";

interface EstupefacientesModalProps {
  initialEstupefacientes: string;
  onSave: (estupefacientes: string) => void;
}

interface Estupefaciente {
  sectorHabitacional: string;
  otroSector: string;
  donde: string;
  otroDetalle: string;
  tipoTenencia: string;
  tipoEstupefaciente: string;
  pesoEstupefaciente: number | string;
  unidadPeso: string;
  detalle: string;
  dentroCelda: string;
  pabellon: string;
}
const EstupefacientesModal: FC<EstupefacientesModalProps> = ({
  initialEstupefacientes,
  onSave,
}) => {
  const [estupefacientes, setEstupefacientes] = useState<Estupefaciente[]>([]);
  const [sectorHabitacional, setSectorHabitacional] = useState<string>("");
  const [otroSector, setOtroSector] = useState<string>("");
  const [donde, setDonde] = useState<string>("");
  const [otroDetalle, setOtroDetalle] = useState<string>("");
  const [tipoTenencia, setTipoTenencia] = useState<string>("");
  const [tipoEstupefaciente, setTipoEstupefaciente] = useState<string>("");
  const [pesoEstupefaciente, setPesoEstupefaciente] = useState<number | string>(
    ""
  );
  const [unidadPeso, setUnidadPeso] = useState<string>("gramos");
  const [detalle, setDetalle] = useState<string>("");
  const [dentroCelda, setdentroCelda] = useState<string>("");
  const [pabellon, setPabellon] = useState<string>("");
  useEffect(() => {
    if (initialEstupefacientes) {
      const data = JSON.parse(initialEstupefacientes);
      setEstupefacientes(data);
    }
  }, [initialEstupefacientes]);

  const closeModal = () => {
    const modal = document.getElementById("estupefacientes-modal");
    if (modal) {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const openModal = () => {
    const modal = document.getElementById("estupefacientes-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  };

  const handleAddEstupefaciente = () => {
    if (!donde) {
      alert(
        "Por favor, complete el campo '¿Dónde se le encontró?' antes de agregar un estupefaciente."
      );
      return;
    }

    const newEstupefaciente: Estupefaciente = {
      sectorHabitacional:
        sectorHabitacional === "Otro" ? otroSector : sectorHabitacional,
      otroSector,
      donde: donde === "Otro" ? otroDetalle : donde,
      otroDetalle,
      tipoTenencia,
      tipoEstupefaciente,
      pesoEstupefaciente,
      unidadPeso,
      detalle,
      dentroCelda,
      pabellon,
    };
    setEstupefacientes([...estupefacientes, newEstupefaciente]);
    setSectorHabitacional("");
    setOtroSector("");
    setDonde("");
    setOtroDetalle("");
    setTipoTenencia("");
    setTipoEstupefaciente("");
    setPesoEstupefaciente("");
    setUnidadPeso("gramos");
    setDetalle("");
    setdentroCelda("");
    setPabellon("");
  };

  const handleRemoveEstupefaciente = (index: number) => {
    const updatedEstupefacientes = estupefacientes.filter(
      (_, i) => i !== index
    );
    setEstupefacientes(updatedEstupefacientes);
  };

  const handleSaveChanges = () => {
    onSave(JSON.stringify(estupefacientes));
    closeModal();
  };

  const getPlaceholderText = () => {
    switch (unidadPeso) {
      case "gramos":
        return "Ej.: 20.5 para 20 gramos con 500 miligramos";
      case "mililitros":
        return "Ej.: 250 para 250 mililitros (equiv a 1/4 de litro)";
      default:
        return `Peso en ${unidadPeso}`;
    }
  };

  return (
    <div id="estupefacientes-group">
      <button
        data-modal-target="estupefacientes-modal"
        data-modal-toggle="estupefacientes-modal"
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        onClick={openModal}
        type="button"
      >
        Estupefacientes secuestrados
      </button>

      <div
        id="estupefacientes-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md backdrop-brightness-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Estupefacientes secuestrados
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="estupefacientes-modal"
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
              {estupefacientes.map((estupefaciente, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-100 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Dentro de Celda:</strong>{" "}
                      {estupefaciente.dentroCelda}
                    </p>
                    {estupefaciente.dentroCelda === "Sí" && (
                      <p>
                        <strong>Celda:</strong> {estupefaciente.pabellon}
                      </p>
                    )}
                    <p>
                      <strong>Sector Habitacional:</strong>{" "}
                      {estupefaciente.sectorHabitacional}
                    </p>
                    <p>
                      <strong>Donde:</strong> {estupefaciente.donde}
                    </p>
                    <p>
                      <strong>Tipo Tenencia:</strong>{" "}
                      {estupefaciente.tipoTenencia}
                    </p>
                    <p>
                      <strong>Estupefaciente:</strong>{" "}
                      {estupefaciente.tipoEstupefaciente}
                    </p>
                    <p>
                      <strong>Peso:</strong> {estupefaciente.pesoEstupefaciente}{" "}
                      {estupefaciente.unidadPeso}
                    </p>
                    <p>
                      <strong>Detalle:</strong> {estupefaciente.detalle}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 font-bold rounded-lg hover:bg-red-100 p-1"
                    onClick={() => handleRemoveEstupefaciente(index)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
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
                  onChange={(e) => setdentroCelda(e.target.value)}
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
                <label
                  htmlFor="tipoTenencia"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4"
                >
                  Tipo de tenencia:
                </label>
                <select
                  id="tipoTenencia"
                  name="tipoTenencia"
                  value={tipoTenencia}
                  onChange={(e) => setTipoTenencia(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="No autorizado">No autorizado</option>
                  <option value="No permitido">No permitido</option>
                  <option value="Autorizado">Autorizado</option>
                </select>
              </div>
              <div className="form-group mt-4">
                <label
                  htmlFor="tipoEstupefaciente"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo de Estupefaciente:
                </label>
                <select
                  id="tipoEstupefaciente"
                  name="tipoEstupefaciente"
                  value={tipoEstupefaciente}
                  onChange={(e) => setTipoEstupefaciente(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Seleccione</option>
                  <option value="CANNABIS">CANNABIS</option>
                  <option value="COCAINA">COCAINA</option>
                  <option value="Mezcla casera">Mezcla casera</option>
                  <option value="COCA">COCA</option>
                  <option value="HEROÍNA">HEROÍNA</option>
                  <option value="Otro">Otro (En detalle)</option>
                  <option value="ACETILMETADOL">ACETILMETADOL</option>
                  <option value="Levacetilmetadol">
                    Levacetilmetadol Ver Acetilmetadol
                  </option>
                  <option value="Acetato_de_Metadil">
                    Acetato de Metadil Ver Acetilmetadol
                  </option>
                  <option value="ACETIL-ALFA-METILFENTANIL">
                    ACETIL-ALFA-METILFENTANIL
                  </option>
                  <option value="ACETORFINA">ACETORFINA</option>
                  <option value="ALFACETILMETADOL">ALFACETILMETADOL</option>
                  <option value="ALFAPRODINA">ALFAPRODINA</option>
                  <option value="ALFAMETALOL">ALFAMETALOL (ALFAMETADOL)</option>
                  <option value="ALFAMETILFENTANILO">ALFAMETILFENTANILO</option>
                  <option value="ALFA_METILTIOFENTANILO">
                    ALFA METILTIOFENTANILO
                  </option>
                  <option value="ALFAPRODINA">ALFAPRODINA</option>
                  <option value="ALFENTANIL">ALFENTANIL</option>
                  <option value="ALILPRODINA">ALILPRODINA</option>
                  <option value="ANILERIDINA">ANILERIDINA</option>
                  <option value="BECITRAMIDA">BECITRAMIDA</option>
                  <option value="BENCETIDINA">BENCETIDINA</option>
                  <option value="BENCILMORFINA">BENCILMORFINA</option>
                  <option value="BETACETILMETADOL">BETACETILMETADOL</option>
                  <option value="BETA_HIDROXIFENTANILO">
                    BETA HIDROXIFENTANILO
                  </option>
                  <option value="BETA_HIDROXI_3_METILFENTANILO">
                    BETA-HIDROXI-3-METILFENTANILO
                  </option>
                  <option value="BETA_MEPRODINA">BETA MEPRODINA</option>
                  <option value="BETAMETADOL">BETAMETADOL</option>
                  <option value="BETAPRODINA">BETAPRODINA</option>
                  <option value="BUTIRATO_DE_DIOXAFETILO">
                    BUTIRATO DE DIOXAFETILO
                  </option>
                  <option value="CODOXIMA">CODOXIMA</option>
                  <option value="CONCENTRADO_DE_PAJA_DE_ADORMIDERA">
                    CONCENTRADO DE PAJA DE ADORMIDERA
                  </option>
                  <option value="DESOMORFINA">DESOMORFINA</option>
                  <option value="DEXTROMORAMIDA">DEXTROMORAMIDA</option>
                  <option value="DIAMPROMIDA">DIAMPROMIDA</option>
                  <option value="DIETILTIAMBUTENO">DIETILTIAMBUTENO</option>
                  <option value="DIFENOXILATO">DIFENOXILATO</option>
                  <option value="DIFENOXINA">DIFENOXINA</option>
                  <option value="DIHIDROMORFINA">DIHIDROMORFINA</option>
                  <option value="DIMEFEPTANOL">DIMEFEPTANOL</option>
                  <option value="DIMENOXADOL">DIMENOXADOL</option>
                  <option value="DIMETILTIAMBUTENO">DIMETILTIAMBUTENO</option>
                  <option value="DIPIPANONA">DIPIPANONA</option>
                  <option value="Fenilperona_Ver_Dipipanona">
                    Fenilperona Ver Dipipanona
                  </option>
                  <option value="DROTEBANOL">DROTEBANOL</option>
                  <option value="Oximetebanol_Ver_Drotebanol">
                    Oximetebanol Ver Drotebanol
                  </option>
                  <option value="ETILMETILTIAMBUTENO">
                    ETILMETILTIAMBUTENO
                  </option>
                  <option value="ETONITACENO">ETONITACENO</option>
                  <option value="ETORFINA">ETORFINA</option>
                  <option value="ETOXERIDINA">ETOXERIDINA</option>
                  <option value="Carbetidina_Ver_Etoxeridina">
                    Carbetidina Ver Etoxeridina
                  </option>
                  <option value="FENADOXONA">FENADOXONA</option>
                  <option value="FENANPROMIDA">FENANPROMIDA</option>
                  <option value="FENAZOCINA">FENAZOCINA</option>
                  <option value="Fenobenzomorfano_Ver_Fenazocina">
                    Fenobenzomorfano Ver Fenazocina
                  </option>
                  <option value="FENOMORFAN">FENOMORFAN</option>
                  <option value="FENOPERIDINA">FENOPERIDINA</option>
                  <option value="Feniperidina_Ver_Fenoperidina">
                    Feniperidina Ver Fenoperidina
                  </option>
                  <option value="FENTANIL">FENTANIL</option>
                  <option value="FURETIDINA">FURETIDINA</option>

                  <option value="Diamorfina_Ver_Heroína">
                    Diamorfina Ver Heroína
                  </option>
                  <option value="Acetomorfina_Ver_Heroína">
                    Acetomorfina Ver Heroína
                  </option>
                  <option value="Diacetilmorfina_Ver_Heroína">
                    Diacetilmorfina Ver Heroína
                  </option>
                  <option value="HIDROCODONA">HIDROCODONA</option>
                  <option value="Dihidrocodeinona_Ver_Hidrocodona">
                    Dihidrocodeinona Ver Hidrocodona
                  </option>
                  <option value="HIDROMORFINOL">HIDROMORFINOL</option>
                  <option value="HIDROMORFONA">HIDROMORFONA</option>
                  <option value="Dihidromorfinona_Ver_Hidromrfona">
                    Dihidromorfinona Ver Hidromrfona
                  </option>
                  <option value="HIDROXIPETIDINA">HIDROXIPETIDINA</option>
                  <option value="ISOMETADONA">ISOMETADONA</option>
                  <option value="LEVOFENACILMORFAN">LEVOFENACILMORFAN</option>
                  <option value="LEVOMETORFAN">LEVOMETORFAN</option>
                  <option value="LEVOMORAMIDA">LEVOMORAMIDA</option>
                  <option value="LEVORFANOL">LEVORFANOL</option>
                  <option value="METADONA">METADONA</option>
                  <option value="Amidona_Ver_Metadona">
                    Amidona Ver Metadona
                  </option>
                  <option value="Dolofina_Ver_Metadona">
                    Dolofina Ver Metadona
                  </option>
                  <option value="Doloheptán">Doloheptán</option>
                  <option value="METAZOCINA">METAZOCINA</option>
                  <option value="METILDESORFINA">METILDESORFINA</option>
                  <option value="METILHIDROMORFINA">METILHIDROMORFINA</option>
                  <option value="3_METIL_FENTANIL">3 METIL FENTANIL</option>
                  <option value="3-Metilfentanilo_Ver_3-Metilfentanil">
                    3-Metilfentanilo Ver 3-Metilfentanil
                  </option>
                  <option value="3_METIL_TIOFENTANIL">
                    3 METIL TIOFENTANIL
                  </option>
                  <option value="METOPON">METOPON</option>
                  <option value="MIROFINA">MIROFINA</option>
                  <option value="MORAMIDA">MORAMIDA</option>
                  <option value="MORFERIDINA">MORFERIDINA</option>
                  <option value="MORFINA">MORFINA</option>
                  <option value="MPPP">MPPP</option>
                  <option value="NICOMORFINA">NICOMORFINA</option>
                  <option value="NORACIMETADOL">NORACIMETADOL</option>
                  <option value="NORLEVORFANOL">NORLEVORFANOL</option>
                  <option value="NORMETADONA">NORMETADONA</option>
                  <option value="Fenildimazona_Ver_Normetadona">
                    Fenildimazona Ver Normetadona
                  </option>
                  <option value="Desmetilmetadona_Ver_Normetadona">
                    Desmetilmetadona Ver Normetadona
                  </option>
                  <option value="Noramidona_Ver_Normetadona">
                    Noramidona Ver Normetadona
                  </option>
                  <option value="Isometadona_Ver_Normetadona">
                    Isometadona Ver Normetadona
                  </option>
                  <option value="Isoamidona_I_Ver_Normetadona">
                    Isoamidona I Ver Normetadona
                  </option>
                  <option value="NORMORFINA">NORMORFINA</option>
                  <option value="NORPIPANONA">NORPIPANONA</option>
                  <option value="N-OXIMORFINA">N-OXIMORFINA</option>
                  <option value="OPIO">OPIO</option>
                  <option value="OXICODONA">OXICODONA</option>
                  <option value="Bionina_Ver_Oxicodona">
                    Bionina Ver Oxicodona
                  </option>
                  <option value="Dihidrona_Ver_Oxicodona">
                    Dihidrona Ver Oxicodona
                  </option>
                  <option value="Dihidroxicodeinona_Ver_Oxicodona">
                    Dihidroxicodeinona Ver Oxicodona
                  </option>
                  <option value="Oxicona_Ver_Oxicodona">
                    Oxicona Ver Oxicodona
                  </option>
                  <option value="Pancodina_Ver_Oxicodona">
                    Pancodina Ver Oxicodona
                  </option>
                  <option value="OXIMORFONA">OXIMORFONA</option>
                  <option value="Dihidroximorfinona_Ver_Oximorfona">
                    Dihidroximorfinona Ver Oximorfona
                  </option>
                  <option value="Oxidimorfona_Ver_Oximorfo">
                    Oxidimorfona Ver Oximorfona
                  </option>
                  <option value="Para_FLUOROFENTANILO">
                    Para- FLUOROFENTANILO
                  </option>
                  <option value="PEPAP">PEPAP</option>
                  <option value="PETIDINA_MEPRIDINA">
                    PETIDINA (MEPERIDINA)
                  </option>
                  <option value="Meperidina_Ver_Petidina">
                    Meperidina Ver Petidina
                  </option>
                  <option value="PIMINODINA">PIMINODINA</option>
                  <option value="PIRITRAMIDA">PIRITRAMIDA</option>
                  <option value="PROHEPTACINA">PROHEPTACINA</option>
                  <option value="PROPERIDINA">PROPERIDINA</option>
                  <option value="RACEMETORFAN">RACEMETORFAN</option>
                  <option value="RACEMORAMIDA">RACEMORAMIDA</option>
                  <option value="RACEMORFAN">RACEMORFAN</option>
                  <option value="SUFENTANIL">SUFENTANIL</option>
                  <option value="TEBACON">TEBACON</option>
                  <option value="TEBAINA">TEBAINA</option>
                  <option value="TILIDINA">TILIDINA</option>
                  <option value="TIOFENTANILO">TIOFENTANILO</option>
                  <option value="TRIMEPERIDINA">TRIMEPERIDINA</option>
                  <option value="ACETILDIHIDROCODEINA">
                    ACETILDIHIDROCODEINA
                  </option>
                  <option value="CODEINA">CODEINA</option>
                  <option value="Metilmorfina_Verr_Codeína">
                    Metilmorfina Verr Codeína
                  </option>
                  <option value="DEXTROPROPOXIFENO">DEXTROPROPOXIFENO</option>
                  <option value="ETILMORFINA">ETILMORFINA</option>
                  <option value="Codetilina_Ver_Etilmorfina">
                    Codetilina Ver Etilmorfina
                  </option>
                  <option value="Dionina_Ver_Etilmorfina">
                    Dionina Ver Etilmorfina
                  </option>
                  <option value="FOLCODINA">FOLCODINA</option>
                  <option value="Betamorfoliniletilmorfina_Ver_Folcodina">
                    Betamorfoliniletilmorfina Ver Folcodina
                  </option>
                  <option value="Morfoliniletilmorfina_Ver_Folcodina">
                    Morfoliniletilmorfina Ver Folcodina
                  </option>
                  <option value="Prodomina_Ver_Folcodina">
                    Prodomina Ver Folcodina
                  </option>
                  <option value="NICOCODINA">NICOCODINA</option>
                  <option value="NICODICODINA">NICODICODINA</option>
                  <option value="NORCODEINA">NORCODEINA</option>
                  <option value="ROPIRAMO">ROPIRAMO</option>
                  <option value="ACETILDIHIDROCODEINA_CODEINA">
                    ACETILDIHIDROCODEINA, CODEINA
                  </option>
                  <option value="DIHIDROCODEINA">DIHIDROCODEINA</option>
                  <option value="ETILMORFINA">ETILMORFINA</option>
                  <option value="norpseudoefedrina">
                    (+)-norpseudoefedrina Ver CATINA
                  </option>
                  <option value="4-methylamino">4-METILAMINOREX</option>
                  <option value="acepromazina">ACEPROMAZINA</option>
                  <option value="acido-alilbarbiturico">
                    Ácido Alilbarbitúrico Ver Butalbital
                  </option>
                  <option value="acido-feniletilbarbiturico">
                    Ácido Feniletilbarbitúrico Ver FENOBARBITAL
                  </option>
                  <option value="aet">AET Ver ETRIPTAMINA</option>
                  <option value="alcohol-tribromoetilico">
                    ALCOHOL TRIBROMOETILICO
                  </option>
                  <option value="alimemazina">ALIMEMAZINA</option>
                  <option value="alobarbital">
                    Alobarbital Ver ALLOBARBITAL
                  </option>
                  <option value="alobarbitona">
                    Alobarbitona ALLOBARBITAL
                  </option>
                  <option value="alopropilbarbital">
                    Alopropilbarbital Ver APROBARBITAL
                  </option>
                  <option value="alpide">ALPIDEM</option>
                  <option value="alprazolam">ALPRAZOLAM</option>
                  <option value="amfetamina">Amfetamina Ver ANFETAMINA</option>
                  <option value="amilobarbitona">
                    Amilobarbitona Ver AMOBARBITAL
                  </option>
                  <option value="amineptina">Amineptina Ver AMINEPTINO</option>
                  <option value="amineptino">AMINEPTINO</option>
                  <option value="aminorex">AMINOREX</option>
                  <option value="aminoxafen">Aminoxafen Ver AMINOREX</option>
                  <option value="amitriptilina">AMITRIPTILINA</option>
                  <option value="amobarbital">AMOBARBITAL</option>
                  <option value="amoxapina">AMOXAPINA</option>
                  <option value="anfepramona">Anfepramona Ver BUPROPION</option>
                  <option value="anfetamina">ANFETAMINA</option>
                  <option value="anfetilina">Anfetilina Ver FENETILINA</option>
                  <option value="aprobarbital">APROBARBITAL</option>
                  <option value="barbital">BARBITAL</option>
                  <option value="benactizina">BENACTIZINA CLORHIDRATO</option>
                  <option value="benperidol">BENPERIDOL</option>
                  <option value="benzfetamina">BENZFETAMINA</option>
                  <option value="benzoctamina">BENZOCTAMINA</option>
                  <option value="benzoperidol">
                    Benzoperidol Ver BENPERIDOL
                  </option>
                  <option value="brallobarbitalc">
                    BRALLOBARBITAL CALCICO
                  </option>
                  <option value="brolanfetamina">BROLANFETAMINA</option>
                  <option value="bromazepan">BROMAZEPAN</option>
                  <option value="brotizolam">BROTIZOLAM</option>
                  <option value="bufotenina">BUFOTENINA</option>
                  <option value="buprenorfina">BUPRENORFINA</option>
                  <option value="bupropion">BUPROPION</option>
                  <option value="butabarbital">BUTABARBITAL SODICO</option>
                  <option value="butalbitral">BUTALBITAL</option>
                  <option value="butaperazina">
                    Butaperazina Ver BUTIRILPERAZINA
                  </option>
                  <option value="butirylperazina">BUTIRILPERAZINA</option>
                  <option value="butobarbital">BUTOBARBITAL</option>
                  <option value="butriptina">BUTRIPTILINA</option>
                  <option value="camazepam">CAMAZEPAM</option>
                  <option value="captopiamina">CAPTODIAMINA</option>
                  <option value="captodiamo">
                    Captodiamo Ver CAPTODIAMINA
                  </option>
                  <option value="catina">CATINA</option>
                  <option value="catinona">CATINONA</option>
                  <option value="centrofenoina">CENTROFENOXINA</option>
                  <option value="ciclobarbital">CICLOBARBITAL</option>
                  <option value="ciprodenato">CIPRODENATO</option>
                  <option value="citalopram">CITALOPRAM</option>
                  <option value="clobazam">CLOBAZAM</option>
                  <option value="clobenzo">CLOBENZOREX</option>
                  <option value="clometiazol">CLOMETIAZOL</option>
                  <option value="clomipramina">CLOMIPRAMINA</option>
                  <option value="clonazepam">CLONAZEPAM</option>
                  <option value="clorazepato">CLORAZEPATO DIPOTASICO</option>
                  <option value="clordiazepoxido">CLORDIAZEPOXIDO</option>
                  <option value="clorfenterm">CLORFENTERMINA</option>
                  <option value="clorpromazina">CLORPROMAZINA</option>
                  <option value="clorprotxeno">CLORPROTIXENO</option>
                  <option value="clortiapina">CLORTIAPINA (CLOTIAPINA)</option>
                  <option value="clotipina">CLOTIAPINA Ver CLORTIAPINA</option>
                  <option value="clotiazepam">CLOTIAZEPAM</option>
                  <option value="cloxazolam">CLOXAZOLAM</option>
                  <option value="clozapina">CLOZAPINA</option>
                  <option value="deanol">Deanol Ver DIMETILAMINOETANOL</option>
                  <option value="delorazepam">DELORAZEPAM</option>
                  <option value="demanyl">DEMANYL FOSFATO</option>
                  <option value="desipramina">DESIPRAMINA</option>
                  <option value="det">DET</option>
                  <option value="dexanfentamina">DEXANFENTAMINA</option>
                  <option value="diazepam">DIAZEPAM</option>
                  <option value="dibencepina">
                    Dibencepina Ver DIBENZEPINA
                  </option>
                  <option value="dibenzeppina">DIBENZEPINA</option>
                  <option value="dietilprop">
                    DIETILPROPIÓN Ver ANFEPRAMONA
                  </option>
                  <option value="dietiltriptamina">
                    Dietiltriptamina Ver DET
                  </option>
                  <option value="dihidroarmina">
                    Dihidroarmina Ver HARMALINA
                  </option>
                  <option value="dimepropion">
                    Dimepropión Ver METANFEPRAMONA
                  </option>
                  <option value="dimetilaminoetanol">DIMETILAMINOETANOL</option>
                  <option value="dimetiletanolamina">
                    Dimetiletanolamina DIMETILAMINOETANOL
                  </option>
                  <option value="dimetilheptilpirano">
                    Dimetilheptilpirano Ver DMHP
                  </option>
                  <option value="dimetiltriptamina">
                    Dimetiltriptamina Ver DMT
                  </option>
                  <option value="dimetiltriptamina">
                    Dimetiltriptamina Ver DMT
                  </option>
                  <option value="dimetoxianfetamina">
                    Dimetoxianfetamina Ver DMA
                  </option>
                  <option value="dixiracina">DIXIRACINA</option>
                  <option value="dma">DMA</option>
                  <option value="dma">DMA</option>
                  <option value="dmhp">DMHP</option>
                  <option value="dmt">DMT</option>
                  <option value="dmt">DMT</option>
                  <option value="doet">DOET</option>
                  <option value="dom">DOM Ver STP</option>
                  <option value="doxepina">DOXEPINA</option>
                  <option value="dronabinol">
                    Dronabinol Ver TETRAHIDROCANNABINOL
                  </option>
                  <option value="droperidol">DROPERIDOL</option>
                  <option value="ephedrone">Ephedrone Ver METCATINONA</option>
                  <option value="estazolam">ESTAZOLAM</option>
                  <option value="etclorvinol">ETCLORVINOL</option>
                  <option value="eticicidina">ETICICLIDINA</option>
                  <option value="etifoxina">ETIFOXINA</option>
                  <option value="etilamfetamina">
                    Etilamfetamina Ver N-ETILANFETAMINA
                  </option>
                  <option value="etilhexabarbital">Etilhexabarbital</option>
                  <option value="etinamato">ETINAMATO</option>
                  <option value="etodroxicina">ETODROXICINA</option>
                  <option value="etriptamina">ETRIPTAMINA</option>
                  <option value="femcanfamina">
                    Femcanfamina Ver FENCANFAMINA
                  </option>
                  <option value="femproprex">FEMPROPOREX</option>
                  <option value="fenazepam">FENAZEPAM</option>
                  <option value="fencanfamina">FENCANFAMINA</option>
                  <option value="fenciclidina">FENCICLIDINA</option>
                  <option value="fendimetrazina">FENDIMETRAZINA</option>
                  <option value="fenelzina">FENELZINA</option>
                  <option value="fenetilina">FENETILINA</option>
                  <option value="fenfluramina">FENFLURAMINA</option>
                  <option value="fenmetracina">FENMETRACINA</option>
                  <option value="fenobarbital">FENOBARBITAL</option>
                  <option value="fenpentadiol">FENPENTADIOL</option>
                  <option value="fentermina">FENTERMINA</option>
                  <option value="fludiazepam">FLUDIAZEPAM</option>
                  <option value="flufenazina">FLUFENAZINA</option>
                  <option value="flunitrazepam">FLUNITRAZEPAM</option>
                  <option value="fluopromazina">
                    Fluopromazina Ver TRIFLUOPERAZINA
                  </option>
                  <option value="fluoxetina">FLUOXETINA</option>
                  <option value="flurazepam">FLURAZEPAM</option>
                  <option value="fluspirileno">FLUSPIRILENO</option>
                  <option value="fluvoxamina">FLUVOXAMINA</option>
                  <option value="furfenorex">FURFENOREX</option>
                  <option value="furfurlmetilanfetamina">
                    FURFURILMETILANFETAMINA Ver FURFENOREX
                  </option>
                  <option value="ghb">GHB (GAMMA HIDROXIBUTÍRICO)</option>
                  <option value="glutetmda">GLUTETMDA</option>
                  <option value="halazepam">HALAZEPAM</option>
                  <option value="haloperidol">HALOPERIDOL</option>
                  <option value="haloxazolam">HALOXAZOLAM</option>
                  <option value="harmalina">HARMALINA</option>
                  <option value="harmina">HARMINA</option>
                  <option value="hemofenazina">
                    HEMOFENAZINA (HOMOFENAZINA)
                  </option>
                  <option value="hexapropimato">HEXAPROPIMATO</option>
                  <option value="hexobarbital">HEXOBARBITAL SODICO</option>
                  <option value="hexobarbitona">
                    Hexobarbitona Ver HEXOBARBITAL SODICO
                  </option>
                  <option value="hidroxizina">HIDROXIZINA</option>
                  <option value="homofenazina">
                    Homofenazina Ver HEMOFENAZINA
                  </option>
                  <option value="ibogaina">IBOGAINA</option>
                  <option value="imipramina">IMIPRAMINA</option>
                  <option value="iproclozida">IPROCLOZIDA</option>
                  <option value="isoaminilo">ISOAMINILO</option>
                  <option value="isobutrazina">
                    Isobutrazina Ver ALIMEMAZINA
                  </option>
                  <option value="isocarboxazida">
                    Isocarboxazida Ver IXOCARBOXIACIDA
                  </option>
                  <option value="ixocarboxiacida">IXOCARBOXIACIDA</option>
                  <option value="ketazolam">KETAZOLAM</option>
                  <option value="lefetamina">Lefetamina Ver SPA</option>
                  <option value="levanfetamina">LEVANFETAMINA</option>
                  <option value="levomepromazina">LEVOMEPROMAZINA</option>
                  <option value="levometanfetamina">LEVOMETANFETAMINA</option>
                  <option value="lisergida">LISERGIDA</option>
                  <option value="loflazepato">LOFLAZEPATO DE ETILO</option>
                  <option value="loprazolam">LOPRAZOLAM</option>
                  <option value="lorazepam">LORAZEPAM</option>
                  <option value="lormetazepam">LORMETAZEPAM</option>
                  <option value="loxapina">LOXAPINA</option>
                  <option value="lsd">LSD Ver LISERGIDA</option>
                  <option value="lsd25">LSD-25 Ver LISERGIDA</option>
                  <option value="mappina">MAPPINA Ver Bufotenina</option>
                  <option value="maprotilina">MAPROTILINA</option>
                  <option value="mazindol">MAZINDOL</option>
                  <option value="mda">MDA</option>
                  <option value="mde">MDE Ver MDMA</option>
                  <option value="mde2">MDE Ver N-ETIL MDA</option>
                  <option value="mdea">MDEA Ver N-ETIL MDA</option>
                  <option value="mdma">MDMA</option>
                  <option value="mdoh">MDOH Ver N-HIDROXI-MDA</option>
                  <option value="meclocualona">MECLOCUALONA</option>
                  <option value="meclofenoxato">
                    Meclofenoxato Ver CENTROFENOXINA
                  </option>
                  <option value="medazepan">MEDAZEPAN</option>
                  <option value="mefaxadina">Mefaxadina Ver MEFEXAMIDA</option>
                  <option value="mefenesina">MEFENESINA</option>
                  <option value="mefenorex">MEFENOREX</option>
                  <option value="mefexamina">Mefexadina Ver MEFEXAMIDA</option>
                  <option value="mefexamida">MEFEXAMIDA</option>
                  <option value="mefobarbitral">
                    Mefobarbital Ver METILFENOBARBITAL
                  </option>
                  <option value="mefobarbitona">
                    Mefobarbitona METILFENOBARBITAL
                  </option>
                  <option value="meprobamato">MEPROBAMATO</option>
                  <option value="mepromazina">
                    Mepromazina? Ver METOPROMAZINA?
                  </option>
                  <option value="mescalina">MESCALINA</option>
                  <option value="mesocarbo">MESOCARBO</option>
                  <option value="metacualona">METACUALONA</option>
                  <option value="metanfetamina">METANFEPRAMONA</option>
                  <option value="metanfetamina2">METANFETAMINA</option>
                  <option value="metcatinona">METCATINONA</option>
                  <option value="metilfenidato">METILFENIDATO</option>
                  <option value="metilfenobarbital">METILFENOBARBITAL</option>
                  <option value="metilpentinol">METILPENTINOL</option>
                  <option value="metilprilona">METILPRILONA</option>
                  <option value="metilpromazina">
                    Metilpromazina Ver ALIMEMAZINA
                  </option>
                  <option value="metiprilona">
                    Metiprilona Ver METILPRILONA
                  </option>
                  <option value="metopromazina">METOPROMAZINA</option>
                  <option value="metotrimeprazina">
                    Metotrimeprazina Ver LEVOMEPROMAZINA
                  </option>
                  <option value="metoxetamina">METOXETAMINA(MXE)</option>
                  <option value="metoxipromazina">
                    Metoxipromazina Ver METOPROMAZINA
                  </option>
                  <option value="mexefenadina">
                    Mexefenadina Ver MEFEXAMIDA
                  </option>
                  <option value="mianserina">MIANSERINA</option>
                  <option value="midazolam">MIDAZOLAM</option>
                  <option value="mirtazapina">MIRTAZAPINA</option>
                  <option value="mmda">MMDA</option>
                  <option value="moclobemida">MOCLOBEMIDA</option>
                  <option value="nalbufina">NALBUFINA</option>
                  <option value="ndesmetildiazepam">N-DESMETIL DIAZEPAM</option>
                  <option value="nefazadona">NEFAZADONA</option>
                  <option value="netilmda">N-ETIL MDA</option>
                  <option value="netilanfetamina">N-ETILANFETAMINA</option>
                  <option value="nhidroximda">N-HIDROXI-MDA</option>
                  <option value="nialamida">NIALAMIDA</option>
                  <option value="niamida">Niamida Ver NIALAMIDA</option>
                  <option value="nimetazepam">NIMETAZEPAM</option>
                  <option value="nitalopram">Nitalopram Ver CITALOPRAM</option>
                  <option value="nitrazepam">NITRAZEPAM</option>
                  <option value="nitrapotassium">NITRAZEPATO DE POTASIO</option>
                  <option value="nomifensina">NOMIFENSINA</option>
                  <option value="nordiazepam">NORDIAZEPAM</option>
                  <option value="nordiazepam2">
                    Nordiazepam Ver N-DESMETIL DIAZEPAM
                  </option>
                  <option value="nortriptilina">NORTRIPTILINA</option>
                  <option value="noxiptillina">NOXIPTILINA</option>
                  <option value="opipramol">OPIPRAMOL</option>
                  <option value="oxazepam">OXAZEPAM</option>
                  <option value="oxazimedrina">
                    OXAZIMEDRINA Ver FENMETRACINA
                  </option>
                  <option value="oxazolam">OXAZOLAM</option>
                  <option value="oxipertina">OXIPERTINA</option>
                  <option value="paegilina">Paeagilina Ver PARGILINA</option>
                  <option value="parahexilo">PARAHEXILO</option>
                  <option value="parametil">Para- metil-4-metilaminorex</option>
                  <option value="pargilina">Pargilamina Ver PARGILINA</option>
                  <option value="pargilina2">PARGILINA</option>
                  <option value="paroxetina">PAROXETINA</option>
                  <option value="pce">PCE Ver Eticiclidina</option>
                  <option value="pcp">PCP Ver FENCICLIDINA</option>
                  <option value="pcpy">PCPY Ver ROLICICLIDINA</option>
                  <option value="pemolina">PEMOLINA</option>
                  <option value="pemolina2">
                    PEMOLINA (como Monodroga pertenece a Lista IV de
                    Psicotrópicos y asociada a Diuréticos, Laxantes,
                    Tranquilizantes y/o otros anorexígenos será Venta Bajo
                    Receta Oficial.
                  </option>
                </select>
              </div>
              <div className="form-group mt-4">
                <label
                  htmlFor="unidadPeso"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Unidad de peso:
                </label>
                <select
                  id="unidadPeso"
                  name="unidadPeso"
                  value={unidadPeso}
                  onChange={(e) => setUnidadPeso(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="gramos">Gramos</option>
                  <option value="mililitros">Mililitros</option>
                </select>
              </div>
              <div className="form-group mt-4">
                <label
                  htmlFor="pesoEstupefaciente"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Peso en {unidadPeso}:
                </label>
                <input
                  type="number"
                  id="pesoEstupefaciente"
                  min="0"
                  step="0.1"
                  placeholder={getPlaceholderText()}
                  value={pesoEstupefaciente}
                  onChange={(e) => setPesoEstupefaciente(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="form-group mt-4">
                <label
                  htmlFor="detalle"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Detalle:
                </label>
                <textarea
                  id="detalle"
                  rows={3}
                  placeholder="Describa algún detalle adicional del estupefaciente secuestrado"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-700">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleAddEstupefaciente}
                type="button"
              >
                Agregar Estupefaciente
              </button>
              <button
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                data-modal-hide="estupefacientes-modal"
                onClick={handleSaveChanges}
                type="button"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstupefacientesModal;
