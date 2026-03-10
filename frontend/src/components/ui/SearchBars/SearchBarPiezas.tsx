"use client";

import { useState, useEffect, useRef } from "react";
import { Alert } from "@/components/ui/alert";
import { InputFieldSimple } from "@/components/ui/inputs/InputFieldSimple";

const STORAGE_KEY = "searchBar_piezas";

interface SearchBarPiezasProps {
  onSearch: (queries: {
    generalQuery: string;
    nombre: string;
    medida: string;
  }) => void;
}

export function SearchBarPiezas({ onSearch }: SearchBarPiezasProps) {
  const [generalQuery, setGeneralQuery] = useState("");
  const [nombre, setNombre] = useState("");
  const [medida, setMedida] = useState("");
  const [loading, setLoading] = useState(false);
  const hasRestoredRef = useRef(false);

  // Restaurar filtros de sessionStorage al montar
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.generalQuery) setGeneralQuery(parsed.generalQuery);
        if (parsed.nombre) setNombre(parsed.nombre);
        if (parsed.medida) setMedida(parsed.medida);
      }
    } catch (e) {
      // Ignorar errores de sessionStorage
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
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
    e.preventDefault();

    if (
      generalQuery.length < 3 &&
      nombre.length < 3 &&
      medida.length < 3
    ) {
      Alert.warning({
        title: "Búsqueda demasiado corta",
        text: "Por favor, ingrese al menos tres caracteres en alguno de los campos para buscar.",
      });
      return;
    }

    const searchParams = {
      generalQuery,
      nombre,
      medida,
    };

    // Guardar en sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchParams));

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
        value={nombre}
        onChange={handleInputChange(setNombre)}
        name="nombre"
        label="Buscar por Nombre"
        placeholder=""
      />
      <InputFieldSimple
        value={medida}
        onChange={handleInputChange(setMedida)}
        name="medida"
        label="Buscar por Medida"
        placeholder=""
      />
      <div className="md:col-span-3 flex justify-start gap-2">
        <button
          onClick={handleSearchClick}
          className={`mt-2 px-4 py-2 rounded-lg ${
            loading ? "bg-green-500" : "bg-blue-500"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
        <button
          onClick={() => {
            setGeneralQuery(""); setNombre(""); setMedida("");
            sessionStorage.removeItem(STORAGE_KEY);
          }}
          className="mt-2 px-4 py-2 rounded-lg bg-gray-400 text-white"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
