// components/ui/WordRenderer.tsx
"use client";
import { saveAs } from 'file-saver';

interface WordRendererProps {
  wordKey: string;
  wordLabel: string;
  wordUrl: string;
}

const WordRenderer: React.FC<WordRendererProps> = ({ wordKey, wordLabel, wordUrl }) => {
  const handleDownload = () => {
    saveAs(wordUrl, wordLabel);
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={handleDownload}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Descargar {wordLabel}
      </button>
    </div>
  );
};

export default WordRenderer;