
//frontend\src\components\ui\globalrender\ImageRenderer.tsx
"use client";
import { useState } from 'react';
import Image from 'next/image';
import { saveAs } from 'file-saver';

interface ImageRendererProps {
  imageKey: string;
  imageLabel: string;
  imageUrl: string;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ imageKey, imageLabel, imageUrl }) => {
  const [visibleImage, setVisibleImage] = useState<string | null>(null);

  const handleDownload = () => {
    saveAs(imageUrl, imageLabel);
  };

  return (
    <>
      <button
        onClick={() => setVisibleImage(visibleImage === imageKey ? null : imageKey)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg my-2 mr-2"
      >
        {visibleImage === imageKey ? `Ocultar ${imageLabel}` : `Mostrar ${imageLabel}`}
      </button>
      {visibleImage === imageKey && (
        <div className="mb-4">
          <Image
            src={imageUrl}
            alt={imageLabel}
            width={500}
            height={500}
            className="rounded-lg"
          />
          <button
            type="button"
            onClick={handleDownload}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Descargar {imageLabel}
          </button>
        </div>
      )}
    </>
  );
};

export default ImageRenderer;