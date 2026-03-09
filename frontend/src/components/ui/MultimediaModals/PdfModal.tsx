//frontend\src\components\ui\MultimediaModals\PdfModal.tsx
import Collapse from "@/components/ui/Collapse";
import { PDF_FIELDS } from "@/app/utils/useFileFields";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string | null>;
  setFile: (field: string, value: string | null) => void;
  getFileUrl: (value: string) => string;
}

const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  files,
  setFile,
  getFileUrl,
}) => {
  const onPdfChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("multimedia", "PdfModal upload", { field });
        setFile(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 mt-0 !m-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-screen-lg max-h-screen-lg relative flex flex-col gap-4 overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 px-4 py-2 mb-5 bg-pink-500 text-white rounded-lg"
        >
          Cerrar
        </button>

        {PDF_FIELDS.map((field, index) => {
          const label = `PDF ${index + 1}`;
          const value = files[field];

          return (
            <div
              key={field}
              className="mt-4 w-full flex flex-col md:flex-row space-x-4 rounded-lg shadow-2xl my-4 py-4"
            >
              <input
                className="mt-2 w-1/2 py-1 ml-2"
                type="file"
                accept=".pdf"
                onChange={onPdfChange(field)}
              />
              {value && (
                <Collapse title={label}>
                  <div className="flex space-x-1">
                    <a href={getFileUrl(value)} target="_blank" rel="noopener noreferrer"></a>
                    <a href={getFileUrl(value)} target="_blank" rel="noopener noreferrer" download>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Descargar {label}
                      </button>
                    </a>
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

export default PdfModal;
