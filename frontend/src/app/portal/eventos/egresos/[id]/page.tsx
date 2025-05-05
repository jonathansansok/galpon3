"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEgreso, deleteEgreso } from "../Egresos.api";
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
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface Props {
  params: {
    id: string;
  };
}

const EgresoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [egreso, setEgreso] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchEgreso = async () => {
      const data = await getEgreso(id);
      setEgreso(data);
    };

    fetchEgreso();
  }, [id]);

  const handleRemoveEgreso = async (id: string) => {
    if (user?.email !== egreso?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este egreso.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este egreso?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteEgreso(id);
      router.push("/portal/eventos/egresos");
    }
  };

  const handleDownloadAll = async () => {
    if (!egreso) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (egreso[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso[pdfKey]}`;
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        zip.file(`${pdfKey}.pdf`, blob);
      }
    }

    // Agregar imágenes al archivo ZIP
    const imageKeys = [
      "imagen",
      "imagenDer",
      "imagenIz",
      "imagenDact",
      "imagenSen1",
      "imagenSen2",
      "imagenSen3",
      "imagenSen4",
      "imagenSen5",
      "imagenSen6",
    ];
    for (const key of imageKeys) {
      if (egreso[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (egreso.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `egreso_${id}.zip`);
  };

  if (!egreso) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(egreso.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(egreso.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(egreso.fechaHora)}
    Establecimiento: ${egreso.establecimiento}
    Módulo - U.R.: ${egreso.modulo_ur}
    Pabellón: ${egreso.pabellon}
    Jurisdicción: ${egreso.jurisdiccion}
    Juzgados: ${egreso.juzgados}
    Prevención: ${egreso.prevencioSiNo ? "Sí" : "No"}
    Fecha de Vencimiento: ${egreso.fechaVenc ? formatDateTime(egreso.fechaVenc) : "Fecha No"}
    Orden de Captura: ${egreso.ordenCapDip ? "Sí" : "No"}
    Otros Datos: ${egreso.otrosDatos}
    Creado el: ${formatDateTime(egreso.createdAt)}
    Actualizado el: ${formatDateTime(egreso.updatedAt)}
  `;

  const title = "Detalle de Egreso extramuro";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/egresos">
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
                  __html: formatInternosInvolucrados(egreso.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(egreso.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(egreso.fechaHora)}</p>
            <p><strong>Establecimiento:</strong> {egreso.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {egreso.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {egreso.pabellon}</p>
            <p><strong>Jurisdicción:</strong> {egreso.jurisdiccion}</p>
            <p><strong>Juzgados:</strong> {egreso.juzgados}</p>
            <p><strong>Prevención:</strong> {egreso.prevencioSiNo ? "Sí" : "No"}</p>
            <p><strong>Fecha de Vencimiento:</strong> {egreso.fechaVenc ? formatDateTime(egreso.fechaVenc) : "Fecha No"}</p>
            <p><strong>Orden de Captura:</strong> {egreso.ordenCapDip ? "Sí" : "No"}</p>
            <p><strong>Otros Datos:</strong> {egreso.otrosDatos}</p>
            <p><strong>Creado el:</strong> {formatDateTime(egreso.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(egreso.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Egreso`} />

          <div className="mt-6 space-y-4">
            {egreso.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {egreso.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {egreso.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {egreso.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {egreso.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {egreso.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {egreso.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {egreso.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {egreso.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {egreso.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {egreso.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen 1" imageUrl={imageUrl("imagen")} />}
            {egreso.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen 2" imageUrl={imageUrl("imagenDer")} />}
            {egreso.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen 3" imageUrl={imageUrl("imagenIz")} />}
            {egreso.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen 4" imageUrl={imageUrl("imagenDact")} />}
            {egreso.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen 5" imageUrl={imageUrl("imagenSen1")} />}
            {egreso.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen 6" imageUrl={imageUrl("imagenSen2")} />}
            {egreso.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen 7" imageUrl={imageUrl("imagenSen3")} />}
            {egreso.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen 8" imageUrl={imageUrl("imagenSen4")} />}
            {egreso.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen 9" imageUrl={imageUrl("imagenSen5")} />}
            {egreso.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen 10" imageUrl={imageUrl("imagenSen6")} />}

            {egreso.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <button
            className="mt-5 bg-green-800 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Descargar Todo
          </button>
          <div className="flex justify-end">
  {(user?.email === egreso.email || privilege === "A1") && (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded"
      onClick={() => handleRemoveEgreso(id)}
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

export default EgresoDetailPage;