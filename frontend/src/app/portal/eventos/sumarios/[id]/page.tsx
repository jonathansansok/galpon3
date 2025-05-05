"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSumario, deleteSumario } from "../Sumarios.api";
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

const SumarioDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [sumario, setSumario] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchSumario = async () => {
      const data = await getSumario(id);
      setSumario(data);
    };

    fetchSumario();
  }, [id]);

  const handleRemoveSumario = async (id: string) => {
    if (user?.email !== sumario?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este sumario.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este sumario?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteSumario(id);
      router.push("/portal/eventos/sumarios");
    }
  };

  if (!sumario) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/${sumario[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(sumario.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(sumario.personalinvolucrado)}
    Evento: ${sumario.evento}
    Fecha y Hora: ${formatDateTime(sumario.fechaHora)}
    Establecimiento: ${sumario.establecimiento}
    Módulo - U.R.: ${sumario.modulo_ur}
    Expediente: ${sumario.expediente}
    Observación: ${sumario.observacion}
    Email: ${sumario.email}
    Creado el: ${formatDateTime(sumario.createdAt)}
    Actualizado el: ${formatDateTime(sumario.updatedAt)}
  `;

  const title = "Detalle del Sumario";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/sumarios">
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
                  __html: formatInternosInvolucrados(sumario.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(sumario.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Evento:</strong> {sumario.evento}</p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(sumario.fechaHora)}</p>
            <p><strong>Establecimiento:</strong> {sumario.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {sumario.modulo_ur}</p>
            <p><strong>Expediente:</strong> {sumario.expediente}</p>
            <p><strong>Observación:</strong> {sumario.observacion}</p>
            <p><strong>Email:</strong> {sumario.email}</p>
            <p><strong>Creado el:</strong> {formatDateTime(sumario.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(sumario.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Sumario`} />

          <div className="mt-6 space-y-4">
            {sumario.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {sumario.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {sumario.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {sumario.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {sumario.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {sumario.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {sumario.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {sumario.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {sumario.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {sumario.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {sumario.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {sumario.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl("imagenDer")} />}
            {sumario.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl("imagenIz")} />}
            {sumario.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl("imagenDact")} />}
            {sumario.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl("imagenSen1")} />}
            {sumario.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl("imagenSen2")} />}
            {sumario.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl("imagenSen3")} />}
            {sumario.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl("imagenSen4")} />}
            {sumario.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl("imagenSen5")} />}
            {sumario.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl("imagenSen6")} />}

            {sumario.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === sumario.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveSumario(id)}
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

export default SumarioDetailPage;