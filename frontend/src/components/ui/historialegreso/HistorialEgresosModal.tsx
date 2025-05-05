//frontend\src\components\ui\historialegreso\HistorialEgresosModal.tsx
import React from "react";
import Modal from "@/components/ui/Modal";
import { updateFechaEgreso } from "@/app/portal/eventos/ingresos/ingresos.api";
import Swal from "sweetalert2";

interface HistorialEgresosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onExportToExcel: () => void; // Propiedad para exportar a Excel
  onExportToWord: () => void; // Propiedad para exportar a Word
  columns: string[];
  historial: any[];
  setEditableHistorial: (newHistorial: any[]) => void;
  ingresoId: string;
}

const HistorialEgresosModal: React.FC<HistorialEgresosModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onExportToExcel,
  onExportToWord,
  columns,
  historial,
  setEditableHistorial,
  ingresoId, // Recibir ingresoId como prop
}) => {
  const handleFechaEgresoChange = async (id: string, nuevaFecha: string) => {
    console.log("Modal - egresoId:", id);
    console.log("Modal - nuevaFecha:", nuevaFecha);
    try {
      const response = await updateFechaEgreso(ingresoId, id, nuevaFecha);
      console.log("Modal - Respuesta del backend:", response);

      if (response.success) {
        const updatedHistorial = historial.map((egreso) =>
          egreso.id === id ? { ...egreso, fechaEgreso: nuevaFecha } : egreso
        );
        setEditableHistorial(updatedHistorial);

        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "La fecha de egreso ha sido actualizada correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error || "No se pudo actualizar la fecha de egreso.",
        });
      }
    } catch (error) {
      console.error("Modal - Error al actualizar la fecha:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar actualizar la fecha de egreso.",
      });
    }
  };

  console.log("Modal - Renderizando historial:", historial); // Verificar el historial recibido en el modal

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">Historial de Egresos</h3>
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={(event) => {
            event.preventDefault(); // Evitar cualquier acción predeterminada
            onExportToExcel();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          type="button"
        >
          Exportar a Excel
        </button>
        <button
          onClick={(event) => {
            event.preventDefault(); // Evitar cualquier acción predeterminada
            onExportToWord();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          type="button"
        >
          Exportar a Word
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((column) => (
              <th key={column} className="border border-gray-300 px-4 py-2">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {historial.map((egreso) => (
            <tr key={egreso.id} className="bg-white hover:bg-gray-100">
              {columns.map((column) => (
                <td key={column} className="border border-gray-300 px-4 py-2">
                  {column === "fechaEgreso" ? (
                    <input
                      type="date"
                      value={egreso.fechaEgreso.split("T")[0]}
                      onChange={(e) => {
                        console.log("Input - egreso completo:", egreso); // Verificar el objeto completo
                        console.log("Input - egresoId:", egreso.id); // Verificar el id
                        console.log("Input - nuevaFecha:", e.target.value); // Verificar la nueva fecha
                        handleFechaEgresoChange(egreso.id, e.target.value);
                      }}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    egreso[column] || ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          type="button"
        >
          Cerrar
        </button>
        <button
          onClick={onSave}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          type="button"
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
};

export default HistorialEgresosModal;