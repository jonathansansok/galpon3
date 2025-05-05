//frontend\src\app\portal\eventos\maps\SearchByMultipleLpu.tsx
"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { searchByMultipleLpu } from "./ingresos.api";
import { Ingreso } from "@/types/Ingreso";

interface SearchByMultipleLpuProps {
  onSearchResults: (results: Ingreso[]) => void;
}

export function SearchByMultipleLpu({ onSearchResults }: SearchByMultipleLpuProps) {
  const [multipleLpu, setMultipleLpu] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Evitar caracteres no permitidos
    if (/[{}\[\]]/.test(value)) {
      Alert.error({
        title: "Caracter no permitido",
        text: "No se permiten llaves ni corchetes en la búsqueda.",
      });
      return;
    }
    setMultipleLpu(value);
  };
  const handleSearchClick = async () => {
    if (!multipleLpu.trim()) {
      Alert.warning({
        title: "Campo vacío",
        text: "Por favor, ingrese al menos un L.P.U. para buscar.",
      });
      return;
    }
  
    // Filtrar y validar los LPU ingresados
    const lpuList = multipleLpu
      .split(",")
      .map((lpu) => lpu.trim()) // Elimina espacios en blanco
      .filter((lpu) => /^\d+$/.test(lpu)); // Asegúrate de que sean numéricos
  
    if (lpuList.length === 0) {
      Alert.warning({
        title: "L.P.U. inválidos",
        text: "Por favor, ingrese al menos un LPU válido (solo números).",
      });
      return;
    }
  
    setLoading(true);
    try {
      const results = await searchByMultipleLpu(lpuList);
  
      // Identificar cuáles LPU fueron encontrados y cuáles no
      const foundLpu = results.map((result: Ingreso) => result.lpu); // Especificar el tipo de `result`
      const notFoundLpu = lpuList.filter((lpu) => !foundLpu.includes(lpu));
  
      // Construir el mensaje para SweetAlert
      const foundMessage = results
        .map(
          (result: Ingreso) =>
            `LPU: ${result.lpu}, Nombre: ${result.nombres}, Apellido: ${result.apellido}`
        )
        .join("\n");
  
      const notFoundMessage = notFoundLpu.length
        ? `--- No encontrados: ${notFoundLpu.join(", ")}`
        : "- Todos los L.P.U. fueron encontrados.";
  
      Alert.success({
        title: "Búsqueda y renderización en mapa completados",
        text: `Resultados encontrados y renderizados en el mapa:\n${foundMessage}\n\n${notFoundMessage}`,
      });
  
      onSearchResults(results); // Devuelve los resultados al componente padre
    } catch (error) {
      Alert.error({
        title: "Error en la búsqueda",
        text: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full mb-4 flex flex-col max-w-[900px]">
      <label htmlFor="multipleLpu" className="mb-2 font-bold text-gray-700">
        Buscar por múltiples L.P.U. (separados por comas)
      </label>
      <input
        id="multipleLpu"
        type="text"
        value={multipleLpu}
        onChange={handleInputChange}
        placeholder="Ejemplo: 456789, 654988, 111559"
        className="p-2 border border-gray-300 rounded-lg"
      />
      <button
        onClick={handleSearchClick}
        className={`mt-2 px-4 py-2 rounded-lg ${loading ? "bg-green-500" : "bg-green-500"} text-white`}
        disabled={loading}
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
}