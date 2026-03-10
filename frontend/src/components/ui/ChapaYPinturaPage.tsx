//frontend\src\components\ui\ChapaYPinturaPage.tsx
import React, { useEffect, useState } from "react";
import ChapaTable, { ChapaRow } from "./ChapaTable";
import PinturaTable, { PinturaRow } from "./PinturaTable";
import { getPiezas } from "@/app/portal/eventos/piezas/Piezas.api";
import { getPartes } from "@/app/portal/eventos/partes/Partes.api";
import { Pieza } from "@/types/Pieza";
import { Parte } from "@/types/Parte";

export default function ChapaYPinturaPage({
  onChapaRowsChange,
  onPinturaRowsChange,
  initialChapaRows = [],
  initialPinturaRows = [],
}: {
  onChapaRowsChange: (rows: ChapaRow[]) => void;
  onPinturaRowsChange: (rows: PinturaRow[]) => void;
  initialChapaRows?: ChapaRow[];
  initialPinturaRows?: PinturaRow[];
}) {
  const [piezasDB, setPiezasDB] = useState<Pieza[]>([]);
  const [partesDB, setPartesDB] = useState<Parte[]>([]);

  const loadPiezas = async () => {
    try {
      const data = await getPiezas();
      setPiezasDB(data);
    } catch (error) {
      console.error("[ChapaYPintura] Error al cargar piezas:", error);
    }
  };

  const loadPartes = async () => {
    try {
      const data = await getPartes();
      setPartesDB(data);
    } catch (error) {
      console.error("[ChapaYPintura] Error al cargar partes:", error);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadPiezas(), loadPartes()]);
  };

  useEffect(() => {
    loadAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto p-1">
      <h1 className="text-3xl font-bold mb-6">Chapa y Pintura</h1>
      <ChapaTable onRowsChange={onChapaRowsChange} piezasDB={piezasDB} partesDB={partesDB} onRefreshPiezas={loadAll} initialRows={initialChapaRows} />
      <PinturaTable onRowsChange={onPinturaRowsChange} piezasDB={piezasDB} partesDB={partesDB} onRefreshPiezas={loadAll} initialRows={initialPinturaRows} />
    </div>
  );
}
