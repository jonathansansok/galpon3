"use client";

import { useState, useEffect, useRef } from "react";
import { Alert } from "@/components/ui/alert";
import { InputFieldSimple } from "@/components/ui/inputs/InputFieldSimple";

const STORAGE_KEY = "searchBar_turnos";

interface SearchBarTurnosProps {
  onSearch: (queries: {
    generalQuery: string;
    plaza: string;
    estado: string;
    patente: string;
    vehiculo: string;
    monto: string;
    observaciones: string;
  }) => void;
}

export function SearchBarTurnos({ onSearch }: SearchBarTurnosProps) {
  const [generalQuery, setGeneralQuery] = useState("");
  const [plaza, setPlaza] = useState("");
  const [estado, setEstado] = useState("");
  const [patente, setPatente] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [monto, setMonto] = useState("");
  const [observaciones, setObservaciones] = useState("");
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
        if (parsed.plaza) setPlaza(parsed.plaza);
        if (parsed.estado) setEstado(parsed.estado);
        if (parsed.patente) setPatente(parsed.patente);
        if (parsed.vehiculo) setVehiculo(parsed.vehiculo);
        if (parsed.monto) setMonto(parsed.monto);
        if (parsed.observaciones) setObservaciones(parsed.observaciones);
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
      plaza.length < 3 &&
      estado.length < 3 &&
      patente.length < 3 &&
      vehiculo.length < 3 &&
      monto.length < 3 &&
      observaciones.length < 3
    ) {
      Alert.warning({
        title: "Búsqueda demasiado corta",
        text: "Por favor, ingrese al menos tres caracteres en alguno de los campos para buscar.",
      });
      return;
    }

    const searchParams = {
      generalQuery,
      plaza,
      estado,
      patente,
      vehiculo,
      monto,
      observaciones,
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
        value={plaza}
        onChange={handleInputChange(setPlaza)}
        name="plaza"
        label="Buscar por Plaza"
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
        value={patente}
        onChange={handleInputChange(setPatente)}
        name="patente"
        label="Buscar por Patente"
        placeholder=""
      />
      <InputFieldSimple
        value={vehiculo}
        onChange={handleInputChange(setVehiculo)}
        name="vehiculo"
        label="Buscar por Vehículo (marca)"
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
        value={observaciones}
        onChange={handleInputChange(setObservaciones)}
        name="observaciones"
        label="Buscar por Observaciones"
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
            setGeneralQuery(""); setPlaza(""); setEstado(""); setPatente(""); setVehiculo(""); setMonto(""); setObservaciones("");
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
