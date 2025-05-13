//frontend\src\components\ui\MovilesAnexados.tsx
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { removeAnexo } from "@/app/portal/eventos/ingresos/ingresos.api"; // Importar la función

interface MovilesAnexadosProps {
  moviles: any[];
  selectedMoviles: number[];
  setSelectedMoviles: React.Dispatch<React.SetStateAction<number[]>>;
}

const MovilesAnexados: React.FC<MovilesAnexadosProps> = ({
  moviles,
  selectedMoviles,
  setSelectedMoviles,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Móviles anexados</h3>
      {selectedMoviles.length > 0 ? (
        <div className="space-y-4">
          {selectedMoviles.map((movilId) => {
            const movil = moviles.find((m) => m.id === movilId);
            return movil ? (
              <MovilCard
                key={movil.id}
                movil={movil}
                selectedMoviles={selectedMoviles}
                setSelectedMoviles={setSelectedMoviles}
              />
            ) : null;
          })}
        </div>
      ) : (
        <p className="text-gray-500">No hay móviles anexados.</p>
      )}
    </div>
  );
};

const MovilCard: React.FC<{
  movil: any;
  selectedMoviles: number[];
  setSelectedMoviles: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ movil, selectedMoviles, setSelectedMoviles }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRemove = async () => {
    const confirmRemove = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas quitar el móvil con patente ${movil.patente}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });

    if (confirmRemove.isConfirmed) {
      try {
        // Llamar a la función removeAnexo desde ingresos.api.ts
        await removeAnexo(movil.clienteId, movil.id);

        // Actualizar el estado en el frontend
        setSelectedMoviles(selectedMoviles.filter((id) => id !== movil.id));

        Swal.fire("Eliminado", "El móvil ha sido quitado correctamente.", "success");
      } catch (error) {
        console.error("Error al quitar el móvil:", error);
        Swal.fire("Error", "No se pudo quitar el móvil. Intenta nuevamente.", "error");
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full">
    <div className="flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Imagen del móvil */}
      {movil.imagen ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${movil.imagen}`}
          alt={`Imagen del móvil ${movil.patente}`}
          width={100}
          height={100}
          className="rounded-lg shadow-md"
        />
      ) : (
        <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-gray-500">Sin imagen</span>
        </div>
      )}
  
      {/* Información principal del móvil */}
      <div className="ml-0 sm:ml-4 flex-1">
        <p className="text-lg font-semibold">
          <strong>Patente:</strong> {movil.patente || "N/A"}
        </p>
        <p className="text-gray-700">
          <strong>Marca:</strong> {movil.marca || "N/A"}
        </p>
        <p className="text-gray-700">
          <strong>Modelo:</strong> {movil.modelo || "N/A"}
        </p>
      </div>
  
      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2">
        {/* Botón para desplegar detalles */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md flex items-center space-x-2"
        >
          <span>{isExpanded ? "Ocultar detalles" : "Ver detalles"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
  
        {/* Botón para editar móvil */}
        <Link
          href={`/portal/eventos/temas/${movil.id}/edit`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md flex items-center space-x-2"
        >
          <span>Editar móvil</span>
        </Link>
  
        {/* Botón para quitar móvil */}
        <button
          type="button"
          onClick={handleRemove}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
        >
          Quitar
        </button>
      </div>
    </div>
  
    {/* Información adicional del móvil */}
    {isExpanded && (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p>
          <strong>Año:</strong> {movil.anio || "N/A"}
        </p>
        <p>
          <strong>Color:</strong> {movil.color || "N/A"}
        </p>
        <p>
          <strong>Tipo de Pintura:</strong> {movil.tipoPintura || "N/A"}
        </p>
        <p>
          <strong>País de Origen:</strong> {movil.paisOrigen || "N/A"}
        </p>
        <p>
          <strong>Tipo de Vehículo:</strong> {movil.tipoVehic || "N/A"}
        </p>
        <p>
          <strong>Motor:</strong> {movil.motor || "N/A"}
        </p>
        <p>
          <strong>Chasis:</strong> {movil.chasis || "N/A"}
        </p>
        <p>
          <strong>Combustión:</strong> {movil.combustion || "N/A"}
        </p>
        <p>
          <strong>VIN:</strong> {movil.vin || "N/A"}
        </p>
        <p>
          <strong>Observación:</strong> {movil.observacion || "N/A"}
        </p>
      </div>
    )}
  </div>
  );
};

export default MovilesAnexados;