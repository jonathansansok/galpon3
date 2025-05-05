"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReqpositivo, deleteReqpositivo } from "../Reqpositivos.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime, formatData, cleanText } from "@/app/utils/formatData";
import { useUserStore } from "@/lib/store";
import Swal from "sweetalert2";
import { formatUbicacionMap } from "@/app/utils/formatters";
interface Props {
  params: {
    id: string;
  };
}

const ProductDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [reqpositivo, setReqpositivo] = useState<any>(null);
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
    const fetchReqpositivo = async () => {
      const data = await getReqpositivo(id);
      setReqpositivo(data);
    };

    fetchReqpositivo();
  }, [id]);

  const handleRemoveReqpositivo = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este reqpositivo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      await deleteReqpositivo(id);
      router.push("/portal/eventos/reqpositivos");
    }
  };

  if (!reqpositivo) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqpositivos/uploads/${reqpositivo[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqpositivos/uploads/${reqpositivo[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqpositivos/uploads/${reqpositivo[wordKey]}`;

  const cardContent = `
    Fecha y Hora: ${formatDateTime(reqpositivo.fechaHora)}
    Establecimiento: ${reqpositivo.establecimiento}
    Fecha de Nacimiento: ${formatDateTime(reqpositivo.fechaNacimiento)}
    Fecha de Egreso: ${formatDateTime(reqpositivo.fechaEgreso)}
    Edad: ${reqpositivo.edad_ing}
    Fecha y Hora de Ingreso: ${formatDateTime(reqpositivo.fechaHoraIng)}
    Alias: ${reqpositivo.alias}
    Tipo de Documento: ${reqpositivo.tipoDoc}
    Número de Documento: ${reqpositivo.numeroDni}
    Nacionalidad: ${reqpositivo.nacionalidad}
    Domicilios: ${reqpositivo.domicilios}
    Ubicación en el Mapa: ${formatUbicacionMap(reqpositivo.ubicacionMap)}
    Sexo: ${reqpositivo.sexo}
    Registra Antecedentes PF: ${reqpositivo.registraantecedentespf}
    LPU: ${reqpositivo.lpu}
    Motivo de Egreso: ${reqpositivo.motivoEgreso}
    Número de Causa: ${reqpositivo.numeroCausa}
    Prensa: ${reqpositivo.prensa}
    Observación: ${reqpositivo.observacion}
    Juzgados: ${reqpositivo.juzgados}
    Electrodomésticos: ${reqpositivo.electrodomesticos}
    Detalles de delitos: ${reqpositivo.electrodomesticosDetalles}
    Situación Procesal: ${reqpositivo.sitProc}
    Email: ${reqpositivo.email}
    Apellido: ${reqpositivo.apellido}
    Nombres: ${reqpositivo.nombres}
    Creado el: ${formatDateTime(reqpositivo.createdAt)}
    Actualizado el: ${formatDateTime(reqpositivo.updatedAt)}
  `;

  const fileName =
    `${reqpositivo.establecimiento}_${reqpositivo.fechaHora}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
  const title = "Detalle de Req. positivo";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link
              className={buttonVariants()}
              href="/portal/eventos/reqpositivos"
            >
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p>
              <strong>Fecha y Hora:</strong>{" "}
              {formatDateTime(reqpositivo.fechaHora)}
            </p>
            <p>
              <strong>Establecimiento:</strong> {reqpositivo.establecimiento}
            </p>
            <p>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {formatDateTime(reqpositivo.fechaNacimiento)}
            </p>
            <p>
              <strong>Fecha de Egreso:</strong>{" "}
              {formatDateTime(reqpositivo.fechaEgreso)}
            </p>
            <p>
              <strong>Edad:</strong> {reqpositivo.edad_ing}
            </p>
            <p>
              <strong>Fecha y Hora de Ingreso:</strong>{" "}
              {formatDateTime(reqpositivo.fechaHoraIng)}
            </p>
            <p>
              <strong>Alias:</strong> {reqpositivo.alias}
            </p>
            <p>
              <strong>Tipo de Documento:</strong> {reqpositivo.tipoDoc}
            </p>
            <p>
              <strong>Número de Documento:</strong> {reqpositivo.numeroDni}
            </p>
            <p>
              <strong>Nacionalidad:</strong> {reqpositivo.nacionalidad}
            </p>
            <p>
              <strong>Domicilios:</strong> {reqpositivo.domicilios}
            </p>
            <p>
              <strong>Ubicación en el Mapa:</strong>{" "}
              {formatUbicacionMap(reqpositivo.ubicacionMap)}
            </p>
            <p>
              <strong>Sexo:</strong> {reqpositivo.sexo}
            </p>
            <p>
              <strong>Registra Antecedentes PF:</strong>{" "}
              {reqpositivo.registraantecedentespf}
            </p>
            <p>
              <strong>LPU:</strong> {reqpositivo.lpu}
            </p>
            <p>
              <strong>Motivo de Egreso:</strong> {reqpositivo.motivoEgreso}
            </p>
            <p>
              <strong>Número de Causa:</strong> {reqpositivo.numeroCausa}
            </p>
            <p>
              <strong>Prensa:</strong> {reqpositivo.prensa}
            </p>
            <p>
              <strong>Observación:</strong> {reqpositivo.observacion}
            </p>
            <p>
              <strong>Juzgados:</strong> {reqpositivo.juzgados}
            </p>
            <p>
              <strong>Delitos:</strong> {reqpositivo.electrodomesticos}
            </p>
            <p>
              <strong>Detalles de Delitos:</strong>{" "}
              {reqpositivo.electrodomesticosDetalles}
            </p>
            <p>
              <strong>Situación Procesal:</strong> {reqpositivo.sitProc}
            </p>
            <p>
              <strong>Email:</strong> {reqpositivo.email}
            </p>
            <p>
              <strong>Apellido:</strong> {reqpositivo.apellido}
            </p>
            <p>
              <strong>Nombres:</strong> {reqpositivo.nombres}
            </p>
            <p>
              <strong>Creado el:</strong>{" "}
              {formatDateTime(reqpositivo.createdAt)}
            </p>
            <p>
              <strong>Actualizado el:</strong>{" "}
              {formatDateTime(reqpositivo.updatedAt)}
            </p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName={fileName}
          />

          <div className="mt-6 space-y-4">
            {reqpositivo.pdf1 && (
              <PdfRenderer
                pdfKey="pdf1"
                pdfLabel="PDF1"
                pdfUrl={pdfUrl("pdf1")}
              />
            )}
            {reqpositivo.pdf2 && (
              <PdfRenderer
                pdfKey="pdf2"
                pdfLabel="PDF2"
                pdfUrl={pdfUrl("pdf2")}
              />
            )}
            {reqpositivo.pdf3 && (
              <PdfRenderer
                pdfKey="pdf3"
                pdfLabel="PDF3"
                pdfUrl={pdfUrl("pdf3")}
              />
            )}
            {reqpositivo.pdf4 && (
              <PdfRenderer
                pdfKey="pdf4"
                pdfLabel="PDF4"
                pdfUrl={pdfUrl("pdf4")}
              />
            )}
            {reqpositivo.pdf5 && (
              <PdfRenderer
                pdfKey="pdf5"
                pdfLabel="PDF5"
                pdfUrl={pdfUrl("pdf5")}
              />
            )}
            {reqpositivo.pdf6 && (
              <PdfRenderer
                pdfKey="pdf6"
                pdfLabel="PDF6"
                pdfUrl={pdfUrl("pdf6")}
              />
            )}
            {reqpositivo.pdf7 && (
              <PdfRenderer
                pdfKey="pdf7"
                pdfLabel="PDF7"
                pdfUrl={pdfUrl("pdf7")}
              />
            )}
            {reqpositivo.pdf8 && (
              <PdfRenderer
                pdfKey="pdf8"
                pdfLabel="PDF8"
                pdfUrl={pdfUrl("pdf8")}
              />
            )}
            {reqpositivo.pdf9 && (
              <PdfRenderer
                pdfKey="pdf9"
                pdfLabel="PDF9"
                pdfUrl={pdfUrl("pdf9")}
              />
            )}
            {reqpositivo.pdf10 && (
              <PdfRenderer
                pdfKey="pdf10"
                pdfLabel="PDF10"
                pdfUrl={pdfUrl("pdf10")}
              />
            )}

            {reqpositivo.imagen && (
              <ImageRenderer
                imageKey="imagen"
                imageLabel="Imagen"
                imageUrl={imageUrl("imagen")}
              />
            )}
            {reqpositivo.imagenDer && (
              <ImageRenderer
                imageKey="imagenDer"
                imageLabel="Imagen Der"
                imageUrl={imageUrl("imagenDer")}
              />
            )}
            {reqpositivo.imagenIz && (
              <ImageRenderer
                imageKey="imagenIz"
                imageLabel="Imagen Iz"
                imageUrl={imageUrl("imagenIz")}
              />
            )}
            {reqpositivo.imagenDact && (
              <ImageRenderer
                imageKey="imagenDact"
                imageLabel="Imagen Dact"
                imageUrl={imageUrl("imagenDact")}
              />
            )}
            {reqpositivo.imagenSen1 && (
              <ImageRenderer
                imageKey="imagenSen1"
                imageLabel="Imagen Sen1"
                imageUrl={imageUrl("imagenSen1")}
              />
            )}
            {reqpositivo.imagenSen2 && (
              <ImageRenderer
                imageKey="imagenSen2"
                imageLabel="Imagen Sen2"
                imageUrl={imageUrl("imagenSen2")}
              />
            )}
            {reqpositivo.imagenSen3 && (
              <ImageRenderer
                imageKey="imagenSen3"
                imageLabel="Imagen Sen3"
                imageUrl={imageUrl("imagenSen3")}
              />
            )}
            {reqpositivo.imagenSen4 && (
              <ImageRenderer
                imageKey="imagenSen4"
                imageLabel="Imagen Sen4"
                imageUrl={imageUrl("imagenSen4")}
              />
            )}
            {reqpositivo.imagenSen5 && (
              <ImageRenderer
                imageKey="imagenSen5"
                imageLabel="Imagen Sen5"
                imageUrl={imageUrl("imagenSen5")}
              />
            )}
            {reqpositivo.imagenSen6 && (
              <ImageRenderer
                imageKey="imagenSen6"
                imageLabel="Imagen Sen6"
                imageUrl={imageUrl("imagenSen6")}
              />
            )}

            {reqpositivo.word1 && (
              <WordRenderer
                wordKey="word1"
                wordLabel="Word1"
                wordUrl={wordUrl("word1")}
              />
            )}
          </div>

          <button
            className="mt-5 bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => handleRemoveReqpositivo(id)}
          >
            Eliminar
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
