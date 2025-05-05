//frontend\src\app\portal\eventos\riesgos\[id]\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRiesgo, deleteRiesgo } from "../Riesgos.api";
import Link from "next/link";
import { useUserStore } from "@/lib/store"; // Importa el estado global
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfRenderer from "@/components/ui/globalrender/PdfRenderer";
import ImageRenderer from "@/components/ui/globalrender/ImageRenderer";
import WordRenderer from "@/components/ui/globalrender/WordRenderer";
import DownloadWordButton from "@/components/ui/globalrender/DownloadWordButton";
import { formatDateTime } from "@/app/utils/formatData";
import Swal from "sweetalert2";
import { formatUbicacionMap } from "@/app/utils/formatters";
interface Props {
  params: {
    id: string;
  };
}

const RiesgoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [riesgo, setRiesgo] = useState<any>(null);
  const router = useRouter();
  const privilege = useUserStore((state) => state.privilege); // Obtén el privilegio del usuario

  useEffect(() => {
    if (privilege === "B1") {
      router.push("/acceso-denegado");
    }
  }, [privilege, router]);

  useEffect(() => {
    const fetchRiesgo = async () => {
      const data = await getRiesgo(id);
      setRiesgo(data);
    };

    fetchRiesgo();
  }, [id]);

  const handleRemoveRiesgo = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este riesgo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      await deleteRiesgo(id);
      router.push("/portal/eventos/riesgos");
    }
  };

  if (!riesgo) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }
  const pdfUrl = (pdfKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/riesgos/uploads/${riesgo[pdfKey]}`;
  const imageUrl = (imageKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/riesgos/uploads/${riesgo[imageKey]}`;
  const wordUrl = (wordKey: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/riesgos/uploads/${riesgo[wordKey]}`;

  const cardContent = `
    Fecha y Hora: ${formatDateTime(riesgo.fechaHora)}
    Condición: ${riesgo.condicion}
    Establecimiento: ${riesgo.establecimiento}
    Ubicación en el Mapa: ${formatUbicacionMap(riesgo.ubicacionMap)}
    LPU: ${riesgo.lpu}
    Apellido: ${riesgo.apellido}
    Nombres: ${riesgo.nombres}
    Módulo - U.R.: ${riesgo.modulo_ur}
    Pabellón: ${riesgo.pabellon}
    Situación Procesal: ${riesgo.sitProc}
    Condena: ${riesgo.condena}
    Organización Criminal: ${riesgo.orgCrim}
    Nombre del GDO: ${riesgo.cualorg}
    Rol: ${riesgo.rol}
    Territorio: ${riesgo.territorio}
    Email: ${riesgo.email}
    Riesgo de Fuga: ${riesgo.riesgo_de_fuga}
    Riesgo de Conflicto: ${riesgo.riesgo_de_conf}
    Restricciones: ${riesgo.restricciones}
    Número de Causa: ${riesgo.numeroCausa}
    Observación: ${riesgo.observacion}
    Información Individual: ${riesgo.infInd}
    Allanamientos: ${riesgo.allanamientos}
    Secuestros: ${riesgo.secuestros}
    Atentados: ${riesgo.atentados}
    Electrodomésticos: ${riesgo.electrodomesticos}
    Fuerza: ${riesgo.fzaSeg}
    Detalles de delitos: ${riesgo.electrodomesticosDetalles}
    Sociedad: ${riesgo.sociedad}
    IM: ${riesgo.im}
    Sexo: ${riesgo.sexo}
    Enemistad: ${riesgo.enemistad}
    Reevaluación: ${riesgo.reeval}
    Internos Involucrados: ${riesgo.internosinvolucrado}
  `;

  const fileName = `${riesgo.establecimiento}_${riesgo.fechaHora}`.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  );
  const title = "Detalle de Eval. S.I.G.P.P.L.A.R.";

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Link className={buttonVariants()} href="/portal/eventos/riesgos">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p>
              <strong>Fecha y Hora:</strong> {formatDateTime(riesgo.fechaHora)}
            </p>
            <p>
              <strong>Condición:</strong> {riesgo.condicion}
            </p>
            <p>
              <strong>Establecimiento:</strong> {riesgo.establecimiento}
            </p>
            <p>
              <strong>Ubicación en el Mapa:</strong>{" "}
              {formatUbicacionMap(riesgo.ubicacionMap)}
            </p>
            <p>
              <strong>LPU:</strong> {riesgo.lpu}
            </p>
            <p>
              <strong>Apellido:</strong> {riesgo.apellido}
            </p>
            <p>
              <strong>Nombres:</strong> {riesgo.nombres}
            </p>
            <p>
              <strong>Módulo - U.R.:</strong> {riesgo.modulo_ur}
            </p>
            <p>
              <strong>Pabellón:</strong> {riesgo.pabellon}
            </p>
            <p>
              <strong>Situación Procesal:</strong> {riesgo.sitProc}
            </p>
            <p>
              <strong>Condena:</strong> {riesgo.condena}
            </p>
            <p>
              <strong>Organización Criminal:</strong> {riesgo.orgCrim}
            </p>
            <p>
              <strong>Nombre del GDO:</strong> {riesgo.cualorg}
            </p>
            <p>
              <strong>Rol:</strong> {riesgo.rol}
            </p>
            <p>
              <strong>Territorio:</strong> {riesgo.territorio}
            </p>
            <p>
              <strong>Email:</strong> {riesgo.email}
            </p>
            <p>
              <strong>Riesgo de Fuga:</strong> {riesgo.riesgo_de_fuga}
            </p>
            <p>
              <strong>Riesgo de Conflicto:</strong> {riesgo.riesgo_de_conf}
            </p>
            <p>
              <strong>Restricciones:</strong> {riesgo.restricciones}
            </p>
            <p>
              <strong>Número de Causa:</strong> {riesgo.numeroCausa}
            </p>
            <p>
              <strong>Observación:</strong> {riesgo.observacion}
            </p>
            <p>
              <strong>Información Individual:</strong> {riesgo.infInd}
            </p>
            <p>
              <strong>Allanamientos:</strong> {riesgo.allanamientos}
            </p>
            <p>
              <strong>Secuestros:</strong> {riesgo.secuestros}
            </p>
            <p>
              <strong>Atentados:</strong> {riesgo.atentados}
            </p>
            <p>
              <strong>Electrodomésticos:</strong> {riesgo.electrodomesticos}
            </p>
            <p>
              <strong>Fuerza:</strong> {riesgo.fzaSeg}
            </p>
            <p>
              <strong>Detalles de Delitos:</strong>{" "}
              {riesgo.electrodomesticosDetalles}
            </p>
            <p>
              <strong>Sociedad:</strong> {riesgo.sociedad}
            </p>
            <p>
              <strong>IM:</strong> {riesgo.im}
            </p>
            <p>
              <strong>Sexo:</strong> {riesgo.sexo}
            </p>
            <p>
              <strong>Enemistad:</strong> {riesgo.enemistad}
            </p>
            <p>
              <strong>Reevaluación:</strong> {riesgo.reeval}
            </p>
            <p>
              <strong className="text-lg">&quot;Internos involucrados:&quot;</strong>{" "}
              {riesgo.internosinvolucrado}
            </p>
          </div>

          <DownloadWordButton
            title={title}
            content={cardContent}
            fileName={fileName}
          />

          <div className="mt-6 space-y-4">
            {riesgo.pdf1 && (
              <PdfRenderer
                pdfKey="pdf1"
                pdfLabel="PDF1"
                pdfUrl={pdfUrl("pdf1")}
              />
            )}
            {riesgo.pdf2 && (
              <PdfRenderer
                pdfKey="pdf2"
                pdfLabel="PDF2"
                pdfUrl={pdfUrl("pdf2")}
              />
            )}
            {riesgo.pdf3 && (
              <PdfRenderer
                pdfKey="pdf3"
                pdfLabel="PDF3"
                pdfUrl={pdfUrl("pdf3")}
              />
            )}
            {riesgo.pdf4 && (
              <PdfRenderer
                pdfKey="pdf4"
                pdfLabel="PDF4"
                pdfUrl={pdfUrl("pdf4")}
              />
            )}
            {riesgo.pdf5 && (
              <PdfRenderer
                pdfKey="pdf5"
                pdfLabel="PDF5"
                pdfUrl={pdfUrl("pdf5")}
              />
            )}
            {riesgo.pdf6 && (
              <PdfRenderer
                pdfKey="pdf6"
                pdfLabel="PDF6"
                pdfUrl={pdfUrl("pdf6")}
              />
            )}
            {riesgo.pdf7 && (
              <PdfRenderer
                pdfKey="pdf7"
                pdfLabel="PDF7"
                pdfUrl={pdfUrl("pdf7")}
              />
            )}
            {riesgo.pdf8 && (
              <PdfRenderer
                pdfKey="pdf8"
                pdfLabel="PDF8"
                pdfUrl={pdfUrl("pdf8")}
              />
            )}
            {riesgo.pdf9 && (
              <PdfRenderer
                pdfKey="pdf9"
                pdfLabel="PDF9"
                pdfUrl={pdfUrl("pdf9")}
              />
            )}
            {riesgo.pdf10 && (
              <PdfRenderer
                pdfKey="pdf10"
                pdfLabel="PDF10"
                pdfUrl={pdfUrl("pdf10")}
              />
            )}

            {riesgo.imagen && (
              <ImageRenderer
                imageKey="imagen"
                imageLabel="Imagen"
                imageUrl={imageUrl("imagen")}
              />
            )}
            {riesgo.imagenDer && (
              <ImageRenderer
                imageKey="imagenDer"
                imageLabel="Imagen Der"
                imageUrl={imageUrl("imagenDer")}
              />
            )}
            {riesgo.imagenIz && (
              <ImageRenderer
                imageKey="imagenIz"
                imageLabel="Imagen Iz"
                imageUrl={imageUrl("imagenIz")}
              />
            )}
            {riesgo.imagenDact && (
              <ImageRenderer
                imageKey="imagenDact"
                imageLabel="Imagen Dact"
                imageUrl={imageUrl("imagenDact")}
              />
            )}
            {riesgo.imagenSen1 && (
              <ImageRenderer
                imageKey="imagenSen1"
                imageLabel="Imagen Sen1"
                imageUrl={imageUrl("imagenSen1")}
              />
            )}
            {riesgo.imagenSen2 && (
              <ImageRenderer
                imageKey="imagenSen2"
                imageLabel="Imagen Sen2"
                imageUrl={imageUrl("imagenSen2")}
              />
            )}
            {riesgo.imagenSen3 && (
              <ImageRenderer
                imageKey="imagenSen3"
                imageLabel="Imagen Sen3"
                imageUrl={imageUrl("imagenSen3")}
              />
            )}
            {riesgo.imagenSen4 && (
              <ImageRenderer
                imageKey="imagenSen4"
                imageLabel="Imagen Sen4"
                imageUrl={imageUrl("imagenSen4")}
              />
            )}
            {riesgo.imagenSen5 && (
              <ImageRenderer
                imageKey="imagenSen5"
                imageLabel="Imagen Sen5"
                imageUrl={imageUrl("imagenSen5")}
              />
            )}
            {riesgo.imagenSen6 && (
              <ImageRenderer
                imageKey="imagenSen6"
                imageLabel="Imagen Sen6"
                imageUrl={imageUrl("imagenSen6")}
              />
            )}

            {riesgo.word1 && (
              <WordRenderer
                wordKey="word1"
                wordLabel="Word1"
                wordUrl={wordUrl("word1")}
              />
            )}
          </div>

          <button
            className="mt-5 bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => handleRemoveRiesgo(id)}
          >
            Eliminar
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiesgoDetailPage;
