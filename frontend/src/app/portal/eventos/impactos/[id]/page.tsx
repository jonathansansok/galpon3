"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImpacto, deleteImpacto } from "../impacto.api";
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

const ImpactoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [impacto, setImpacto] = useState<any>(null);
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

  useEffect(() => {
    const fetchImpacto = async () => {
      const data = await getImpacto(id);
      setImpacto(data);
    };

    fetchImpacto();
  }, [id]);

  const handleRemoveImpacto = async (id: string) => {
    if (user?.email !== impacto?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este impacto.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este impacto?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteImpacto(id);
      router.push("/portal/eventos/impactos");
    }
  };

  const handleDownloadAll = async () => {
    if (!impacto) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (impacto[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto[pdfKey]}`;
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
      if (impacto[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (impacto.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `impacto_${id}.zip`);
  };

  if (!impacto) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/${impacto[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(impacto.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(impacto.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(impacto.fechaHora)}
    Módulo - U.R.: ${impacto.modulo_ur}
    Pabellón: ${impacto.pabellon}
    Acontecimiento: ${impacto.acontecimiento}
    Observación: ${impacto.observacion}
    Foco Ígneo: ${impacto.foco_igneo ? "Sí" : "No"}
    Reyerta: ${impacto.reyerta ? "Sí" : "No"}
    Intervención de Requisa: ${impacto.interv_requisa ? "Sí" : "No"}
    Expediente: ${impacto.expediente}
    Establecimiento: ${impacto.establecimiento}
    Email: ${impacto.email}
    Creado el: ${formatDateTime(impacto.createdAt)}
    Actualizado el: ${formatDateTime(impacto.updatedAt)}
  `;

  const title = "Detalle del Impacto";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/impactos">
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
                  __html: formatInternosInvolucrados(impacto.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(impacto.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(impacto.fechaHora)}</p>
            <p><strong>Módulo - U.R.:</strong> {impacto.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {impacto.pabellon}</p>
            <p><strong>Acontecimiento:</strong> {impacto.acontecimiento}</p>
            <p><strong>Observación:</strong> {impacto.observacion}</p>
            <p><strong>Foco Ígneo:</strong> {impacto.foco_igneo ? "Sí" : "No"}</p>
            <p><strong>Reyerta:</strong> {impacto.reyerta ? "Sí" : "No"}</p>
            <p><strong>Intervención de Requisa:</strong> {impacto.interv_requisa ? "Sí" : "No"}</p>
            <p><strong>Expediente:</strong> {impacto.expediente}</p>
            <p><strong>Establecimiento:</strong> {impacto.establecimiento}</p>
            <p><strong>Email:</strong> {impacto.email}</p>
            <p><strong>Creado el:</strong> {formatDateTime(impacto.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(impacto.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Impacto`} />

          <div className="mt-6 space-y-4">
            {impacto.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {impacto.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {impacto.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {impacto.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {impacto.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {impacto.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {impacto.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {impacto.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {impacto.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {impacto.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {impacto.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen 1" imageUrl={imageUrl("imagen")} />}
            {impacto.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen 2" imageUrl={imageUrl("imagenDer")} />}
            {impacto.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen 3" imageUrl={imageUrl("imagenIz")} />}
            {impacto.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen 4" imageUrl={imageUrl("imagenDact")} />}
            {impacto.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen 5" imageUrl={imageUrl("imagenSen1")} />}
            {impacto.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen 6" imageUrl={imageUrl("imagenSen2")} />}
            {impacto.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen 7" imageUrl={imageUrl("imagenSen3")} />}
            {impacto.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen 8" imageUrl={imageUrl("imagenSen4")} />}
            {impacto.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen 9" imageUrl={imageUrl("imagenSen5")} />}
            {impacto.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen 10" imageUrl={imageUrl("imagenSen6")} />}

            {impacto.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>
          <button
            className="mt-5 bg-green-800 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Descargar Todo
          </button>
          <div className="flex justify-end">
            {(user?.email === impacto.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveImpacto(id)}
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

export default ImpactoDetailPage;