"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getElemento, deleteElemento } from "../elementos.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime } from "@/app/utils/formatData";
import {
  formatInternosInvolucrados,
  formatPersonalInvolucrado,
} from "@/app/utils/formatUtils";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface Props {
  params: {
    id: string;
  };
}

const ElementoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [elemento, setElemento] = useState<any>(null);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user); // Agrega esta línea
  const privilege = useUserStore((state) => state.privilege); // Agrega esta línea
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

    fetchUser();
  }, [setUser, router]);

  useEffect(() => {
    const fetchElemento = async () => {
      const data = await getElemento(id);
      setElemento(data);
    };

    fetchElemento();
  }, [id]);

  const handleRemoveElemento = async (id: string) => {
    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este elemento?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteElemento(id);
      router.push("/portal/eventos/elementos");
    }
  };

  const handleDownloadAll = async () => {
    if (!elemento) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (elemento[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento[pdfKey]}`;
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
      if (elemento[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (elemento.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `elemento_${id}.zip`);
  };

  if (!elemento) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(
      elemento.internosinvolucrado
    )}
    Personal Involucrado: ${formatPersonalInvolucrado(
      elemento.personalinvolucrado
    )}
    Fecha y Hora: ${formatDateTime(elemento.fechaHora)}
    Establecimiento: ${elemento.establecimiento}
    Módulo - U.R.: ${elemento.modulo_ur}
    Pabellón: ${elemento.pabellon}
    Observación: ${elemento.observacion}
    Medidas: ${elemento.medidas}
    Dentro de Pabellón: ${elemento.dentroDePabellon}
    Estupefacientes: ${elemento.estupefacientes}
    Armas: ${elemento.armas}
    Electrónicos: ${elemento.electronicos}
    Componentes: ${elemento.componentes}
    Creado el: ${formatDateTime(elemento.createdAt)}
    Actualizado el: ${formatDateTime(elemento.updatedAt)}
  `;

  const title = "Detalle de Elementos secuestrados";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/elementos">
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
                  __html: formatInternosInvolucrados(
                    elemento.internosinvolucrado
                  ),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(
                    elemento.personalinvolucrado
                  ),
                }}
              />
            </p>
            <p>
              <strong>Fecha y Hora:</strong>{" "}
              {formatDateTime(elemento.fechaHora)}
            </p>
            <p>
              <strong>Establecimiento:</strong> {elemento.establecimiento}
            </p>
            <p>
              <strong>Módulo - U.R.:</strong> {elemento.modulo_ur}
            </p>
            <p>
              <strong>Pabellón:</strong> {elemento.pabellon}
            </p>
            <p>
              <strong>Observación:</strong> {elemento.observacion}
            </p>
            <p>
              <strong>Medidas:</strong> {elemento.medidas}
            </p>
            <p>
              <strong>Dentro de Pabellón:</strong> {elemento.dentroDePabellon}
            </p>
            <p>
              <strong>Estupefacientes:</strong> {elemento.estupefacientes}
            </p>
            <p>
              <strong>Armas:</strong> {elemento.armas}
            </p>
            <p>
              <strong>Electrónicos:</strong> {elemento.electronicos}
            </p>
            <p>
              <strong>Componentes:</strong> {elemento.componentes}
            </p>
            <p>
              <strong>Creado el:</strong> {formatDateTime(elemento.createdAt)}
            </p>
            <p>
              <strong>Actualizado el:</strong>{" "}
              {formatDateTime(elemento.updatedAt)}
            </p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName={`Detalle_Elemento`}
          />

          <div className="mt-6 space-y-4">
            {elemento.pdf1 && (
              <PdfRenderer
                pdfKey="pdf1"
                pdfLabel="PDF1"
                pdfUrl={pdfUrl("pdf1")}
              />
            )}
            {elemento.pdf2 && (
              <PdfRenderer
                pdfKey="pdf2"
                pdfLabel="PDF2"
                pdfUrl={pdfUrl("pdf2")}
              />
            )}
            {elemento.pdf3 && (
              <PdfRenderer
                pdfKey="pdf3"
                pdfLabel="PDF3"
                pdfUrl={pdfUrl("pdf3")}
              />
            )}
            {elemento.pdf4 && (
              <PdfRenderer
                pdfKey="pdf4"
                pdfLabel="PDF4"
                pdfUrl={pdfUrl("pdf4")}
              />
            )}
            {elemento.pdf5 && (
              <PdfRenderer
                pdfKey="pdf5"
                pdfLabel="PDF5"
                pdfUrl={pdfUrl("pdf5")}
              />
            )}
            {elemento.pdf6 && (
              <PdfRenderer
                pdfKey="pdf6"
                pdfLabel="PDF6"
                pdfUrl={pdfUrl("pdf6")}
              />
            )}
            {elemento.pdf7 && (
              <PdfRenderer
                pdfKey="pdf7"
                pdfLabel="PDF7"
                pdfUrl={pdfUrl("pdf7")}
              />
            )}
            {elemento.pdf8 && (
              <PdfRenderer
                pdfKey="pdf8"
                pdfLabel="PDF8"
                pdfUrl={pdfUrl("pdf8")}
              />
            )}
            {elemento.pdf9 && (
              <PdfRenderer
                pdfKey="pdf9"
                pdfLabel="PDF9"
                pdfUrl={pdfUrl("pdf9")}
              />
            )}
            {elemento.pdf10 && (
              <PdfRenderer
                pdfKey="pdf10"
                pdfLabel="PDF10"
                pdfUrl={pdfUrl("pdf10")}
              />
            )}

            {elemento.imagen && (
              <ImageRenderer
                imageKey="imagen"
                imageLabel="Imagen 1"
                imageUrl={imageUrl("imagen")}
              />
            )}
            {elemento.imagenDer && (
              <ImageRenderer
                imageKey="imagenDer"
                imageLabel="Imagen 2"
                imageUrl={imageUrl("imagenDer")}
              />
            )}
            {elemento.imagenIz && (
              <ImageRenderer
                imageKey="imagenIz"
                imageLabel="Imagen 3"
                imageUrl={imageUrl("imagenIz")}
              />
            )}
            {elemento.imagenDact && (
              <ImageRenderer
                imageKey="imagenDact"
                imageLabel="Imagen 4"
                imageUrl={imageUrl("imagenDact")}
              />
            )}
            {elemento.imagenSen1 && (
              <ImageRenderer
                imageKey="imagenSen1"
                imageLabel="Imagen 5"
                imageUrl={imageUrl("imagenSen1")}
              />
            )}
            {elemento.imagenSen2 && (
              <ImageRenderer
                imageKey="imagenSen2"
                imageLabel="Imagen 6"
                imageUrl={imageUrl("imagenSen2")}
              />
            )}
            {elemento.imagenSen3 && (
              <ImageRenderer
                imageKey="imagenSen3"
                imageLabel="Imagen 7"
                imageUrl={imageUrl("imagenSen3")}
              />
            )}
            {elemento.imagenSen4 && (
              <ImageRenderer
                imageKey="imagenSen4"
                imageLabel="Imagen 8"
                imageUrl={imageUrl("imagenSen4")}
              />
            )}
            {elemento.imagenSen5 && (
              <ImageRenderer
                imageKey="imagenSen5"
                imageLabel="Imagen 9"
                imageUrl={imageUrl("imagenSen5")}
              />
            )}
            {elemento.imagenSen6 && (
              <ImageRenderer
                imageKey="imagenSen6"
                imageLabel="Imagen 10"
                imageUrl={imageUrl("imagenSen6")}
              />
            )}

            {elemento.word1 && (
              <WordRenderer
                wordKey="word1"
                wordLabel="Word1"
                wordUrl={wordUrl("word1")}
              />
            )}
          </div>

          <button
            className="mt-5 bg-green-800 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Descargar Todo
          </button>
          <div className="flex justify-end">
            {(user?.email === elemento.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveElemento(id)}
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

export default ElementoDetailPage;
