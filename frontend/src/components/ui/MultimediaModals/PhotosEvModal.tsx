import { useState } from "react";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/Collapse";
import Image from "next/image";
import { IMAGE_FIELDS } from "@/app/utils/useFileFields";

const IMAGE_LABELS = [
  "Fotografía 1",
  "Fotografía 2",
  "Fotografía 3",
  "Fotografía 4",
  "Fotografía 5",
  "Fotografía 6",
  "Fotografía 7",
  "Fotografía 8",
  "Fotografía 9",
  "Fotografía 10",
];

interface PhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string | null>;
  setFile: (field: string, value: string | null) => void;
  getFileUrl: (value: string) => string;
}

const PhotosEvModal: React.FC<PhotosModalProps> = ({
  isOpen,
  onClose,
  files,
  setFile,
  getFileUrl,
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
                    <h2 className="text-xl font-semibold mb-4">Subir Imagen</h2>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            console.log("multimedia", "PhotosEvModal upload", { field });
                            setFile(field, reader.result as string);
                            setOpenUpload(null);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setOpenUpload(null)}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              <Collapse title={`Ver ${label}`}>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotosEvModal;
