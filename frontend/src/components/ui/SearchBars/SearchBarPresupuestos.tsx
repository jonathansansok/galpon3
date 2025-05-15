//frontend\src\components\ui\SearchBars\SearchBarPresupuestos.tsx
"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { InputFieldSimple } from "@/components/ui/inputs/InputFieldSimple";

interface SearchBarPresupuestosProps {
  onSearch: (queries: {
    generalQuery: string;
    monto: string;
    estado: string;
    observaciones: string;
    movilId: string;
    patente: string;
  }) => void;
}

export function SearchBarPresupuestos({ onSearch }: SearchBarPresupuestosProps) {
  const [generalQuery, setGeneralQuery] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [movilId, setMovilId] = useState("");
  const [patente, setPatente] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Evitar que se ingresen llaves o corchetes
      if (/[{}\[\]]/.test(value)) {
        Alert.error({
          title: "Caracter no permitido",
          text: "No se permiten llaves ni corchetes en la búsqueda.",
        });
        return;
      }
      setter(value);
    };

  const handleSearchClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir el envío del formulario

    if (
      generalQuery.length < 3 &&
      monto.length < 3 &&
      estado.length < 3 &&
      observaciones.length < 3 &&
      movilId.length < 3 &&
      patente.length < 3
    ) {
      Alert.warning({
        title: "Búsqueda demasiado corta",
        text: "Por favor, ingrese al menos tres caracteres en alguno de los campos para buscar.",
      });
      return;
    }

    const searchParams = {
      generalQuery,
      monto,
      estado,
      observaciones,
      movilId,
      patente,
    };
    console.log("Parámetros de búsqueda enviados:", searchParams);

    setLoading(true);
    await onSearch(searchParams);
    setLoading(false);
  };

  return (
    <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1200px]">
      <InputFieldSimple
        value={generalQuery}
        onChange={handleInputChange(setGeneralQuery)}
        name="generalQuery"
        label="Búsqueda general"
        placeholder=""
      />
      <InputFieldSimple
        value={monto}
        onChange={handleInputChange(setMonto)}
        name="monto"
        label="Buscar por Monto"
        placeholder=""
      />
      <InputFieldSimple
        value={estado}
        onChange={handleInputChange(setEstado)}
        name="estado"
        label="Buscar por Estado"
        placeholder=""
      />
      <InputFieldSimple
        value={observaciones}
        onChange={handleInputChange(setObservaciones)}
        name="observaciones"
        label="Buscar por Observaciones"
        placeholder=""
      />
      <InputFieldSimple
        value={movilId}
        onChange={handleInputChange(setMovilId)}
        name="movilId"
        label="Buscar por ID del Móvil"
        placeholder=""
      />
      <InputFieldSimple
        value={patente}
        onChange={handleInputChange(setPatente)}
        name="patente"
        label="Buscar por Patente"
        placeholder=""
      />
      <div className="md:col-span-3 flex justify-start">
        <button
          onClick={handleSearchClick}
          className={`mt-2 px-4 py-2 rounded-lg ${
            loading ? "bg-green-500" : "bg-blue-500"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </div>
  );
}