"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrevencion, deletePrevencion } from "../Prevenciones.api";
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

const PrevencionDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [prevencion, setPrevencion] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchPrevencion = async () => {
      const data = await getPrevencion(id);
      setPrevencion(data);
    };

    fetchPrevencion();
  }, [id]);

  const handleRemovePrevencion = async (id: string) => {
    if (user?.email !== prevencion?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar esta prevención.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta prevención?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deletePrevencion(id);
      router.push("/portal/eventos/prevenciones");
    }
  };

  if (!prevencion) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(prevencion.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(prevencion.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(prevencion.fechaHora)}
    Reyerta: ${prevencion.reyerta ? "Sí" : "No"}
    Intervención de Requisa: ${prevencion.interv_requisa ? "Sí" : "No"}
    Foco Ígneo: ${prevencion.foco_igneo ? "Sí" : "No"}
    Observación: ${prevencion.observacion}
    Expediente: ${prevencion.expediente}
    Email: ${prevencion.email}
    Establecimiento: ${prevencion.establecimiento}
    Módulo - U.R.: ${prevencion.modulo_ur}
    Pabellón: ${prevencion.pabellon}
    Sector: ${prevencion.sector}
    Juzgados: ${prevencion.juzgados}
    Creado el: ${formatDateTime(prevencion.createdAt)}
    Actualizado el: ${formatDateTime(prevencion.updatedAt)}
  `;

  const title = "Detalle de la Prevención";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/prevenciones">
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
                  __html: formatInternosInvolucrados(prevencion.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(prevencion.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(prevencion.fechaHora)}</p>
            <p><strong>Reyerta:</strong> {prevencion.reyerta ? "Sí" : "No"}</p>
            <p><strong>Intervención de Requisa:</strong> {prevencion.interv_requisa ? "Sí" : "No"}</p>
            <p><strong>Foco Ígneo:</strong> {prevencion.foco_igneo ? "Sí" : "No"}</p>
            <p><strong>Observación:</strong> {prevencion.observacion}</p>
            <p><strong>Expediente:</strong> {prevencion.expediente}</p>
            <p><strong>Email:</strong> {prevencion.email}</p>
            <p><strong>Establecimiento:</strong> {prevencion.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {prevencion.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {prevencion.pabellon}</p>
            <p><strong>Sector:</strong> {prevencion.sector}</p>
            <p><strong>Juzgados:</strong> {prevencion.juzgados}</p>
            <p><strong>Creado el:</strong> {formatDateTime(prevencion.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(prevencion.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Prevencion`} />

          <div className="mt-6 space-y-4">
            {prevencion.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {prevencion.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {prevencion.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {prevencion.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {prevencion.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {prevencion.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {prevencion.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {prevencion.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {prevencion.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {prevencion.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {prevencion.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {prevencion.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl("imagenDer")} />}
            {prevencion.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl("imagenIz")} />}
            {prevencion.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl("imagenDact")} />}
            {prevencion.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl("imagenSen1")} />}
            {prevencion.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl("imagenSen2")} />}
            {prevencion.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl("imagenSen3")} />}
            {prevencion.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl("imagenSen4")} />}
            {prevencion.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl("imagenSen5")} />}
            {prevencion.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl("imagenSen6")} />}

            {prevencion.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === prevencion.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemovePrevencion(id)}
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

export default PrevencionDetailPage;