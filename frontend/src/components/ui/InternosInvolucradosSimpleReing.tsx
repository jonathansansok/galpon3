"use client";
import { FC, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getIngresos } from "@/app/portal/eventos/ingresos/ingresos.api";
import "@/../public/css/internosInvolucrados.css";

interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  detalle: string;
}

interface Ingreso {
  id: number;
  apellido: string;
  nombres: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  numeroDni: string;
  sitProc: string;
}

interface InternosInvolucradosSimpleProps {
  initialInternos: Interno[];
  onSelect: (selectedInternos: Interno[]) => void;
}

const InternosInvolucradosSimple: FC<InternosInvolucradosSimpleProps> = ({
  initialInternos,
  onSelect,
}) => {
  const [internosArray, setInternosArray] =
    useState<Interno[]>(initialInternos);
  const [detalle, setDetalle] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Ingreso[]>([]);
  const [selectedIngreso, setSelectedIngreso] = useState<Ingreso | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);

  useEffect(() => {
    setInternosArray(initialInternos);
  }, [initialInternos]);

  const abrirModalInternos = () => {
    const modal = document.getElementById("modalCargaInternos");
    if (modal) {
      modal.style.display = "flex";
    }
  };

  const cerrarModalInternos = () => {
    const modal = document.getElementById("modalCargaInternos");
    if (modal) {
      modal.style.display = "none";
    }
  };

  const verificarFormularioInternos = () => {
    const btnGuardarInterno = document.getElementById("btnGuardarInterno");
    if (btnGuardarInterno) {
      if (selectedIngreso) {
        btnGuardarInterno.style.display = "inline-flex";
      } else {
        btnGuardarInterno.style.display = "none";
      }
    }
  };

  const guardarInternoActual = () => {
    if (!selectedIngreso) {
      Swal.fire({
        title: "Campos incompletos",
        text: "¿Desea agregar este interno con algunos campos sin completar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#30d688",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          agregarInterno();
        }
      });
    } else {
      agregarInterno();
    }
  };

  const agregarInterno = () => {
    const interno: Interno = {
      nombreApellido: `${selectedIngreso?.apellido}, ${selectedIngreso?.nombres}`,
      alias: selectedIngreso?.alias || "",
      lpu: selectedIngreso?.lpu || "",
      lpuProv: selectedIngreso?.lpuProv || "",
      sitProc: selectedIngreso?.sitProc || "",
      detalle: detalle || "Sin Detalle",
    };
    setInternosArray((prev) => [...prev, interno]);

    setSelectedIngreso(null);
    setDetalle("");

    verificarFormularioInternos();
  };

  const eliminarInterno = (index: number) => {
    setInternosArray((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarInternos = () => {
    cerrarModalInternos();
    onSelect(internosArray);
  };

  const buscarInternos = async () => {
    if (searchTerm.length < 3) {
      alert("Por favor, ingresa al menos 3 caracteres para buscar.");
      return;
    }

    setLoading(true);
    setNoResults(false);

    try {
      const ingresos = await getIngresos();
      const filteredIngresos = ingresos.filter((ingreso: Ingreso) => {
        const apellido = ingreso.apellido?.toLowerCase() || "";
        const nombres = ingreso.nombres?.toLowerCase() || "";
        const alias = ingreso.alias?.toLowerCase() || "";
        const lpu = ingreso.lpu?.toLowerCase() || "";
        const lpuProv = ingreso.lpuProv?.toLowerCase() || "";
        const numeroDni = ingreso.numeroDni?.toLowerCase() || "";

        return (
          apellido.includes(searchTerm.toLowerCase()) ||
          nombres.includes(searchTerm.toLowerCase()) ||
          alias.includes(searchTerm.toLowerCase()) ||
          lpu.includes(searchTerm.toLowerCase()) ||
          lpuProv.includes(searchTerm.toLowerCase()) ||
          numeroDni.includes(searchTerm.toLowerCase())
        );
      });

      setSearchResults(filteredIngresos);
      setNoResults(filteredIngresos.length === 0);
    } catch (error) {
      console.error("Error fetching ingresos:", error);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarIngreso = (ingreso: Ingreso) => {
    setSelectedIngreso(ingreso);
    verificarFormularioInternos();
  };

  return (
    <div>
      <button
        className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700"
        type="button"
        onClick={abrirModalInternos}
      >
        Agregar reincidencias
      </button>

      <div
        id="modalCargaInternos"
        className="modal hidden fixed inset-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50 overflow-y-auto"
      >
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto">
          <span
            className="close cursor-pointer text-red-500 hover:text-red-700 text-4xl absolute top-4 right-4"
            onClick={cerrarModalInternos}
          >
            &times;
          </span>
          <h2 className="text-xl font-semibold mb-4">Carga de Internos</h2>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-green-500">
              Internos Confirmados ({internosArray.length}):
            </h3>
            <ul className="list-group">
              {internosArray.map((interno, index) => (
                <li
                  key={index}
                  className="list-group-item mb-2 bg-green-300 rounded-lg p-4 shadow-md"
                >
                  <span>
                    <strong>Nombre y Apellido:</strong> {interno.nombreApellido}{" "}
                    - <strong>Alias:</strong> {interno.alias} -{" "}
                    <strong>L.P.U.:</strong> {interno.lpu} -{" "}
                    <strong>Sit. Proc.:</strong> {interno.sitProc} -{" "}
                    <strong>L.P.U. Prov.:</strong> {interno.lpuProv} -{" "}
                    <strong>Detalle:</strong> {interno.detalle}
                  </span>
                  <span
                    className="delete-btn cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => eliminarInterno(index)}
                  >
                      <strong style={{ marginLeft: "10px", fontSize: "25px" }}> x</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-gray-700"
            >
              Buscar Interno:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="form-control mb-2 p-2 border border-gray-300 rounded-lg flex-grow"
                placeholder="L.P.U. - L.P.U. Prov. - Apellido - Nombre - Alias"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className={`bg-${
                  loading ? "green" : "blue"
                }-500 text-white px-4 py-2 rounded-lg`}
                onClick={buscarInternos}
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-500">
              Elija un interno de los resultados:
            </h3>
            {noResults && (
              <p className="text-blue-500 text-lg">No hay resultados.</p>
            )}
            <ul className="list-group max-h-60 overflow-y-auto">
              {searchResults.map((ingreso) => (
                <li
                  key={ingreso.id}
                  className="list-group-item mb-2 bg-gray-100 rounded-lg p-4 shadow-md cursor-pointer"
                  onClick={() => seleccionarIngreso(ingreso)}
                >
                  <span>
                    <strong>Nombre y Apellido:</strong> {ingreso.apellido},{" "}
                    {ingreso.nombres} - <strong>Alias:</strong> {ingreso.alias}{" "}
                    - <strong>L.P.U.:</strong> {ingreso.lpu} -{" "}
                    <strong>Sit. Proc.:</strong> {ingreso.sitProc} -{" "}
                    <strong>L.P.U. Prov.:</strong> {ingreso.lpuProv}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {selectedIngreso && (
            <div
              id="nuevoInternoForm"
              className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-light-blue w-full p-4 rounded-lg"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Interno Seleccionado:
                </h3>
                <p>
                  <strong>Nombre y Apellido:</strong> {selectedIngreso.apellido}
                  , {selectedIngreso.nombres}
                </p>
                <p>
                  <strong>Alias:</strong> {selectedIngreso.alias}
                </p>
                <p>
                  <strong>L.P.U.:</strong> {selectedIngreso.lpu}
                </p>
                <p>
                  <strong>Sit. Proc.:</strong> {selectedIngreso.sitProc}
                </p>
                <p>
                  <strong>L.P.U. Prov.:</strong> {selectedIngreso.lpuProv}
                </p>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="detalle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Detalle:
                </label>
                <textarea
                  className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Detalle"
                  id="detalle"
                  value={detalle}
                  onChange={(e) => {
                    setDetalle(e.target.value);
                    verificarFormularioInternos();
                  }}
                  rows={4}
                />
              </div>
            </div>
          )}

          <div className="botones-form mb-4">
            <button
              type="button"
              className="btn-guardar-form bg-green-400 text-white px-4 py-2 rounded-lg"
              onClick={guardarInternoActual}
              id="btnGuardarInterno"
              style={{ display: "none" }}
            >
              Confirm. interno
            </button>
          </div>

          <div className="modal-footer flex justify-end">
            <button
              type="button"
              className="btn-cerrar bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={cerrarModalInternos}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn-guardar bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={guardarInternos}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternosInvolucradosSimple;