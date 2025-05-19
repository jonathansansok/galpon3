//frontend\src\components\ui\ChapaYPinturaPage.tsx
import React from "react";
import ChapaTable from "./ChapaTable";
import PinturaTable from "./PinturaTable";

export default function ChapaYPinturaPage({ onUpdate }: { onUpdate: (costo: number, horas: number) => void }) {
  return (
    <div className="container mx-auto p-1">
      <h1 className="text-3xl font-bold mb-6"> Chapa y Pintura</h1>
      <ChapaTable onUpdate={onUpdate} />
      <PinturaTable />
    </div>
  );
}