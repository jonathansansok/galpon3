//frontend\src\components\ui\ChapaYPinturaPage.tsx
import React, { useState } from "react";
import ChapaTable from "./ChapaTable";
import PinturaTable from "./PinturaTable";

interface ChapaRow {
  id: number;
  parte: string;
  piezas: string;
  especificacion: string;
  horas: number;
  costo: number;
}

export default function ChapaYPinturaPage({
  onUpdateChapa,
  onUpdatePintura,
}: {
  onUpdateChapa: (costo: number, horas: number, diasPanos: number) => void;
  onUpdatePintura: (costo: number, horas: number, diasPanos: number) => void;
}) {
  const [chapaRows, setChapaRows] = useState<ChapaRow[]>([]); // Estado para las filas de ChapaTable

  const handleUpdateChapa = (rows: ChapaRow[]) => {
    setChapaRows(rows); // Actualizar las filas de ChapaTable
  };

  return (
    <div className="container mx-auto p-1">
      <h1 className="text-3xl font-bold mb-6">Chapa y Pintura</h1>
      {/* Tabla de Chapa */}
      <ChapaTable
        onUpdate={(costo, horas, diasPanos) => {
          onUpdateChapa(costo, horas, diasPanos); // Actualizar los datos de Chapa
        }}
        onRowsUpdate={(rows: ChapaRow[]) => {
          handleUpdateChapa(rows); // Actualizar las filas de ChapaTable
        }}
      />
      {/* Tabla de Pintura */}
      <PinturaTable
        chapaRows={chapaRows} // Pasar las filas de ChapaTable a PinturaTable
        onUpdate={(costo, horas, diasPanos) => {
          onUpdatePintura(costo, horas, diasPanos); // Actualizar los datos de Pintura
        }}
      />
    </div>
  );
}