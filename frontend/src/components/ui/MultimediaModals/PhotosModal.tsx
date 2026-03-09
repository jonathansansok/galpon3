//frontend\src\components\ui\MultimediaModals\PhotosModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileImageCropper from "@/components/ui/ProfileImageCropper";
import Collapse from "@/components/ui/Collapse";
import Image from "next/image";
import { IMAGE_FIELDS } from "@/app/utils/useFileFields";

const IMAGE_LABELS = [
  "Fotografía rostro",
  "Fotografía perfil derecho",
  "Fotografía perfil izquierdo",
  "Fotografía dactilar",
  "Fotografía señas 1",
  "Fotografía señas 2",
  "Fotografía señas 3",
  "Fotografía señas 4",
  "Fotografía señas 5",
  "Fotografía señas 6",
];

// First 4 images use ProfileImageCropper, rest use simple file input
const CROPPER_FIELDS = new Set(IMAGE_FIELDS.slice(0, 4));

interface PhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string | null>;
  setFile: (field: string, value: string | null) => void;
  getFileUrl: (value: string) => string;
  imagenesHistorial?: { [key: string]: string[] };
}

const PhotosModal: React.FC<PhotosModalProps> = ({
  isOpen,
  onClose,
  files,
  setFile,
  getFileUrl,
  imagenesHistorial = {},
}) => {
  const [openUpload, setOpenUpload] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 mt-0 !m-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-screen-lg max-h-screen-lg relative grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          Cerrar
        </button>

        {IMAGE_FIELDS.map((field, index) => {
          const label = IMAGE_LABELS[index];
          const value = files[field];
          const useCropper = CROPPER_FIELDS.has(field);
          const historial = imagenesHistorial[field] || [];

          return (
            <div key={field} className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
              <Button
                type="button"
                onClick={() => setOpenUpload(field)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
              >
                Editar {label}
              </Button>

              {openUpload === field && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-0 !m-0">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-100">
                    {useCropper ? (
                      <>
                        <h2 className="text-xl font-semibold mb-4">Recortar Imagen</h2>
                        <ProfileImageCropper
                          onImageCropped={(croppedImage: string) => {
                            console.log("multimedia", "PhotosModal crop", { field });
                            setFile(field, croppedImage);
                            setOpenUpload(null);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold mb-4">Subir Imagen</h2>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                console.log("multimedia", "PhotosModal upload", { field });
                                setFile(field, reader.result as string);
                                setOpenUpload(null);
                              };
                              reader.readAsDataURL(f);
                            }
                          }}
                        />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpenUpload(null)}
                      className="mt-4 mr-7 px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              <Collapse title={`Ver ${label}`} isOpenByDefault={!!value}>
                {value && (
                  <div className="mt-4">
                    {value.startsWith("data:") ? (
                      <Image
                        src={value}
                        alt={label}
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100}
                      />
                    ) : (
                      <>
                        <a
                          href={getFileUrl(value)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={getFileUrl(value)}
                            alt={label}
                            className="rounded-lg"
                            width={350}
                            height={350}
                            quality={100}
                          />
                        </a>
                        <a
                          href={getFileUrl(value)}
                          download={`Documento_${label.replace(/\s+/g, "_")}.png`}
                        >
                          <button
                            type="button"
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            Descargar {label}
                          </button>
                        </a>
                      </>
                    )}
                  </div>
                )}
              </Collapse>

              {historial.length > 0 && (
                <Collapse title={`Historial ${label}`}>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {historial.map((img, i) => (
                      <Image
                        key={i}
                        src={getFileUrl(img)}
                        alt={`${label} historial ${i + 1}`}
                        className="rounded-lg"
                        width={150}
                        height={150}
                        quality={80}
                      />
                    ))}
                  </div>
                </Collapse>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotosModal;
