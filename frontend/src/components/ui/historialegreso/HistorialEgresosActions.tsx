import React from "react";

interface HistorialEgresosActionsProps {
  onExportToExcel: () => void;
  onExportToWord: () => void;
}

const HistorialEgresosActions: React.FC<HistorialEgresosActionsProps> = ({
  onExportToExcel,
  onExportToWord,
}) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={onExportToExcel}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
        type="button"
      >
        Exportar a Excel
      </button>
      <button
        onClick={onExportToWord}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        type="button"
      >
        Exportar a Word
      </button>
    </div>
  );
};

export default HistorialEgresosActions;