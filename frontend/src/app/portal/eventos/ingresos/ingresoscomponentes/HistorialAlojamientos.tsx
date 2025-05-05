//frontend\src\app\portal\eventos\ingresos\ingresoscomponentes\HistorialAlojamientos.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { FaEdit } from "react-icons/fa";
import SelectCompHistorial from "@/components/ui/SelectCompHistorial";
import "./historialAlojamientos.css";

interface HistorialAlojamientosProps {
  historial: string;
  setHistorial: (historial: string) => void;
  ingreso: any;
}

const HistorialAlojamientos: React.FC<HistorialAlojamientosProps> = ({
  historial,
  setHistorial,
  ingreso,
}) => {
  const [selectedHistorialDate, setSelectedHistorialDate] = useState<Date | null>(new Date());
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editHistorialValues, setEditHistorialValues] = useState<{
    historialEstablecimiento: string;
    historialModuloUr: string;
    historialPabellon: string;
  }>({
    historialEstablecimiento: "",
    historialModuloUr: "",
    historialPabellon: "",
  });

  const actualizarHistorial = (data: any) => {
    const formattedDate = selectedHistorialDate
      ? format(selectedHistorialDate, "dd/MM/yyyy, HH:mm:ss")
      : "";
    const nuevoHistorial = `${historial}\n${formattedDate} - Establecimiento: ${data.historialEstablecimiento}, Módulo UR: ${data.historialModuloUr}, Pabellón: ${data.historialPabellon}`;
    setHistorial(nuevoHistorial);
  };

  const agregarEgreso = () => {
    const formattedDate = selectedHistorialDate
      ? format(selectedHistorialDate, "dd/MM/yyyy, HH:mm:ss")
      : "";
    const nuevoHistorial = `${historial}\n${formattedDate} - Egreso.`;
    setHistorial(nuevoHistorial);
  };

  const eliminarEntrada = (index: number) => {
    const historialArray = historial.split("\n").filter((entry) => entry.trim() !== "");
    historialArray.splice(index, 1);
    const nuevoHistorial = historialArray.join("\n");
    setHistorial(nuevoHistorial);
  };

  const handleEdit = (
    index: number,
    historialEstablecimiento: string,
    historialModuloUr: string,
    historialPabellon: string,
    date: string
  ) => {
    setEditIndex(index);
    setEditHistorialValues({ historialEstablecimiento, historialModuloUr, historialPabellon });
    setSelectedHistorialDate(parse(date, "dd/MM/yyyy, HH:mm:ss", new Date()));
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const historialArray = historial.split("\n").filter((entry) => entry.trim() !== "");
      const updatedDetails = `Establecimiento: ${editHistorialValues.historialEstablecimiento}, Módulo UR: ${editHistorialValues.historialModuloUr}, Pabellón: ${editHistorialValues.historialPabellon}`;
      const formattedDate = selectedHistorialDate
        ? format(selectedHistorialDate, "dd/MM/yyyy, HH:mm:ss")
        : "";

      historialArray[editIndex] = `${formattedDate} - ${updatedDetails}`;
      setHistorial(historialArray.join("\n"));

      setEditIndex(null);
      setEditHistorialValues({ historialEstablecimiento: "", historialModuloUr: "", historialPabellon: "" });
    }
  };

  const handleAddAlojamiento = () => {
    actualizarHistorial({
      historialEstablecimiento: editHistorialValues.historialEstablecimiento,
      historialModuloUr: editHistorialValues.historialModuloUr,
      historialPabellon: editHistorialValues.historialPabellon,
    });
    setEditHistorialValues({ historialEstablecimiento: "", historialModuloUr: "", historialPabellon: "" });
  };

  const isConfirmButtonVisible =
    selectedHistorialDate &&
    editHistorialValues.historialEstablecimiento &&
    editHistorialValues.historialModuloUr &&
    editHistorialValues.historialPabellon;

  return (
    <div>
      <div className="flex items-center mt-4">
        <DatePicker
          selected={selectedHistorialDate}
          onChange={(date: Date | null) => setSelectedHistorialDate(date)}
          dateFormat="dd/MM/yyyy"
          className="rounded-sm border border-gray-300 p-1 mr-4"
        />
        <SelectCompHistorial
          initialEstablecimiento={editHistorialValues.historialEstablecimiento}
          initialModuloUr={editHistorialValues.historialModuloUr}
          initialPabellon={editHistorialValues.historialPabellon}
          onEstablecimientoChange={(value) =>
            setEditHistorialValues((prev) => ({ ...prev, historialEstablecimiento: value }))
          }
          onModuloUrChange={(value) =>
            setEditHistorialValues((prev) => ({ ...prev, historialModuloUr: value }))
          }
          onPabellonChange={(value) =>
            setEditHistorialValues((prev) => ({ ...prev, historialPabellon: value }))
          }
          showPabellon={true}
        />
        {isConfirmButtonVisible ? (
          <button
            type="button"
            onClick={handleAddAlojamiento}
            className="bg-green-500 text-white rounded-sm px-2 py-1 ml-2"
          >
            Confirmar
          </button>
        ) : (
          <span className="text-green-500 ml-2">Escribir cambio de alojamiento</span>
        )}
        <button
          type="button"
          onClick={agregarEgreso}
          className="bg-red-500 text-white rounded-sm px-2 py-1 ml-4"
        >
          Egreso
        </button>
      </div>
      <div className="historial">
        <h3 className="my-3">Cronología de alojamientos:</h3>
        {historial
          .split("\n")
          .filter((entry) => entry.trim() !== "")
          .map((entry, index) => {
            const [date, details] = entry.split(" - ");
            return (
              <div
                key={index}
                className={`historial-entry flex items-center ${
                  index % 2 === 0 ? "bg-green-200" : "bg-blue-200"
                } p-2 mb-1 rounded-lg`}
              >
                <button
                  type="button"
                  onClick={() => eliminarEntrada(index)}
                  className="bg-red-500 text-white rounded-sm px-2 py-1 mr-2"
                >
                  X
                </button>
                <pre>
                  <strong>{date}</strong> - {details}
                </pre>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HistorialAlojamientos;