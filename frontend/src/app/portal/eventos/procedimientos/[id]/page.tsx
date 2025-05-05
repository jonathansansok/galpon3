"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProcedimiento, deleteProcedimiento } from "../Procedimientos.api";
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

const ProcedimientoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [procedimiento, setProcedimiento] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchProcedimiento = async () => {
      const data = await getProcedimiento(id);
      setProcedimiento(data);
    };

    fetchProcedimiento();
  }, [id]);

  const handleRemoveProcedimiento = async (id: string) => {
    if (user?.email !== procedimiento?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este procedimiento.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este procedimiento?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteProcedimiento(id);
      router.push("/portal/eventos/procedimientos");
    }
  };

  if (!procedimiento) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(procedimiento.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(procedimiento.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(procedimiento.fechaHora)}
    Establecimiento: ${procedimiento.establecimiento}
    Módulo - U.R.: ${procedimiento.modulo_ur}
    Pabellón: ${procedimiento.pabellon}
    Sector: ${procedimiento.sector}
    Expediente: ${procedimiento.expediente}
    Tipo de Procedimiento: ${procedimiento.tipo_procedimiento}
    Por Orden de: ${procedimiento.por_orden_de}
    Medidas: ${procedimiento.medidas}
    Intervención de Requisa: ${procedimiento.interv_requisa ? "Sí" : "No"}
    Observación: ${procedimiento.observacion}
    Email: ${procedimiento.email}
    Creado el: ${formatDateTime(procedimiento.createdAt)}
    Actualizado el: ${formatDateTime(procedimiento.updatedAt)}
  `;

  const title = "Detalle del Procedimiento";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/procedimientos">
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
                  __html: formatInternosInvolucrados(procedimiento.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(procedimiento.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(procedimiento.fechaHora)}</p>
            <p><strong>Establecimiento:</strong> {procedimiento.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {procedimiento.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {procedimiento.pabellon}</p>
            <p><strong>Sector:</strong> {procedimiento.sector}</p>
            <p><strong>Expediente:</strong> {procedimiento.expediente}</p>
            <p><strong>Tipo de Procedimiento:</strong> {procedimiento.tipo_procedimiento}</p>
            <p><strong>Por Orden de:</strong> {procedimiento.por_orden_de}</p>
            <p><strong>Medidas:</strong> {procedimiento.medidas}</p>
            <p><strong>Intervención de Requisa:</strong> {procedimiento.interv_requisa ? "Sí" : "No"}</p>
            <p><strong>Observación:</strong> {procedimiento.observacion}</p>
            <p><strong>Email:</strong> {procedimiento.email}</p>
            <p><strong>Creado el:</strong> {formatDateTime(procedimiento.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(procedimiento.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Procedimiento`} />

          <div className="mt-6 space-y-4">
            {procedimiento.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {procedimiento.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {procedimiento.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {procedimiento.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {procedimiento.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {procedimiento.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {procedimiento.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {procedimiento.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {procedimiento.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {procedimiento.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {procedimiento.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {procedimiento.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl("imagenDer")} />}
            {procedimiento.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl("imagenIz")} />}
            {procedimiento.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl("imagenDact")} />}
            {procedimiento.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl("imagenSen1")} />}
            {procedimiento.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl("imagenSen2")} />}
            {procedimiento.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl("imagenSen3")} />}
            {procedimiento.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl("imagenSen4")} />}
            {procedimiento.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl("imagenSen5")} />}
            {procedimiento.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl("imagenSen6")} />}

            {procedimiento.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === procedimiento.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveProcedimiento(id)}
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

export default ProcedimientoDetailPage;