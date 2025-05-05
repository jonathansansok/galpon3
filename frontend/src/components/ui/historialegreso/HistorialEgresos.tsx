//frontend\src\components\ui\historialegreso\HistorialEgresos.tsx
import React, { useState } from "react";
import { useParams } from "next/navigation"; // Importar useParams de next/navigation
import Swal from "sweetalert2";
import HistorialEgresosModal from "./HistorialEgresosModal";
import { exportToExcel } from "./exportToExcel";
import { exportToWord } from "./exportToWord";

function HistorialEgresos({
  historial,
  setHistorial,
}: {
  historial: any[];
  setHistorial: (newHistorial: any[]) => void;
}) {
  const { id } = useParams(); // Obtener ingresoId dinámico desde la URL
  const ingresoId = Array.isArray(id) ? id[0] : id; // Asegurarse de que ingresoId sea un string

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableHistorial, setEditableHistorial] = useState<any[]>(historial);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSave = () => {
    setHistorial(editableHistorial);
    Swal.fire({
      icon: "success",
      title: "Guardado",
      text: "El historial ha sido actualizado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
    toggleModal();
  };

  const columns = [
    "fechaNacimiento",
    "fechaHoraIng",
    "fechaEgreso",
    "apellido",
    "nombres",
    "alias",
    "numeroDni",
    "lpu",
    "lpuProv",
    "condicion",
    "esAlerta",
    "establecimiento",
    "historial",
  ];

  if (!ingresoId) {
    return <p>Cargando...</p>; // Mostrar un mensaje de carga mientras se obtiene el ingresoId
  }

  console.log("HistorialEgresos - historial pasado al modal:", editableHistorial); // Verificar el historial antes de pasarlo al modal

  return (
    <div>
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        type="button"
      >
        Ver Historial de Egresos
      </button>
      <HistorialEgresosModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSave={handleSave}
        onExportToExcel={() => exportToExcel(editableHistorial)}
        onExportToWord={() => exportToWord(editableHistorial)}
        columns={columns}
        historial={editableHistorial}
        setEditableHistorial={setEditableHistorial}
        ingresoId={ingresoId} // Pasar ingresoId al modal
      />
    </div>
  );
}

export default HistorialEgresos;