"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPreingreso,
  deletePreingreso,
  getPreingresos,
} from "../Preingresos.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime, formatData, cleanText } from "@/app/utils/formatData";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";
import Image from "next/image";
import { formatUbicacionMap } from "@/app/utils/formatters";
interface Props {
  params: {
    id: string;
  };
}

const PreingresoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [preingreso, setPreingreso] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.email) {
          setUser({ name: data.name, email: data.email });
        } else {
          router.push("/api/auth/login");
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        router.push("/api/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, router]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreingreso = async () => {
      const data = await getPreingreso(id);
      setPreingreso(data);
    };

    fetchPreingreso();
  }, [id]);

  const handleRemovePreingreso = async (id: string) => {
    console.log("Current user email:", user?.email);
    console.log("Preingreso creator email:", preingreso?.email);
    console.log("User privilege:", privilege);

    if (user?.email !== preingreso?.email && privilege !== "A1") {
      console.log("User is not authorized to delete this preingreso");
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este preingreso.",
        icon: "error",
      });
      return;
    }

    console.log("Attempting to delete preingreso with id:", id);
    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este preingreso?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      console.log("User confirmed deletion");
      await deletePreingreso(id);
      console.log("Preingreso deleted");
      router.push("/portal/eventos/preingresos");
    } else {
      console.log("User canceled deletion");
    }
  };

  if (!preingreso) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso[wordKey]}`;

  const cardContent = `
    Fecha y Hora de informe: ${
      preingreso.fechaHoraIng ? formatDateTime(preingreso.fechaHoraIng) : "N/A"
    }
    Clasificación: ${preingreso.clasificacion}
        Clasificación: ${preingreso.internosinvolucradoSimple}
       Apellido: ${preingreso.apellido}
    Nombres: ${preingreso.nombres}
    LPU: ${preingreso.lpu}
    LPU Prov: ${preingreso.lpuProv}
    Situación Procesal: ${preingreso.sitProc}
    Alias: ${preingreso.alias}
    Nacionalidad: ${preingreso.nacionalidad}
    Provincia: ${preingreso.provincia}
    Fecha de Nacimiento: ${
      preingreso.fechaNacimiento
        ? formatDateTime(preingreso.fechaNacimiento)
        : "N/A"
    }
    Edad al Ingreso: ${preingreso.edad_ing}
    Tipo de Documento: ${preingreso.tipoDoc}
    Número de DNI: ${preingreso.numeroDni}
    Delitos: ${JSON.stringify(preingreso.electrodomesticos)}
    Detalles de Delitos: ${preingreso.electrodomesticosDetalles}
    Domicilios: ${preingreso.domicilios}
Ubicación en el Mapa: ${formatUbicacionMap(preingreso.ubicacionMap)}
    Organización Criminal: ${preingreso.orgCrim}
    Cuál Organización: ${preingreso.cualorg}
    Procedencia: ${preingreso.procedencia}
    Establecimiento: ${preingreso.establecimiento}
    Delitos: ${preingreso.delitos}
    Detalle Adicional: ${preingreso.detalle_adicional}
    Juzgados: ${preingreso.juzgados}
    Organización Judicial: ${preingreso.org_judicial}
    Número de Causa: ${preingreso.numeroCausa}
    Reingreso: ${preingreso.reingreso}
    Registro SUV: ${preingreso.reg_suv}
    Registro CIR: ${preingreso.reg_cir}
    Título de Información Pública: ${preingreso.titInfoPublic}
    Resumen: ${preingreso.resumen}
    Link: ${preingreso.link}
    CIR Det: ${preingreso.cirDet}
    Observación: ${preingreso.observacion}
    Email: ${preingreso.email}
    Creado el: ${formatDateTime(preingreso.createdAt)}
    Actualizado el: ${formatDateTime(preingreso.updatedAt)}
  `;

  const fileName =
    `${preingreso.establecimiento}_${preingreso.fechaHora}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
  const title = "Detalle del Preingreso";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <span>{title}</span>
              {preingreso.imagen && (
                <div className="ml-4 flex">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagen}`}
                    alt="Imagen del preingreso"
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
            <Link
              className={buttonVariants()}
              href="/portal/eventos/preingresos"
            >
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p>
              <strong>Fecha y Hora de informe:</strong>{" "}
              {preingreso.fechaHoraIng
                ? formatDateTime(preingreso.fechaHoraIng)
                : "N/A"}
            </p>
            <p>
              <strong>Reingresos:</strong>{" "}
              {preingreso.internosinvolucradoSimple}
            </p>
            <p>
              <strong>Clasificación:</strong> {preingreso.clasificacion}
            </p>
            <p>
              <strong>Apellido:</strong> {preingreso.apellido}
            </p>
            <p>
              <strong>Nombres:</strong> {preingreso.nombres}
            </p>
            <p>
              <strong>LPU:</strong> {preingreso.lpu}
            </p>
            <p>
              <strong>LPU Prov:</strong> {preingreso.lpuProv}
            </p>
            <p>
              <strong>Situación Procesal:</strong> {preingreso.sitProc}
            </p>
            <p>
              <strong>Alias:</strong> {preingreso.alias}
            </p>
            <p>
              <strong>Nacionalidad:</strong> {preingreso.nacionalidad}
            </p>
            <p>
              <strong>Provincia:</strong> {preingreso.provincia}
            </p>
            <p>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {preingreso.fechaNacimiento
                ? formatDateTime(preingreso.fechaNacimiento)
                : "N/A"}
            </p>
            <p>
              <strong>Edad al Ingreso:</strong> {preingreso.edad_ing}
            </p>
            <p>
              <strong>Tipo de Documento:</strong> {preingreso.tipoDoc}
            </p>
            <p>
              <strong>Número de DNI:</strong> {preingreso.numeroDni}
            </p>
            <p>
              <strong>Delitos:</strong>{" "}
              {JSON.stringify(preingreso.electrodomesticos)}
            </p>
            <p>
              <strong>Detalles de Delitos:</strong>{" "}
              {preingreso.electrodomesticosDetalles}
            </p>
            <p>
              <strong>Domicilios:</strong> {preingreso.domicilios}
            </p>
            <p>
              <strong>Ubicación en el Mapa:</strong>{" "}
              {formatUbicacionMap(preingreso.ubicacionMap)}
            </p>
            <p>
              <strong>Organización Criminal:</strong> {preingreso.orgCrim}
            </p>
            <p>
              <strong>Cuál Organización:</strong> {preingreso.cualorg}
            </p>
            <p>
              <strong>Procedencia:</strong> {preingreso.procedencia}
            </p>
            <p>
              <strong>Establecimiento:</strong> {preingreso.establecimiento}
            </p>
            <p>
              <strong>Delitos:</strong> {preingreso.delitos}
            </p>
            <p>
              <strong>Detalle Adicional:</strong> {preingreso.detalle_adicional}
            </p>
            <p>
              <strong>Juzgados:</strong> {preingreso.juzgados}
            </p>
            <p>
              <strong>Organización Judicial:</strong> {preingreso.org_judicial}
            </p>
            <p>
              <strong>Número de Causa:</strong> {preingreso.numeroCausa}
            </p>
            <p>
              <strong>Reingreso:</strong> {preingreso.reingreso}
            </p>
            <p>
              <strong>Registro SUV:</strong> {preingreso.reg_suv}
            </p>
            <p>
              <strong>Registro CIR:</strong> {preingreso.reg_cir}
            </p>
            <p>
              <strong>Título de Información Pública:</strong>{" "}
              {preingreso.titInfoPublic}
            </p>
            <p>
              <strong>Resumen:</strong> {preingreso.resumen}
            </p>
            <p>
              <strong>Link:</strong> {preingreso.link}
            </p>
            <p>
              <strong>CIR Det:</strong> {preingreso.cirDet}
            </p>
            <p>
              <strong>Observación:</strong> {preingreso.observacion}
            </p>
            <p>
              <strong>Email:</strong> {preingreso.email}
            </p>
            <p>
              <strong>Creado el:</strong> {formatDateTime(preingreso.createdAt)}
            </p>
            <p>
              <strong>Actualizado el:</strong>{" "}
              {formatDateTime(preingreso.updatedAt)}
            </p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName={fileName}
          />

          <div className="mt-6 space-y-4">
            {preingreso.pdf1 && (
              <PdfRenderer
                pdfKey="pdf1"
                pdfLabel="PDF1"
                pdfUrl={pdfUrl("pdf1")}
              />
            )}
            {preingreso.pdf2 && (
              <PdfRenderer
                pdfKey="pdf2"
                pdfLabel="PDF2"
                pdfUrl={pdfUrl("pdf2")}
              />
            )}
            {preingreso.pdf3 && (
              <PdfRenderer
                pdfKey="pdf3"
                pdfLabel="PDF3"
                pdfUrl={pdfUrl("pdf3")}
              />
            )}
            {preingreso.pdf4 && (
              <PdfRenderer
                pdfKey="pdf4"
                pdfLabel="PDF4"
                pdfUrl={pdfUrl("pdf4")}
              />
            )}
            {preingreso.pdf5 && (
              <PdfRenderer
                pdfKey="pdf5"
                pdfLabel="PDF5"
                pdfUrl={pdfUrl("pdf5")}
              />
            )}
            {preingreso.pdf6 && (
              <PdfRenderer
                pdfKey="pdf6"
                pdfLabel="PDF6"
                pdfUrl={pdfUrl("pdf6")}
              />
            )}
            {preingreso.pdf7 && (
              <PdfRenderer
                pdfKey="pdf7"
                pdfLabel="PDF7"
                pdfUrl={pdfUrl("pdf7")}
              />
            )}
            {preingreso.pdf8 && (
              <PdfRenderer
                pdfKey="pdf8"
                pdfLabel="PDF8"
                pdfUrl={pdfUrl("pdf8")}
              />
            )}
            {preingreso.pdf9 && (
              <PdfRenderer
                pdfKey="pdf9"
                pdfLabel="PDF9"
                pdfUrl={pdfUrl("pdf9")}
              />
            )}
            {preingreso.pdf10 && (
              <PdfRenderer
                pdfKey="pdf10"
                pdfLabel="PDF10"
                pdfUrl={pdfUrl("pdf10")}
              />
            )}

            {preingreso.imagen && (
              <ImageRenderer
                imageKey="imagen"
                imageLabel="Imagen"
                imageUrl={imageUrl("imagen")}
              />
            )}
            {preingreso.imagenDer && (
              <ImageRenderer
                imageKey="imagenDer"
                imageLabel="Imagen Der"
                imageUrl={imageUrl("imagenDer")}
              />
            )}
            {preingreso.imagenIz && (
              <ImageRenderer
                imageKey="imagenIz"
                imageLabel="Imagen Iz"
                imageUrl={imageUrl("imagenIz")}
              />
            )}
            {preingreso.imagenDact && (
              <ImageRenderer
                imageKey="imagenDact"
                imageLabel="Imagen Dact"
                imageUrl={imageUrl("imagenDact")}
              />
            )}
            {preingreso.imagenSen1 && (
              <ImageRenderer
                imageKey="imagenSen1"
                imageLabel="Imagen Sen1"
                imageUrl={imageUrl("imagenSen1")}
              />
            )}
            {preingreso.imagenSen2 && (
              <ImageRenderer
                imageKey="imagenSen2"
                imageLabel="Imagen Sen2"
                imageUrl={imageUrl("imagenSen2")}
              />
            )}
            {preingreso.imagenSen3 && (
              <ImageRenderer
                imageKey="imagenSen3"
                imageLabel="Imagen Sen3"
                imageUrl={imageUrl("imagenSen3")}
              />
            )}
            {preingreso.imagenSen4 && (
              <ImageRenderer
                imageKey="imagenSen4"
                imageLabel="Imagen Sen4"
                imageUrl={imageUrl("imagenSen4")}
              />
            )}
            {preingreso.imagenSen5 && (
              <ImageRenderer
                imageKey="imagenSen5"
                imageLabel="Imagen Sen5"
                imageUrl={imageUrl("imagenSen5")}
              />
            )}
            {preingreso.imagenSen6 && (
              <ImageRenderer
                imageKey="imagenSen6"
                imageLabel="Imagen Sen6"
                imageUrl={imageUrl("imagenSen6")}
              />
            )}

            {preingreso.word1 && (
              <WordRenderer
                wordKey="word1"
                wordLabel="Word1"
                wordUrl={wordUrl("word1")}
              />
            )}
          </div>

          <div className="flex justify-end">
            {(user?.email === preingreso.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemovePreingreso(id)}
              >
                Eliminar
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreingresoDetailPage;
