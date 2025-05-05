"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAgresion, deleteAgresion } from "../agresiones.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatUtils";
import { formatDateTime } from "@/app/utils/formatData";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { formatUbicacionMap } from "@/app/utils/formatters";
interface Props {
  params: {
    id: string;
  };
}

const ProductDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [agresion, setAgresion] = useState<any>(null);
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
    const fetchAgresion = async () => {
      const data = await getAgresion(id);
      setAgresion(data);
    };

    fetchAgresion();
  }, [id]);

  const handleRemoveAgresion = async (id: string) => {
    if (user?.email !== agresion?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar esta agresión.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta agresión?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteAgresion(id);
      router.push("/portal/eventos/agresiones");
    }
  };

  const handleDownloadAll = async () => {
    if (!agresion) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (agresion[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${agresion[pdfKey]}`;
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
      if (agresion[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${agresion[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (agresion.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${agresion.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `agresion_${id}.zip`);
  };

  if (!agresion) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${agresion[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${agresion[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${agresion[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(agresion.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(agresion.personalinvolucrado)}
    Establecimiento: ${agresion.establecimiento || "No"}
    Módulo - U.R.: ${agresion.modulo_ur || "No"}
    Pabellón: ${agresion.pabellon || "No"}
    Fecha y Hora: ${formatDateTime(agresion.fechaHora)}
    Expediente: ${agresion.expediente || "No"}
    Observaciones: ${agresion.observacion || "No"}
 Ubicación en el Mapa: ${formatUbicacionMap(agresion.ubicacionMap) || "No"}
  `;

  const title = "Detalle de la Agresión";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/agresiones">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
  <div>
    <p>
      <strong className="text-lg">&quot;Internos involucrados:&quot;</strong>
    </p>
    <div
      dangerouslySetInnerHTML={{
        __html: formatInternosInvolucrados(agresion.internosinvolucrado),
      }}
    />
  </div>
  <div>
    <p>
      <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
    </p>
    <div
      dangerouslySetInnerHTML={{
        __html: formatPersonalInvolucrado(agresion.personalinvolucrado),
      }}
    />
  </div>
  <p><strong>Establecimiento:</strong> {agresion.establecimiento || "No"}</p>
  <p><strong>Módulo - U.R.:</strong> {agresion.modulo_ur || "No"}</p>
  <p><strong>Pabellón:</strong> {agresion.pabellon || "No"}</p>
  <p><strong>Fecha y Hora:</strong> {formatDateTime(agresion.fechaHora)}</p>
  <p><strong>Expediente:</strong> {agresion.expediente || "No"}</p>
  <p><strong>Ubicación en el Mapa:</strong> {formatUbicacionMap(agresion.ubicacionMap)}</p>
  <p><strong>Observaciones:</strong> {agresion.observacion || "No"}</p>
</div>

          <DownloadWordButton title={title} content={cardContent} fileName="Detalle_Agresion" />

          <div className="mt-6 space-y-4">
            {agresion.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {agresion.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {agresion.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {agresion.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {agresion.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {agresion.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {agresion.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {agresion.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {agresion.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {agresion.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {agresion.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen 1" imageUrl={imageUrl("imagen")} />}
            {agresion.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen 2" imageUrl={imageUrl("imagenDer")} />}
            {agresion.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen 3" imageUrl={imageUrl("imagenIz")} />}
            {agresion.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen 4" imageUrl={imageUrl("imagenDact")} />}
            {agresion.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen 5" imageUrl={imageUrl("imagenSen1")} />}
            {agresion.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen 6" imageUrl={imageUrl("imagenSen2")} />}
            {agresion.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen 7" imageUrl={imageUrl("imagenSen3")} />}
            {agresion.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen 8" imageUrl={imageUrl("imagenSen4")} />}
            {agresion.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen 9" imageUrl={imageUrl("imagenSen5")} />}
            {agresion.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen 10" imageUrl={imageUrl("imagenSen6")} />}

            {agresion.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <button
            className="mt-5 bg-green-800 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Descargar Fotos-P.D.F. como ZIP
          </button>
          <div className="flex justify-end">
  {(user?.email === agresion.email || privilege === "A1") && (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded"
      onClick={() => handleRemoveAgresion(id)}
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

export default ProductDetailPage;