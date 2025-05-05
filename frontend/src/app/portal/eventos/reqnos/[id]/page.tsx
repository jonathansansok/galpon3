
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReqno, deleteReqno } from "../Reqnos.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime, formatData, cleanText } from "@/app/utils/formatData";
import Swal from "sweetalert2";
import { Alert } from "@/components/ui/alert";

interface Props {
  params: {
    id: string;
  };
}

const ReqnoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [reqno, setReqno] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReqno = async () => {
      try {
        const data = await getReqno(id);
        setReqno(data);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchReqno();
  }, [id]);

  const handleRemoveReqno = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este reqno?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      await deleteReqno(id);
      router.push("/portal/eventos/reqnos");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqnos/uploads/${reqno[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqnos/uploads/${reqno[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqnos/uploads/${reqno[wordKey]}`;

  const cardContent = `
    Creado el: ${formatDateTime(reqno.createdAt)}
    Actualizado el: ${formatDateTime(reqno.updatedAt)}
    Fecha y Hora: ${formatDateTime(reqno.fechaHora)}
    Email: ${reqno.email}
    Requerido por: ${reqno.requerido_por}
    Observación: ${reqno.observacion}
    Datos Filiatorios: ${reqno.datos_filiatorios}
    Internos Involucrados: ${reqno.internosinvolucrado}
  `;

  const fileName = `${reqno.establecimiento}_${reqno.fechaHora}`.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  );
  const title = "Detalle de Respuesta de requerimiento: Negativa";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/reqnos">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p>
              <strong>Fecha y Hora:</strong> {formatDateTime(reqno.fechaHora)}
            </p>
            <p>
              <strong className="text-lg">&quot;Internos involucrados:&quot;</strong>{" "}
              {reqno.internosinvolucrado}
            </p>
            <p>
              <strong>Requerido por:</strong> {reqno.requerido_por}
            </p>
            <p style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
              <strong>Datos Filiatorios:</strong> {reqno.datos_filiatorios}
            </p>
            <p>
              <strong>Observación:</strong> {reqno.observacion}
            </p>
            <p>
              <strong>Email:</strong> {reqno.email}
            </p>
            <p>
              <strong>Creado el:</strong> {formatDateTime(reqno.createdAt)}
            </p>
            <p>
              <strong>Actualizado el:</strong>{" "}
              {formatDateTime(reqno.updatedAt)}
            </p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName={fileName}
          />

          <div className="mt-6 space-y-4">
            {reqno.pdf1 && (
              <PdfRenderer
                pdfKey="pdf1"
                pdfLabel="PDF1"
                pdfUrl={pdfUrl("pdf1")}
              />
            )}
            {reqno.pdf2 && (
              <PdfRenderer
                pdfKey="pdf2"
                pdfLabel="PDF2"
                pdfUrl={pdfUrl("pdf2")}
              />
            )}
            {reqno.pdf3 && (
              <PdfRenderer
                pdfKey="pdf3"
                pdfLabel="PDF3"
                pdfUrl={pdfUrl("pdf3")}
              />
            )}
            {reqno.pdf4 && (
              <PdfRenderer
                pdfKey="pdf4"
                pdfLabel="PDF4"
                pdfUrl={pdfUrl("pdf4")}
              />
            )}
            {reqno.pdf5 && (
              <PdfRenderer
                pdfKey="pdf5"
                pdfLabel="PDF5"
                pdfUrl={pdfUrl("pdf5")}
              />
            )}
            {reqno.pdf6 && (
              <PdfRenderer
                pdfKey="pdf6"
                pdfLabel="PDF6"
                pdfUrl={pdfUrl("pdf6")}
              />
            )}
            {reqno.pdf7 && (
              <PdfRenderer
                pdfKey="pdf7"
                pdfLabel="PDF7"
                pdfUrl={pdfUrl("pdf7")}
              />
            )}
            {reqno.pdf8 && (
              <PdfRenderer
                pdfKey="pdf8"
                pdfLabel="PDF8"
                pdfUrl={pdfUrl("pdf8")}
              />
            )}
            {reqno.pdf9 && (
              <PdfRenderer
                pdfKey="pdf9"
                pdfLabel="PDF9"
                pdfUrl={pdfUrl("pdf9")}
              />
            )}
            {reqno.pdf10 && (
              <PdfRenderer
                pdfKey="pdf10"
                pdfLabel="PDF10"
                pdfUrl={pdfUrl("pdf10")}
              />
            )}

            {reqno.imagen && (
              <ImageRenderer
                imageKey="imagen"
                imageLabel="Imagen"
                imageUrl={imageUrl("imagen")}
              />
            )}
            {reqno.imagenDer && (
              <ImageRenderer
                imageKey="imagenDer"
                imageLabel="Imagen Der"
                imageUrl={imageUrl("imagenDer")}
              />
            )}
            {reqno.imagenIz && (
              <ImageRenderer
                imageKey="imagenIz"
                imageLabel="Imagen Iz"
                imageUrl={imageUrl("imagenIz")}
              />
            )}
            {reqno.imagenDact && (
              <ImageRenderer
                imageKey="imagenDact"
                imageLabel="Imagen Dact"
                imageUrl={imageUrl("imagenDact")}
              />
            )}
            {reqno.imagenSen1 && (
              <ImageRenderer
                imageKey="imagenSen1"
                imageLabel="Imagen Sen1"
                imageUrl={imageUrl("imagenSen1")}
              />
            )}
            {reqno.imagenSen2 && (
              <ImageRenderer
                imageKey="imagenSen2"
                imageLabel="Imagen Sen2"
                imageUrl={imageUrl("imagenSen2")}
              />
            )}
            {reqno.imagenSen3 && (
              <ImageRenderer
                imageKey="imagenSen3"
                imageLabel="Imagen Sen3"
                imageUrl={imageUrl("imagenSen3")}
              />
            )}
            {reqno.imagenSen4 && (
              <ImageRenderer
                imageKey="imagenSen4"
                imageLabel="Imagen Sen4"
                imageUrl={imageUrl("imagenSen4")}
              />
            )}
            {reqno.imagenSen5 && (
              <ImageRenderer
                imageKey="imagenSen5"
                imageLabel="Imagen Sen5"
                imageUrl={imageUrl("imagenSen5")}
              />
            )}
            {reqno.imagenSen6 && (
              <ImageRenderer
                imageKey="imagenSen6"
                imageLabel="Imagen Sen6"
                imageUrl={imageUrl("imagenSen6")}
              />
            )}

            {reqno.word1 && (
              <WordRenderer
                wordKey="word1"
                wordLabel="Word1"
                wordUrl={wordUrl("word1")}
              />
            )}
          </div>

          <button
            className="mt-5 bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => handleRemoveReqno(id)}
          >
            Eliminar
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReqnoDetailPage;