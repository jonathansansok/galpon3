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
    Fecha y Hora: ${formatDateTime(tema.fechaHora)}
    Patente: ${tema.patente || "No especificado"}
    Marca: ${tema.marca || "No especificado"}
    Modelo: ${tema.modelo || "No especificado"}
    Año: ${tema.anio || "No especificado"}
    Color: ${tema.color || "No especificado"}
    Tipo de Pintura: ${tema.tipoPintura || "No especificado"}
    País de Origen: ${tema.paisOrigen || "No especificado"}
    Tipo de Vehículo: ${tema.tipoVehic || "No especificado"}
    Motor: ${tema.motor || "No especificado"}
    Chasis: ${tema.chasis || "No especificado"}
    Combustión: ${tema.combustion || "No especificado"}
    VIN: ${tema.vin || "No especificado"}
    Observación: ${tema.observacion || "No especificado"}
    Creado el: ${formatDateTime(tema.createdAt)}
    Actualizado el: ${formatDateTime(tema.updatedAt)}
  `;

  const title = "Detalle del Móvil";

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
            <p><strong>Fecha y Hora:</strong> {formatDateTime(tema.fechaHora)}</p>
            <p><strong>Patente:</strong> {tema.patente || "No especificado"}</p>
            <p><strong>Marca:</strong> {tema.marca || "No especificado"}</p>
            <p><strong>Modelo:</strong> {tema.modelo || "No especificado"}</p>
            <p><strong>Año:</strong> {tema.anio || "No especificado"}</p>
            <p><strong>Color:</strong> {tema.color || "No especificado"}</p>
            <p><strong>Tipo de Pintura:</strong> {tema.tipoPintura || "No especificado"}</p>
            <p><strong>País de Origen:</strong> {tema.paisOrigen || "No especificado"}</p>
            <p><strong>Tipo de Vehículo:</strong> {tema.tipoVehic || "No especificado"}</p>
            <p><strong>Motor:</strong> {tema.motor || "No especificado"}</p>
            <p><strong>Chasis:</strong> {tema.chasis || "No especificado"}</p>
            <p><strong>Combustión:</strong> {tema.combustion || "No especificado"}</p>
            <p><strong>VIN:</strong> {tema.vin || "No especificado"}</p>
            <p><strong>Observación:</strong> {tema.observacion || "No especificado"}</p>
            <p><strong>Creado el:</strong> {formatDateTime(tema.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(tema.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Tema`} />

          <div className="mt-6 space-y-4">
            {/* PDFs */}
            {Array.from({ length: 10 }, (_, index) => `pdf${index + 1}`).map((key, index) =>
              tema[key] ? (
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
              tema[key] ? (
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
              tema[key] ? (
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