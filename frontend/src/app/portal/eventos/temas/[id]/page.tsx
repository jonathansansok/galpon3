//frontend\src\app\portal\eventos\temas\[id]\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTema, deleteTema } from "../Temas.api";
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

const TemaDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [tema, setTema] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchTema = async () => {
      const data = await getTema(id);
      setTema(data);
    };

    fetchTema();
  }, [id]);

  const handleRemoveTema = async (id: string) => {
    if (user?.email !== tema?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este tema.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este tema?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteTema(id);
      router.push("/portal/eventos/temas");
    }
  };

  if (!tema) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(tema.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(tema.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(tema.fechaHora)}
    Establecimiento: ${tema.establecimiento}
    Módulo - U.R.: ${tema.modulo_ur}
    Pabellón: ${tema.pabellon}
    Observación: ${tema.observacion}
    Email: ${tema.email}
    Creado el: ${formatDateTime(tema.createdAt)}
    Actualizado el: ${formatDateTime(tema.updatedAt)}
  `;

  const title = "Detalle del Tema informativo";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/temas">
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
                  __html: formatInternosInvolucrados(tema.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(tema.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(tema.fechaHora)}</p>
            <p><strong>Establecimiento:</strong> {tema.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {tema.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {tema.pabellon}</p>
            <p><strong>Observación:</strong> {tema.observacion}</p>
            <p><strong>Email:</strong> {tema.email}</p>
            <p><strong>Creado el:</strong> {formatDateTime(tema.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(tema.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Tema`} />

          <div className="mt-6 space-y-4">
            {tema.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {tema.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {tema.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {tema.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {tema.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {tema.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {tema.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {tema.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {tema.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {tema.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {tema.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {tema.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl("imagenDer")} />}
            {tema.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl("imagenIz")} />}
            {tema.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl("imagenDact")} />}
            {tema.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl("imagenSen1")} />}
            {tema.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl("imagenSen2")} />}
            {tema.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl("imagenSen3")} />}
            {tema.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl("imagenSen4")} />}
            {tema.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl("imagenSen5")} />}
            {tema.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl("imagenSen6")} />}

            {tema.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === tema.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveTema(id)}
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

export default TemaDetailPage;