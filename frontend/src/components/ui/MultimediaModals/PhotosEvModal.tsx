import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileImageCropper from "@/components/ui/ProfileImageCropper";
import Collapse from "@/components/ui/Collapse";
import Image from "next/image";

interface PhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagen: string | null;
  setImagen: (imagen: string | null) => void;
  imagenDer: string | null;
  setImagenDer: (imagenDer: string | null) => void;
  imagenIz: string | null;
  setImagenIz: (imagenIz: string | null) => void;
  imagenDact: string | null;
  setImagenDact: (imagenDact: string | null) => void;
  imagenSen1: string | null;
  setImagenSen1: (imagenSen1: string | null) => void;
  imagenSen2: string | null;
  setImagenSen2: (imagenSen2: string | null) => void;
  imagenSen3: string | null;
  setImagenSen3: (imagenSen3: string | null) => void;
  imagenSen4: string | null;
  setImagenSen4: (imagenSen4: string | null) => void;
  imagenSen5: string | null;
  setImagenSen5: (imagenSen5: string | null) => void;
  imagenSen6: string | null;
  setImagenSen6: (imagenSen6: string | null) => void;
  getImageUrl: (imagePath: string) => string;
  generateFileName: (type: string) => string;
}

const PhotosEvModal: React.FC<PhotosModalProps> = ({
  isOpen,
  onClose,
  imagen,
  setImagen,
  imagenDer,
  setImagenDer,
  imagenIz,
  setImagenIz,
  imagenDact,
  setImagenDact,
  imagenSen1,
  setImagenSen1,
  imagenSen2,
  setImagenSen2,
  imagenSen3,
  setImagenSen3,
  imagenSen4,
  setImagenSen4,
  imagenSen5,
  setImagenSen5,
  imagenSen6,
  setImagenSen6,
  getImageUrl,
  generateFileName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDer, setIsModalOpenDer] = useState(false);
  const [isModalOpenIz, setIsModalOpenIz] = useState(false);
  const [isModalOpenDact, setIsModalOpenDact] = useState(false);
  const [isModalOpenSen1, setIsModalOpenSen1] = useState(false);
  const [isModalOpenSen2, setIsModalOpenSen2] = useState(false);
  const [isModalOpenSen3, setIsModalOpenSen3] = useState(false);
  const [isModalOpenSen4, setIsModalOpenSen4] = useState(false);
  const [isModalOpenSen5, setIsModalOpenSen5] = useState(false);
  const [isModalOpenSen6, setIsModalOpenSen6] = useState(false);

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

        {/* Fotografía rostro */}
{/* Fotografía rostro */}
<div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
  <Button
    type="button"
    onClick={() => setIsModalOpen(true)}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
  >
    Editar Fotografía 1
  </Button>
  {isModalOpen && (
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
                setImagen(reader.result as string);
                setIsModalOpen(false);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  )}

  <Collapse title="Ver fotografía 1">
    {imagen && (
      <div className="mt-4">
        {imagen.startsWith("data:") ? (
          <Image
            src={imagen}
            alt="Imagen rostro"
            className="rounded-lg"
            width={350}
            height={350}
            quality={100} // Asegura la mejor calidad posible
          />
        ) : (
          <>
            <a
              href={getImageUrl(imagen)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={getImageUrl(imagen)}
                alt="Imagen rostro"
                className="rounded-lg"
                width={350}
                height={350}
                quality={100} // Asegura la mejor calidad posible
              />
            </a>
            <a
              href={getImageUrl(imagen)}
              download={generateFileName("rostro")}
            >
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Descargar fotografía 1
              </button>
            </a>
          </>
        )}
      </div>
    )}
  </Collapse>
</div>

{/* Fotografía perfil derecho */}
<div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
  <Button
    type="button"
    onClick={() => setIsModalOpenDer(true)}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
  >
    Editar Fotografía 2
  </Button>
  {isModalOpenDer && (
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
                setImagenDer(reader.result as string);
                setIsModalOpenDer(false);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          type="button"
          onClick={() => setIsModalOpenDer(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  )}

  <Collapse title="Ver Fotografía 2">
    {imagenDer && (
      <div className="mt-4">
        {imagenDer.startsWith("data:") ? (
          <Image
            src={imagenDer}
            alt="Imagen perfil derecho"
            className="rounded-lg"
            width={350}
            height={350}
            quality={100} // Asegura la mejor calidad posible
          />
        ) : (
          <>
            <a
              href={getImageUrl(imagenDer)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={getImageUrl(imagenDer)}
                alt="Imagen perfil derecho"
                className="rounded-lg"
                width={350}
                height={350}
                quality={100} // Asegura la mejor calidad posible
              />
            </a>
            <a
              href={getImageUrl(imagenDer)}
              download={generateFileName("derecha")}
            >
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Descargar fotografía 2
              </button>
            </a>
          </>
        )}
      </div>
    )}
  </Collapse>
</div>

{/* Fotografía perfil izquierdo */}
<div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
  <Button
    type="button"
    onClick={() => setIsModalOpenIz(true)}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
  >
    Editar Fotografía 3
  </Button>
  {isModalOpenIz && (
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
                setImagenIz(reader.result as string);
                setIsModalOpenIz(false);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          type="button"
          onClick={() => setIsModalOpenIz(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  )}

  <Collapse title="Ver Fotografía 3">
    {imagenIz && (
      <div className="mt-4">
        {imagenIz.startsWith("data:") ? (
          <Image
            src={imagenIz}
            alt="Imagen perfil izquierdo"
            className="rounded-lg"
            width={350}
            height={350}
            quality={100} // Asegura la mejor calidad posible
          />
        ) : (
          <>
            <a
              href={getImageUrl(imagenIz)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={getImageUrl(imagenIz)}
                alt="Imagen perfil izquierdo"
                className="rounded-lg"
                width={350}
                height={350}
                quality={100} // Asegura la mejor calidad posible
              />
            </a>
            <a
              href={getImageUrl(imagenIz)}
              download={generateFileName("izquierda")}
            >
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Descargar fotografía 3 
              </button>
            </a>
          </>
        )}
      </div>
    )}
  </Collapse>
</div>

        {/* Fotografía dactilar */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenDact(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar Fotografia 4
          </Button>
          {isModalOpenDact && (
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
                        setImagenDact(reader.result as string);
                        setIsModalOpenDact(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenDact(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 4">
            {imagenDact && (
              <div className="mt-4">
                {imagenDact.startsWith("data:") ? (
                  <Image
                    src={imagenDact}
                    alt="Imagen dactilar recortada"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenDact)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenDact)}
                        alt="Imagen dactilar recortada"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenDact)}
                      download={generateFileName("dactilar")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>

        {/* Fotos de señas part.-tatuajes 1 */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenSen1(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar fotografía 5
          </Button>
          {isModalOpenSen1 && (
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
                        setImagenSen1(reader.result as string);
                        setIsModalOpenSen1(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenSen1(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 5">
            {imagenSen1 && (
              <div className="mt-4">
                {imagenSen1.startsWith("data:") ? (
                  <Image
                    src={imagenSen1}
                    alt="Imagen señas 1"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenSen1)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenSen1)}
                        alt="Imagen señas 1"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenSen1)}
                      download={generateFileName("señas1")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>

        {/* Fotos de señas part.-tatuajes 2 */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenSen2(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar fotografía 6
          </Button>
          {isModalOpenSen2 && (
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
                        setImagenSen2(reader.result as string);
                        setIsModalOpenSen2(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenSen2(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 6">
            {imagenSen2 && (
              <div className="mt-4">
                {imagenSen2.startsWith("data:") ? (
                  <Image
                    src={imagenSen2}
                    alt="Imagen señas 2"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenSen2)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenSen2)}
                        alt="Imagen señas 2"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenSen2)}
                      download={generateFileName("señas2")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>
        {/* Fotos de señas part.-tatuajes 3 */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenSen3(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar fotografía 7
          </Button>
          {isModalOpenSen3 && (
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
                        setImagenSen3(reader.result as string);
                        setIsModalOpenSen3(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenSen3(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 7">
            {imagenSen3 && (
              <div className="mt-4">
                {imagenSen3.startsWith("data:") ? (
                  <Image
                    src={imagenSen3}
                    alt="Imagen señas 3"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenSen3)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenSen3)}
                        alt="Imagen señas 3"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenSen3)}
                      download={generateFileName("señas3")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>

        {/* Fotos de señas part.-tatuajes 4 */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenSen4(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar fotografía 8
          </Button>
          {isModalOpenSen4 && (
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
                        setImagenSen4(reader.result as string);
                        setIsModalOpenSen4(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenSen4(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 8">
            {imagenSen4 && (
              <div className="mt-4">
                {imagenSen4.startsWith("data:") ? (
                  <Image
                    src={imagenSen4}
                    alt="Imagen señas 4"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenSen4)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenSen4)}
                        alt="Imagen señas 4"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenSen4)}
                      download={generateFileName("señas4")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>
        {/* Fotos de señas part.-tatuajes 5 */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenSen5(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar fotografía 9
          </Button>
          {isModalOpenSen5 && (
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
                        setImagenSen5(reader.result as string);
                        setIsModalOpenSen5(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenSen5(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 9">
            {imagenSen5 && (
              <div className="mt-4">
                {imagenSen5.startsWith("data:") ? (
                  <Image
                    src={imagenSen5}
                    alt="Imagen señas 5"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenSen5)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenSen5)}
                        alt="Imagen señas 5"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenSen5)}
                      download={generateFileName("señas5")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>

        {/* Fotos de señas part.-tatuajes 6 */}
        <div className="mt-4 flex-1 min-w-full sm:min-w-0 sm:w-full">
          <Button
            type="button"
            onClick={() => setIsModalOpenSen6(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mb-2"
          >
            Editar fotografía 10
          </Button>
          {isModalOpenSen6 && (
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
                        setImagenSen6(reader.result as string);
                        setIsModalOpenSen6(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpenSen6(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <Collapse title="Ver Fotografía 10">
            {imagenSen6 && (
              <div className="mt-4">
                {imagenSen6.startsWith("data:") ? (
                  <Image
                    src={imagenSen6}
                    alt="Imagen señas 6"
                    className="rounded-lg"
                    width={350}
                    height={350}
                    quality={100} // Asegura la mejor calidad posible
                  />
                ) : (
                  <>
                    <a
                      href={getImageUrl(imagenSen6)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={getImageUrl(imagenSen6)}
                        alt="Imagen señas 6"
                        className="rounded-lg"
                        width={350}
                        height={350}
                        quality={100} // Asegura la mejor calidad posible
                      />
                    </a>
                    <a
                      href={getImageUrl(imagenSen6)}
                      download={generateFileName("señas6")}
                    >
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar Fotografía
                      </button>
                    </a>
                  </>
                )}
              </div>
            )}
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default PhotosEvModal;
