//frontend\src\app\portal\eventos\ingresos\[id]\page.tsx
"use client";
import { useEffect, useState } from "react";
import { getIngreso } from "../ingresos.api";
import ImageModal from "@/components/InternoId/ImageUniqueModal";
import IngresoInfo from "@/components/InternoId/FichaTecnicaYFoto";
import RelatedDataAccordion from "@/components/IngresoRelated/RelatedDataAccordion";
import { getUploadUrl } from "@/app/utils/multimediaUrl";

interface Props {
  params: {
    id: string;
  };
}

const ProductDetailPage = ({ params }: Props) => {
  const { id } = params;
  const [ingreso, setIngreso] = useState<any>(null);
  const [showAllFields, setShowAllFields] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchIngreso = async () => {
      const data = await getIngreso(id);
      setIngreso(data);
    };

    fetchIngreso();
  }, [id]);

  const toggleFields = () => {
    setShowAllFields(!showAllFields);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  if (!ingreso) {
    return <div>Cargando...</div>;
  }

  console.log("multimedia", "detailPage render", { module: "ingresos", id });

  const words = [
    {
      src: getUploadUrl("ingresos", ingreso.word1),
      title: "Word 1",
    },
  ].filter((x): x is { src: string; title: string } => x.src !== null);

  const pdfs = [
    {
      src: getUploadUrl("ingresos", ingreso.pdf1),
      title: "PDF 1",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf2),
      title: "PDF 2",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf3),
      title: "PDF 3",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf4),
      title: "PDF 4",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf5),
      title: "PDF 5",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf6),
      title: "PDF 6",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf7),
      title: "PDF 7",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf8),
      title: "PDF 8",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf9),
      title: "PDF 9",
    },
    {
      src: getUploadUrl("ingresos", ingreso.pdf10),
      title: "PDF 10",
    },
  ].filter((x): x is { src: string; title: string } => x.src !== null);

  const images = [
    {
      src: getUploadUrl("ingresos", ingreso.imagen),
      title: "Imagen frontal",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenDer),
      title: "Imagen derecha del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenIz),
      title: "Imagen izquierda del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenDact),
      title: "Imagen dactilar del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenSen1),
      title: "Imagen seña 1 del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenSen2),
      title: "Imagen seña 2 del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenSen3),
      title: "Imagen seña 3 del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenSen4),
      title: "Imagen seña 4 del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenSen5),
      title: "Imagen seña 5 del ingreso",
    },
    {
      src: getUploadUrl("ingresos", ingreso.imagenSen6),
      title: "Imagen seña 6 del ingreso",
    },
  ].filter((x): x is { src: string; title: string } => x.src !== null);

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <IngresoInfo
        ingreso={ingreso}
        showAllFields={showAllFields}
        toggleFields={toggleFields}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 self-start"
        onClick={openModal}
      >
        Ver y descargar fotografías, PDFs, Word de ingreso y Ficha Técnica.
      </button>
      <ImageModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        words={words}
        pdfs={pdfs}
        images={images}
        downloadImage={downloadImage}
        interno={{
          nombre: ingreso.nombres,
          apellido: ingreso.apellido,
          lpu: ingreso.lpu,
        }}
        ingreso={ingreso}
      />
      <RelatedDataAccordion ingresoId={id} />
    </div>
  );
};

export default ProductDetailPage;
