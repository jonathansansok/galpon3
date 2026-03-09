//frontend\src\components\ui\SearchBars\SearchBarIngresos.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Alert } from "@/components/ui/alert";
import { InputFieldSimple } from "@/components/ui/inputs/InputFieldSimple";

const STORAGE_KEY = "searchBar_ingresos";

interface SearchBarProps {
  onSearch: (queries: {
    generalQuery: string;
    apellido: string;
    nombres: string;
    lpu: string;
    lpuProv: string;
    telefono: string;
    emailCliente: string;
  }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [generalQuery, setGeneralQuery] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombres, setNombres] = useState("");
  const [lpu, setLpu] = useState("");
  const [lpuProv, setLpuProv] = useState("");
  const [telefono, setTelefono] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
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
        if (parsed.apellido) setApellido(parsed.apellido);
        if (parsed.nombres) setNombres(parsed.nombres);
        if (parsed.lpu) setLpu(parsed.lpu);
        if (parsed.lpuProv) setLpuProv(parsed.lpuProv);
        if (parsed.telefono) setTelefono(parsed.telefono);
        if (parsed.emailCliente) setEmailCliente(parsed.emailCliente);
        // Auto-ejecutar búsqueda si hay filtros guardados
        const hasFilter = Object.values(parsed).some((v: unknown) => typeof v === "string" && v.length >= 3);
        if (hasFilter) {
          onSearch(parsed);
        }
      }
    } catch (e) {
      // Ignorar errores de sessionStorage
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[{}\[\]]/.test(value)) {
      Alert.error({
        title: 'Caracter no permitido',
        text: 'No se permiten llaves ni corchetes en la búsqueda.',
      });
      return;
    }
    setter(value);
  };

  const handleSearchClick = async () => {
    if (
      generalQuery.length < 3 &&
      apellido.length < 3 &&
      nombres.length < 3 &&
      lpu.length < 3 &&
      lpuProv.length < 3 &&
      telefono.length < 3 &&
      emailCliente.length < 3
    ) {
      Alert.warning({
        title: 'Búsqueda demasiado corta',
        text: 'Por favor, ingrese al menos tres caracteres en alguno de los campos para buscar.',
      });
      return;
    }

    const searchParams = { generalQuery, apellido, nombres, lpu, lpuProv, telefono, emailCliente };

    // Guardar en sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchParams));

    setLoading(true);
    await onSearch(searchParams);
    setLoading(false);
  };

  return (
    <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px]">
      <InputFieldSimple
        value={generalQuery}
        onChange={handleInputChange(setGeneralQuery)}
        name="generalQuery"
        label="Búsqueda general"
        placeholder=""
      />
      <InputFieldSimple
        value={apellido}
        onChange={handleInputChange(setApellido)}
        name="apellido"
        label="Buscar por Apellido"
        placeholder=""
      />
      <InputFieldSimple
        value={nombres}
        onChange={handleInputChange(setNombres)}
        name="nombres"
        label="Buscar por Nombres"
        placeholder=""
      />
      <InputFieldSimple
        value={lpu}
        onChange={handleInputChange(setLpu)}
        name="lpu"
        label="Buscar por patente"
        placeholder=""
      />
      <InputFieldSimple
        value={telefono} // Agregado
        onChange={handleInputChange(setTelefono)} // Agregado
        name="telefono" // Agregado
        label="Buscar por Teléfono" // Agregado
        placeholder="" // Agregado
      />
      <InputFieldSimple
        value={emailCliente} // Agregado
        onChange={handleInputChange(setEmailCliente)} // Agregado
        name="emailCliente" // Agregado
        label="Buscar por Email Cliente" // Agregado
        placeholder="" // Agregado
      />
      <div className="md:col-span-2 flex justify-start gap-2">
        <button
          onClick={handleSearchClick}
          className={`mt-2 px-4 py-2 rounded-lg ${loading ? 'bg-green-500' : 'bg-blue-500'} text-white`}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button
          onClick={() => {
            setGeneralQuery(""); setApellido(""); setNombres(""); setLpu(""); setLpuProv(""); setTelefono(""); setEmailCliente("");
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