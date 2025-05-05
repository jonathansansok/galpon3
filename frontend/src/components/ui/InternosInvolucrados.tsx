// frontend/src/components/ui/InternosInvolucrados.tsx
"use client";
import { FC, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { searchInternos } from "@/app/portal/eventos/ingresos/ingresos.api";
import "@/../public/css/internosInvolucrados.css";
import { SearchBar } from "@/components/ui/SearchBars/SearchBarIngresos";

interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  gravedad: string;
  atencionExtramuro: string;
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

interface InternosInvolucradosProps {
  initialInternos: Interno[];
  onSelect: (selectedInternos: Interno[]) => void;
}

const InternosInvolucrados: FC<InternosInvolucradosProps> = ({
  initialInternos,
  onSelect,
}) => {
  const [internosArray, setInternosArray] =
    useState<Interno[]>(initialInternos);
  const [gravedad, setGravedad] = useState<string>("");
  const [atencionExtramuro, setAtencionExtramuro] = useState<string>("");
  const [detalle, setDetalle] = useState<string>("");
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
      if (selectedIngreso || gravedad || atencionExtramuro) {
        btnGuardarInterno.style.display = "inline-flex";
      } else {
        btnGuardarInterno.style.display = "none";
      }
    }
  };

  const guardarInternoActual = () => {
    if (!selectedIngreso || !gravedad || !atencionExtramuro) {
      Swal.fire({
        title: "Campos incompletos",
        text: "¿Desea agregar este interno con algunos campos sin completar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
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
      gravedad,
      atencionExtramuro,
      detalle: detalle || "Sin Detalle",
    };
    setInternosArray((prev) => [...prev, interno]);

    setSelectedIngreso(null);
    setGravedad("");
    setAtencionExtramuro("");
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

  const onSearch = async (queries: { generalQuery: string; apellido: string; nombres: string; lpu: string; lpuProv: string }) => {
    setLoading(true);
    setNoResults(false);

    try {
      const { generalQuery, apellido, nombres, lpu, lpuProv } = queries;
      const query = generalQuery || apellido || nombres || lpu || lpuProv;
      if (query) {
        const data = await searchInternos(query);
        if (Array.isArray(data)) {
          const filteredIngresos = data.filter((item: Ingreso) => 
            (!apellido || item.apellido?.toLowerCase().includes(apellido.toLowerCase())) &&
            (!nombres || item.nombres?.toLowerCase().includes(nombres.toLowerCase())) &&
            (!lpu || item.lpu?.toLowerCase().includes(lpu.toLowerCase())) &&
            (!lpuProv || item.lpuProv?.toLowerCase().includes(lpuProv.toLowerCase()))
          );
          setSearchResults(filteredIngresos);
          setNoResults(filteredIngresos.length === 0);
        } else {
          console.error("Data is not an array:", data);
        }
      } else {
        setSearchResults([]);
      }
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
        Agregar internos
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
                    <strong>Gravedad:</strong> {interno.gravedad} -{" "}
                    <strong>At. Extramuro:</strong> {interno.atencionExtramuro}{" "}
                    - <strong>Detalle:</strong> {interno.detalle}
                  </span>
                  <span
                    className="delete-btn cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => eliminarInterno(index)}
                  >
                    <strong>x</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4 w-full">
            <SearchBar onSearch={onSearch} />
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

              <div>
                <label
                  htmlFor="gravedad"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gravedad:
                </label>
                <select
                  className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  id="gravedad"
                  value={gravedad}
                  onChange={(e) => {
                    setGravedad(e.target.value);
                    verificarFormularioInternos();
                  }}
                >
                  <option value=""></option>
                  <option value="Ninguna">Ninguna</option>
                  <option value="Indefinida">Indefinida</option>
                  <option value="Leve">Leve</option>
                  <option value="Grave">Grave</option>
                  <option value="Gravisima">Gravísima</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="atencionExtramuro"
                  className="block text-sm font-medium text-gray-700"
                >
                  Atención Extramuro:
                </label>
                <select
                  className="form-control mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  id="atencionExtramuro"
                  value={atencionExtramuro}
                  onChange={(e) => {
                    setAtencionExtramuro(e.target.value);
                    verificarFormularioInternos();
                  }}
                >
                  <option value="">Atención Extramuro</option>
                  <option value="Indefinido">Indefinido</option>
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>
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

export default InternosInvolucrados;