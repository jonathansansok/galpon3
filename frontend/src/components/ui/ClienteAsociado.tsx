import React, { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/app/utils/pdfUtils"; // Importar la función de formato

interface ClienteAsociadoProps {
  cliente: {
    id: number; // ID del cliente para el enlace
    nombres: string;
    apellido: string;
    emailCliente?: string;
    telefono?: string;
    numeroCuit?: string;
    provincia?: string;
    direccion?: string;
    ciudad?: string;
    codigoPostal?: string;
    createdAt?: string; // Fecha de creación
    updatedAt?: string; // Fecha de actualización
    dias?: string; // Días
    iva?: string; // Condición frente al IVA
    pyme?: string; // Indica si es PyME
    porcB?: string; // Porcentaje B
    porcRetIB?: string; // Porcentaje Retención IB
  } | null;
}

const ClienteAsociado: React.FC<ClienteAsociadoProps> = ({ cliente }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!cliente) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Cliente asociado</h3>
        <p className="text-gray-500">No hay cliente asociado.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Cliente asociado</h3>
      <div className="p-6 border rounded-lg shadow-md bg-white flex flex-col md:flex-row items-start gap-6">
        {/* Información principal del cliente */}
        <div className="flex-1">
          <p className="text-lg font-semibold">
            <strong>Nombre:</strong> {cliente.nombres} {cliente.apellido}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {cliente.emailCliente || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Teléfono:</strong> {cliente.telefono || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>CUIT:</strong> {cliente.numeroCuit || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Localidad:</strong> {cliente.provincia || "N/A"}
          </p>

          {/* Botón para desplegar más datos */}
          <button
            type="button" // Evita que el botón envíe el formulario
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            {isExpanded ? "Ocultar detalles" : "Ver más detalles"}
          </button>

          {/* Datos adicionales del cliente */}
          {isExpanded && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                <strong>Dirección:</strong> {cliente.direccion || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Ciudad:</strong> {cliente.ciudad || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Código Postal:</strong> {cliente.codigoPostal || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Días:</strong> {cliente.dias || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Condición IVA:</strong> {cliente.iva || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>PyME:</strong> {cliente.pyme || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Porcentaje B:</strong> {cliente.porcB || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Porcentaje Retención IB:</strong> {cliente.porcRetIB || "N/A"}
              </p>
            </div>
          )}

          {/* Fechas formateadas al final */}
          <div className="mt-4 space-y-2">
            <p className="text-gray-700">
              <strong>Fecha de Creación:</strong>{" "}
              {formatDateTime(cliente.createdAt || "")}
            </p>
          </div>
        </div>

        {/* Botón para abrir el cliente en otra pestaña */}
        <div className="flex-shrink-0">
          <Link
            href={`/portal/eventos/ingresos/${cliente.id}`} // URL corregida
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Ver cliente
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClienteAsociado;