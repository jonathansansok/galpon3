"use client";

import { useState, useEffect, useRef } from "react";
import { Alert } from "@/components/ui/alert";
import { InputFieldSimple } from "@/components/ui/inputs/InputFieldSimple";

const STORAGE_KEY = "searchBar_moviles";

interface SearchBarMovilesProps {
  onSearch: (queries: {
    generalQuery: string;
    patente: string;
    marca: string;
    modelo: string;
    anio: string;
    color: string;
    tipoVehic: string;
    vin: string;
  }) => void;
}

export function SearchBarMoviles({ onSearch }: SearchBarMovilesProps) {
  const [generalQuery, setGeneralQuery] = useState("");
  const [patente, setPatente] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [color, setColor] = useState("");
  const [tipoVehic, setTipoVehic] = useState("");
  const [vin, setVin] = useState("");
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
        if (parsed.patente) setPatente(parsed.patente);
        if (parsed.marca) setMarca(parsed.marca);
        if (parsed.modelo) setModelo(parsed.modelo);
        if (parsed.anio) setAnio(parsed.anio);
        if (parsed.color) setColor(parsed.color);
        if (parsed.tipoVehic) setTipoVehic(parsed.tipoVehic);
        if (parsed.vin) setVin(parsed.vin);
        // No auto-ejecutar búsqueda aquí (la página maneja la auto-búsqueda después de cargar datos)
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
      patente.length < 3 &&
      marca.length < 3 &&
      modelo.length < 3 &&
      anio.length < 3 &&
      color.length < 3 &&
      tipoVehic.length < 3 &&
      vin.length < 3
    ) {
      Alert.warning({
        title: "Búsqueda demasiado corta",
        text: "Por favor, ingrese al menos tres caracteres en alguno de los campos para buscar.",
      });
      return;
    }

    const searchParams = {
      generalQuery,
      patente,
      marca,
      modelo,
      anio,
      color,
      tipoVehic,
      vin,
    };

    // Guardar en sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchParams));

    setLoading(true);
    await onSearch(searchParams);
    setLoading(false);
  };

  return (
    <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1200px]">
      <InputFieldSimple
        value={generalQuery}
        onChange={handleInputChange(setGeneralQuery)}
        name="generalQuery"
        label="Búsqueda general"
        placeholder=""
      />
      <InputFieldSimple
        value={patente}
        onChange={handleInputChange(setPatente)}
        name="patente"
        label="Buscar por Patente"
        placeholder=""
      />
      <InputFieldSimple
        value={marca}
        onChange={handleInputChange(setMarca)}
        name="marca"
        label="Buscar por Marca"
        placeholder=""
      />
      <InputFieldSimple
        value={modelo}
        onChange={handleInputChange(setModelo)}
        name="modelo"
        label="Buscar por Modelo"
        placeholder=""
      />
      <InputFieldSimple
        value={anio}
        onChange={handleInputChange(setAnio)}
        name="anio"
        label="Buscar por Año"
        placeholder=""
      />
      <InputFieldSimple
        value={color}
        onChange={handleInputChange(setColor)}
        name="color"
        label="Buscar por Color"
        placeholder=""
      />
      <InputFieldSimple
        value={tipoVehic}
        onChange={handleInputChange(setTipoVehic)}
        name="tipoVehic"
        label="Buscar por Tipo de Vehículo"
        placeholder=""
      />
      <InputFieldSimple
        value={vin}
        onChange={handleInputChange(setVin)}
        name="vin"
        label="Buscar por VIN"
        placeholder=""
      />
      <div className="md:col-span-2 flex justify-start gap-2">
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
            setGeneralQuery(""); setPatente(""); setMarca(""); setModelo(""); setAnio(""); setColor(""); setTipoVehic(""); setVin("");
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