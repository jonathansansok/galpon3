"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAtentado, deleteAtentado } from "../Atentados.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime, formatData, cleanText } from "@/app/utils/formatData";
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

const ProductDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [atentado, setAtentado] = useState<any>(null);
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
    const fetchAtentado = async () => {
      const data = await getAtentado(id);
      setAtentado(data);
    };

    fetchAtentado();
  }, [id]);

  const handleRemoveAtentado = async (id: string) => {
    if (user?.email !== atentado?.email && privilege !== "A1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este atentado.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este atentado?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteAtentado(id);
      router.push("/portal/eventos/atentados");
    }
  };

  const handleDownloadAll = async () => {
    if (!atentado) return;

    const zip = new JSZip();

    // Agregar PDFs al archivo ZIP
    for (let i = 1; i <= 10; i++) {
      const pdfKey = `pdf${i}`;
      if (atentado[pdfKey]) {
        const pdfUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado[pdfKey]}`;
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
      if (atentado[key]) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado[key]}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`${key}.jpg`, blob);
      }
    }

    // Agregar archivos Word al archivo ZIP
    if (atentado.word1) {
      const wordUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.word1}`;
      const response = await fetch(wordUrl);
      const blob = await response.blob();
      zip.file("word1.docx", blob);
    }

    // Generar y descargar el archivo ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `atentado_${id}.zip`);
  };

  if (!atentado) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado[wordKey]}`;

  const cardContent = `
  Internos Involucrados: ${formatInternosInvolucrados(atentado.internosinvolucrado)}
  Personal Involucrado: ${formatPersonalInvolucrado(atentado.personalinvolucrado)}
  Fecha y Hora: ${formatDateTime(atentado.fechaHora)}
  Establecimiento: ${atentado.establecimiento}
  Módulo - U.R.: ${atentado.modulo_ur}
  Pabellón: ${atentado.pabellon}
  Acontecimiento: ${atentado.acontecimiento}
  Jurisdicción: ${atentado.jurisdiccion}
  Juzgados: ${atentado.juzgados}
  Prevención: ${atentado.prevencioSiNo ? "Sí" : "No"}
  Fecha Venc: ${atentado.fechaVenc ? formatDateTime(atentado.fechaVenc) : "Fecha No"}
  Orden CapDip: ${atentado.ordenCapDip ? atentado.ordenCapDip.toString() : "No"}
  Expediente: ${atentado.expediente}
  Observaciones: ${atentado.observacion}
  Otros Datos: ${atentado.otrosDatos}
  Fecha Hora Venc: ${formatDateTime(atentado.fechaHoraVencTime ?? "")}
  Fecha Hora Últ. Cap: ${formatDateTime(atentado.fechaHoraUlOrCap ?? "")}
  Creado el: ${formatDateTime(atentado.createdAt)}
  Actualizado el: ${formatDateTime(atentado.updatedAt)}
  Email: ${atentado.email}
`;
  const title = "Detalle de Atentado a la seguridad";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/atentados">
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
          __html: atentado.internosinvolucrado && atentado.internosinvolucrado !== "[]"
            ? formatInternosInvolucrados(atentado.internosinvolucrado)
            : "No",
        }}
      />
    </p>
    <p>
      <strong className="text-lg">&quot;Personal involucrado:&quot;</strong>
      <div
        dangerouslySetInnerHTML={{
          __html: atentado.personalinvolucrado && atentado.personalinvolucrado !== "[]"
            ? formatPersonalInvolucrado(atentado.personalinvolucrado)
            : "No",
        }}
      />
    </p>
    <p><strong>Fecha y Hora:</strong> {atentado.fechaHora ? formatDateTime(atentado.fechaHora) : "NO ESPECIFICADO"}</p>
    <p><strong>Establecimiento:</strong> {atentado.establecimiento || "No"}</p>
    <p><strong>Módulo - U.R.:</strong> {atentado.modulo_ur || "No"}</p>
    <p><strong>Pabellón:</strong> {atentado.pabellon || "No"}</p>
    <p><strong>Acontecimiento:</strong> {atentado.acontecimiento || "No"}</p>
    <p><strong>Jurisdicción:</strong> {atentado.jurisdiccion || "No"}</p>
    <p><strong>Juzgados:</strong> {atentado.juzgados || "No"}</p>
    <p><strong>Prevención:</strong> {atentado.prevencioSiNo === "Si" ? "Sí" : "No"}</p>
    <p><strong>Fecha Venc:</strong> 
      {atentado.fechaVenc && atentado.fechaVenc !== "No" 
        ? formatDateTime(atentado.fechaHoraVencTime) 
        : "Fecha No"}
    </p>
    <p><strong>Orden CapDip:</strong> {atentado.ordenCapDip || "No"}</p>
    <p><strong>Expediente:</strong> {atentado.expediente || "No"}</p>
    <p><strong>Observaciones:</strong> {atentado.observacion || "No"}</p>
    <p><strong>Otros Datos:</strong> {atentado.otrosDatos || "No"}</p>
    <p><strong>Fecha Hora Venc:</strong> {atentado.fechaHoraVencTime ? formatDateTime(atentado.fechaHoraVencTime) : "NO ESPECIFICADO"}</p>
    <p><strong>Fecha Hora Últ. Cap:</strong> {atentado.fechaHoraUlOrCap ? formatDateTime(atentado.fechaHoraUlOrCap) : "NO ESPECIFICADO"}</p>
    <p><strong>Creado el:</strong> {atentado.createdAt ? formatDateTime(atentado.createdAt) : "NO ESPECIFICADO"}</p>
    <p><strong>Actualizado el:</strong> {atentado.updatedAt ? formatDateTime(atentado.updatedAt) : "NO ESPECIFICADO"}</p>
    <p><strong>Email:</strong> {atentado.email || "No"}</p>
  </div>

  <DownloadWordButton title={title} content={cardContent} fileName={`Detalle_Atentado`} />

  <div className="mt-6 space-y-4">
    {atentado.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl("pdf1")} />}
    {atentado.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl("pdf2")} />}
    {atentado.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl("pdf3")} />}
    {atentado.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl("pdf4")} />}
    {atentado.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl("pdf5")} />}
    {atentado.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl("pdf6")} />}
    {atentado.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl("pdf7")} />}
    {atentado.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl("pdf8")} />}
    {atentado.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl("pdf9")} />}
    {atentado.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl("pdf10")} />}

    {atentado.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen 1" imageUrl={imageUrl("imagen")} />}
    {atentado.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen 2" imageUrl={imageUrl("imagenDer")} />}
    {atentado.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen 3" imageUrl={imageUrl("imagenIz")} />}
    {atentado.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen 4" imageUrl={imageUrl("imagenDact")} />}
    {atentado.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen 5" imageUrl={imageUrl("imagenSen1")} />}
    {atentado.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen 6" imageUrl={imageUrl("imagenSen2")} />}
    {atentado.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen 7" imageUrl={imageUrl("imagenSen3")} />}
    {atentado.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen 8" imageUrl={imageUrl("imagenSen4")} />}
    {atentado.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen 9" imageUrl={imageUrl("imagenSen5")} />}
    {atentado.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen 10" imageUrl={imageUrl("imagenSen6")} />}

    {atentado.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl("word1")} />}
  </div>

  <button
    className="mt-5 bg-green-500 text-white py-2 px-4 rounded"
    onClick={handleDownloadAll}
  >
    Descargar Todo
  </button>
  <div className="flex justify-end">
  {(user?.email === atentado.email || privilege === "A1") && (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded"
      onClick={() => handleRemoveAtentado(id)}
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