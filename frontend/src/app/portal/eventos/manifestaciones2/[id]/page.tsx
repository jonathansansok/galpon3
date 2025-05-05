"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getManifestacion2, deleteManifestacion2 } from "../manifestaciones2.api";
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

const ProductDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [manifestacion2, setManifestacion2] = useState<any>(null);
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
    const fetchManifestacion2 = async () => {
      const data = await getManifestacion2(id);
      setManifestacion2(data);
    };

    fetchManifestacion2();
  }, [id]);

  const handleRemoveManifestacion2 = async (id: string) => {
    if (user?.email !== manifestacion2?.email && privilege !== "A1") {
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
      await deleteManifestacion2(id);
      router.push("/portal/eventos/manifestaciones2");
    }
  };

  if (!manifestacion2) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2[wordKey]}`;

  const cardContent = `
    Internos Involucrados: ${formatInternosInvolucrados(manifestacion2.internosinvolucrado)}
    Personal Involucrado: ${formatPersonalInvolucrado(manifestacion2.personalinvolucrado)}
    Fecha y Hora: ${formatDateTime(manifestacion2.fechaHora)}
    Establecimiento: ${manifestacion2.establecimiento || "No"}
    Módulo - U.R.: ${manifestacion2.modulo_ur || "No"}
    Sector: ${manifestacion2.sector || "No"}
    Expediente: ${manifestacion2.expediente || "No"}
    Foco Ígneo: ${manifestacion2.foco_igneo ? "Sí" : "No"}
    Reyerta: ${manifestacion2.reyerta ? "Sí" : "No"}
    Intervención Requisa: ${manifestacion2.interv_requisa ? "Sí" : "No"}
    Observación: ${manifestacion2.observacion || "No"}
    Email: ${manifestacion2.email || "No"}
    Creado el: ${formatDateTime(manifestacion2.createdAt)}
    Actualizado el: ${formatDateTime(manifestacion2.updatedAt)}
  `;

  const fileName = `${manifestacion2.establecimiento}_${manifestacion2.fechaHora}`.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  );
  const title = "Detalle de Alteración al orden en sec. común";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/manifestaciones2">
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
                  __html: formatInternosInvolucrados(manifestacion2.internosinvolucrado),
                }}
              />
            </p>
            <p>
              <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatPersonalInvolucrado(manifestacion2.personalinvolucrado),
                }}
              />
            </p>
            <p><strong>Fecha y Hora:</strong> {formatDateTime(manifestacion2.fechaHora)}</p>
            <p><strong>Establecimiento:</strong> {manifestacion2.establecimiento || "No"}</p>
            <p><strong>Módulo - U.R.:</strong> {manifestacion2.modulo_ur || "No"}</p>
            <p><strong>Sector:</strong> {manifestacion2.sector || "No"}</p>
            <p><strong>Expediente:</strong> {manifestacion2.expediente || "No"}</p>
            <p><strong>Foco Ígneo:</strong> {manifestacion2.foco_igneo ? "Sí" : "No"}</p>
            <p><strong>Reyerta:</strong> {manifestacion2.reyerta ? "Sí" : "No"}</p>
            <p><strong>Intervención Requisa:</strong> {manifestacion2.interv_requisa ? "Sí" : "No"}</p>
            <p><strong>Observación:</strong> {manifestacion2.observacion || "No"}</p>
            <p><strong>Email:</strong> {manifestacion2.email || "No"}</p>
            <p><strong>Creado el:</strong> {formatDateTime(manifestacion2.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(manifestacion2.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={fileName} />

          <div className="mt-6 space-y-4">
            {manifestacion2.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {manifestacion2.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {manifestacion2.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
            {manifestacion2.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
            {manifestacion2.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
            {manifestacion2.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
            {manifestacion2.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
            {manifestacion2.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
            {manifestacion2.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
            {manifestacion2.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

            {manifestacion2.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {manifestacion2.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl("imagenDer")} />}
            {manifestacion2.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl("imagenIz")} />}
            {manifestacion2.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl("imagenDact")} />}
            {manifestacion2.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl("imagenSen1")} />}
            {manifestacion2.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl("imagenSen2")} />}
            {manifestacion2.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl("imagenSen3")} />}
            {manifestacion2.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl("imagenSen4")} />}
            {manifestacion2.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl("imagenSen5")} />}
            {manifestacion2.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl("imagenSen6")} />}

            {manifestacion2.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === manifestacion2.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveManifestacion2(id)}
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