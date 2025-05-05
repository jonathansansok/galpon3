"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExtramuro, deleteExtramuro } from "../Extramuros.api";
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

const ExtramuroDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [extramuro, setExtramuro] = useState<any>(null);
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
    const fetchExtramuro = async () => {
      const data = await getExtramuro(id);
      setExtramuro(data);
    };

    fetchExtramuro();
  }, [id]);

  const handleRemoveExtramuro = async (id: string) => {
    if (user?.email !== extramuro?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este extramuro.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este extramuro?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteExtramuro(id);
      router.push("/portal/eventos/extramuros");
    }
  };

  const handleDownloadAll = async () => {
    if (!extramuro) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (extramuro[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro[pdfKey]}`;
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
      if (extramuro[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (extramuro.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `extramuro_${id}.zip`);
  };

  if (!extramuro) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/${extramuro[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(extramuro.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(extramuro.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(extramuro.fechaHora)}
    Fecha y Hora Reintegro: ${extramuro.fechaHoraReintegro ? formatDateTime(extramuro.fechaHoraReintegro) : "N/A"}
    Internación: ${extramuro.internacion}
    Por Orden: ${extramuro.porOrden}
    Observación: ${extramuro.observacion}
    Establecimiento: ${extramuro.establecimiento}
    Sector Internación: ${extramuro.sector_internacion}
    Piso: ${extramuro.piso}
    Habitación: ${extramuro.habitacion}
    Cama: ${extramuro.cama}
    Motivo Reintegro: ${extramuro.motivo_reintegro}
    Módulo - U.R.: ${extramuro.modulo_ur}
    Pabellón: ${extramuro.pabellon}
    Hospital: ${extramuro.hospital}
    Motivo: ${extramuro.motivo}
    Email: ${extramuro.email}
    Expediente: ${extramuro.expediente}
    Creado el: ${formatDateTime(extramuro.created_at)}
    Actualizado el: ${formatDateTime(extramuro.updatedAt)}
  `;

  const title = "Detalle del Extramuro";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/extramuros">
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
                  __html: formatInternosInvolucrados(extramuro.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(extramuro.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(extramuro.fechaHora)}</p>
            <p><strong>Fecha y Hora Reintegro:</strong> {extramuro.fechaHoraReintegro ? formatDateTime(extramuro.fechaHoraReintegro) : "N/A"}</p>
            <p><strong>Establecimiento:</strong> {extramuro.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {extramuro.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {extramuro.pabellon}</p>
            <p><strong>Motivo:</strong> {extramuro.motivo}</p>
            <p><strong>Hospital:</strong> {extramuro.hospital}</p>
            <p><strong>Por Orden:</strong> {extramuro.porOrden}</p>
            <p><strong>Sector Internación:</strong> {extramuro.sector_internacion}</p>
            <p><strong>Piso:</strong> {extramuro.piso}</p>
            <p><strong>Habitación:</strong> {extramuro.habitacion}</p>
            <p><strong>Cama:</strong> {extramuro.cama}</p>
            <p><strong>Internación:</strong> {extramuro.internacion}</p>
            <p><strong>Observación:</strong> {extramuro.observacion}</p>
            <p><strong>Motivo Reintegro:</strong> {extramuro.motivo_reintegro}</p>
            <p><strong>Email:</strong> {extramuro.email}</p>
            <p><strong>Expediente:</strong> {extramuro.expediente}</p>
            <p><strong>Creado el:</strong> {formatDateTime(extramuro.created_at)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(extramuro.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Extramuro`} />

          <div className="mt-6 space-y-4">
            {extramuro.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {extramuro.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {extramuro.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {extramuro.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {extramuro.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {extramuro.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {extramuro.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {extramuro.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {extramuro.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {extramuro.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {extramuro.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen 1" imageUrl={imageUrl("imagen")} />}
            {extramuro.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen 2" imageUrl={imageUrl("imagenDer")} />}
            {extramuro.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen 3" imageUrl={imageUrl("imagenIz")} />}
            {extramuro.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen 4" imageUrl={imageUrl("imagenDact")} />}
            {extramuro.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen 5" imageUrl={imageUrl("imagenSen1")} />}
            {extramuro.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen 6" imageUrl={imageUrl("imagenSen2")} />}
            {extramuro.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen 7" imageUrl={imageUrl("imagenSen3")} />}
            {extramuro.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen 8" imageUrl={imageUrl("imagenSen4")} />}
            {extramuro.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen 9" imageUrl={imageUrl("imagenSen5")} />}
            {extramuro.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen 10" imageUrl={imageUrl("imagenSen6")} />}

            {extramuro.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <button
            className="mt-5 bg-green-800 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Descargar Todo
          </button>

          <div className="flex justify-end">
            {(user?.email === extramuro.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveExtramuro(id)}
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

export default ExtramuroDetailPage;