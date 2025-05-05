
'use client';
import React, { useState, useRef, useEffect } from "react";
import Cropper from "react-cropper"; // Importa el componente Cropper
import "cropperjs/dist/cropper.css";

interface ProfileImageCropperProps {
  onImageCropped: (croppedImage: string) => void;
}

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({
  onImageCropped,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const cropperRef = useRef<any>(null); // Ref para acceder al Cropper

  useEffect(() => {
    if (cropperRef.current) {
      // Asegúrate de que el Cropper esté inicializado
    }
  }, [cropperRef]); // Monitorear el ref para ver si se inicializa

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && cropper.getCroppedCanvas) {
      const croppedCanvas = cropper.getCroppedCanvas({
        maxWidth: 4096, // Ajusta el tamaño máximo según sea necesario
        maxHeight: 4096, // Ajusta el tamaño máximo según sea necesario
        imageSmoothingQuality: 'high', // Asegura la mejor calidad de suavizado
      });
      if (croppedCanvas) {
        const croppedImageData = croppedCanvas.toDataURL('image/jpeg', 1.0); // Ajusta el formato y la calidad
        onImageCropped(croppedImageData);
      } else {
        console.error("No se pudo obtener el canvas recortado");
      }
    } else {
      console.error("Cropper no está inicializado o getCroppedCanvas no está disponible");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onImageChange} />
      {image && (
        <div>
          <Cropper
            ref={cropperRef}
            src={image}
            style={{ height: 400, width: "100%" }}
            aspectRatio={1}
            guides={false}
            viewMode={1}
          />
          <button
            type="button"
            onClick={getCroppedImage}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Recortar Imagen
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageCropper;