"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHuelga, deleteHuelga } from "../Huelgas.api";
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

const HuelgaDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [huelga, setHuelga] = useState<any>(null);
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
    const fetchHuelga = async () => {
      const data = await getHuelga(id);
      setHuelga(data);
    };

    fetchHuelga();
  }, [id]);

  const handleRemoveHuelga = async (id: string) => {
    if (user?.email !== huelga?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar esta huelga.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta huelga?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteHuelga(id);
      router.push("/portal/eventos/huelgas");
    }
  };

  const handleDownloadAll = async () => {
    if (!huelga) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (huelga[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelga[pdfKey]}`;
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
      if (huelga[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelga[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (huelga.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelga.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `huelga_${id}.zip`);
  };

  if (!huelga) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelga[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelga[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/${huelga[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(huelga.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(huelga.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(huelga.fechaHora)}
    Fecha y Hora de Cierre: ${huelga.fechaHoraCierre ? formatDateTime(huelga.fechaHoraCierre) : "N/A"}
    Establecimiento: ${huelga.establecimiento}
    Módulo - U.R.: ${huelga.modulo_ur}
    Pabellón: ${huelga.pabellon}
    Motivo: ${huelga.motivo}
    Estado: ${huelga.estado}
    Expediente: ${huelga.expediente}
    Observación: ${huelga.observacion}
    Email: ${huelga.email}
  `;

  const title = "Detalle de la Huelga de hambre";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/huelgas">
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
                  __html: formatInternosInvolucrados(huelga.internosinvolucrado),
                }}
              />
            </p>
            <p>
            <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(huelga.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(huelga.fechaHora)}</p>
            <p><strong>Fecha y Hora de Cierre:</strong> {huelga.fechaHoraCierre ? formatDateTime(huelga.fechaHoraCierre) : "N/A"}</p>
            <p><strong>Establecimiento:</strong> {huelga.establecimiento}</p>
            <p><strong>Módulo - U.R.:</strong> {huelga.modulo_ur}</p>
            <p><strong>Pabellón:</strong> {huelga.pabellon}</p>
            <p><strong>Motivo:</strong> {huelga.motivo}</p>
            <p><strong>Estado:</strong> {huelga.estado}</p>
            <p><strong>Expediente:</strong> {huelga.expediente}</p>
            <p><strong>Observación:</strong> {huelga.observacion}</p>
            <p><strong>Email:</strong> {huelga.email}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Huelga`} />

          <div className="mt-6 space-y-4">
            {huelga.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {huelga.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {huelga.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {huelga.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {huelga.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {huelga.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {huelga.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {huelga.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {huelga.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {huelga.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {huelga.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen 1" imageUrl={imageUrl("imagen")} />}
            {huelga.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen 2" imageUrl={imageUrl("imagenDer")} />}
            {huelga.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen 3" imageUrl={imageUrl("imagenIz")} />}
            {huelga.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen 4" imageUrl={imageUrl("imagenDact")} />}
            {huelga.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen 5" imageUrl={imageUrl("imagenSen1")} />}
            {huelga.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen 6" imageUrl={imageUrl("imagenSen2")} />}
            {huelga.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen 7" imageUrl={imageUrl("imagenSen3")} />}
            {huelga.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen 8" imageUrl={imageUrl("imagenSen4")} />}
            {huelga.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen 9" imageUrl={imageUrl("imagenSen5")} />}
            {huelga.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen 10" imageUrl={imageUrl("imagenSen6")} />}

            {huelga.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <button
            className="mt-5 bg-green-800 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Descargar Todo
          </button>
          <div className="flex justify-end">
            {(user?.email === huelga.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveHuelga(id)}
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

export default HuelgaDetailPage;