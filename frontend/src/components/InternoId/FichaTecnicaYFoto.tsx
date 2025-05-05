//frontend\src\components\InternoId\FichaTecnicaYFoto.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "@/../public/css/botonesSearch.css";
import HistorialEgresos from "@/components/ui/historialegreso/HistorialEgresos";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { formatUbicacionMap } from "@/app/utils/formatters";
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
              interno
            </button>
            <h1 className="text-3xl font-bold my-4">
              Interno e historial de entidades/eventos:
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
                    ingreso.nombres +
                    " L.P.U (" +
                    ingreso.lpu +
                    ")"}
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

          <p>
            <strong>Fecha de ingreso:</strong>{" "}
            {ingreso.fechaHoraIng
              ? new Date(ingreso.fechaHoraIng)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")
              : "No"}
            <strong
              className={ingreso.esAlerta ? "text-red-500" : "text-green-500"}
            >
              ¿Es Alerta?:
            </strong>{" "}
            {ingreso.esAlerta === true
              ? "Sí"
              : ingreso.esAlerta === false
              ? "No"
              : "No"}
          </p>
          <p>
            <strong>Teléfono:</strong> {ingreso.telefono || "No"}
          </p>
          <p>
            <strong>Email Cliente:</strong> {ingreso.emailCliente || "No"}
          </p>

          <p>
            <strong>Condición:</strong> {ingreso.condicion || "No"}
          </p>
          <p>
            <strong>Apellido:</strong> {ingreso.apellido || "No"}
          </p>
          <p>
            <strong>Nombres:</strong> {ingreso.nombres || "No"}
          </p>
          <p>
            <strong>LPU:</strong> {ingreso.lpu || "No"}
          </p>
          <p>
            <strong>LPU Prov:</strong> {ingreso.lpuProv || "No"}
          </p>
          <p>
            <strong>Situación Procesal:</strong> {ingreso.sitProc || "No"}
          </p>
          <p>
            <strong>Tipo de Documento:</strong> {ingreso.tipoDoc || "No"}
          </p>
          {ingreso.docNacionalidad && (
            <p>
              <strong>Nacionalidad del Documento:</strong>{" "}
              {ingreso.docNacionalidad || "No"}
            </p>
          )}
          <p>
            <strong>Número de Documento:</strong> {ingreso.numeroDni || "No"}
          </p>
          <p>
            <strong>Establecimiento</strong> {ingreso.establecimiento || "No"}
          </p>
          <p>
            <strong>Módulo - U.R.:</strong> {ingreso.modulo_ur || "No"}
          </p>
          <p>
            <strong>Pabellón:</strong> {ingreso.pabellon || "No"}
          </p>
          <p>
            <strong>Celda:</strong> {ingreso.celda || "No"}
          </p>

          <p>
            <strong>Fecha de Nacimiento:</strong>{" "}
            {ingreso.fechaNacimiento
              ? new Date(ingreso.fechaNacimiento)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")
              : "No"}
          </p>
          <p>
            <strong>Edad:</strong> {ingreso.edad_ing || "No"}
          </p>
          {showAllFields && (
            <>
              <p>
                <strong>Alias:</strong> {ingreso.alias || "No"}
              </p>
              <p>
                <strong>Cronología de alojamientos actual:</strong>
              </p>
              <div className="mt-2 space-y-2 w-full col-span-2">
                {ingreso.historial
                  ? ingreso.historial
                      .split("\n")
                      .map((line: string, index: number) => {
                        const isEgreso = line.includes("Egresado");
                        return (
                          <div
                            key={index}
                            className={`w-full p-2 rounded-lg shadow-md ${
                              isEgreso
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {line}
                          </div>
                        );
                      })
                  : "No hay historial disponible"}
              </div>
              <p>
                <strong>Nacionalidad:</strong> {ingreso.nacionalidad || "No"}
              </p>
              <p>
                <strong>Provincia:</strong> {ingreso.provincia || "No"}
              </p>
              <p>
                <strong>Domicilios:</strong> {ingreso.domicilios || "No"}
              </p>
              <p>
                <strong>Número/s de Causa/s:</strong>{" "}
                {ingreso.numeroCausa || "No"}
              </p>
              <p>
                <strong>Procedencia:</strong> {ingreso.procedencia || "No"}
              </p>
              <p>
                <strong>Organización Criminal:</strong>{" "}
                {ingreso.orgCrim || "No"}
              </p>
              <p>
                <strong>Delitos:</strong>{" "}
                {ingreso.electrodomesticos
                  ? JSON.stringify(ingreso.electrodomesticos)
                  : "No"}
              </p>
              <p>
                <strong>Detalles de Delitos:</strong>{" "}
                {ingreso.electrodomesticosDetalles || "No"}
              </p>
              <p>
                <strong>Juzgados:</strong>{" "}
                {ingreso.juzgados ? JSON.stringify(ingreso.juzgados) : "No"}
              </p>
              <p>
                <strong>Ubicación en el Mapa:</strong>{" "}
                {formatUbicacionMap(ingreso.ubicacionMap)}
              </p>
              <p>
                <strong>Perfil:</strong>{" "}
                {ingreso.perfil ? JSON.stringify(ingreso.perfil) : "No"}
              </p>
              <p>
                <strong>Reingreso:</strong> {ingreso.reingreso || "No"}
              </p>
              <p>
                <strong>Título de Información Pública:</strong>{" "}
                {ingreso.titInfoPublic || "No"}
              </p>
              <p>
                <strong>Tema informativo:</strong> {ingreso.temaInf || "No"}
              </p>
              <p>
                <strong>Resumen:</strong> {ingreso.resumen || "No"}
              </p>
              <p>
                <strong>Observación:</strong> {ingreso.observacion || "No"}
              </p>
              <p>
                <strong>Link:</strong> {ingreso.link || "No"}
              </p>
              <p>
                <strong>Patologías:</strong>{" "}
                {ingreso.patologias ? JSON.stringify(ingreso.patologias) : "No"}
              </p>
              <p>
                <strong>Tatuajes:</strong>{" "}
                {ingreso.tatuajes ? JSON.stringify(ingreso.tatuajes) : "No"}
              </p>
              <p>
                <strong>Cicatrices:</strong>{" "}
                {ingreso.cicatrices ? JSON.stringify(ingreso.cicatrices) : "No"}
              </p>
              <p>
                <strong>Subgrupo:</strong> {ingreso.subGrupo || "No"}
              </p>
              <p>
                <strong>Sexo:</strong> {ingreso.sexo || "No"}
              </p>
              <p>
                <strong>Sexualidad:</strong> {ingreso.sexualidad || "No"}
              </p>
              <p>
                <strong>Estado Civil:</strong> {ingreso.estadoCivil || "No"}
              </p>
              <p>
                <strong>Profesión:</strong> {ingreso.profesion || "No"}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IngresoInfo;
