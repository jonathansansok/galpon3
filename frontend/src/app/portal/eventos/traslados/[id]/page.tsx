"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTraslado, deleteTraslado } from "../Traslados.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime } from "@/app/utils/formatData";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";

interface Props {
  params: {
    id: string;
  };
}

const TrasladoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [traslado, setTraslado] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchTraslado = async () => {
      const data = await getTraslado(id);
      setTraslado(data);
    };

    fetchTraslado();
  }, [id]);

  const handleRemoveTraslado = async (id: string) => {
    if (user?.email !== traslado?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este traslado.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este traslado?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteTraslado(id);
      router.push("/portal/eventos/traslados");
    }
  };

  if (!traslado) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(traslado.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(traslado.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(traslado.fechaHora)}
    Establecimiento: ${traslado.establecimiento}
    Módulo - U.R.: ${traslado.modulo_ur}
    Pabellón: ${traslado.pabellon}
    Observación: ${traslado.observacion}
    Email: ${traslado.email}
    Creado el: ${formatDateTime(traslado.createdAt)}
    Actualizado el: ${formatDateTime(traslado.updatedAt)}
  `;

  const title = "Detalle del Traslado";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/traslados">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p>
              <strong className="text-lg">&quot;Internos involucrados:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatInternosInvolucrados(traslado.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(traslado.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(traslado.fechaHora)}</p>
            <p><strong>Establecimiento:</strong> {traslado.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {traslado.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {traslado.pabellon}</p>
            <p><strong>Observación:</strong> {traslado.observacion}</p>
            <p><strong>Email:</strong> {traslado.email}</p>
            <p><strong>Creado el:</strong> {formatDateTime(traslado.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(traslado.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Traslado`} />

          <div className="mt-6 space-y-4">
            {traslado.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {traslado.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {traslado.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {traslado.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {traslado.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {traslado.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {traslado.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {traslado.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {traslado.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {traslado.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {traslado.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {traslado.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl("imagenDer")} />}
            {traslado.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl("imagenIz")} />}
            {traslado.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl("imagenDact")} />}
            {traslado.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl("imagenSen1")} />}
            {traslado.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl("imagenSen2")} />}
            {traslado.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl("imagenSen3")} />}
            {traslado.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl("imagenSen4")} />}
            {traslado.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl("imagenSen5")} />}
            {traslado.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl("imagenSen6")} />}

            {traslado.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === traslado.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveTraslado(id)}
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

export default TrasladoDetailPage;