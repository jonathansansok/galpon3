//frontend\src\components\InternoId\ImageUniqueModal.tsx
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import { generateWord,  } from "@/app/utils/generateWord"; // Importa la función para generar el archivo Word
import Swal from "sweetalert2"; // Importa SweetAlert
import { useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  closeModal: () => void;
  images: { src: string; title: string }[];
  words: { src: string; title: string }[];
  pdfs: { src: string; title: string }[];
  downloadImage: (url: string) => void;
  interno: { nombre: string; apellido: string; lpu: string };
  ingreso: any;
}

const ImageModal = ({
  isOpen,
  closeModal,
  images,
  words,
  pdfs,
  downloadImage,
  interno,
  ingreso,
}: ImageModalProps) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  if (!isOpen) return null;

  const downloadAllImages = async () => {
    let hasImages = false;

    for (const image of images) {
      const response = await fetch(image.src);
      const blob = await response.blob();
      if (blob.size > 84) { // Verificar que el tamaño del blob sea mayor a 84 bytes
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${interno.apellido}_${interno.nombre}_${interno.lpu}_${image.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        hasImages = true;
      }
    }

    if (!hasImages) {
      Swal.fire({
        icon: 'info',
        title: 'No hay imágenes disponibles',
        text: 'No hay imágenes disponibles para descargar.',
      });
    }
  };

  const downloadAllImagesAsZip = async () => {
    const zip = new JSZip();
    let hasFiles = false;

    for (const image of images) {
      const response = await fetch(image.src);
      const blob = await response.blob();
      if (blob.size > 84) { // Verificar que el tamaño del blob sea mayor a 84 bytes
        zip.file(
          `${interno.apellido}_${interno.nombre}_${interno.lpu}_${image.title}.jpg`,
          blob
        );
        hasFiles = true;
      }
    }

    for (const pdf of pdfs) {
      const response = await fetch(pdf.src);
      const blob = await response.blob();
      if (blob.size > 84) { // Verificar que el tamaño del blob sea mayor a 84 bytes
        zip.file(
          `${interno.apellido}_${interno.nombre}_${interno.lpu}_${pdf.title}.pdf`,
          blob
        );
        hasFiles = true;
      }
    }

    for (const word of words) {
      const response = await fetch(word.src);
      const blob = await response.blob();
      if (blob.size > 84) { // Verificar que el tamaño del blob sea mayor a 84 bytes
        zip.file(
          `${interno.apellido}_${interno.nombre}_${interno.lpu}_${word.title}.docx`,
          blob
        );
        hasFiles = true;
      }
    }

    // Generar el archivo Word estilizado
    const wordBlob = await generateWord(ingreso, interno, ingreso.historialEgresos || []);
    if (wordBlob.size > 84) { // Verificar que el tamaño del blob sea mayor a 84 bytes
      zip.file(
        `${interno.apellido}_${interno.nombre}_${interno.lpu}_Perfil.docx`,
        wordBlob
      );
      hasFiles = true;
    }

    if (hasFiles) {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(
        content,
        `${interno.apellido}_${interno.nombre}_${interno.lpu}.zip`
      );
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No hay archivos disponibles',
        text: 'No hay archivos disponibles para descargar.',
      });
    }
  };

  const downloadAllPdfs = async () => {
    const zip = new JSZip();
    let hasFiles = false;

    for (const pdf of pdfs) {
      const response = await fetch(pdf.src);
      const blob = await response.blob();
      if (blob.size > 84) { // Verificar que el tamaño del blob sea mayor a 84 bytes
        zip.file(
          `${interno.apellido}_${interno.nombre}_${interno.lpu}_${pdf.title}.pdf`,
          blob
        );
        hasFiles = true;
      }
    }

    if (hasFiles) {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(
        content,
        `${interno.apellido}_${interno.nombre}_${interno.lpu}_PDFs.zip`
      );
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No hay PDFs disponibles',
        text: 'No hay PDFs disponibles para descargar.',
      });
    }
  };

  const downloadWord = async () => {
    const wordBlob = await generateWord(ingreso, interno, ingreso.historialEgresos || []);
    saveAs(wordBlob, `${interno.apellido}_${interno.nombre}_${interno.lpu}_Perfil.docx`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur"
        onClick={closeModal}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-11/12 md:w-3/4 lg:w-1/2 h-auto max-h-[90vh] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="mt-4 mb-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            onClick={closeModal}
          >
            Cerrar
          </button>
          <button
            className="mt-4 mb-4 bg-blue-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            onClick={downloadAllImagesAsZip}
          >
            Descargar todo cómo ZIP
          </button>
          <button
            className="mt-4 mb-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
            onClick={downloadAllImages}
          >
            Descargar todas las fotografías
          </button>
          <button
            className="mt-4 mb-4 bg-green-400 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300"
            onClick={() => setIsPhotoModalOpen(true)}
          >
            Ver Fotografías
          </button>
          <button
            className="mt-4 mb-4 bg-red-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            onClick={downloadAllPdfs}
          >
            Descargar PDFs
          </button>
          <button
            className="mt-4 mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            onClick={downloadWord}
          >
            Descargar Word
          </button>
        </div>

        {isPhotoModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur"
              onClick={() => setIsPhotoModalOpen(false)}
            ></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-11/12 md:w-3/4 lg:w-1/2 h-auto max-h-[90vh] overflow-auto">
              <button
                className="mt-4 mb-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                onClick={() => setIsPhotoModalOpen(false)}
              >
                Cerrar
              </button>
              <div className="flex flex-wrap gap-4 mt-4">
                {images.filter((image) => image.src).length > 0 ? (
                  images
                    .filter((image) => image.src)
                    .map((image, index) => (
                      <div key={index} className="w-full md:w-1/3">
                        <h3 className="text-center font-bold">{image.title}</h3>
                        <Image
                          src={image.src}
                          alt={image.title}
                          layout="responsive"
                          width={600}
                          height={600}
                          className="rounded-lg object-cover"
                        />
                        <button
                          onClick={() => downloadImage(image.src)}
                          className="block mt-2 text-center text-blue-500 hover:underline"
                        >
                          Descargar
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-center w-full">Sin respectiva foto</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;