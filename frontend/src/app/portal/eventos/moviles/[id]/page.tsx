"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMovil, deleteMovil } from "../Moviles.api";
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

const MovilDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [movil, setMovil] = useState<any>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchMovil = async () => {
      const data = await getMovil(id);
      setMovil(data);
    };

    fetchMovil();
  }, [id]);

  const handleRemoveMovil = async (id: string) => {
    if (user?.email !== movil?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este móvil.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este móvil?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteMovil(id);
      router.push("/portal/eventos/moviles");
    }
  };

  if (!movil) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/moviles/uploads/${movil[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/moviles/uploads/${movil[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/moviles/uploads/${movil[wordKey]}`;

  const cardContent = `
    Patente: ${movil.patente}
    Marca: ${movil.marca}
    Modelo: ${movil.modelo}
    Año: ${movil.anio}
    Color: ${movil.color}
    Tipo de Pintura: ${movil.tipoPintura}
    País de Origen: ${movil.paisOrigen}
    Tipo de Vehículo: ${movil.tipoVehic}
    Motor: ${movil.motor}
    Chasis: ${movil.chasis}
    Combustión: ${movil.combustion}
    VIN: ${movil.vin}
    Creado el: ${formatDateTime(movil.createdAt)}
    Actualizado el: ${formatDateTime(movil.updatedAt)}
  `;

  const title = "Detalle del Móvil";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/moviles">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p><strong>Patente:</strong> {movil.patente}</p>
            <p><strong>Marca:</strong> {movil.marca}</p>
            <p><strong>Modelo:</strong> {movil.modelo}</p>
            <p><strong>Año:</strong> {movil.anio}</p>
            <p><strong>Color:</strong> {movil.color}</p>
            <p><strong>Tipo de Pintura:</strong> {movil.tipoPintura}</p>
            <p><strong>País de Origen:</strong> {movil.paisOrigen}</p>
            <p><strong>Tipo de Vehículo:</strong> {movil.tipoVehic}</p>
            <p><strong>Motor:</strong> {movil.motor}</p>
            <p><strong>Chasis:</strong> {movil.chasis}</p>
            <p><strong>Combustión:</strong> {movil.combustion}</p>
            <p><strong>VIN:</strong> {movil.vin}</p>
            <p><strong>Creado el:</strong> {formatDateTime(movil.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(movil.updatedAt)}</p>
          </div>

          <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Movil`} />

          <div className="mt-6 space-y-4">
            {movil.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
            {movil.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
            {movil.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl("imagen")} />}
            {movil.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
          </div>

          <div className="flex justify-end">
            {(user?.email === movil.email || privilege === "A1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveMovil(id)}
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

export default MovilDetailPage;