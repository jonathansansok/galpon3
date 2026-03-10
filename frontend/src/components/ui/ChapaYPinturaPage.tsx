//frontend\src\components\ui\ChapaYPinturaPage.tsx
import React, { useEffect, useState } from "react";
import ChapaTable from "./ChapaTable";
import PinturaTable from "./PinturaTable";
import { getPiezas } from "@/app/portal/eventos/piezas/Piezas.api";
import { Pieza } from "@/types/Pieza";

export default function ChapaYPinturaPage({
  onUpdateChapa,
  onUpdatePintura,
}: {
  onUpdateChapa: (costo: number, horas: number, diasPanos: number) => void;
  onUpdatePintura: (costo: number, horas: number, diasPanos: number) => void;
}) {
  const [piezasDB, setPiezasDB] = useState<Pieza[]>([]);

  const loadPiezas = async () => {
    try {
      const data = await getPiezas();
      setPiezasDB(data);
    } catch (error) {
      console.error("[ChapaYPintura] Error al cargar piezas:", error);
    }
  };

  useEffect(() => {
    loadPiezas();
  }, []);

  return (
    <div className="container mx-auto p-1">
      <h1 className="text-3xl font-bold mb-6">Chapa y Pintura</h1>
      <ChapaTable onUpdate={onUpdateChapa} piezasDB={piezasDB} onRefreshPiezas={loadPiezas} />
      <PinturaTable onUpdate={onUpdatePintura} piezasDB={piezasDB} onRefreshPiezas={loadPiezas} />
    </div>
  );
}