"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatInternosInvolucrados,
  formatPersonalInvolucrado,
} from "@/app/utils/formatUtils";
import { getManifestacion, deleteManifestacion } from "../manifestaciones.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime } from "@/app/utils/formatData";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface Props {
  params: {
    id: string;
  };
}

const ProductDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [manifestacion, setManifestacion] = useState<any>(null);
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
    const fetchManifestacion = async () => {
      const data = await getManifestacion(id);
      setManifestacion(data);
    };

    fetchManifestacion();
  }, [id]);

  const handleRemoveManifestacion = async (id: string) => {
    if (user?.email !== manifestacion?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar esta manifestación.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta manifestación?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteManifestacion(id);
      router.push("/portal/eventos/manifestaciones");
    }
  };

  const handleDownloadAll = async () => {
    if (!manifestacion) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (manifestacion[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion[pdfKey]}`;
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
      if (manifestacion[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (manifestacion.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `manifestacion_${id}.zip`);
  };

  if (!manifestacion) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion[wordKey]}`;

  const cardContent = `
    Fecha y Hora: ${formatDateTime(manifestacion.fechaHora)}
    Establecimiento: ${manifestacion.establecimiento || "No"}
    Módulo - U.R.: ${manifestacion.modulo_ur || "No"}
    Pabellón: ${manifestacion.pabellon || "No"}
    Sector: ${manifestacion.sector || "No"}
    Internos Involucrados: ${formatInternosInvolucrados(
      manifestacion.internosinvolucrado
    )}
    Personal Involucrados: ${formatPersonalInvolucrado(
      manifestacion.personalinvolucrado
    )}
    Expediente: ${manifestacion.expediente || "No"}
    Foco Ígneo: ${manifestacion.foco_igneo ? "Sí" : "No"}
    Reyerta: ${manifestacion.reyerta ? "Sí" : "No"}
    Intervención Requisa: ${manifestacion.interv_requisa ? "Sí" : "No"}
    Email: ${manifestacion.email || "No"}
    Observación: ${manifestacion.observacion || "No"}
    Creado el: ${formatDateTime(manifestacion.createdAt)}
    Actualizado el: ${formatDateTime(manifestacion.updatedAt)}
  `;

  const title = "Detalle de Alteración al orden Hab.";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link
              className={buttonVariants()}
              href="/portal/eventos/manifestaciones"
            >
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p>
              <strong>Fecha y Hora:</strong>{" "}
              {formatDateTime(manifestacion.fechaHora)}
            </p>
            <p>
              <strong className="text-lg">&quot;Internos involucrados:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatInternosInvolucrados(
                    manifestacion.internosinvolucrado
                  ),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(
                    manifestacion.personalinvolucrado
                  ),
                }}
              />
            </p>
            <p>
              <strong>Establecimiento:</strong>{" "}
              {manifestacion.establecimiento || "No"}
            </p>
            <p>
              <strong>Módulo - U.R.:</strong>{" "}
              {manifestacion.modulo_ur || "No"}
            </p>
            <p>
              <strong>Pabellón:</strong>{" "}
              {manifestacion.pabellon || "No"}
            </p>
            <p>
              <strong>Sector:</strong> {manifestacion.sector || "No"}
            </p>
            <p>
              <strong>Foco Ígneo:</strong>{" "}
              {manifestacion.foco_igneo ? "Sí" : "No"}
            </p>
            <p>
              <strong>Reyerta:</strong> {manifestacion.reyerta ? "Sí" : "No"}
            </p>
            <p>
              <strong>Intervención Requisa:</strong>{" "}
              {manifestacion.interv_requisa ? "Sí" : "No"}
            </p>
            <p>
              <strong>Expediente:</strong>{" "}
              {manifestacion.expediente || "No"}
            </p>
            <p>
              <strong>Observación:</strong>{" "}
              {manifestacion.observacion || "No"}
            </p>
            <p>
              <strong>Email:</strong> {manifestacion.email || "No"}
            </p>
            <p>
              <strong>Creado el:</strong>{" "}
              {formatDateTime(manifestacion.createdAt)}
            </p>
            <p>
              <strong>Actualizado el:</strong>{" "}
              {formatDateTime(manifestacion.updatedAt)}
            </p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName="Detalle_Manifestacion"
          />

          <div className="mt-6 space-y-4">
            {/* Renderizado de PDFs, imágenes y Word */}
            {manifestacion.pdf1 && (
              <PdfRenderer
                pdfKey="pdf1"
                pdfLabel="PDF1"
                pdfUrl={pdfUrl("pdf1")}
              />
            )}
            {manifestacion.imagen && (
              <ImageRenderer
                imageKey="imagen"
                imageLabel="Imagen 1"
                imageUrl={imageUrl("imagen")}
              />
            )}
            {manifestacion.word1 && (
              <WordRenderer
                wordKey="word1"
                wordLabel="Word1"
                wordUrl={wordUrl("word1")}
              />
            )}
          </div>

          <div className="mt-5 flex space-x-4">
            {/* Botón de Descargar Todo */}
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={handleDownloadAll}
            >
              Descargar Todo
            </button>

            <div className="flex justify-end">
            {(user?.email === manifestacion.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveManifestacion(id)}
              >
                Eliminar
              </button>
            )}
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
