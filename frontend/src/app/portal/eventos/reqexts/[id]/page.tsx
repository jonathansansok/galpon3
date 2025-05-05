
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReqext, deleteReqext } from "../Reqexts.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import Swal from "sweetalert2";
import { Alert } from "@/components/ui/alert";

interface Props {
  params: {
    id: string;
  };
}

const ReqextDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [reqext, setReqext] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReqext = async () => {
      const data = await getReqext(id);
      setReqext(data);
    };

    fetchReqext();
  }, [id]);

  const handleRemoveReqext = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este reqext?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      await deleteReqext(id);
      router.push("/portal/eventos/reqexts");
    }
  };

  if (!reqext) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const pdfUrl = (pdfKey: string) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqext[pdfKey]}`;
  const imageUrl = (imageKey: string) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqext[imageKey]}`;
  const wordUrl = (wordKey: string) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqext[wordKey]}`;

  const cardContent = `
    Fecha y Hora: ${new Date(reqext.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
    Organismo Requiriente: ${reqext.organismo_requiriente}
    Internos Involucrados: ${reqext.internosinvolucrado}
    Internos sin buscador: ${reqext.internosinvolucrado2}
    Causa: ${reqext.causa}
    Nota: ${reqext.nota}
    Estado: ${reqext.estado}
    Fecha y Hora de Contestación: ${reqext.fechaHoraContestacion ? new Date(reqext.fechaHoraContestacion).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : "N/A"}
    Contestación: ${reqext.contestacion}
    Observación: ${reqext.observacion}
    Email: ${reqext.email}
  `;

  const fileName = `${reqext.organismo_requiriente}_${reqext.nota}_${reqext.internosinvolucrado}_${reqext.internosinvolucrado2}`.replace(/[^a-zA-Z0-9]/g, '_');
  const title = "Detalle de Respuesta de Req.externo";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/reqexts">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p><strong>Fecha y Hora:</strong> {new Date(reqext.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
            <p><strong>Organismo Requiriente:</strong> {reqext.organismo_requiriente}</p>
            <p><strong className="text-lg">&quot;Internos involucrados:&quot;</strong> {reqext.internosinvolucrado}</p>
            <p><strong>Internos sin buscador:</strong> {reqext.internosinvolucrado2}</p>
            <p><strong>Causa:</strong> {reqext.causa}</p>
            <p><strong>Nota:</strong> {reqext.nota}</p>
            <p><strong>Estado:</strong> {reqext.estado}</p>
            <p><strong>Fecha y Hora de Contestación:</strong> {reqext.fechaHoraContestacion ? new Date(reqext.fechaHoraContestacion).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : "N/A"}</p>
            <p><strong>Contestación:</strong> {reqext.contestacion}</p>
            <p><strong>Observación:</strong> {reqext.observacion}</p>
            <p><strong>Email:</strong> {reqext.email}</p>
          </div>
          
          <DownloadWordButton title={title} content={cardContent} fileName={fileName} />

          <div className="mt-6 space-y-4">
            {reqext.pdf1 && <PdfRenderer pdfKey="pdf1" pdfLabel="PDF1" pdfUrl={pdfUrl('pdf1')} />}
            {reqext.pdf2 && <PdfRenderer pdfKey="pdf2" pdfLabel="PDF2" pdfUrl={pdfUrl('pdf2')} />}
            {reqext.pdf3 && <PdfRenderer pdfKey="pdf3" pdfLabel="PDF3" pdfUrl={pdfUrl('pdf3')} />}
            {reqext.pdf4 && <PdfRenderer pdfKey="pdf4" pdfLabel="PDF4" pdfUrl={pdfUrl('pdf4')} />}
            {reqext.pdf5 && <PdfRenderer pdfKey="pdf5" pdfLabel="PDF5" pdfUrl={pdfUrl('pdf5')} />}
            {reqext.pdf6 && <PdfRenderer pdfKey="pdf6" pdfLabel="PDF6" pdfUrl={pdfUrl('pdf6')} />}
            {reqext.pdf7 && <PdfRenderer pdfKey="pdf7" pdfLabel="PDF7" pdfUrl={pdfUrl('pdf7')} />}
            {reqext.pdf8 && <PdfRenderer pdfKey="pdf8" pdfLabel="PDF8" pdfUrl={pdfUrl('pdf8')} />}
            {reqext.pdf9 && <PdfRenderer pdfKey="pdf9" pdfLabel="PDF9" pdfUrl={pdfUrl('pdf9')} />}
            {reqext.pdf10 && <PdfRenderer pdfKey="pdf10" pdfLabel="PDF10" pdfUrl={pdfUrl('pdf10')} />}
            
            {reqext.imagen && <ImageRenderer imageKey="imagen" imageLabel="Imagen" imageUrl={imageUrl('imagen')} />}
            {reqext.imagenDer && <ImageRenderer imageKey="imagenDer" imageLabel="Imagen Der" imageUrl={imageUrl('imagenDer')} />}
            {reqext.imagenIz && <ImageRenderer imageKey="imagenIz" imageLabel="Imagen Iz" imageUrl={imageUrl('imagenIz')} />}
            {reqext.imagenDact && <ImageRenderer imageKey="imagenDact" imageLabel="Imagen Dact" imageUrl={imageUrl('imagenDact')} />}
            {reqext.imagenSen1 && <ImageRenderer imageKey="imagenSen1" imageLabel="Imagen Sen1" imageUrl={imageUrl('imagenSen1')} />}
            {reqext.imagenSen2 && <ImageRenderer imageKey="imagenSen2" imageLabel="Imagen Sen2" imageUrl={imageUrl('imagenSen2')} />}
            {reqext.imagenSen3 && <ImageRenderer imageKey="imagenSen3" imageLabel="Imagen Sen3" imageUrl={imageUrl('imagenSen3')} />}
            {reqext.imagenSen4 && <ImageRenderer imageKey="imagenSen4" imageLabel="Imagen Sen4" imageUrl={imageUrl('imagenSen4')} />}
            {reqext.imagenSen5 && <ImageRenderer imageKey="imagenSen5" imageLabel="Imagen Sen5" imageUrl={imageUrl('imagenSen5')} />}
            {reqext.imagenSen6 && <ImageRenderer imageKey="imagenSen6" imageLabel="Imagen Sen6" imageUrl={imageUrl('imagenSen6')} />}
            
            {reqext.word1 && <WordRenderer wordKey="word1" wordLabel="Word1" wordUrl={wordUrl('word1')} />}
          </div>

          <button
            className="mt-5 bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => handleRemoveReqext(id)}
          >
            Eliminar
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReqextDetailPage;