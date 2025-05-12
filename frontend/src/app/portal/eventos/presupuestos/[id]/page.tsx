"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPresupuesto, deletePresupuesto } from "../Presupuestos.api";
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

interface Props {
  params: {
    id: string;
  };
}

const PresupuestoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [presupuesto, setPresupuesto] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchPresupuesto = async () => {
      const data = await getPresupuesto(id);
      setPresupuesto(data);
    };

    fetchPresupuesto();
  }, [id]);

  const handleRemovePresupuesto = async (id: string) => {
    if (user?.email !== presupuesto?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este presupuesto.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este presupuesto?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deletePresupuesto(id);
      router.push("/portal/eventos/presupuestos");
    }
  };

  if (!presupuesto) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/${presupuesto[wordKey]}`;

  const cardContent = `
    Monto: ${presupuesto.monto || "No especificado"}
    Estado: ${presupuesto.estado || "No especificado"}
    Observaciones: ${presupuesto.observaciones || "No especificado"}
    Creado el: ${formatDateTime(presupuesto.createdAt)}
    Actualizado el: ${formatDateTime(presupuesto.updatedAt)}
  `;

  const title = "Detalle del Presupuesto";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/presupuestos">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p><strong>Monto:</strong> {presupuesto.monto || "No especificado"}</p>
            <p><strong>Estado:</strong> {presupuesto.estado || "No especificado"}</p>
            <p><strong>Observaciones:</strong> {presupuesto.observaciones || "No especificado"}</p>
            <p><strong>Creado el:</strong> {formatDateTime(presupuesto.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(presupuesto.updatedAt)}</p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName={`Detalle_Presupuesto`}
          />

          <div className="mt-6 space-y-4">
            {/* PDFs */}
            {Array.from({ length: 10 }, (_, index) => `pdf${index + 1}`).map((key, index) =>
              presupuesto[key] ? (
                <PdfRenderer
                  key={key}
                  pdfKey={key}
                  pdfLabel={`PDF ${index + 1}`}
                  pdfUrl={pdfUrl(key)}
                />
              ) : null
            )}

            {/* Imágenes */}
            {[
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
            ].map((key) =>
              presupuesto[key] ? (
                <ImageRenderer
                  key={key}
                  imageKey={key}
                  imageLabel={key.replace("imagen", "Imagen ")}
                  imageUrl={imageUrl(key)}
                />
              ) : null
            )}

            {/* Archivos Word */}
            {["word1"].map((key) =>
              presupuesto[key] ? (
                <WordRenderer
                  key={key}
                  wordKey={key}
                  wordLabel={`Word ${key.replace("word", "")}`}
                  wordUrl={wordUrl(key)}
                />
              ) : null
            )}
          </div>

          <div className="flex justify-end">
            {(user?.email === presupuesto.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemovePresupuesto(id)}
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

export default PresupuestoDetailPage;