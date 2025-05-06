import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import Link from "next/link";
import "@/../public/css/botonesSearch.css";
import HistorialEgresos from "@/components/ui/historialegreso/HistorialEgresos";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Image from "next/image";

interface IngresoInfoProps {
  ingreso: any;
  showAllFields: boolean;
  toggleFields: () => void;
}

const IngresoInfo = ({
  ingreso,
  showAllFields,
  toggleFields,
}: IngresoInfoProps) => {
  const [historialEgresos, setHistorialEgresos] = useState<any[]>(
    ingreso.historialEgresos || []
  );

  const handleEditClick = (id: string) => {
    window.open(`/portal/eventos/ingresos/${id}/edit`, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="w-full">
            <Link
              className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300"
              href="/portal/eventos/ingresos"
            >
              Volver
            </Link>
            <button
              className="mt-0 bg-blue-500 text-white px-4 py-2.5 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ml-4"
              onClick={() => handleEditClick(ingreso.id)}
            >
              Ver perfil dinámico para expedir en PDF, mensajería o editar
              cliente
            </button>
            <h1 className="text-3xl font-bold my-4">
              Cliente e historial de reparaciones:
            </h1>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <button
                  className="custom-button flex items-center"
                  onClick={toggleFields}
                >
                  {showAllFields ? (
                    <>
                      <FaChevronUp className="text-blue-500 mr-2" /> Contraer
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="text-green-500 mr-2" /> Expandir
                    </>
                  )}
                </button>
                <span className="text-green-500 text-3xl">
                  {ingreso.apellido +
                    ", " +
                    ingreso.nombres }
                </span>
              </div>
              {ingreso.imagen && (
                <div className="ml-4 flex">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagen}`}
                    alt="Imagen del ingreso"
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Renderizar el historial */}
          <div className="col-span-2 mt-4">
            <HistorialEgresos
              historial={historialEgresos}
              setHistorial={setHistorialEgresos}
            />
          </div>

          {/* Información del ingreso */}
          <div className="space-y-2">
            
            <div>
              <strong className="text-gray-700">Condición:</strong>{" "}
              <span
                className={
                  ingreso.esAlerta ? "text-red-500" : "text-green-500"
                }
              >
                {ingreso.esAlerta === true
                  ? "Sí"
                  : ingreso.esAlerta === false
                  ? "No"
                  : "No"}
              </span>
            </div>
            <div>
              <strong className="text-gray-700">Teléfono:</strong>{" "}
              <span>{ingreso.telefono || "No"}</span>
            </div>
            <div>
              <strong className="text-gray-700">Email Cliente:</strong>{" "}
              <span>{ingreso.emailCliente || "No"}</span>
            </div>
            <div>
              <strong className="text-gray-700">Condición:</strong>{" "}
              <span>{ingreso.condicion || "No"}</span>
            </div>
            <div>
              <strong className="text-gray-700">Apellido:</strong>{" "}
              <span>{ingreso.apellido || "No"}</span>
            </div>
            <div>
              <strong className="text-gray-700">Nombres:</strong>{" "}
              <span>{ingreso.nombres || "No"}</span>
            </div>
           
            <div>
              <strong className="text-gray-700">Número de Documento:</strong>{" "}
              <span>{ingreso.numeroDni || "No"}</span>
            </div>
          </div>

          {/* Campos adicionales si están expandidos */}
          {showAllFields && (
            <div className="space-y-2">
            
              <div>
                <strong className="text-gray-700">Provincia:</strong>{" "}
                <span>{ingreso.provincia || "No"}</span>
              </div>
              <div>
                <strong className="text-gray-700">Domicilios:</strong>{" "}
                <span>{ingreso.domicilios || "No"}</span>
              </div>
              <div>
                <strong className="text-gray-700">C.P.:</strong>{" "}
                <span>{ingreso.cp || "No"}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IngresoInfo;