// components/ui/DownloadWordButton.tsx
"use client";
import { generateWord2 } from "@/app/utils/generateWord2";
import { saveAs } from 'file-saver';

interface DownloadWordButtonProps {
  title: string;
  content: string;
  fileName: string;
}

const DownloadWordButton: React.FC<DownloadWordButtonProps> = ({ title, content, fileName }) => {
  const handleDownload = async () => {
    const blob = await generateWord2(title, content);
    saveAs(blob, `${fileName}.docx`);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Descargar en Word
    </button>
  );
};

export default DownloadWordButton;